"use client";

import { useState } from "react";
import { User, Class, Quiz, QuizAttempt } from "../lib/types";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LogOut, Plus } from "lucide-react";
import QuizManager from "./QuizManager";
import ClassManager from "./ClassManager";
import ClassStatistics from "./ClassStatistics";

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
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const myClasses = classes.filter((c) => c.teacherId === currentUser.id);
  const selectedClass = myClasses.find((c) => c.id === selectedClassId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1>Teacher Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {currentUser.name}</p>
          </div>
          <Button onClick={onLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>My Classes</CardTitle>
            <CardDescription>Select a class to manage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {myClasses.map((cls) => (
                <Card
                  key={cls.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedClassId === cls.id ? "ring-2 ring-indigo-600" : ""
                  }`}
                  onClick={() => setSelectedClassId(cls.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-base">{cls.name}</CardTitle>
                    <CardDescription>
                      {cls.studentIds.length} students
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedClass && (
          <Tabs defaultValue="quizzes" className="space-y-4">
            <TabsList>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
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
        )}
      </div>
    </div>
  );
}
