
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Calendar, Clock, Sparkles, BookOpen, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Subject {
  name: string;
  hoursPerWeek: number;
  color: string;
}

interface TimeSlot {
  day: string;
  time: string;
  subject: string;
  color: string;
}

const StudyPlanner = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [newHours, setNewHours] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showTimetable, setShowTimetable] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];

  const addSubject = () => {
    if (newSubject.trim() && newHours) {
      const subject: Subject = {
        name: newSubject.trim(),
        hoursPerWeek: parseInt(newHours),
        color: colors[subjects.length % colors.length]
      };
      setSubjects([...subjects, subject]);
      setNewSubject('');
      setNewHours('');
    }
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const generateTimetable = () => {
    if (subjects.length === 0 || selectedDays.length === 0) return;

    const newTimeSlots: TimeSlot[] = [];
    
    // Create a pool of all available time slots
    const availableSlots: { day: string; time: string }[] = [];
    selectedDays.forEach(day => {
      hours.forEach(time => {
        availableSlots.push({ day, time });
      });
    });

    // Shuffle the available slots to create more varied distribution
    const shuffledSlots = [...availableSlots].sort(() => Math.random() - 0.5);

    // Create a list of all study sessions needed
    const studySessions: { subject: Subject; sessionNumber: number }[] = [];
    subjects.forEach(subject => {
      for (let i = 0; i < subject.hoursPerWeek; i++) {
        studySessions.push({ subject, sessionNumber: i });
      }
    });

    // Distribute study sessions across time slots
    // Try to spread sessions for the same subject across different days
    const usedSlots = new Set<string>();
    const subjectLastDay = new Map<string, string>();

    studySessions.forEach((session, index) => {
      const { subject } = session;
      
      // Find the best slot for this session
      let bestSlot = null;
      let bestSlotIndex = -1;

      for (let i = 0; i < shuffledSlots.length; i++) {
        const slot = shuffledSlots[i];
        const slotKey = `${slot.day}-${slot.time}`;
        
        if (usedSlots.has(slotKey)) continue;

        // Prefer slots on different days than the last assignment for this subject
        const lastDay = subjectLastDay.get(subject.name);
        if (!lastDay || slot.day !== lastDay) {
          bestSlot = slot;
          bestSlotIndex = i;
          break;
        } else if (!bestSlot) {
          // If no different day is available, use any available slot
          bestSlot = slot;
          bestSlotIndex = i;
        }
      }

      if (bestSlot && bestSlotIndex !== -1) {
        const slotKey = `${bestSlot.day}-${bestSlot.time}`;
        usedSlots.add(slotKey);
        subjectLastDay.set(subject.name, bestSlot.day);
        
        newTimeSlots.push({
          day: bestSlot.day,
          time: bestSlot.time,
          subject: subject.name,
          color: subject.color
        });

        // Remove the used slot from shuffled slots
        shuffledSlots.splice(bestSlotIndex, 1);
      }
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
                    />
                  </div>
                  <div className="w-32">
                    <Label htmlFor="hours" className="text-white/90 font-medium">Hours/Week</Label>
                    <Select value={newHours} onValueChange={setNewHours}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-300">
                        <SelectValue placeholder="Hours" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-md border-white/20">
                        {[1,2,3,4,5,6,7,8,9,10].map(h => (
                          <SelectItem key={h} value={h.toString()} className="hover:bg-green-100">{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                            <Badge variant="outline" className="border-white/30 text-white/90 bg-white/10 hover:bg-white/20 transition-all duration-300">
                              {subject.hoursPerWeek}h/week
                            </Badge>
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

            {/* Select Days */}
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15 animate-in slide-in-from-right-4 duration-1000 delay-600">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Select Study Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {days.map((day, index) => (
                    <div key={day} className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${600 + index * 100}ms` }}>
                      <Checkbox
                        id={day}
                        checked={selectedDays.includes(day)}
                        onCheckedChange={() => toggleDay(day)}
                        className="border-white/30 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                      <Label htmlFor={day} className="text-white/90 font-medium cursor-pointer">{day}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="text-center animate-in slide-in-from-bottom-4 duration-1000 delay-800">
              <Button 
                onClick={generateTimetable}
                disabled={subjects.length === 0 || selectedDays.length === 0}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium px-12 py-4 rounded-xl transition-all duration-500 transform hover:scale-110 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                  Generate AI Timetable
                  <Zap className="w-5 h-5 group-hover:animate-pulse" />
                </div>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Timetable */}
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
                        {selectedDays.map((day, index) => (
                          <th key={day} className="border border-white/20 p-4 bg-white/20 backdrop-blur-md text-white font-bold animate-in slide-in-from-top-4" style={{ animationDelay: `${index * 100}ms` }}>{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {hours.map((time, timeIndex) => (
                        <tr key={time} className="hover:bg-white/10 transition-all duration-300">
                          <td className="border border-white/20 p-4 font-medium bg-white/10 backdrop-blur-md text-white animate-in slide-in-from-left-4" style={{ animationDelay: `${timeIndex * 50}ms` }}>{time}</td>
                          {selectedDays.map((day, dayIndex) => {
                            const slot = getSubjectForSlot(day, time);
                            return (
                              <td key={`${day}-${time}`} className="border border-white/20 p-2 h-16 animate-in fade-in-0" style={{ animationDelay: `${timeIndex * 50 + dayIndex * 25}ms` }}>
                                {slot && (
                                  <div className={`${slot.color} text-white text-sm p-2 rounded-lg text-center font-medium shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-xl`}>
                                    {slot.subject}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                  Edit Schedule
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
