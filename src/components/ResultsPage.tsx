
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, RotateCcw, Trophy, Target } from 'lucide-react';
import { QuizResult } from '@/types/quiz';

interface ResultsPageProps {
  result: QuizResult;
  onRestart: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ result, onRestart }) => {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage === 100) return '🎉 Perfect Score! Outstanding!';
    if (percentage >= 90) return '🌟 Excellent work!';
    if (percentage >= 80) return '👏 Great job!';
    if (percentage >= 70) return '👍 Good effort!';
    if (percentage >= 60) return '📚 Keep learning!';
    return '💪 Don\'t give up, try again!';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Quiz Results</h1>
        <p className="text-xl text-blue-100">
          Here's how you performed
        </p>
      </div>

      {/* Score Overview */}
      <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0 mb-6">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-12 h-12 text-yellow-500 mr-3" />
              <div className={`text-6xl font-bold ${getScoreColor(result.percentage)}`}>
                {result.percentage}%
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {getScoreMessage(result.percentage)}
            </h2>
            <p className="text-lg text-gray-600">
              You scored {result.score} out of {result.totalQuestions} questions correctly
            </p>
            
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">
                  {result.score} Correct
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-medium">
                  {result.totalQuestions - result.score} Incorrect
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-medium">
                  {result.percentage}% Accuracy
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0 mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Detailed Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.questions.map((question, index) => {
            const userAnswer = result.userAnswers.find(ua => ua.questionId === question.id);
            const isCorrect = userAnswer?.isCorrect || false;
            
            return (
              <div key={question.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-gray-800 flex-1 pr-4">
                    {index + 1}. {question.question}
                  </h3>
                  <Badge 
                    variant={isCorrect ? "default" : "destructive"}
                    className={isCorrect ? "bg-green-100 text-green-800" : ""}
                  >
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="grid gap-2">
                    {question.options.map((option, optionIndex) => {
                      const isUserAnswer = userAnswer?.selectedAnswer === optionIndex;
                      const isCorrectAnswer = optionIndex === question.correctAnswer;
                      
                      let className = "p-2 rounded border ";
                      if (isCorrectAnswer) {
                        className += "bg-green-50 border-green-200 text-green-800";
                      } else if (isUserAnswer && !isCorrect) {
                        className += "bg-red-50 border-red-200 text-red-800";
                      } else {
                        className += "bg-gray-50 border-gray-200 text-gray-700";
                      }
                      
                      return (
                        <div key={optionIndex} className={className}>
                          <div className="flex items-center gap-2">
                            {isCorrectAnswer && <CheckCircle className="w-4 h-4 text-green-600" />}
                            {isUserAnswer && !isCorrect && <XCircle className="w-4 h-4 text-red-600" />}
                            <span>{option}</span>
                            {isUserAnswer && (
                              <Badge variant="outline" className="ml-auto">
                                Your Answer
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {question.explanation && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-blue-800">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="text-center">
        <Button
          onClick={onRestart}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Take Another Quiz
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;
