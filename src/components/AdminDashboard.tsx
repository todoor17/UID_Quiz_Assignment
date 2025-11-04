import { useState } from 'react';
import { User, Class } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LogOut, Plus, Trash2 } from 'lucide-react';
import { Badge } from './ui/badge';

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

  const teachers = users.filter(u => u.role === 'teacher');

  const handleAddTeacher = () => {
    if (newTeacherName && newTeacherEmail) {
      const newTeacher: User = {
        id: `teacher${Date.now()}`,
        name: newTeacherName,
        email: newTeacherEmail,
        role: 'teacher',
      };
      onUpdateUsers([...users, newTeacher]);
      setNewTeacherName('');
      setNewTeacherEmail('');
    }
  };

  const handleDeleteTeacher = (teacherId: string) => {
    onUpdateUsers(users.filter(u => u.id !== teacherId));
  };

  const handleAddClass = () => {
    if (newClassName && selectedTeacherId) {
      const newClass: Class = {
        id: `class${Date.now()}`,
        name: newClassName,
        teacherId: selectedTeacherId,
        studentIds: [],
      };
      onUpdateClasses([...classes, newClass]);
      setNewClassName('');
      setSelectedTeacherId('');
    }
  };

  const handleDeleteClass = (classId: string) => {
    onUpdateClasses(classes.filter(c => c.id !== classId));
  };

  const getTeacherName = (teacherId: string) => {
    return users.find(u => u.id === teacherId)?.name || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1>Admin Dashboard</h1>
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
            <Card>
              <CardHeader>
                <CardTitle>Add New Teacher</CardTitle>
                <CardDescription>Create a new teacher account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Teacher name"
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={newTeacherEmail}
                    onChange={(e) => setNewTeacherEmail(e.target.value)}
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
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teachers.map(teacher => (
                    <div
                      key={teacher.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p>{teacher.name}</p>
                        <p className="text-sm text-gray-600">{teacher.email}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTeacher(teacher.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Class</CardTitle>
                <CardDescription>Add a new class and assign a teacher</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Class name"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Classes ({classes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {classes.map(cls => (
                    <div
                      key={cls.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p>{cls.name}</p>
                        <p className="text-sm text-gray-600">
                          Teacher: {getTeacherName(cls.teacherId)}
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          {cls.studentIds.length} students
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
