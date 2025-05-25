
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BookOpen, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TopicInputProps {
  onTopicSubmit: (topic: string) => void;
  isLoading: boolean;
}

const TopicInput: React.FC<TopicInputProps> = ({ onTopicSubmit, isLoading }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length > 0) {
      onTopicSubmit(content.trim());
    }
  };

  const isValid = content.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Link to="/" className="text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            AI Quiz Generator
          </h1>
        </div>
        <p className="text-xl text-blue-100">
          Enter a topic or paste text to generate an intelligent quiz
        </p>
      </div>

      <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gray-800 flex items-center justify-center gap-2">
            <BookOpen className="w-6 h-6" />
            Create Your Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                Enter a topic or paste text content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Examples:
• Topic: 'World War II', 'Machine Learning', 'Photosynthesis'
• Text: Paste an article, paragraph, or any content you'd like to create a quiz from..."
                className="mt-2 min-h-[120px] resize-none"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-2">
                {content.length} characters • Minimum 1 character required
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={!isValid || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                'Generate Quiz'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopicInput;
