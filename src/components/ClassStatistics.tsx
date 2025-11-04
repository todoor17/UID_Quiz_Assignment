import { Class, Quiz, QuizAttempt, User } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, Users, FileText } from 'lucide-react';

interface ClassStatisticsProps {
  classData: Class;
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  users: User[];
}

export default function ClassStatistics({
  classData,
  quizzes,
  attempts,
  users,
}: ClassStatisticsProps) {
  const classQuizzes = quizzes.filter(q => q.classId === classData.id);
  const classAttempts = attempts.filter(att =>
    classQuizzes.some(q => q.id === att.quizId)
  );

  const averageScore =
    classAttempts.length > 0
      ? Math.round(
          classAttempts.reduce((acc, att) => acc + att.score, 0) /
            classAttempts.length
        )
      : 0;

  const totalQuestions = classQuizzes.reduce(
    (acc, q) => acc + q.questions.length,
    0
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Students</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              {classData.studentIds.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Quizzes</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              {classQuizzes.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Class Average</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              {averageScore}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {classQuizzes.map(quiz => {
              const quizAttempts = attempts.filter(att => att.quizId === quiz.id);
              const avgScore =
                quizAttempts.length > 0
                  ? Math.round(
                      quizAttempts.reduce((acc, att) => acc + att.score, 0) /
                        quizAttempts.length
                    )
                  : 0;

              return (
                <div key={quiz.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base">{quiz.name}</h3>
                    <span className="text-sm text-gray-600">
                      {quizAttempts.length} attempts
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${avgScore}%` }}
                      />
                    </div>
                    <span className="text-sm">{avgScore}%</span>
                  </div>
                </div>
              );
            })}
            {classQuizzes.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">
                No quizzes created yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
