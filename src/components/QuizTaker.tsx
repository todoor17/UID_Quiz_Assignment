import { useState } from 'react';
import { Quiz, User, QuizAttempt } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { ArrowLeft, Check, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

interface QuizTakerProps {
  quiz: Quiz;
  currentUser: User;
  attempts: QuizAttempt[];
  onUpdateAttempts: (attempts: QuizAttempt[]) => void;
  onComplete: () => void;
  retryIncorrectOnly?: string[];
  retrySingleQuestion?: string;
}

export default function QuizTaker({
  quiz,
  currentUser,
  attempts,
  onUpdateAttempts,
  onComplete,
  retryIncorrectOnly,
  retrySingleQuestion,
}: QuizTakerProps) {
  const questionsToShow = retryIncorrectOnly
    ? quiz.questions.filter(q => retryIncorrectOnly.includes(q.id))
    : retrySingleQuestion
    ? quiz.questions.filter(q => q.id === retrySingleQuestion)
    : quiz.questions;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questionsToShow.length).fill(-1));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAutoExport, setShowAutoExport] = useState(false);
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);

  const currentQuestion = questionsToShow[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questionsToShow.length) * 100;

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionsToShow.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const unanswered = answers.some(a => a === -1);
    if (unanswered) {
      alert('Please answer all questions before submitting');
      return;
    }

    let correctCount = 0;
    questionsToShow.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questionsToShow.length) * 100);

    const newAttempt: QuizAttempt = {
      id: `attempt${Date.now()}`,
      studentId: currentUser.id,
      quizId: quiz.id,
      answers,
      score,
      timestamp: Date.now(),
    };

    onUpdateAttempts([...attempts, newAttempt]);
    setIsSubmitted(true);
    setLatestAttempt(newAttempt);
    setShowAutoExport(true);
  };

  const handleAutoExport = () => {
    if (!latestAttempt) return;
    
    let csvContent = 'Question,Your Answer,Correct Answer,Result\n';

    questionsToShow.forEach((question, index) => {
      const yourAnswer = question.options[answers[index]] || 'Not answered';
      const correctAnswer = question.options[question.correctAnswer];
      const isCorrect = answers[index] === question.correctAnswer;

      csvContent += `"${question.text}","${yourAnswer}","${correctAnswer}","${
        isCorrect ? 'Correct' : 'Incorrect'
      }"\n`;
    });

    csvContent += `\nScore,${latestAttempt.score}%\n`;
    csvContent += `Date,${new Date(latestAttempt.timestamp).toLocaleString()}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${quiz.name}_results.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowAutoExport(false);
  };

  if (isSubmitted) {
    const correctCount = questionsToShow.filter(
      (q, i) => answers[i] === q.correctAnswer
    ).length;
    const score = Math.round((correctCount / questionsToShow.length) * 100);

    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-center">Quiz Completed!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚'}
                </div>
                <h2 className="text-4xl mb-2">{score}%</h2>
                <p className="text-gray-600">
                  You got {correctCount} out of {questionsToShow.length} questions correct
                </p>
              </div>
              <Button onClick={onComplete} className="w-full">
                View Results
              </Button>
            </CardContent>
          </Card>
        </div>

        <Dialog open={showAutoExport} onOpenChange={setShowAutoExport}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Download Results?</DialogTitle>
              <DialogDescription>
                Would you like to download your quiz results as an Excel file?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAutoExport(false)}>
                No, Thanks
              </Button>
              <Button onClick={handleAutoExport}>
                <Download className="w-4 h-4 mr-2" />
                Download Excel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1>{quiz.name}</h1>
            <Button onClick={onComplete} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
          <Progress value={progress} />
          <p className="text-sm text-gray-600 mt-2">
            Question {currentQuestionIndex + 1} of {questionsToShow.length}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>{currentQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left border rounded-lg transition-all ${
                  answers[currentQuestionIndex] === index
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {answers[currentQuestionIndex] === index && (
                    <Check className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            Previous
          </Button>
          {currentQuestionIndex < questionsToShow.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={answers[currentQuestionIndex] === -1}
              className="flex-1"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={answers.some(a => a === -1)}
              className="flex-1"
            >
              Submit Quiz
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}