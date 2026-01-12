import { Question } from '../App';

export interface QuizTemplate {
  name: string;
  description: string;
  defaultQuestions: Partial<Question>[];
  settings: {
    defaultName: string;
    questionCount: number;
  };
}

export const quizTemplates: QuizTemplate[] = [
  {
    name: 'Exam Template',
    description: 'Standard exam format with multiple-choice questions',
    settings: {
      defaultName: 'Exam',
      questionCount: 5,
    },
    defaultQuestions: [
      {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
      {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
      {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
      {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
      {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ],
  },
  {
    name: 'Quick Quiz Template',
    description: 'Short 3-question quiz for quick assessments',
    settings: {
      defaultName: 'Quick Quiz',
      questionCount: 3,
    },
    defaultQuestions: [
      {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
      {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
      {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ],
  },
  {
    name: 'True/False Template',
    description: 'Quiz with True/False questions only',
    settings: {
      defaultName: 'True or False Quiz',
      questionCount: 5,
    },
    defaultQuestions: [
      {
        text: '',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        text: '',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        text: '',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        text: '',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        text: '',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
    ],
  },
  {
    name: 'Comprehensive Test Template',
    description: 'Long-form test with 10 questions',
    settings: {
      defaultName: 'Comprehensive Test',
      questionCount: 10,
    },
    defaultQuestions: Array(10).fill({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    }),
  },
];
