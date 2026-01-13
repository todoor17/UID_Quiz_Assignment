import { useState } from 'react';
import { User, Class, Quiz, QuizAttempt } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LogOut, PlayCircle, TrendingUp } from 'lucide-react';
import { Badge } from './ui/badge';
import QuizTaker from './QuizTaker';
import QuizResults from './QuizResults';
import PracticeQuiz from './PracticeQuiz';
import QuizLeaderboard from './QuizLeaderboard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface StudentDashboardProps {
  currentUser: User;
  users: User[];
  classes: Class[];
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  onLogout: () => void;
  onUpdateAttempts: (attempts: QuizAttempt[]) => void;
}

export default function StudentDashboard({
  currentUser,
  users,
  classes,
  quizzes,
  attempts,
  onLogout,
  onUpdateAttempts,
}: StudentDashboardProps) {
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [viewingResultsId, setViewingResultsId] = useState<string | null>(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [viewLeaderboardQuizId, setViewLeaderboardQuizId] = useState<string | null>(null);

  const myClasses = classes.filter(c => c.studentIds.includes(currentUser.id));
  const myQuizzes = quizzes.filter(q =>
    myClasses.some(c => c.id === q.classId) && q.visible
  );

  const getClassName = (classId: string) => {
    return classes.find(c => c.id === classId)?.name || 'Unknown';
  };

  const getQuizAttempts = (quizId: string) => {
    return attempts.filter(
      att => att.quizId === quizId && att.studentId === currentUser.id
    );
  };

  const getBestScore = (quizId: string) => {
    const quizAttempts = getQuizAttempts(quizId);
    if (quizAttempts.length === 0) return null;
    return Math.max(...quizAttempts.map(att => att.score));
  };

  const getAverageScore = () => {
    const myAttempts = attempts.filter(att => att.studentId === currentUser.id);
    if (myAttempts.length === 0) return 0;
    return Math.round(
      myAttempts.reduce((acc, att) => acc + att.score, 0) / myAttempts.length
    );
  };

  const handleStartQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
  };

  if (activeQuizId) {
    const quiz = quizzes.find(q => q.id === activeQuizId);
    if (quiz) {
      return (
        <QuizTaker
          quiz={quiz}
          currentUser={currentUser}
          attempts={attempts}
          onUpdateAttempts={onUpdateAttempts}
          onComplete={() => setActiveQuizId(null)}
        />
      );
    }
  }

  if (viewingResultsId) {
    const quiz = quizzes.find(q => q.id === viewingResultsId);
    const quizAttempts = getQuizAttempts(viewingResultsId);
    if (quiz && quizAttempts.length > 0) {
      return (
        <QuizResults
          quiz={quiz}
          attempts={quizAttempts}
          currentUser={currentUser}
          onBack={() => setViewingResultsId(null)}
          onRetryQuiz={() => {
            setViewingResultsId(null);
            setActiveQuizId(viewingResultsId);
          }}
          onRetryIncorrect={(incorrectQuestionIds) => {
            setViewingResultsId(null);
            setActiveQuizId(viewingResultsId);
          }}
          allAttempts={attempts}
          onUpdateAttempts={onUpdateAttempts}
        />
      );
    }
  }

  if (isPracticing) {
    return (
      <PracticeQuiz
        myQuizzes={myQuizzes}
        currentUser={currentUser}
        attempts={attempts}
        onUpdateAttempts={onUpdateAttempts}
        onBack={() => setIsPracticing(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1>Student Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {currentUser.name}</p>
          </div>
          <Button onClick={onLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>My Classes</CardDescription>
              <CardTitle>{myClasses.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Available Quizzes</CardDescription>
              <CardTitle>{myQuizzes.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Overall Average</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                {getAverageScore()}%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="quizzes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="quizzes">Available Quizzes</TabsTrigger>
            <TabsTrigger value="history">Quiz History</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
          </TabsList>

          <TabsContent value="quizzes" className="space-y-4">
            {myClasses.map(cls => {
              const classQuizzes = myQuizzes.filter(q => q.classId === cls.id);
              if (classQuizzes.length === 0) return null;

              return (
                <Card key={cls.id}>
                  <CardHeader>
                    <CardTitle>{cls.name}</CardTitle>
                    <CardDescription>{classQuizzes.length} quizzes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {classQuizzes.map(quiz => {
                        const bestScore = getBestScore(quiz.id);
                        const attemptCount = getQuizAttempts(quiz.id).length;

                        return (
                          <div
                            key={quiz.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex-1">
                              <h3 className="text-base">{quiz.name}</h3>
                              <p className="text-sm text-gray-600">
                                {quiz.questions.length} questions
                              </p>
                              {bestScore !== null && (
                                <Badge variant="secondary" className="mt-1">
                                  Best: {bestScore}%
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewLeaderboardQuizId(quiz.id)}
                              >
                                Leaderboard
                              </Button>
                              {attemptCount > 0 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setViewingResultsId(quiz.id)}
                                >
                                  View Results
                                </Button>
                              )}
                              <Button
                                size="sm"
                                onClick={() => handleStartQuiz(quiz.id)}
                              >
                                <PlayCircle className="w-4 h-4 mr-2" />
                                {attemptCount > 0 ? 'Retry' : 'Start'}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Quiz History</CardTitle>
                <CardDescription>
                  View your past quiz attempts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attempts
                    .filter(att => att.studentId === currentUser.id)
                    .map(att => {
                      const quiz = quizzes.find(q => q.id === att.quizId);
                      if (!quiz) return null;

                      return (
                        <div
                          key={att.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <h3 className="text-base">{quiz.name}</h3>
                            <p className="text-sm text-gray-600">
                              {quiz.questions.length} questions
                            </p>
                            <Badge variant="secondary" className="mt-1">
                              Score: {att.score}%
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewingResultsId(att.quizId)}
                            >
                              View Results
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practice">
            <Card>
              <CardHeader>
                <CardTitle>Custom Practice</CardTitle>
                <CardDescription>
                  Create a practice quiz with custom settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setIsPracticing(true)}
                  className="w-full"
                >
                  Customize Practice Quiz
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!viewLeaderboardQuizId} onOpenChange={() => setViewLeaderboardQuizId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Leaderboard - {quizzes.find(q => q.id === viewLeaderboardQuizId)?.name}
            </DialogTitle>
          </DialogHeader>
          {viewLeaderboardQuizId && (
            <QuizLeaderboard
              quizId={viewLeaderboardQuizId}
              attempts={attempts}
              users={users}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
