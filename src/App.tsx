import { useState } from 'react';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

// Mock data structure
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  studentIds: string[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  topic?: string;
}

export interface Quiz {
  id: string;
  classId: string;
  name: string;
  questions: Question[];
  visible: boolean;
  createdBy: string;
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  answers: number[];
  score: number;
  timestamp: number;
}

// Initial mock data
const initialUsers: User[] = [
  { id: 'admin1', name: 'Admin User', email: 'admin@school.com', role: 'admin' },
  { id: 'teacher1', name: 'John Smith', email: 'john@school.com', role: 'teacher' },
  { id: 'teacher2', name: 'Sarah Johnson', email: 'sarah@school.com', role: 'teacher' },
  { id: 'student1', name: 'Alice Brown', email: 'alice@school.com', role: 'student' },
  { id: 'student2', name: 'Bob Wilson', email: 'bob@school.com', role: 'student' },
  { id: 'student3', name: 'Charlie Davis', email: 'charlie@school.com', role: 'student' },
  { id: 'student4', name: 'Diana Evans', email: 'diana@school.com', role: 'student' },
];

const initialClasses: Class[] = [
  { id: 'class1', name: 'Mathematics 101', teacherId: 'teacher1', studentIds: ['student1', 'student2', 'student3'] },
  { id: 'class2', name: 'Physics 101', teacherId: 'teacher2', studentIds: ['student1', 'student4'] },
];

const initialQuizzes: Quiz[] = [
  {
    id: 'quiz1',
    classId: 'class1',
    name: 'Algebra Basics',
    visible: true,
    createdBy: 'teacher1',
    questions: [
      {
        id: 'q1',
        text: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 1,
        explanation: 'Basic addition: 2 + 2 equals 4. This is a fundamental arithmetic operation.',
        topic: 'Addition',
      },
      {
        id: 'q2',
        text: 'What is 5 × 3?',
        options: ['12', '13', '14', '15'],
        correctAnswer: 3,
        explanation: 'Multiplication: 5 × 3 means adding 5 three times (5 + 5 + 5) which equals 15.',
        topic: 'Multiplication',
      },
      {
        id: 'q3',
        text: 'What is 10 - 7?',
        options: ['2', '3', '4', '5'],
        correctAnswer: 1,
        explanation: 'Subtraction: 10 - 7 equals 3. Count down from 10 to find the difference.',
        topic: 'Subtraction',
      },
    ],
  },
  {
    id: 'quiz2',
    classId: 'class1',
    name: 'Geometry Fundamentals',
    visible: true,
    createdBy: 'teacher1',
    questions: [
      {
        id: 'q4',
        text: 'How many sides does a triangle have?',
        options: ['2', '3', '4', '5'],
        correctAnswer: 1,
        explanation: 'A triangle is a polygon with three sides and three angles. The prefix "tri-" means three.',
        topic: 'Polygons',
      },
      {
        id: 'q5',
        text: 'What is the sum of angles in a triangle?',
        options: ['90°', '180°', '270°', '360°'],
        correctAnswer: 1,
        explanation: 'The interior angles of any triangle always add up to 180 degrees. This is a fundamental property of triangles.',
        topic: 'Angles',
      },
    ],
  },
  {
    id: 'quiz3',
    classId: 'class2',
    name: 'Newton\'s Laws',
    visible: true,
    createdBy: 'teacher2',
    questions: [
      {
        id: 'q6',
        text: 'What is the formula for force?',
        options: ['F = m/a', 'F = ma', 'F = m + a', 'F = m - a'],
        correctAnswer: 1,
        explanation: 'Newton\'s Second Law states that Force equals mass times acceleration (F = ma). This is one of the most important equations in physics.',
        topic: 'Forces',
      },
    ],
  },
];

const initialAttempts: QuizAttempt[] = [
  {
    id: 'attempt1',
    studentId: 'student1',
    quizId: 'quiz1',
    answers: [1, 3, 1],
    score: 100,
    timestamp: Date.now() - 86400000,
  },
  {
    id: 'attempt2',
    studentId: 'student2',
    quizId: 'quiz1',
    answers: [1, 2, 1],
    score: 67,
    timestamp: Date.now() - 172800000,
  },
  {
    id: 'attempt3',
    studentId: 'student3',
    quizId: 'quiz1',
    answers: [0, 3, 0],
    score: 33,
    timestamp: Date.now() - 259200000,
  },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [attempts, setAttempts] = useState<QuizAttempt[]>(initialAttempts);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage users={users} onLogin={handleLogin} />;
  }

  if (currentUser.role === 'admin') {
    return (
      <AdminDashboard
        currentUser={currentUser}
        users={users}
        classes={classes}
        onLogout={handleLogout}
        onUpdateUsers={setUsers}
        onUpdateClasses={setClasses}
      />
    );
  }

  if (currentUser.role === 'teacher') {
    return (
      <TeacherDashboard
        currentUser={currentUser}
        users={users}
        classes={classes}
        quizzes={quizzes}
        attempts={attempts}
        onLogout={handleLogout}
        onUpdateClasses={setClasses}
        onUpdateQuizzes={setQuizzes}
      />
    );
  }

  return (
    <StudentDashboard
      currentUser={currentUser}
      users={users}
      classes={classes}
      quizzes={quizzes}
      attempts={attempts}
      onLogout={handleLogout}
      onUpdateAttempts={setAttempts}
    />
  );
}