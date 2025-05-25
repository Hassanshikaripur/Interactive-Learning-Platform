
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Calendar, Sparkles, BookOpen, Zap, Brain, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Subject {
  name: string;
  color: string;
}

interface TimeSlot {
  day: string;
  time: string;
  subject: string;
  color: string;
}

// Initialize Gemini AI
const API_KEY = "AIzaSyDh8Igr0MhT4FXTIo6mHdjk3VrKdjWGQp8";
const genAI = new GoogleGenerativeAI(API_KEY);

const StudyPlanner = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showTimetable, setShowTimetable] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fixed study days and hours - reduced hours range for more density
  const studyDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];

  const addSubject = () => {
    if (newSubject.trim()) {
      const subject: Subject = {
        name: newSubject.trim(),
        color: colors[subjects.length % colors.length]
      };
      setSubjects([...subjects, subject]);
      setNewSubject('');
    }
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const generateAITimetable = async () => {
    if (subjects.length === 0) return;
    
    setIsGenerating(true);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      
      // Create a prompt for the AI with emphasis on filling the timetable
      const prompt = `Create an optimized study timetable for the following subjects.
      
      Subjects:
      ${subjects.map(s => `- ${s.name}`).join('\n')}
      
      Available days: ${studyDays.join(', ')}
      Available hours each day: ${hours.join(', ')}
      
      Requirements:
      - IMPORTANT: Fill at least 70% of the available time slots with study sessions
      - EVERY subject MUST appear multiple times in the timetable (at least 6-8 times each)
      - Distribute subjects evenly across all days of the week
      - Each subject should appear at least once on different days
      - Avoid scheduling the same subject on consecutive days when possible
      - Place subjects requiring more focus during peak productivity hours (morning or early afternoon)
      - Ensure variety within each day
      
      Return the response in this exact JSON format:
      {
        "timeSlots": [
          {
            "day": "Monday",
            "time": "9:00",
            "subject": "Subject Name"
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
        
        if (!parsed.timeSlots || !Array.isArray(parsed.timeSlots)) {
          throw new Error('Invalid response format: missing timeSlots array');
        }
        
        // Process the AI-generated timetable
        const newTimeSlots: TimeSlot[] = parsed.timeSlots
          .filter((slot: any) => 
            slot.day && 
            slot.time && 
            slot.subject &&
            studyDays.includes(slot.day) &&
            hours.includes(slot.time) &&
            subjects.some(s => s.name === slot.subject)
          )
          .map((slot: any) => ({
            day: slot.day,
            time: slot.time,
            subject: slot.subject,
            color: subjects.find(s => s.name === slot.subject)?.color || colors[0]
          }));
        
        // Check if all subjects are included and have sufficient occurrences
        const subjectCounts = {};
        subjects.forEach(subject => {
          subjectCounts[subject.name] = 0;
        });
        
        newTimeSlots.forEach(slot => {
          if (subjectCounts[slot.subject] !== undefined) {
            subjectCounts[slot.subject]++;
          }
        });
        
        const missingOrInsufficientSubjects = Object.entries(subjectCounts)
          .filter(([_, count]) => count < 4)
          .map(([name]) => name);
        
        // Check if we have enough slots filled (at least 60% of available slots)
        const totalAvailableSlots = studyDays.length * hours.length;
        const filledPercentage = (newTimeSlots.length / totalAvailableSlots) * 100;
        
        if (newTimeSlots.length > 0 && missingOrInsufficientSubjects.length === 0 && filledPercentage >= 60) {
          setTimeSlots(newTimeSlots);
          setShowTimetable(true);
        } else {
          // Fallback to the improved algorithm if AI didn't produce valid results
          generateDenselyFilledTimetable();
        }
        
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        // Fallback to the improved algorithm
        generateDenselyFilledTimetable();
      }
      
    } catch (error) {
      console.error('Error generating AI timetable:', error);
      // Fallback to the improved algorithm
      generateDenselyFilledTimetable();
    } finally {
      setIsGenerating(false);
    }
  };

  // Improved timetable generation algorithm that fills most of the available slots
  const generateDenselyFilledTimetable = () => {
    if (subjects.length === 0) return;

    const newTimeSlots: TimeSlot[] = [];
    
    // Create a pool of all available time slots
    const availableSlots: { day: string; time: string }[] = [];
    studyDays.forEach(day => {
      hours.forEach(time => {
        availableSlots.push({ day, time });
      });
    });

    // Calculate how many slots to fill (at least 75% of available slots)
    const totalSlotsToFill = Math.ceil(availableSlots.length * 0.75);
    
    // Calculate minimum sessions per subject (at least 6)
    const sessionsPerSubject = Math.max(6, Math.ceil(totalSlotsToFill / subjects.length));
    
    // Create a map to track used slots
    const usedSlotKeys = new Set<string>();
    
    // First pass: distribute subjects evenly across days
    // Ensure each subject appears on each day at least once if possible
    subjects.forEach(subject => {
      studyDays.forEach(day => {
        // Find an available slot on this day
        const availableSlot = hours.find(time => {
          const slotKey = `${day}-${time}`;
          return !usedSlotKeys.has(slotKey);
        });
        
        if (availableSlot) {
          const slotKey = `${day}-${availableSlot}`;
          usedSlotKeys.add(slotKey);
          
          newTimeSlots.push({
            day,
            time: availableSlot,
            subject: subject.name,
            color: subject.color
          });
        }
      });
    });
    
    // Second pass: fill remaining slots to reach the target density
    // Distribute remaining slots evenly among subjects
    let currentSubjectIndex = 0;
    let remainingSlotsToFill = totalSlotsToFill - newTimeSlots.length;
    
    // Create a shuffled copy of available slots for random distribution
    const remainingSlots = availableSlots
      .filter(slot => !usedSlotKeys.has(`${slot.day}-${slot.time}`))
      .sort(() => Math.random() - 0.5);
    
    while (remainingSlotsToFill > 0 && remainingSlots.length > 0) {
      const slot = remainingSlots.pop()!;
      const slotKey = `${slot.day}-${slot.time}`;
      
      if (!usedSlotKeys.has(slotKey)) {
        const subject = subjects[currentSubjectIndex % subjects.length];
        
        usedSlotKeys.add(slotKey);
        newTimeSlots.push({
          day: slot.day,
          time: slot.time,
          subject: subject.name,
          color: subject.color
        });
        
        remainingSlotsToFill--;
        currentSubjectIndex++;
      }
    }
    
    // Sort the time slots for consistent display
    newTimeSlots.sort((a, b) => {
      const dayOrder = studyDays.indexOf(a.day) - studyDays.indexOf(b.day);
      if (dayOrder !== 0) return dayOrder;
      return hours.indexOf(a.time) - hours.indexOf(b.time);
    });

    setTimeSlots(newTimeSlots);
    setShowTimetable(true);
  };

  const getSubjectForSlot = (day: string, time: string) => {
    return timeSlots.find(slot => slot.day === day && slot.time === time);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-teal-600 to-blue-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8 animate-in fade-in-0 duration-1000">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Link to="/" className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20">
              ← Back to Home
            </Link>
            <div className="flex items-center gap-3 group">
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-all duration-300 group-hover:rotate-12">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">Study Planner</h1>
            </div>
          </div>
          <p className="text-xl text-green-100 animate-in slide-in-from-bottom-4 duration-1000 delay-200">
            Create your personalized study timetable with AI-powered optimization
          </p>
        </div>

        {!showTimetable ? (
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Add Subjects */}
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15 animate-in slide-in-from-left-4 duration-1000 delay-400">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  Add Your Subjects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label htmlFor="subject" className="text-white/90 font-medium">Subject Name</Label>
                    <Input
                      id="subject"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="e.g., Mathematics, History..."
                      className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:bg-white/30 transition-all duration-300 focus:scale-105"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addSubject();
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={addSubject} 
                      className="bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {subjects.length > 0 && (
                  <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500">
                    <Label className="text-white/90 font-medium">Your Subjects:</Label>
                    <div className="space-y-3">
                      {subjects.map((subject, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-300 hover:scale-105 animate-in slide-in-from-left-4" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${subject.color} animate-pulse`}></div>
                            <span className="text-white font-medium">{subject.name}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeSubject(index)}
                            className="text-white/70 hover:text-white hover:bg-red-500/20 transition-all duration-300 hover:scale-110"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="text-center animate-in slide-in-from-bottom-4 duration-1000 delay-800">
              <Button 
                onClick={generateAITimetable}
                disabled={subjects.length === 0 || isGenerating}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium px-12 py-4 rounded-xl transition-all duration-500 transform hover:scale-110 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-3">
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating AI Timetable...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                      Generate AI Timetable
                      <Zap className="w-5 h-5 group-hover:animate-pulse" />
                    </>
                  )}
                </div>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Improved Timetable with better UI */}
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl animate-in scale-in-0 duration-1000">
              <CardHeader>
                <CardTitle className="text-2xl text-white text-center flex items-center justify-center gap-3">
                  <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                  Your AI-Generated Study Timetable
                  <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse rounded-lg overflow-hidden shadow-2xl">
                    <thead>
                      <tr>
                        <th className="border border-white/20 p-4 bg-white/20 backdrop-blur-md text-white font-bold">Time</th>
                        {studyDays.map((day, index) => (
                          <th key={day} className="border border-white/20 p-4 bg-white/20 backdrop-blur-md text-white font-bold animate-in slide-in-from-top-4" style={{ animationDelay: `${index * 100}ms` }}>{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {hours.map((time, timeIndex) => (
                        <tr key={time} className="hover:bg-white/10 transition-all duration-300">
                          <td className="border border-white/20 p-4 font-medium bg-white/10 backdrop-blur-md text-white animate-in slide-in-from-left-4" style={{ animationDelay: `${timeIndex * 50}ms` }}>{time}</td>
                          {studyDays.map((day, dayIndex) => {
                            const slot = getSubjectForSlot(day, time);
                            return (
                              <td key={`${day}-${time}`} className="border border-white/20 p-2 h-16 animate-in fade-in-0" style={{ animationDelay: `${timeIndex * 50 + dayIndex * 25}ms` }}>
                                {slot ? (
                                  <div className={`${slot.color} text-white text-sm p-2 rounded-lg text-center font-medium shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-xl flex items-center justify-center h-full`}>
                                    {slot.subject}
                                  </div>
                                ) : (
                                  <div className="w-full h-full bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"></div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Subject Legend */}
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  {subjects.map((subject, index) => (
                    <Badge key={index} className={`${subject.color} text-white px-3 py-1.5 text-sm font-medium animate-in fade-in-0`} style={{ animationDelay: `${index * 100}ms` }}>
                      {subject.name}
                    </Badge>
                  ))}
                </div>
                
                {/* Timetable Stats */}
                <div className="mt-4 text-center text-white/80 text-sm">
                  <p>Total study sessions: {timeSlots.length} ({Math.round((timeSlots.length / (studyDays.length * hours.length)) * 100)}% filled)</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {subjects.map((subject, index) => {
                      const count = timeSlots.filter(slot => slot.subject === subject.name).length;
                      return (
                        <span key={index} className="text-white/90">
                          {subject.name}: {count} sessions
                        </span>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center space-x-6 animate-in slide-in-from-bottom-4 duration-1000 delay-500">
              <Button
                onClick={() => setShowTimetable(false)}
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 px-8 py-3 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Edit Subjects
                </div>
              </Button>
              <Button
                onClick={generateAITimetable}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white hover:scale-105 transition-all duration-300 px-8 py-3 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Regenerate Timetable
                </div>
              </Button>
              <Link to="/">
                <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 hover:scale-105 transition-all duration-300 px-8 py-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    Back to Home
                    <Sparkles className="w-4 h-4" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPlanner;
