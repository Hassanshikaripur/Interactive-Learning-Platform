
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, Brain, Clock, ArrowRight, Sparkles, Zap, Target, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Modern background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(120,119,198,0.1)_0deg,transparent_60deg,rgba(120,119,198,0.1)_120deg,transparent_180deg,rgba(120,119,198,0.1)_240deg,transparent_300deg,rgba(120,119,198,0.1)_360deg)]"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-in fade-in-0 duration-1000">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative p-8 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl group-hover:scale-110 transition-all duration-500">
                <Brain className="w-16 h-16 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white leading-tight animate-in slide-in-from-bottom-4 duration-1000 delay-200">
              Learn<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse">Smart</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-slate-200 font-light max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom-4 duration-1000 delay-400">
              AI-powered learning platform that creates 
              <span className="font-medium text-purple-300"> personalized quizzes</span> and 
              <span className="font-medium text-blue-300"> smart schedules</span>
            </p>
            
            <div className="flex items-center justify-center gap-2 text-slate-400 animate-in slide-in-from-bottom-4 duration-1000 delay-600">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-2 font-medium">Trusted by 10k+ learners</span>
            </div>
          </div>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 animate-in slide-in-from-bottom-4 duration-1000 delay-800">
            {[
              { icon: Clock, text: 'Smart Scheduling', gradient: 'from-blue-500 to-cyan-500' },
              { icon: Sparkles, text: 'AI-Generated Quizzes', gradient: 'from-purple-500 to-pink-500' },
              { icon: Target, text: 'Personalized Learning', gradient: 'from-green-500 to-emerald-500' },
              { icon: TrendingUp, text: 'Progress Tracking', gradient: 'from-orange-500 to-red-500' }
            ].map((feature, index) => (
              <div key={feature.text} className="group cursor-pointer animate-in slide-in-from-bottom-4 duration-1000" style={{animationDelay: `${1000 + index * 100}ms`}}>
                <div className="relative">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-full opacity-50 group-hover:opacity-100 transition duration-300 blur`}></div>
                  <div className="relative flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                    <feature.icon className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">{feature.text}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
          <Card className="group relative backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:transform hover:scale-[1.02] animate-in slide-in-from-left-4 duration-1000 delay-1000 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <CardHeader className="relative text-center pb-6 pt-8">
              <div className="mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                <Brain className="w-12 h-12 text-white drop-shadow-md" />
              </div>
              <CardTitle className="text-3xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
                Quiz Generator
              </CardTitle>
              <p className="text-slate-300 text-lg mt-4 leading-relaxed">
                Transform any topic into engaging quizzes with instant feedback.
              </p>
            </CardHeader>
            <CardContent className="relative px-8 pb-8">
              <div className="space-y-4 mb-8">
                {[
                  '10 thoughtful questions per quiz',
                  'Instant answer validation',
                  'Detailed explanations for learning',
                  'Progress tracking and scoring'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-slate-200 group-hover:translate-x-2 transition-transform duration-300" style={{transitionDelay: `${index * 50}ms`}}>
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/quiz" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-0 group-hover:animate-pulse text-lg">
                  <span className="flex items-center justify-center gap-3">
                    Start Learning
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group relative backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:transform hover:scale-[1.02] animate-in slide-in-from-right-4 duration-1000 delay-1200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <CardHeader className="relative text-center pb-6 pt-8">
              <div className="mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                <Calendar className="w-12 h-12 text-white drop-shadow-md" />
              </div>
              <CardTitle className="text-3xl font-bold text-white group-hover:text-green-200 transition-colors duration-300">
                Study Planner
              </CardTitle>
              <p className="text-slate-300 text-lg mt-4 leading-relaxed">
                Create personalized timetables that optimize your learning time across subjects
              </p>
            </CardHeader>
            <CardContent className="relative px-8 pb-8">
              <div className="space-y-4 mb-8">
                {[
                  'Custom subject planning',
                  'Flexible time slots',
                  'Weekly schedule generation',
                  'Visual timetable layout'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-slate-200 group-hover:translate-x-2 transition-transform duration-300" style={{transitionDelay: `${index * 50}ms`}}>
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-teal-400"></div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/planner" className="block">
                <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-0 group-hover:animate-pulse text-lg">
                  <span className="flex items-center justify-center gap-3">
                    Plan Your Studies
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center animate-in fade-in-0 duration-1000 delay-1400">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 group cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse group-hover:bg-green-300"></div>
            <p className="text-slate-200 font-medium text-lg">
              Created by <span className='animate-pulse text-secondary'> Hassan Shikaripur </span> • Built for learners everywhere
            </p>
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
