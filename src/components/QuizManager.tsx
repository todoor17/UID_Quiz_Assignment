import { useState } from 'react';
import { Quiz, QuizAttempt, User } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Eye, EyeOff, Trash2, TrendingUp, Users, Copy } from 'lucide-react';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import QuizCreator from './QuizCreator';
import QuizLeaderboard from './QuizLeaderboard';

interface QuizManagerProps {
  classId: string;
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  users: User[];
  onUpdateQuizzes: (quizzes: Quiz[]) => void;
  currentUserId: string;
}

export default function QuizManager({
  classId,
  quizzes,
  attempts,
  users,
  onUpdateQuizzes,
  currentUserId,
}: QuizManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'questions' | 'attempts'>('name');
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [duplicatingQuiz, setDuplicatingQuiz] = useState<Quiz | null>(null);

  const classQuizzes = quizzes.filter(q => q.classId === classId);

  const sortedQuizzes = [...classQuizzes].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'questions') {
      return b.questions.length - a.questions.length;
    } else {
      const aAttempts = attempts.filter(att => att.quizId === a.id).length;
      const bAttempts = attempts.filter(att => att.quizId === b.id).length;
      return bAttempts - aAttempts;
    }
  });

  const handleToggleVisibility = (quizId: string) => {
    onUpdateQuizzes(
      quizzes.map(q =>
        q.id === quizId ? { ...q, visible: !q.visible } : q
      )
    );
  };

  const handleDeleteQuiz = (quizId: string) => {
    onUpdateQuizzes(quizzes.filter(q => q.id !== quizId));
  };

  const getQuizAttemptCount = (quizId: string) => {
    return attempts.filter(att => att.quizId === quizId).length;
  };

  const getQuizAverageScore = (quizId: string) => {
    const quizAttempts = attempts.filter(att => att.quizId === quizId);
    if (quizAttempts.length === 0) return 0;
    const sum = quizAttempts.reduce((acc, att) => acc + att.score, 0);
    return Math.round(sum / quizAttempts.length);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quizzes</CardTitle>
              <CardDescription>Create and manage quizzes for this class</CardDescription>
            </div>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Quiz
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('name')}
            >
              Sort by Name
            </Button>
            <Button
              variant={sortBy === 'questions' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('questions')}
            >
              Sort by Questions
            </Button>
            <Button
              variant={sortBy === 'attempts' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('attempts')}
            >
              Sort by Attempts
            </Button>
          </div>

          <div className="space-y-3">
            {sortedQuizzes.map(quiz => (
              <div key={quiz.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3>{quiz.name}</h3>
                      {!quiz.visible && (
                        <Badge variant="secondary">Hidden</Badge>
                      )}
                    </div>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>{quiz.questions.length} questions</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {getQuizAttemptCount(quiz.id)} attempts
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {getQuizAverageScore(quiz.id)}% avg
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedQuizId(quiz.id)}
                        >
                          Leaderboard
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Leaderboard - {quiz.name}</DialogTitle>
                        </DialogHeader>
                        <QuizLeaderboard
                          quizId={quiz.id}
                          attempts={attempts}
                          users={users}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDuplicatingQuiz(quiz)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Duplicate
                    </Button>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={quiz.visible}
                        onCheckedChange={() => handleToggleVisibility(quiz.id)}
                      />
                      {quiz.visible ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Quiz</DialogTitle>
            <DialogDescription>Add questions to your quiz</DialogDescription>
          </DialogHeader>
          <QuizCreator
            classId={classId}
            quizzes={quizzes}
            onUpdateQuizzes={onUpdateQuizzes}
            onClose={() => setIsCreating(false)}
            currentUserId={currentUserId}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!duplicatingQuiz} onOpenChange={() => setDuplicatingQuiz(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Duplicate Quiz</DialogTitle>
            <DialogDescription>Create a copy of this quiz to edit</DialogDescription>
          </DialogHeader>
          {duplicatingQuiz && (
            <QuizCreator
              classId={classId}
              quizzes={quizzes}
              onUpdateQuizzes={onUpdateQuizzes}
              onClose={() => setDuplicatingQuiz(null)}
              currentUserId={currentUserId}
              duplicateQuiz={duplicatingQuiz}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}