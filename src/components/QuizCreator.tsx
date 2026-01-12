import { useState } from 'react';
import { Quiz, Question } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Plus, Trash2, FileText } from 'lucide-react';
import { quizTemplates, QuizTemplate } from './QuizTemplates';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface QuizCreatorProps {
  classId: string;
  quizzes: Quiz[];
  onUpdateQuizzes: (quizzes: Quiz[]) => void;
  onClose: () => void;
  currentUserId: string;
  editingQuiz?: Quiz;
  duplicateQuiz?: Quiz;
}

export default function QuizCreator({
  classId,
  quizzes,
  onUpdateQuizzes,
  onClose,
  currentUserId,
  editingQuiz,
  duplicateQuiz,
}: QuizCreatorProps) {
  const [showTemplates, setShowTemplates] = useState(!editingQuiz && !duplicateQuiz);
  const [quizName, setQuizName] = useState(
    editingQuiz?.name || (duplicateQuiz ? `${duplicateQuiz.name} (Copy)` : '')
  );
  const [questions, setQuestions] = useState<Question[]>(
    editingQuiz?.questions || 
    duplicateQuiz?.questions ||
    [
      {
        id: `q${Date.now()}`,
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ]
  );

  const handleTemplateSelect = (template: QuizTemplate) => {
    setQuizName(template.settings.defaultName);
    setQuestions(
      template.defaultQuestions.map((q, idx) => ({
        id: `q${Date.now()}_${idx}`,
        text: q.text || '',
        options: q.options || ['', '', '', ''],
        correctAnswer: q.correctAnswer || 0,
      }))
    );
    setShowTemplates(false);
  };

  const handleSkipTemplate = () => {
    setShowTemplates(false);
  };

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
      {showTemplates && (
        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Choose a Template
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Start with a pre-configured template or create from scratch
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              {quizTemplates.map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTemplateSelect(template)}
                  className="p-4 text-left border-2 border-gray-200 bg-white rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  <p className="mb-1">{template.name}</p>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {template.settings.questionCount} questions
                  </p>
                </button>
              ))}
            </div>
            <Button onClick={handleSkipTemplate} variant="outline" className="w-full">
              Skip and Create from Scratch
            </Button>
          </CardContent>
        </Card>
      )}
      
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
              <div className="space-y-1">
                <label className="text-sm">Question {qIndex + 1}</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={question.text}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    placeholder="Enter question"
                    className="flex-1"
                  />
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
