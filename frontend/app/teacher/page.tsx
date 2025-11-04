"use client";

import { useState } from "react";
import TeacherDashboard from "../../components/TeacherDashboard";
import {
  initialUsers,
  initialClasses,
  initialQuizzes,
  initialAttempts,
} from "../../lib/types";

export default function TeacherPage() {
  const [users, setUsers] = useState(initialUsers);
  const [classes, setClasses] = useState(initialClasses);
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [attempts, setAttempts] = useState(initialAttempts);
  const teacher = users.find((u) => u.role === "teacher"); // Just uses first teacher
  // TODO: Replace with proper auth and redirect
  if (!teacher) return <div>No teacher found!</div>;
  return (
    <TeacherDashboard
      currentUser={teacher}
      users={users}
      classes={classes}
      quizzes={quizzes}
      attempts={attempts}
      onLogout={() => {}}
      onUpdateClasses={setClasses}
      onUpdateQuizzes={setQuizzes}
    />
  );
}
