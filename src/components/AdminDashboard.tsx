import { useState } from 'react';
import { User, Class } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LogOut, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

interface AdminDashboardProps {
    currentUser: User;
    users: User[];
    classes: Class[];
    onLogout: () => void;
    onUpdateUsers: (users: User[]) => void;
    onUpdateClasses: (classes: Class[]) => void;
}

export default function AdminDashboard({
                                           currentUser,
                                           users,
                                           classes,
                                           onLogout,
                                           onUpdateUsers,
                                           onUpdateClasses,
                                       }: AdminDashboardProps) {
    const [newTeacherName, setNewTeacherName] = useState('');
    const [newTeacherEmail, setNewTeacherEmail] = useState('');
    const [newClassName, setNewClassName] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState('');

    // Error states
    const [teacherError, setTeacherError] = useState('');
    const [classError, setClassError] = useState('');

    // Success states
    const [teacherSuccess, setTeacherSuccess] = useState('');
    const [classSuccess, setClassSuccess] = useState('');

    const teachers = users.filter(u => u.role === 'teacher');

    // Validation functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validateName = (name: string): boolean => {
        // Must be at least 2 characters, contain letters, and can include spaces and hyphens
        const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
        return name.trim().length >= 2 && nameRegex.test(name.trim());
    };

    const validateClassName = (name: string): boolean => {
        // Must be at least 3 characters and can contain letters, numbers, and common separators
        const classRegex = /^[a-zA-Z0-9\s\-:()]+$/;
        return name.trim().length >= 3 && classRegex.test(name.trim());
    };

    const isEmailUnique = (email: string): boolean => {
        return !users.some(u => u.email.toLowerCase() === email.toLowerCase());
    };

    const isClassNameUnique = (name: string): boolean => {
        return !classes.some(c => c.name.toLowerCase() === name.trim().toLowerCase());
    };

    const handleAddTeacher = () => {
        // Clear previous messages
        setTeacherError('');
        setTeacherSuccess('');

        // Trim inputs
        const trimmedName = newTeacherName.trim();
        const trimmedEmail = newTeacherEmail.trim().toLowerCase();

        // Validation checks
        if (!trimmedName) {
            setTeacherError('Teacher name is required');
            return;
        }

        if (!validateName(trimmedName)) {
            setTeacherError('Please enter a valid name (at least 2 characters, letters only)');
            return;
        }

        if (!trimmedEmail) {
            setTeacherError('Email address is required');
            return;
        }

        if (!validateEmail(trimmedEmail)) {
            setTeacherError('Please enter a valid email address (e.g., teacher@utcluj.ro)');
            return;
        }

        if (!isEmailUnique(trimmedEmail)) {
            setTeacherError('This email address is already registered in the system');
            return;
        }

        // Create new teacher with realistic data structure
        const newTeacher: User = {
            id: `teacher_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: trimmedName,
            email: trimmedEmail,
            role: 'teacher',
        };

        onUpdateUsers([...users, newTeacher]);
        setNewTeacherName('');
        setNewTeacherEmail('');
        setTeacherSuccess(`Successfully added ${trimmedName} to the system`);

        // Success message clears on the next action.
    };

    const handleDeleteTeacher = (teacherId: string) => {
        const teacher = users.find(u => u.id === teacherId);

        // Check if teacher has assigned classes
        const assignedClasses = classes.filter(c => c.teacherId === teacherId);

        if (assignedClasses.length > 0) {
            setTeacherError(
                `Cannot delete ${teacher?.name}. This teacher is assigned to ${assignedClasses.length} class(es). Please reassign or delete these classes first.`
            );
            setTimeout(() => setTeacherError(''), 5000);
            return;
        }

        onUpdateUsers(users.filter(u => u.id !== teacherId));
        setTeacherSuccess(`Successfully removed ${teacher?.name} from the system`);
        // Success message clears on the next action.
    };

    const handleAddClass = () => {
        // Clear previous messages
        setClassError('');
        setClassSuccess('');

        // Trim input
        const trimmedClassName = newClassName.trim();

        // Validation checks
        if (!trimmedClassName) {
            setClassError('Class name is required');
            return;
        }

        if (!validateClassName(trimmedClassName)) {
            setClassError('Please enter a valid class name (at least 3 characters, alphanumeric)');
            return;
        }

        if (!isClassNameUnique(trimmedClassName)) {
            setClassError('A class with this name already exists');
            return;
        }

        if (!selectedTeacherId) {
            setClassError('Please select a teacher for this class');
            return;
        }

        // Check if selected teacher exists
        const teacher = users.find(u => u.id === selectedTeacherId);
        if (!teacher) {
            setClassError('Selected teacher not found. Please select a valid teacher.');
            return;
        }

        // Create new class with realistic data structure
        const newClass: Class = {
            id: `class_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: trimmedClassName,
            teacherId: selectedTeacherId,
            studentIds: [],
        };

        onUpdateClasses([...classes, newClass]);
        setNewClassName('');
        setSelectedTeacherId('');
        setClassSuccess(`Successfully created "${trimmedClassName}" and assigned to ${teacher.name}`);

        // Success message clears on the next action.
    };

    const handleDeleteClass = (classId: string) => {
        const cls = classes.find(c => c.id === classId);

        if (cls && cls.studentIds.length > 0) {
            setClassError(
                `Cannot delete "${cls.name}". This class has ${cls.studentIds.length} enrolled student(s). Please remove all students first.`
            );
            setTimeout(() => setClassError(''), 5000);
            return;
        }

        onUpdateClasses(classes.filter(c => c.id !== classId));
        setClassSuccess(`Successfully deleted "${cls?.name}"`);
        // Success message clears on the next action.
    };

    const getTeacherName = (teacherId: string) => {
        return users.find(u => u.id === teacherId)?.name || 'Unknown';
    };

    const getTeacherClassCount = (teacherId: string) => {
        return classes.filter(c => c.teacherId === teacherId).length;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                        <p className="text-sm text-gray-600">Welcome, {currentUser.name}</p>
                    </div>
                    <Button onClick={onLogout} variant="outline">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                <Tabs defaultValue="teachers" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="teachers">Teachers</TabsTrigger>
                        <TabsTrigger value="classes">Classes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="teachers" className="space-y-4">
                        {/* Success/Error Messages */}
                        {teacherError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{teacherError}</AlertDescription>
                            </Alert>
                        )}
                        {teacherSuccess && (
                            <Alert variant="success">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{teacherSuccess}</AlertDescription>
                            </Alert>
                        )}
                        <Card>
                            <CardHeader>
                                <CardTitle>Add New Teacher</CardTitle>
                                <CardDescription>Create a new teacher account for the system</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Input
                                        placeholder="Full name (e.g., Sarah Johnson)"
                                        value={newTeacherName}
                                        onChange={(e) => setNewTeacherName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddTeacher()}
                                    />
                                    <Input
                                        placeholder="Email (e.g., teacher@utcluj.ro)"
                                        type="email"
                                        value={newTeacherEmail}
                                        onChange={(e) => setNewTeacherEmail(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddTeacher()}
                                    />
                                    <Button onClick={handleAddTeacher}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Teacher
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Teachers ({teachers.length})</CardTitle>
                                <CardDescription>Manage all teachers in the system</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {teachers.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>No teachers added yet</p>
                                            <p className="text-sm">Add your first teacher using the form above</p>
                                        </div>
                                    ) : (
                                        teachers.map(teacher => {
                                            const classCount = getTeacherClassCount(teacher.id);
                                            return (
                                                <div
                                                    key={teacher.id}
                                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium">{teacher.name}</p>
                                                        <p className="text-sm text-gray-600">{teacher.email}</p>
                                                        {classCount > 0 && (
                                                            <Badge variant="secondary" className="mt-1">
                                                                {classCount} {classCount === 1 ? 'class' : 'classes'}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteTeacher(teacher.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="classes" className="space-y-4">
                        {/* Success/Error Messages */}
                        {classError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{classError}</AlertDescription>
                            </Alert>
                        )}
                        {classSuccess && (
                            <Alert variant="success">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{classSuccess}</AlertDescription>
                            </Alert>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Create New Class</CardTitle>
                                <CardDescription>Add a new class and assign a teacher</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {teachers.length === 0 ? (
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Please add at least one teacher before creating a class
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <Input
                                            placeholder="Class name (e.g., Physics 101)"
                                            value={newClassName}
                                            onChange={(e) => setNewClassName(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddClass()}
                                        />
                                        <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Assign teacher" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {teachers.map(teacher => (
                                                    <SelectItem key={teacher.id} value={teacher.id}>
                                                        {teacher.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button onClick={handleAddClass}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Class
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Classes ({classes.length})</CardTitle>
                                <CardDescription>Manage all classes in the system</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {classes.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>No classes created yet</p>
                                            <p className="text-sm">Create your first class using the form above</p>
                                        </div>
                                    ) : (
                                        classes.map(cls => (
                                            <div
                                                key={cls.id}
                                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium">{cls.name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Teacher: {getTeacherName(cls.teacherId)}
                                                    </p>
                                                    <Badge variant="secondary" className="mt-1">
                                                        {cls.studentIds.length} {cls.studentIds.length === 1 ? 'student' : 'students'}
                                                    </Badge>
                                                </div>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteClass(cls.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
