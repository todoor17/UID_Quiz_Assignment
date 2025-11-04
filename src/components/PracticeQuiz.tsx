import { useState } from 'react';
import { Quiz, User, QuizAttempt, Question } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ArrowLeft, Shuffle } from 'lucide-react';
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

  const allQuestions = myQuizzes.flatMap(quiz => quiz.questions);

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
      name: 'Random Practice Quiz',
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1>Practice Quiz</h1>
              <p className="text-sm text-gray-600">
                Generate a random quiz from all available questions
              </p>
            </div>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Generate Practice Quiz</CardTitle>
            <CardDescription>
              Create a random quiz with questions from all your available quizzes
            </CardDescription>
          </CardHeader>
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
              Generate Random Quiz
            </Button>

            {allQuestions.length === 0 && (
              <p className="text-sm text-red-600 text-center">
                No questions available. Complete some quizzes first to unlock practice mode.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Available Question Sources</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
