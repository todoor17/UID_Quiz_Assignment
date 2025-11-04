import { QuizAttempt, User } from '../App';
import { Trophy, Medal } from 'lucide-react';
import { Badge } from './ui/badge';

interface QuizLeaderboardProps {
  quizId: string;
  attempts: QuizAttempt[];
  users: User[];
}

export default function QuizLeaderboard({
  quizId,
  attempts,
  users,
}: QuizLeaderboardProps) {
  const quizAttempts = attempts.filter(att => att.quizId === quizId);

  // Get best attempt per student
  const bestAttempts = quizAttempts.reduce((acc, att) => {
    const existing = acc.find(a => a.studentId === att.studentId);
    if (!existing || att.score > existing.score) {
      return [...acc.filter(a => a.studentId !== att.studentId), att];
    }
    return acc;
  }, [] as QuizAttempt[]);

  const sortedAttempts = bestAttempts.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.timestamp - b.timestamp;
  });

  const getStudentName = (studentId: string) => {
    return users.find(u => u.id === studentId)?.name || 'Unknown';
  };

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  return (
    <div className="space-y-2">
      {sortedAttempts.map((attempt, index) => (
        <div
          key={attempt.id}
          className="flex items-center justify-between p-3 border rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 text-center">
              {getMedalIcon(index) || <span>{index + 1}</span>}
            </div>
            <div>
              <p>{getStudentName(attempt.studentId)}</p>
              <p className="text-sm text-gray-600">
                {new Date(attempt.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge
            variant={attempt.score >= 80 ? 'default' : 'secondary'}
          >
            {attempt.score}%
          </Badge>
        </div>
      ))}
      {sortedAttempts.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-8">
          No attempts yet
        </p>
      )}
    </div>
  );
}
