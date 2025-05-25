
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Clock, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { QuizQuestion, QuizResult, UserAnswer } from '@/types/quiz';
import { generateQuiz } from '@/services/geminiService';
import { useToast } from '@/hooks/use-toast';

interface QuizInterfaceProps {
  topic: string;
  onQuizComplete: (result: QuizResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setQuestions: (questions: QuizQuestion[]) => void;
  questions: QuizQuestion[];
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ 
  topic, 
  onQuizComplete, 
  isLoading, 
  setIsLoading,
  setQuestions,
  questions 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<UserAnswer | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const generatedQuestions = await generateQuiz(topic);
        setQuestions(generatedQuestions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error generating quiz:', error);
        toast({
          title: "Error",
          description: "Failed to generate quiz. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    if (isLoading && questions.length === 0) {
      loadQuiz();
    }
  }, [topic, isLoading, questions.length, setQuestions, setIsLoading, toast]);

  useEffect(() => {
    if (!isLoading && questions.length > 0) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLoading, questions.length]);

  // Reset selected answer when moving to new question
  useEffect(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCurrentAnswer(null);
  }, [currentQuestionIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showFeedback) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
    };

    setCurrentAnswer(answer);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentAnswer) {
      const updatedAnswers = [...userAnswers, currentAnswer];
      setUserAnswers(updatedAnswers);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Quiz completed
        const score = updatedAnswers.filter(a => a.isCorrect).length;
        const result: QuizResult = {
          score,
          totalQuestions: questions.length,
          userAnswers: updatedAnswers,
          questions,
          percentage: Math.round((score / questions.length) * 100),
        };
        onQuizComplete(result);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Remove the last answer from userAnswers
      const updatedAnswers = userAnswers.slice(0, -1);
      setUserAnswers(updatedAnswers);
    }
  };

  if (isLoading || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Generating Your Quiz
            </h3>
            <p className="text-gray-600 text-center">
              Our AI is creating 10 thoughtful questions about: <strong>{topic}</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Quiz: {topic}</h2>
        <div className="flex items-center justify-center gap-4 text-blue-100">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatTime(timeElapsed)}
          </span>
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <Progress value={progress} className="h-2 bg-white/20" />
      </div>

      <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={selectedAnswer?.toString() || ""}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            disabled={showFeedback}
          >
            {currentQuestion.options.map((option, index) => {
              let optionClass = "flex items-center space-x-2 p-3 rounded-lg transition-colors";
              
              if (showFeedback) {
                if (index === currentQuestion.correctAnswer) {
                  optionClass += " bg-green-100 border-2 border-green-500";
                } else if (index === selectedAnswer && !currentAnswer?.isCorrect) {
                  optionClass += " bg-red-100 border-2 border-red-500";
                } else {
                  optionClass += " bg-gray-50";
                }
              } else {
                optionClass += " hover:bg-gray-50 cursor-pointer";
              }

              return (
                <div key={index} className={optionClass}>
                  <RadioGroupItem 
                    value={index.toString()} 
                    id={`option-${index}`}
                    disabled={showFeedback}
                  />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="flex-1 cursor-pointer text-gray-700 flex items-center justify-between"
                  >
                    <span>{option}</span>
                    {showFeedback && (
                      <>
                        {index === currentQuestion.correctAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        {index === selectedAnswer && !currentAnswer?.isCorrect && (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </>
                    )}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>

          {showFeedback && currentQuestion.explanation && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
              <p className="text-blue-700">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {!showFeedback ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {currentQuestionIndex === questions.length - 1 ? 'View Results' : 'Next Question'}
                {currentQuestionIndex < questions.length - 1 && <ChevronRight className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizInterface;
