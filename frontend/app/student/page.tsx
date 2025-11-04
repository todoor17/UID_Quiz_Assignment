"use client";

import { useState } from "react";
import StudentDashboard from "../../components/StudentDashboard";
import {
  initialUsers,
  initialClasses,
  initialQuizzes,
  initialAttempts,
} from "../../lib/types";

export default function StudentPage() {
  const [users, setUsers] = useState(initialUsers);
  const [classes, setClasses] = useState(initialClasses);
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [attempts, setAttempts] = useState(initialAttempts);
  const student = users.find((u) => u.role === "student"); // Just uses first student
  // TODO: Replace with proper auth and redirect
  if (!student) return <div>No student found!</div>;
  return (
    <StudentDashboard
      currentUser={student}
      users={users}
      classes={classes}
      quizzes={quizzes}
      attempts={attempts}
      onLogout={() => {}}
      onUpdateAttempts={setAttempts}
    />
  );
}
