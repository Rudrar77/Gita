
import Header from "@/components/Header";
import DailyVerse from "@/components/DailyVerse";
import ChapterGrid from "@/components/ChapterGrid";
import StatsCard from "@/components/StatsCard";
import { BookOpen, Star, Calendar, User } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 to-amber-25">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Your Spiritual Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the timeless wisdom of the Bhagavad Gita through interactive learning and daily practice
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Chapters Read"
            value="0/18"
            icon={<BookOpen className="w-5 h-5 text-white" />}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatsCard
            title="Daily Streak"
            value="0"
            icon={<Calendar className="w-5 h-5 text-white" />}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatsCard
            title="Bookmarked"
            value="0"
            icon={<Star className="w-5 h-5 text-white" />}
            color="bg-gradient-to-br from-yellow-500 to-orange-500"
          />
          <StatsCard
            title="Reading Time"
            value="0 min"
            icon={<User className="w-5 h-5 text-white" />}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        {/* Daily Verse */}
        <DailyVerse />

        {/* Chapters Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Chapters</h2>
            <p className="text-gray-600">Begin your journey through the 18 chapters</p>
          </div>
          <ChapterGrid />
        </div>

        {/* Inspirational Quote */}
        <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-8 text-center">
          <blockquote className="text-2xl font-serif text-gray-800 mb-4">
            "You have the right to perform your actions, but you are not entitled to the fruits of action."
          </blockquote>
          <cite className="text-orange-700 font-medium">— Bhagavad Gita, Chapter 2, Verse 47</cite>
        </div>
      </main>
    </div>
  );
};

export default Index;
