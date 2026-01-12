import { useState } from 'react';
import { Quiz, User, QuizAttempt, Question } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ArrowLeft, Shuffle, Zap, Brain, Settings } from 'lucide-react';
import { Badge } from './ui/badge';
import QuizTaker from './QuizTaker';

interface PracticeQuizProps {
  myQuizzes: Quiz[];
  currentUser: User;
  attempts: QuizAttempt[];
  onUpdateAttempts: (attempts: QuizAttempt[]) => void;
  onBack: () => void;
}

export default function PracticeQuiz({
  myQuizzes,
  currentUser,
  attempts,
  onUpdateAttempts,
  onBack,
}: PracticeQuizProps) {
  const [questionCount, setQuestionCount] = useState(10);
  const [practiceQuiz, setPracticeQuiz] = useState<Quiz | null>(null);
  const [showCustom, setShowCustom] = useState(false);

  const allQuestions = myQuizzes.flatMap(quiz => quiz.questions);

  // Analyze weak topics based on student's attempt history
  const analyzeWeakTopics = () => {
    const topicPerformance: { [topic: string]: { correct: number; total: number } } = {};
    
    // Get student's attempts
    const studentAttempts = attempts.filter(a => a.studentId === currentUser.id);
    
    studentAttempts.forEach(attempt => {
      const quiz = myQuizzes.find(q => q.id === attempt.quizId);
      if (!quiz) return;
      
      quiz.questions.forEach((question, index) => {
        const topic = question.topic || 'General';
        if (!topicPerformance[topic]) {
          topicPerformance[topic] = { correct: 0, total: 0 };
        }
        
        topicPerformance[topic].total++;
        if (attempt.answers[index] === question.correctAnswer) {
          topicPerformance[topic].correct++;
        }
      });
    });

    // Calculate accuracy for each topic and sort by weakness
    const topicAccuracy = Object.entries(topicPerformance).map(([topic, stats]) => ({
      topic,
      accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
      total: stats.total,
    })).sort((a, b) => a.accuracy - b.accuracy);

    return topicAccuracy;
  };

  const handleSmartPractice = () => {
    if (allQuestions.length === 0) {
      alert('No questions available for practice');
      return;
    }

    const weakTopics = analyzeWeakTopics();
    let selectedQuestions: Question[] = [];

    if (weakTopics.length > 0) {
      // Focus on weakest topics (bottom 50% accuracy)
      const weakTopicNames = weakTopics
        .filter(t => t.accuracy < 70)
        .map(t => t.topic)
        .slice(0, 3); // Top 3 weakest topics

      if (weakTopicNames.length > 0) {
        // Get questions from weak topics
        const weakTopicQuestions = allQuestions.filter(q => 
          weakTopicNames.includes(q.topic || 'General')
        );

        if (weakTopicQuestions.length > 0) {
          const shuffled = [...weakTopicQuestions].sort(() => Math.random() - 0.5);
          selectedQuestions = shuffled.slice(0, 10);
        }
      }
    }

    // Fallback to random if not enough weak topic questions
    if (selectedQuestions.length < 10) {
      const remaining = 10 - selectedQuestions.length;
      const otherQuestions = allQuestions.filter(q => !selectedQuestions.includes(q));
      const shuffled = [...otherQuestions].sort(() => Math.random() - 0.5);
      selectedQuestions = [...selectedQuestions, ...shuffled.slice(0, remaining)];
    }

    const quiz: Quiz = {
      id: `practice${Date.now()}`,
      classId: 'practice',
      name: 'Smart Practice Quiz',
      questions: selectedQuestions,
      visible: true,
      createdBy: currentUser.id,
    };

    setPracticeQuiz(quiz);
  };

  const handleQuickPractice = () => {
    if (allQuestions.length === 0) {
      alert('No questions available for practice');
      return;
    }

    const count = Math.min(10, allQuestions.length);
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, count);

    const quiz: Quiz = {
      id: `practice${Date.now()}`,
      classId: 'practice',
      name: '10-Question Practice',
      questions: selectedQuestions,
      visible: true,
      createdBy: currentUser.id,
    };

    setPracticeQuiz(quiz);
  };

  const handleGenerateQuiz = () => {
    if (allQuestions.length === 0) {
      alert('No questions available for practice');
      return;
    }

    const count = Math.min(questionCount, allQuestions.length);
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, count);

    const quiz: Quiz = {
      id: `practice${Date.now()}`,
      classId: 'practice',
      name: 'Custom Practice Quiz',
      questions: selectedQuestions,
      visible: true,
      createdBy: currentUser.id,
    };

    setPracticeQuiz(quiz);
  };

  if (practiceQuiz) {
    return (
      <QuizTaker
        quiz={practiceQuiz}
        currentUser={currentUser}
        attempts={attempts}
        onUpdateAttempts={onUpdateAttempts}
        onComplete={() => {
          setPracticeQuiz(null);
          onBack();
        }}
      />
    );
  }

  const weakTopics = analyzeWeakTopics();
  const hasAttempts = attempts.filter(a => a.studentId === currentUser.id).length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1>Practice Quiz</h1>
              <p className="text-sm text-gray-600">
                Practice with questions from your quizzes
              </p>
            </div>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Smart Practice */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <CardTitle>Smart Practice</CardTitle>
              {hasAttempts && <Badge variant="secondary">Recommended</Badge>}
            </div>
            <CardDescription>
              Focus on your weakest topics based on past performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasAttempts && weakTopics.length > 0 ? (
              <>
                <div className="space-y-2">
                  <p className="text-sm">Your weakest topics:</p>
                  {weakTopics.slice(0, 3).map((topic, index) => (
                    <div
                      key={topic.topic}
                      className="flex items-center justify-between p-2 bg-white rounded border"
                    >
                      <span className="text-sm">
                        {index + 1}. {topic.topic}
                      </span>
                      <span className="text-sm text-gray-600">
                        {topic.accuracy.toFixed(0)}% accuracy
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleSmartPractice}
                  disabled={allQuestions.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Start Smart Practice
                </Button>
              </>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-sm text-gray-600">
                  Complete some quizzes first to unlock smart practice recommendations
                </p>
                <Button
                  onClick={handleSmartPractice}
                  disabled={allQuestions.length === 0}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Start Smart Practice
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Practice */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              <CardTitle>Quick Practice</CardTitle>
            </div>
            <CardDescription>
              Start a 10-question practice immediately with zero setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleQuickPractice}
              disabled={allQuestions.length === 0}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Zap className="w-4 h-4 mr-2" />
              10-Question Practice
            </Button>
          </CardContent>
        </Card>

        {/* Custom Practice */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                <CardTitle>Custom Practice</CardTitle>
              </div>
              <Button
                onClick={() => setShowCustom(!showCustom)}
                variant="ghost"
                size="sm"
              >
                {showCustom ? 'Hide' : 'Show Options'}
              </Button>
            </div>
            <CardDescription>
              Configure your practice quiz settings
            </CardDescription>
          </CardHeader>
          {showCustom && (
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm mb-2">
                  Total questions available: <strong>{allQuestions.length}</strong>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Questions will be randomly selected from {myQuizzes.length} quiz(zes)
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Number of Questions</label>
                <Input
                  type="number"
                  min="1"
                  max={allQuestions.length}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value) || 1)}
                />
              </div>

              <Button
                onClick={handleGenerateQuiz}
                disabled={allQuestions.length === 0}
                className="w-full"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Generate Custom Quiz
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Available Question Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Available Question Sources</CardTitle>
            <CardDescription>
              {allQuestions.length} total questions from {myQuizzes.length} quiz(zes)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allQuestions.length === 0 ? (
              <p className="text-sm text-red-600 text-center py-4">
                No questions available. Complete some quizzes first to unlock practice mode.
              </p>
            ) : (
              <div className="space-y-2">
                {myQuizzes.map(quiz => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <span>{quiz.name}</span>
                    <span className="text-sm text-gray-600">
                      {quiz.questions.length} questions
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
