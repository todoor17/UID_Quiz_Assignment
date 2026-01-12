import { useState, useEffect } from 'react';
import { User, Class, Quiz, QuizAttempt } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LogOut, Plus, BookOpen, Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import QuizManager from './QuizManager';
import ClassManager from './ClassManager';
import ClassStatistics from './ClassStatistics';

interface TeacherDashboardProps {
    currentUser: User;
    users: User[];
    classes: Class[];
    quizzes: Quiz[];
    attempts: QuizAttempt[];
    onLogout: () => void;
    onUpdateClasses: (classes: Class[]) => void;
    onUpdateQuizzes: (quizzes: Quiz[]) => void;
}

export default function TeacherDashboard({
                                             currentUser,
                                             users,
                                             classes,
                                             quizzes,
                                             attempts,
                                             onLogout,
                                             onUpdateClasses,
                                             onUpdateQuizzes,
                                         }: TeacherDashboardProps) {
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState<{
        type: 'success' | 'error' | 'info';
        message: string;
    } | null>(null);

    // Get teacher's classes
    const myClasses = classes.filter(c => c.teacherId === currentUser.id);
    const selectedClass = myClasses.find(c => c.id === selectedClassId);

    // Auto-select first class if none selected and classes exist
    useEffect(() => {
        if (!selectedClassId && myClasses.length > 0) {
            setSelectedClassId(myClasses[0].id);
        }
    }, [myClasses.length, selectedClassId]);

    // Clear alert after 4 seconds
    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => {
                setAlertMessage(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    // Calculate statistics for selected class
    const getClassStatistics = () => {
        if (!selectedClass) return null;

        const classQuizzes = quizzes.filter(q => q.classId === selectedClass.id);
        const classAttempts = attempts.filter(a =>
            classQuizzes.some(q => q.id === a.quizId)
        );

        const totalQuizzes = classQuizzes.length;
        const totalStudents = selectedClass.studentIds.length;
        const totalAttempts = classAttempts.length;

        // Calculate average score
        const averageScore = classAttempts.length > 0
            ? Math.round(
                classAttempts.reduce((sum, a) => sum + a.score, 0) / classAttempts.length
            )
            : 0;

        // Count active (visible) quizzes
        const activeQuizzes = classQuizzes.filter(q => q.visible).length;

        return {
            totalQuizzes,
            activeQuizzes,
            totalStudents,
            totalAttempts,
            averageScore,
        };
    };

    const stats = getClassStatistics();

    // Validate class selection
    const handleClassSelect = (classId: string) => {
        const cls = myClasses.find(c => c.id === classId);
        if (!cls) {
            setAlertMessage({
                type: 'error',
                message: 'Unable to load class. Please try again.',
            });
            return;
        }
        setSelectedClassId(classId);
    };

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Teacher Dashboard</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {getGreeting()}, {currentUser.name}
                        </p>
                    </div>
                    <Button onClick={onLogout} variant="outline">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 space-y-4">
                {/* Alert Messages */}
                {alertMessage && (
                    <Alert variant={alertMessage.type === 'error' ? 'destructive' : 'success'}>
                        {alertMessage.type === 'error' ? (
                            <AlertCircle className="h-4 w-4" />
                        ) : (
                            <CheckCircle className="h-4 w-4" />
                        )}
                        <AlertDescription>{alertMessage.message}</AlertDescription>
                    </Alert>
                )}

                {/* Class Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            My Classes
                        </CardTitle>
                        <CardDescription>
                            {myClasses.length === 0
                                ? 'No classes assigned yet. Please contact your administrator.'
                                : `Select a class to manage (${myClasses.length} ${myClasses.length === 1 ? 'class' : 'classes'})`
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {myClasses.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                <p className="text-gray-600 mb-2">No classes assigned yet</p>
                                <p className="text-sm text-gray-500">
                                    Contact your administrator to get assigned to classes
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {myClasses.map(cls => {
                                    const classQuizzes = quizzes.filter(q => q.classId === cls.id);
                                    const activeQuizzes = classQuizzes.filter(q => q.visible).length;
                                    const isSelected = selectedClassId === cls.id;

                                    return (
                                        <Card
                                            key={cls.id}
                                            className={`cursor-pointer transition-all hover:shadow-md ${
                                                isSelected
                                                    ? 'ring-2 ring-indigo-600 shadow-lg bg-indigo-50'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() => handleClassSelect(cls.id)}
                                        >
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-base flex items-center justify-between">
                                                    <span>{cls.name}</span>
                                                    {isSelected && (
                                                        <Badge variant="default" className="bg-indigo-600">
                                                            Active
                                                        </Badge>
                                                    )}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                              {cls.studentIds.length} {cls.studentIds.length === 1 ? 'student' : 'students'}
                          </span>
                                                    <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                                                        {classQuizzes.length} {classQuizzes.length === 1 ? 'quiz' : 'quizzes'}
                          </span>
                                                </CardDescription>
                                                {activeQuizzes > 0 && (
                                                    <Badge variant="secondary" className="mt-2 w-fit">
                                                        {activeQuizzes} active {activeQuizzes === 1 ? 'quiz' : 'quizzes'}
                                                    </Badge>
                                                )}
                                            </CardHeader>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Class Statistics Overview */}
                {selectedClass && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardDescription className="text-xs">Total Quizzes</CardDescription>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-indigo-600" />
                                    {stats.totalQuizzes}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-gray-600">
                                    {stats.activeQuizzes} currently active
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardDescription className="text-xs">Total Students</CardDescription>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <Users className="w-5 h-5 text-green-600" />
                                    {stats.totalStudents}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-gray-600">
                                    Enrolled in {selectedClass.name}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardDescription className="text-xs">Total Attempts</CardDescription>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                    {stats.totalAttempts}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-gray-600">
                                    Across all quizzes
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardDescription className="text-xs">Class Average</CardDescription>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                    {stats.averageScore}%
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-gray-600">
                                    {stats.averageScore >= 70 ? 'Above target' : 'Below target'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Main Content Tabs */}
                {selectedClass ? (
                    <Tabs defaultValue="quizzes" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="quizzes" className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Quizzes
                            </TabsTrigger>
                            <TabsTrigger value="students" className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Students
                            </TabsTrigger>
                            <TabsTrigger value="statistics" className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Statistics
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="quizzes">
                            <QuizManager
                                classId={selectedClass.id}
                                quizzes={quizzes}
                                attempts={attempts}
                                users={users}
                                onUpdateQuizzes={onUpdateQuizzes}
                                currentUserId={currentUser.id}
                            />
                        </TabsContent>

                        <TabsContent value="students">
                            <ClassManager
                                classData={selectedClass}
                                users={users}
                                classes={classes}
                                onUpdateClasses={onUpdateClasses}
                            />
                        </TabsContent>

                        <TabsContent value="statistics">
                            <ClassStatistics
                                classData={selectedClass}
                                quizzes={quizzes}
                                attempts={attempts}
                                users={users}
                            />
                        </TabsContent>
                    </Tabs>
                ) : myClasses.length > 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-600 mb-2">Select a class to get started</p>
                            <p className="text-sm text-gray-500">
                                Choose a class from the options above to manage quizzes and students
                            </p>
                        </CardContent>
                    </Card>
                ) : null}
            </div>
        </div>
    );
}