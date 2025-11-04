"use client";

import { useState } from "react";
import { Quiz, QuizAttempt, User } from "../lib/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  ArrowLeft,
  Download,
  RotateCcw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "./ui/badge";
import QuizTaker from "./QuizTaker";

interface QuizResultsProps {
  quiz: Quiz;
  attempts: QuizAttempt[];
  currentUser: User;
  onBack: () => void;
  onRetryQuiz: () => void;
  onRetryIncorrect: (incorrectQuestionIds: string[]) => void;
  allAttempts: QuizAttempt[];
  onUpdateAttempts: (attempts: QuizAttempt[]) => void;
}

export default function QuizResults({
  quiz,
  attempts,
  currentUser,
  onBack,
  onRetryQuiz,
  onRetryIncorrect,
  allAttempts,
  onUpdateAttempts,
}: QuizResultsProps) {
  const [retryingIncorrect, setRetryingIncorrect] = useState(false);
  const [incorrectQuestionIds, setIncorrectQuestionIds] = useState<string[]>(
    []
  );

  const latestAttempt = attempts.reduce((latest, current) =>
    current.timestamp > latest.timestamp ? current : latest
  );

  const handleExportToExcel = () => {
    let csvContent = "Question,Your Answer,Correct Answer,Result\n";

    quiz.questions.forEach((question, index) => {
      const yourAnswer =
        question.options[latestAttempt.answers[index]] || "Not answered";
      const correctAnswer = question.options[question.correctAnswer];
      const isCorrect = latestAttempt.answers[index] === question.correctAnswer;

      csvContent += `"${question.text}","${yourAnswer}","${correctAnswer}","${
        isCorrect ? "Correct" : "Incorrect"
      }"\n`;
    });

    csvContent += `\nScore,${latestAttempt.score}%\n`;
    csvContent += `Date,${new Date(
      latestAttempt.timestamp
    ).toLocaleString()}\n`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${quiz.name}_results.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRetryIncorrectOnly = () => {
    const incorrect = quiz.questions
      .filter((q, index) => latestAttempt.answers[index] !== q.correctAnswer)
      .map((q) => q.id);

    if (incorrect.length === 0) {
      alert("You got all questions correct! No questions to retry.");
      return;
    }

    setIncorrectQuestionIds(incorrect);
    setRetryingIncorrect(true);
  };

  if (retryingIncorrect) {
    return (
      <QuizTaker
        quiz={quiz}
        currentUser={currentUser}
        attempts={allAttempts}
        onUpdateAttempts={onUpdateAttempts}
        onComplete={() => {
          setRetryingIncorrect(false);
          setIncorrectQuestionIds([]);
        }}
        retryIncorrectOnly={incorrectQuestionIds}
      />
    );
  }

  const bestScore = Math.max(...attempts.map((a) => a.score));
  const averageScore = Math.round(
    attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1>{quiz.name} - Results</h1>
              <p className="text-sm text-gray-600">Review your performance</p>
            </div>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <p className="text-sm text-gray-600">Latest Score</p>
              <CardTitle className="text-3xl">{latestAttempt.score}%</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <p className="text-sm text-gray-600">Best Score</p>
              <CardTitle className="text-3xl">{bestScore}%</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <p className="text-sm text-gray-600">Average Score</p>
              <CardTitle className="text-3xl">{averageScore}%</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button onClick={handleExportToExcel} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export to Excel
            </Button>
            <Button onClick={onRetryQuiz} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry Complete Quiz
            </Button>
            <Button onClick={handleRetryIncorrectOnly} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry Incorrect Only
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quiz.questions.map((question, index) => {
              const yourAnswer = latestAttempt.answers[index];
              const isCorrect = yourAnswer === question.correctAnswer;

              return (
                <div
                  key={question.id}
                  className={`p-4 border rounded-lg ${
                    isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="mb-2">
                        <strong>Question {index + 1}:</strong> {question.text}
                      </p>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-gray-600">Your answer:</span>{" "}
                          <Badge
                            variant={isCorrect ? "default" : "destructive"}
                          >
                            {question.options[yourAnswer] || "Not answered"}
                          </Badge>
                        </p>
                        {!isCorrect && (
                          <p>
                            <span className="text-gray-600">
                              Correct answer:
                            </span>{" "}
                            <Badge variant="default">
                              {question.options[question.correctAnswer]}
                            </Badge>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attempt History ({attempts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {attempts
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((attempt, index) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="text-sm">
                        {new Date(attempt.timestamp).toLocaleString()}
                      </p>
                      {index === 0 && (
                        <Badge variant="secondary" className="mt-1">
                          Latest
                        </Badge>
                      )}
                    </div>
                    <Badge
                      variant={attempt.score >= 80 ? "default" : "secondary"}
                    >
                      {attempt.score}%
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
