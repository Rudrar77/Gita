import React, { useState, useEffect } from 'react';
import { userDataAPI } from '@/lib/api';
import { useAuth } from '@/hooks/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Trophy, 
  Award,
  BookOpen,
  Heart,
  Star,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Flame,
  Bookmark,
  Lightbulb
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  totalVersesRead: number;
  totalChaptersCompleted: number;
  totalLearningTime: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  moodHistory: Array<{
    date: string;
    mood: string;
  }>;
  journalEntries: Array<{
    date: string;
    verseId: string;
    reflection: string;
  }>;
  chapterProgress: { [key: string]: number };
  weeklyChallenges: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
}

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalVersesRead: 0,
    totalChaptersCompleted: 0,
    totalLearningTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    moodHistory: [],
    journalEntries: [],
    chapterProgress: {},
    weeklyChallenges: []
  });

  const { isAuthenticated } = useAuth();

  // Load data from API
  useEffect(() => {
    const loadAnalyticsData = async () => {
      if (!isAuthenticated) return;
      try {
        const userData = await userDataAPI.getAll();

        // Load read verses
        const readVerses = userData.readVerses || [];
        
        // Load mood history
        const moodHistory = userData.moodHistory || [];
        
        // Load journal entries
        const journalEntries = userData.journalHistory || [];
        
        // Load chapter progress
        const chapterProgress = userData.chapterProgress || {};
        
        // Load weekly challenges
        const weeklyChallenges = userData.weeklyChallenges || [];
        
        // Load learning sessions
        const learningSessions = userData.learningSessions || [];

        // Calculate total learning time
        const totalLearningTime = learningSessions.reduce((acc: number, session: any) => {
          if (session.endTime) {
            return acc + (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60);
          }
          return acc;
        }, 0);

        // Calculate completed chapters
        const completedChapters = Object.values(chapterProgress).filter((chapter: any) => chapter.completed).length;

        // Simplified streak calculation based on learning sessions
        const dates = learningSessions
          .map((session: any) => new Date(session.startTime).toISOString().split('T')[0])
          .filter((value: any, index: any, self: any) => self.indexOf(value) === index)
          .sort();

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 1;

        if (dates.length > 0) {
          for (let i = 0; i < dates.length - 1; i++) {
            const currentDate = new Date(dates[i]);
            const nextDate = new Date(dates[i + 1]);
            const diffDays = (nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
            
            if (diffDays <= 1) {
              tempStreak++;
            } else {
              longestStreak = Math.max(longestStreak, tempStreak);
              tempStreak = 1;
            }
          }
          longestStreak = Math.max(longestStreak, tempStreak);
          
          // Check if current streak is still active (today or yesterday)
          const today = new Date();
          today.setHours(0,0,0,0);
          const lastDate = new Date(dates[dates.length - 1]);
          const diffDays = (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
          
          if (diffDays <= 1) {
            currentStreak = tempStreak;
          }
        }

        setAnalyticsData({
          totalVersesRead: readVerses.length,
          totalChaptersCompleted: completedChapters,
          totalLearningTime: Math.round(totalLearningTime),
          currentStreak,
          longestStreak,
          moodHistory,
          journalEntries,
          chapterProgress,
          weeklyChallenges
        });
      } catch (err) {
        console.error("Failed to load analytics data", err);
      }
    };

    loadAnalyticsData();
  }, [isAuthenticated]);

  // Prepare mood data for chart
  const moodData = analyticsData.moodHistory.reduce((acc: any, entry) => {
    const mood = entry.mood;
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});

  const moodChartData = Object.entries(moodData).map(([mood, count]) => ({
    name: mood,
    value: count
  }));

  // Prepare chapter progress data
  const chapterProgressData = Object.entries(analyticsData.chapterProgress).map(([chapter, progress]: [string, any]) => ({
    chapter: `Chapter ${chapter}`,
    progress: progress.readVerses / progress.totalVerses * 100
  }));

  // Calculate achievements
  const achievements = [
    {
      id: 'first_verse',
      title: 'पहला श्लोक',
      description: 'पहला श्लोक पढ़ा',
      icon: BookOpen,
      achieved: analyticsData.totalVersesRead >= 1,
      color: 'text-blue-600'
    },
    {
      id: 'first_chapter',
      title: 'पहला अध्याय',
      description: 'एक अध्याय पूरा किया',
      icon: Trophy,
      achieved: analyticsData.totalChaptersCompleted >= 1,
      color: 'text-green-600'
    },
    {
      id: 'streak_7',
      title: 'सात दिन का सिलसिला',
      description: '7 दिन लगातार पढ़ा',
      icon: Flame,
      achieved: analyticsData.currentStreak >= 7,
      color: 'text-orange-600'
    },
    {
      id: 'mood_tracker',
      title: 'मूड ट्रैकर',
      description: 'मूड ट्रैक करना शुरू किया',
      icon: Heart,
      achieved: analyticsData.moodHistory.length >= 1,
      color: 'text-pink-600'
    },
    {
      id: 'journal_writer',
      title: 'पत्रिका लेखक',
      description: 'पहली पत्रिका प्रविष्टि लिखी',
      icon: Bookmark,
      achieved: analyticsData.journalEntries.length >= 1,
      color: 'text-purple-600'
    },
    {
      id: 'challenge_master',
      title: 'चुनौती मास्टर',
      description: 'सभी साप्ताहिक चुनौतियां पूरी कीं',
      icon: Target,
      achieved: analyticsData.weeklyChallenges.filter(c => c.completed).length >= 7,
      color: 'text-indigo-600'
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600 font-medium">कुल श्लोक पढ़े</p>
                <p className="text-2xl font-bold text-blue-900">{analyticsData.totalVersesRead}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-green-600 font-medium">पूर्ण अध्याय</p>
                <p className="text-2xl font-bold text-green-900">{analyticsData.totalChaptersCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-orange-600 font-medium">कुल समय</p>
                <p className="text-2xl font-bold text-orange-900">{analyticsData.totalLearningTime} मिनट</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-purple-600 font-medium">वर्तमान सिलसिला</p>
                <p className="text-2xl font-bold text-purple-900">{analyticsData.currentStreak} दिन</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-900">
              <Heart className="w-5 h-5" />
              मूड वितरण
            </CardTitle>
          </CardHeader>
          <CardContent>
            {moodChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={moodChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {moodChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Heart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>अभी तक कोई मूड डेटा नहीं है</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chapter Progress */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <BarChart3 className="w-5 h-5" />
              अध्याय प्रगति
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chapterProgressData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chapterProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="chapter" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="progress" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>अभी तक कोई प्रगति डेटा नहीं है</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-900">
            <Award className="w-5 h-5" />
            उपलब्धियां
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    achievement.achieved
                      ? 'bg-white/80 border-green-300 shadow-md'
                      : 'bg-gray-100/50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${achievement.achieved ? achievement.color : 'text-gray-400'}`} />
                    <div>
                      <h4 className={`font-semibold ${
                        achievement.achieved ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm ${
                        achievement.achieved ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.achieved && (
                      <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Activity className="w-5 h-5" />
            हाल की गतिविधियां
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.journalEntries.slice(0, 5).map((entry, index) => (
              <div key={index} className="bg-white/70 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-600 font-medium">
                    {new Date(entry.date).toLocaleDateString('hi-IN')}
                  </span>
                  <Badge variant="secondary">पत्रिका</Badge>
                </div>
                <p className="text-gray-800 text-sm line-clamp-2">
                  {entry.reflection}
                </p>
              </div>
            ))}
            
            {analyticsData.journalEntries.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Bookmark className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>अभी तक कोई पत्रिका प्रविष्टि नहीं है</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Challenges Progress */}
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <Target className="w-5 h-5" />
            साप्ताहिक चुनौतियां प्रगति
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData.weeklyChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  challenge.completed
                    ? 'bg-green-100 border-green-300'
                    : 'bg-white/70 border-gray-200'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  challenge.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300'
                }`}>
                  {challenge.completed && <span className="text-xs">✓</span>}
                </div>
                <span className={`flex-1 ${
                  challenge.completed ? 'text-green-800 line-through' : 'text-gray-800'
                }`}>
                  {challenge.title}
                </span>
              </div>
            ))}
            
            {analyticsData.weeklyChallenges.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Target className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>अभी तक कोई चुनौती नहीं है</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics; 