import { useState } from 'react';
import { Class, User } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface ClassManagerProps {
  classData: Class;
  users: User[];
  classes: Class[];
  onUpdateClasses: (classes: Class[]) => void;
}

export default function ClassManager({
  classData,
  users,
  classes,
  onUpdateClasses,
}: ClassManagerProps) {
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const students = users.filter(u => u.role === 'student');
  const availableStudents = students.filter(
    s => !classData.studentIds.includes(s.id)
  );
  const enrolledStudents = students.filter(s =>
    classData.studentIds.includes(s.id)
  );

  const handleAddStudent = () => {
    if (selectedStudentId) {
      onUpdateClasses(
        classes.map(c =>
          c.id === classData.id
            ? { ...c, studentIds: [...c.studentIds, selectedStudentId] }
            : c
        )
      );
      setSelectedStudentId('');
    }
  };

  const handleRemoveStudent = (studentId: string) => {
    onUpdateClasses(
      classes.map(c =>
        c.id === classData.id
          ? { ...c, studentIds: c.studentIds.filter(id => id !== studentId) }
          : c
      )
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Enroll Students</CardTitle>
          <CardDescription>Add students to {classData.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {availableStudents.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddStudent} disabled={!selectedStudentId}>
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students ({enrolledStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {enrolledStudents.map(student => (
                <div
                    key={student.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p>{student.name}</p>
                    <a
                        href="https://moodle.cs.utcluj.ro/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:underline"
                    >
                      {student.email}
                    </a>
                  </div>
                  <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveStudent(student.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
            ))}

            {enrolledStudents.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">
                No students enrolled yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
