import { useState } from 'react';
import { Quiz, Question } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface QuizCreatorProps {
  classId: string;
  quizzes: Quiz[];
  onUpdateQuizzes: (quizzes: Quiz[]) => void;
  onClose: () => void;
  currentUserId: string;
}

export default function QuizCreator({
  classId,
  quizzes,
  onUpdateQuizzes,
  onClose,
  currentUserId,
}: QuizCreatorProps) {
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: `q${Date.now()}`,
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q${Date.now()}`,
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = oIndex;
    setQuestions(newQuestions);
  };

  const handleSaveQuiz = () => {
    if (!quizName.trim()) {
      alert('Please enter a quiz name');
      return;
    }

    const hasEmptyQuestions = questions.some(q => !q.text.trim());
    const hasEmptyOptions = questions.some(q => q.options.some(o => !o.trim()));

    if (hasEmptyQuestions || hasEmptyOptions) {
      alert('Please fill in all questions and options');
      return;
    }

    const newQuiz: Quiz = {
      id: `quiz${Date.now()}`,
      classId,
      name: quizName,
      questions,
      visible: true,
      createdBy: currentUserId,
    };

    onUpdateQuizzes([...quizzes, newQuiz]);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm">Quiz Name</label>
        <Input
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          placeholder="Enter quiz name"
          className="mt-1"
        />
      </div>

      <div className="space-y-4">
        {questions.map((question, qIndex) => (
          <Card key={question.id}>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <label className="text-sm">Question {qIndex + 1}</label>
                  <Input
                    value={question.text}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    placeholder="Enter question"
                    className="mt-1"
                  />
                </div>
                {questions.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveQuestion(qIndex)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm">Options (select the correct one)</label>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={question.correctAnswer === oIndex}
                      onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                      className="w-4 h-4"
                    />
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleAddQuestion} variant="outline" className="flex-1">
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={onClose} variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSaveQuiz} className="flex-1">
          Save Quiz
        </Button>
      </div>
    </div>
  );
}
