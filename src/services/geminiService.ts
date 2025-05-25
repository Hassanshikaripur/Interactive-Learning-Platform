
import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuizQuestion } from '@/types/quiz';

const API_KEY = "AIzaSyDh8Igr0MhT4FXTIo6mHdjk3VrKdjWGQp8";
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const prompt = `Create a 10-question multiple-choice quiz about "${topic}". 
    
    Requirements:
    - Generate exactly 10 questions
    - Each question should have 4 answer options (A, B, C, D)
    - Include the correct answer index (0-3)
    - Provide a brief explanation for each correct answer
    - Questions should vary in difficulty from basic to intermediate
    - Cover different aspects of the topic
    - Make questions clear and unambiguous
    
    Return the response in this exact JSON format:
    {
      "questions": [
        {
          "id": 1,
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Brief explanation of why this answer is correct"
        }
      ]
    }
    
    Make sure the JSON is valid and properly formatted.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw AI response:', text);
    
    // Try to extract JSON from the response
    let jsonText = text;
    
    // Remove markdown formatting if present
    if (text.includes('```json')) {
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
    } else if (text.includes('```')) {
      const jsonMatch = text.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
    }
    
    // Clean up the JSON text
    jsonText = jsonText.trim();
    
    try {
      const parsed = JSON.parse(jsonText);
      
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Invalid response format: missing questions array');
      }
      
      // Validate and clean the questions
      const validQuestions: QuizQuestion[] = parsed.questions
        .filter((q: any) => 
          q.question && 
          Array.isArray(q.options) && 
          q.options.length === 4 &&
          typeof q.correctAnswer === 'number' &&
          q.correctAnswer >= 0 &&
          q.correctAnswer < 4
        )
        .slice(0, 10) // Ensure we only take 10 questions
        .map((q: any, index: number) => ({
          id: index + 1,
          question: q.question.trim(),
          options: q.options.map((opt: string) => opt.trim()),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation?.trim() || ''
        }));
      
      if (validQuestions.length < 5) {
        throw new Error('Not enough valid questions generated');
      }
      
      return validQuestions;
      
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('JSON text:', jsonText);
      throw new Error('Failed to parse AI response');
    }
    
  } catch (error) {
    console.error('Error generating quiz:', error);
    
    // Fallback questions if AI fails
    return generateFallbackQuiz(topic);
  }
};

const generateFallbackQuiz = (topic: string): QuizQuestion[] => {
  return [
    {
      id: 1,
      question: `What is the main focus of ${topic}?`,
      options: [
        'Primary concept A',
        'Primary concept B', 
        'Primary concept C',
        'Primary concept D'
      ],
      correctAnswer: 0,
      explanation: 'This is a general question about the topic.'
    },
    {
      id: 2,
      question: `Which of the following is most closely related to ${topic}?`,
      options: [
        'Related concept A',
        'Related concept B',
        'Related concept C', 
        'Related concept D'
      ],
      correctAnswer: 1,
      explanation: 'This relates to the core principles of the topic.'
    },
    {
      id: 3,
      question: `What is an important characteristic of ${topic}?`,
      options: [
        'Characteristic A',
        'Characteristic B',
        'Characteristic C',
        'Characteristic D'
      ],
      correctAnswer: 2,
      explanation: 'This characteristic is fundamental to understanding the topic.'
    },
    {
      id: 4,
      question: `How would you best describe ${topic}?`,
      options: [
        'Description A',
        'Description B', 
        'Description C',
        'Description D'
      ],
      correctAnswer: 0,
      explanation: 'This description captures the essence of the topic.'
    },
    {
      id: 5,
      question: `What is a key application of ${topic}?`,
      options: [
        'Application A',
        'Application B',
        'Application C',
        'Application D'
      ],
      correctAnswer: 1,
      explanation: 'This is one of the primary applications in this field.'
    }
  ];
};
