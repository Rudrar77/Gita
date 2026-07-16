import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import ChapterGrid from "@/components/ChapterGrid";
import StatsCard from "@/components/StatsCard";
import gitaData from "@/data/Bhagwad_Gita.json";
import { 
  BookOpen, 
  Star, 
  Calendar, 
  User, 
  Home, 
  Book, 
  Settings, 
  HelpCircle, 
  Layers,
  Search,
  Volume2,
  Share2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Heart,
  Bookmark,
  Target,
  TrendingUp
} from "lucide-react";
import { hindiChapterNames, englishChapterNames } from "@/data/chapterNames";
import { useReadVerses } from "@/hooks/useReadVerses";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { useNavigate, useLocation } from 'react-router-dom';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HomeScreenWidget from "@/components/HomeScreenWidget";
import html2canvas from 'html2canvas';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/hooks/useLanguage';


import { userDataAPI } from '@/lib/api';
import { useAuth } from '@/hooks/AuthContext';

const scheduleDailyVerse = async () => {
  const idx = Math.floor(Math.random() * gitaData.length);
  const verse = gitaData[idx];
  const now = new Date();
  const next7am = new Date(now);
  next7am.setHours(7, 0, 0, 0);
  if (now > next7am) next7am.setDate(next7am.getDate() + 1);
  await LocalNotifications.schedule({
    notifications: [
      {
        id: 1,
        title: 'आज का श्लोक',
        body: verse.Shloka + '\n' + verse.HinMeaning,
        schedule: { at: next7am, repeats: true, every: 'day' },
        sound: null,
      },
    ],
  });
};

const cancelDailyVerse = async () => {
  await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
};

const Index = () => {
  const t = useTranslation();
  const [language] = useLanguage();
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [currentVerseIdx, setCurrentVerseIdx] = useState(0);
  const { readVerses, markAsRead, isRead } = useReadVerses();
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useAuth();
  const [notifEnabled, setNotifEnabled] = React.useState(false);
  
  React.useEffect(() => {
    if (isAuthenticated) {
      userDataAPI.getAll().then(data => {
        if (data.dailyVerseNotificationEnabled !== undefined) {
          setNotifEnabled(data.dailyVerseNotificationEnabled);
        }
      }).catch(err => console.error("Error loading notification settings:", err));
    }
  }, [isAuthenticated]);
  const [isSharing, setIsSharing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);


  // Get all verses for the selected chapter
  const verses = selectedChapter
    ? gitaData.filter((v: any) => v.Chapter === selectedChapter)
    : [];

  // Calculate chapter progress for ChapterGrid
  const chapterProgress: { [chapter: string]: { read: number; total: number } } = {};
  gitaData.forEach((v: any) => {
    if (!chapterProgress[v.Chapter]) chapterProgress[v.Chapter] = { read: 0, total: 0 };
    chapterProgress[v.Chapter].total += 1;
    if (readVerses.includes(v.ID)) chapterProgress[v.Chapter].read += 1;
  });

  // Overall progress
  const totalRead = readVerses.length;
  const totalVerses = gitaData.length;

  // Handler for Next button
  const handleNext = () => {
    if (verses.length > 0 && currentVerseIdx < verses.length - 1) {
      markAsRead(verses[currentVerseIdx].ID);
      setCurrentVerseIdx((idx) => Math.min(verses.length - 1, idx + 1));
    }
  };

  // Handler for Previous button (no marking as read)
  const handlePrev = () => {
    setCurrentVerseIdx((idx) => Math.max(0, idx - 1));
  };

  // Show achievement if chapter is completed
  useEffect(() => {
    if (selectedChapter && chapterProgress[selectedChapter]) {
      const { read, total } = chapterProgress[selectedChapter];
      if (read === total && total > 0) {
        setShowAchievement(`🎉 ${hindiChapterNames[selectedChapter]} पूरा हुआ!`);
        const timeout = setTimeout(() => setShowAchievement(null), 4000);
        return () => clearTimeout(timeout);
      }
    }
  }, [selectedChapter, chapterProgress, hindiChapterNames]);

  // Mark last verse as read when viewed
  useEffect(() => {
    if (
      selectedChapter &&
      verses.length > 0 &&
      currentVerseIdx === verses.length - 1
    ) {
      markAsRead(verses[currentVerseIdx].ID);
    }
  }, [selectedChapter, currentVerseIdx, verses, markAsRead]);

  // Web/native TTS function
  const speakHindi = async (text, lang = 'hindi') => {
    if (Capacitor.getPlatform() === 'web') {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'english' ? 'en-US' : 'hi-IN';
        window.speechSynthesis.speak(utterance);
      }
    } else {
      await TextToSpeech.speak({
        text,
        lang: lang === 'english' ? 'en-US' : 'hi-IN',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient',
      });
    }
  };


  React.useEffect(() => {
    if (notifEnabled) {
      LocalNotifications.requestPermissions();
      scheduleDailyVerse();
    } else {
      cancelDailyVerse();
    }
    if (isAuthenticated) {
      userDataAPI.updateSettings({ dailyVerseNotificationEnabled: notifEnabled })
        .catch(err => console.error("Error saving notification settings:", err));
    }
  }, [notifEnabled, isAuthenticated]);

  const navItems = [
    { label: 'होम', icon: Home, path: '/' },
    { label: 'दैनिक धर्म', icon: Calendar, path: '/daily-dharma' },
    { label: 'क्विज़', icon: HelpCircle, path: '/quiz' },
    { label: 'फ्लैशकार्ड्स', icon: Layers, path: '/flashcards' },
    { label: 'बुकमार्क', icon: Star, path: '/bookmarks' },
  ];

  const handleShare = async () => {
    if (verses.length > 0) {
      const verse = verses[currentVerseIdx];
      const shareText = `${hindiChapterNames[verse.Chapter]} ${verse.Verse}\n\n${verse.Shloka}\n\n${verse.HinMeaning}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'श्रीमद्भगवद्गीता',
          text: shareText,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(shareText);
        // Show toast or alert
      }
    }
  };

  const handlePlayPause = async () => {
    if (verses.length > 0) {
      const verse = verses[currentVerseIdx];
      if (isPlaying) {
        if (Capacitor.getPlatform() === 'web') {
          window.speechSynthesis?.cancel();
        } else {
          await TextToSpeech.stop();
        }
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
        await speakHindi(verse.Shloka, 'sanskrit');
        setTimeout(() => setIsPlaying(false), 3000);
      }
    }
  };

  const currentVerse = verses.length > 0 ? verses[currentVerseIdx] : null;

  // Get verse meaning based on selected language
  const getVerseMeaning = (verse) => {
    return language === 'hindi' ? verse.HinMeaning : verse.EngMeaning;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 to-amber-25 flex flex-col mobile-content">
      <Header />
      
      {/* Mobile Status Bar */}
      {/* Removed mobile status bar here */}

        <div className="flex-1 mobile-px">
          {/* Overall Progress */}
          {/* Removed progress card here */}

          {/* Achievement Message */}
          {showAchievement && (
            <div className="mobile-achievement mb-4">
              {showAchievement}
            </div>
          )}

          {/* Chapters Section or Verses Section */}
          {selectedChapter ? (
            <div className="space-y-4">
              {/* Chapter Header */}
              <div className="mobile-card mobile-px mobile-py">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-center">
                    <h2 className="mobile-text-xl font-bold text-orange-900">
                      {(language === 'hindi' ? hindiChapterNames[selectedChapter] : englishChapterNames[selectedChapter])}
                    </h2>
                    <p className="text-sm text-orange-600">
                      श्लोक {currentVerseIdx + 1} / {verses.length}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mobile-progress mb-4">
                  <div 
                    className="mobile-progress-fill"
                    style={{ width: `${((currentVerseIdx + 1) / verses.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Verse */}
              {currentVerse && (
                <div className="mobile-verse mobile-px mobile-py" ref={cardRef}>
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-orange-100 text-orange-700">
                      {(language === 'hindi' ? hindiChapterNames[currentVerse.Chapter] : englishChapterNames[currentVerse.Chapter])} {currentVerse.Verse}
                    </Badge>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePlayPause}
                        className="touch-button bg-orange-100 text-orange-700 rounded-full p-2"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={handleShare}
                        className="touch-button bg-orange-100 text-orange-700 rounded-full p-2"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => isBookmarked(currentVerse.ID) ? removeBookmark(currentVerse.ID) : addBookmark(currentVerse.ID)}
                        className={`touch-button rounded-full p-2 ${isBookmarked(currentVerse.ID) ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700'}`}
                      >
                        {isBookmarked(currentVerse.ID) ? <Heart className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="mobile-text-xl font-sanskrit text-gray-900 mb-4" style={{ whiteSpace: 'pre-line' }}>
                    {currentVerse.Shloka}
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 text-gray-800 mobile-text-lg">
                    {getVerseMeaning(currentVerse)}
                  </div>

                  {/* Verse Navigation */}
                  <div className="mobile-verse-nav mt-4">
                    <button
                      onClick={handlePrev}
                      disabled={currentVerseIdx === 0}
                      className="flex-1 touch-button bg-orange-100 text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      पिछला
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentVerseIdx === verses.length - 1}
                      className="flex-1 touch-button bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                    >
                      अगला
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Chapters Grid */
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="mobile-text-2xl font-bold text-orange-900 mb-2">
                  {t('chooseChapter')}
                </h2>
                <p className="text-orange-700">
                  {t('readChapterBasedOnInterest')}
                </p>
              </div>
              
              {/* ChapterGrid props type definition is missing or incorrect */}
              {/* @ts-ignore */}
              <ChapterGrid />
            </div>
          )}
        </div>
    </div>
  );
};

export default Index;
