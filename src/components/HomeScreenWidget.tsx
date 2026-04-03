import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Volume2, Heart, BookOpen, Sun } from "lucide-react";
import gitaData from "@/data/Bhagwad_Gita.json";
import { hindiChapterNames } from "@/data/chapterNames";
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
// Import images from data folder
import { getRandomImage, getImageByIndex } from '@/utils/imageUtils';

interface HomeScreenWidgetProps {
  compact?: boolean;
  showAudio?: boolean;
  showMood?: boolean;
}

const HomeScreenWidget = ({ compact = false, showAudio = true, showMood = true }: HomeScreenWidgetProps) => {
  // Get today's verse (consistent for the day)
  const dailyVerse = useMemo(() => {
    const todayNum = new Date().getDate();
    const monthNum = new Date().getMonth();
    const yearNum = new Date().getFullYear();
    const seed = todayNum + monthNum * 31 + yearNum * 365;
    const idx = seed % gitaData.length;
    return gitaData[idx];
  }, []);

  // Text-to-Speech function
  const speakVerse = async () => {
    if (Capacitor.getPlatform() === 'web') {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new window.SpeechSynthesisUtterance(dailyVerse.HinMeaning);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      await TextToSpeech.speak({
        text: dailyVerse.HinMeaning,
        lang: 'hi-IN',
        rate: 0.8,
        pitch: 1.0,
        volume: 1.0,
      });
    }
  };

  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img src={getImageByIndex(0)} alt="Krishna" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold text-orange-900">आज का श्लोक</h3>
            <Badge variant="secondary" className="ml-auto text-xs">
              {hindiChapterNames[dailyVerse.Chapter]} {dailyVerse.Verse}
            </Badge>
          </div>
          
          <div className="bg-white/70 rounded-lg p-3 mb-3">
            <p className="text-sm font-sanskrit text-gray-800 leading-relaxed mb-2">
              {dailyVerse.Shloka}
            </p>
            <p className="text-xs text-gray-600 line-clamp-2">
              {dailyVerse.HinMeaning}
            </p>
          </div>

          {showAudio && (
            <Button
              size="sm"
              onClick={speakVerse}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs"
            >
              <Volume2 className="w-3 h-3 mr-1" />
              सुनें
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-lg">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg">
              <img src={getImageByIndex(1)} alt="Krishna" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-lg font-bold text-orange-900">दैनिक धर्म</h2>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            {hindiChapterNames[dailyVerse.Chapter]} {dailyVerse.Verse}
          </Badge>
        </div>

        {/* Verse Display */}
        <div className="bg-white/70 rounded-lg p-4 mb-4 border border-orange-200 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-5">
            <img src={getRandomImage()} alt="Krishna background" className="w-full h-full object-cover" />
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-3">
              <Badge variant="outline" className="mb-2">
                आज का श्लोक
              </Badge>
            </div>
            
            <div className="text-lg font-sanskrit text-gray-800 leading-relaxed mb-3 text-center">
              {dailyVerse.Shloka}
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-2">अर्थ:</h4>
              <p className="text-orange-800 text-sm leading-relaxed">
                {dailyVerse.HinMeaning}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {showAudio && (
            <Button
              onClick={speakVerse}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Volume2 className="w-4 h-4 mr-1" />
              सुनें
            </Button>
          )}
          
          {showMood && (
            <Button
              variant="outline"
              className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <Heart className="w-4 h-4 mr-1" />
              मूड ट्रैक
            </Button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t border-orange-200">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/50 rounded p-2">
              <BookOpen className="w-4 h-4 mx-auto mb-1 text-orange-600" />
              <span className="text-orange-700 font-medium">श्लोक</span>
            </div>
            <div className="bg-white/50 rounded p-2">
              <Heart className="w-4 h-4 mx-auto mb-1 text-pink-600" />
              <span className="text-pink-700 font-medium">मूड</span>
            </div>
            <div className="bg-white/50 rounded p-2">
              <Sun className="w-4 h-4 mx-auto mb-1 text-yellow-600" />
              <span className="text-yellow-700 font-medium">दैनिक</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeScreenWidget; 