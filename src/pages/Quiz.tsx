
import React, { useState } from 'react';
import TopicInput from '@/components/TopicInput';
import QuizInterface from '@/components/QuizInterface';
import ResultsPage from '@/components/ResultsPage';
import { QuizQuestion, QuizResult } from '@/types/quiz';

const Quiz = () => {
  const [currentStep, setCurrentStep] = useState<'input' | 'quiz' | 'results'>('input');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTopicSubmit = async (inputTopic: string) => {
    setTopic(inputTopic);
    setIsLoading(true);
    setCurrentStep('quiz');
  };

  const handleQuizComplete = (quizResult: QuizResult) => {
    setResult(quizResult);
    setCurrentStep('results');
  };

  const handleRestart = () => {
    setCurrentStep('input');
    setTopic('');
    setQuestions([]);
    setResult(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700">
      <div className="container mx-auto px-4 py-8">
        {currentStep === 'input' && (
          <TopicInput onTopicSubmit={handleTopicSubmit} isLoading={isLoading} />
        )}
        
        {currentStep === 'quiz' && (
          <QuizInterface 
            topic={topic} 
            onQuizComplete={handleQuizComplete}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setQuestions={setQuestions}
            questions={questions}
          />
        )}
        
        {currentStep === 'results' && result && (
          <ResultsPage result={result} onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
};

export default Quiz;
