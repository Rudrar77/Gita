import React, { useState } from 'react';
import gitaData from '@/data/Bhagwad_Gita.json';
import { hindiChapterNames, englishChapterNames } from '@/data/chapterNames';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import { 
  Home, 
  Star, 
  Calendar, 
  HelpCircle, 
  Layers,
  Heart,
  Trash2,
  Search,
  Filter,
  BookOpen,
  Target
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

const Bookmarks = () => {
  const { bookmarks, removeBookmark, isBookmarked } = useBookmarks();
  const t = useTranslation();
  const [language] = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('all');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'होम', icon: Home, path: '/' },
    { label: 'दैनिक धर्म', icon: Calendar, path: '/daily-dharma' },
    { label: 'क्विज़', icon: HelpCircle, path: '/quiz' },
    { label: 'फ्लैशकार्ड्स', icon: Layers, path: '/flashcards' },
    { label: 'बुकमार्क', icon: Star, path: '/bookmarks' },
  ];

  // Filter bookmarked verses
  const filteredBookmarks = bookmarks
    .map(id => gitaData.find(v => v.ID === id))
    .filter(verse => {
      if (!verse) return false;
      
      // Search filter
      if (searchTerm && !verse.Shloka.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !(language === 'hindi' ? verse.HinMeaning : verse.EngMeaning).toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Chapter filter
      if (selectedChapter !== 'all' && verse.Chapter !== selectedChapter) {
        return false;
      }
      
      return true;
    });

  const handlePlayAudio = async (verseId: string, text: string, lang: string) => {
    if (isPlaying === verseId) {
      if (Capacitor.getPlatform() === 'web') {
        window.speechSynthesis?.cancel();
      } else {
        await TextToSpeech.stop();
      }
      setIsPlaying(null);
    } else {
      setIsPlaying(verseId);
      
      if (Capacitor.getPlatform() === 'web') {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utterance = new window.SpeechSynthesisUtterance(text);
          utterance.lang = lang;
          utterance.rate = 0.8;
          window.speechSynthesis.speak(utterance);
        }
      } else {
        await TextToSpeech.speak({
          text,
          lang,
          rate: 0.8,
          pitch: 1.0,
          volume: 1.0,
        });
      }
      
      setTimeout(() => setIsPlaying(null), 3000);
    }
  };

  const handleRemoveBookmark = (verseId: string) => {
    removeBookmark(verseId);
    // Add haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  const getChapterStats = () => {
    const stats: { [key: string]: number } = {};
    bookmarks.forEach(id => {
      const verse = gitaData.find(v => v.ID === id);
      if (verse) {
        stats[verse.Chapter] = (stats[verse.Chapter] || 0) + 1;
      }
    });
    return stats;
  };

  const chapterStats = getChapterStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 to-amber-25 flex flex-col mobile-content">
      <Header />
      
      <main className="flex-1 mobile-px mobile-py">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="mobile-text-2xl font-bold text-orange-900 mb-2">{t('bookmarksTitle')}</h2>
            <p className="text-orange-700">{t('yourFavorites')}</p>
          </div>

          {/* Stats */}
          <div className="mobile-card mobile-px mobile-py mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-600" />
                <span className="mobile-text-lg font-bold text-orange-900">
                  {language === 'hindi' ? 'कुल:' : t('total')}: {bookmarks.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-semibold">
                  {language === 'hindi' ? 'सहेजे गए' : t('bookmarked')}
                </span>
              </div>
            </div>

            {/* Chapter Distribution */}
            {Object.keys(chapterStats).length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-orange-600 font-medium">{t('chapterDistribution')}</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(chapterStats).map(([chapter, count]) => (
                    <span key={chapter} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                      {language === 'hindi' ? hindiChapterNames[chapter] : englishChapterNames[chapter]}: {count}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search and Filter */}
          <div className="mobile-card mobile-px mobile-py mb-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="flex items-center gap-2 bg-white rounded-lg border border-orange-100 px-3 py-2">
                <Search className="w-5 h-5 text-orange-400" strokeWidth={1.5} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="mobile-search flex-1 border-0 focus:outline-none bg-transparent text-base"
                />
              </div>

              {/* Chapter Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-orange-600" />
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="flex-1 p-2 border border-orange-200 rounded-lg bg-white text-sm"
                >
                  <option value="all">{t('allChapters')}</option>
                  {Object.keys(hindiChapterNames).map(chapter => (
                    <option key={chapter} value={chapter}>
                      {language === 'hindi' ? hindiChapterNames[chapter] : englishChapterNames[chapter]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bookmarks List */}
          {filteredBookmarks.length === 0 ? (
            <div className="mobile-card mobile-px mobile-py text-center">
              <Star className="w-12 h-12 mx-auto mb-4 text-orange-400" />
              <h3 className="mobile-text-lg font-bold text-orange-900 mb-2">{t('noBookmarks')}</h3>
              <p className="text-orange-600">
                {bookmarks.length === 0 
                  ? t('noBookmarksPrompt')
                  : t('noResultsPrompt')
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookmarks.map((verse) => (
                <div key={verse.ID} className="mobile-verse mobile-px mobile-py relative">
                  {/* Bookmark Remove Button */}
                  <button
                    onClick={() => handleRemoveBookmark(verse.ID)}
                    className="absolute top-4 right-4 icon-button text-red-500"
                    title={t('removeBookmark')}
                  >
                    <Trash2 className="icon" />
                  </button>

                  {/* Verse Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="text-orange-700 font-bold text-base">
                        {language === 'hindi' ? hindiChapterNames[verse.Chapter] : englishChapterNames[verse.Chapter]} {verse.Verse}
                      </span>
                    </div>
                    <button
                      onClick={() => handlePlayAudio(verse.ID, verse.Shloka, 'sa-IN')}
                      className="icon-button text-orange-500"
                    >
                      {isPlaying === verse.ID ? (
                        <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div className="w-4 h-4 flex items-center justify-center">
                          <div className="w-2 h-2 bg-orange-600 rounded-full" />
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Sanskrit Text */}
                  <div className="mobile-text-lg font-sanskrit text-gray-900 mb-4" style={{ whiteSpace: 'pre-line' }}>
                    {verse.Shloka}
                  </div>

                  {/* Verse Meaning */}
                  <div className="bg-yellow-50 rounded-lg p-4 text-gray-800 mobile-text-lg">
                    {language === 'hindi' ? verse.HinMeaning : verse.EngMeaning}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handlePlayAudio(verse.ID, language === 'hindi' ? verse.HinMeaning : verse.EngMeaning, language === 'hindi' ? 'hi-IN' : 'en-US')}
                      className="flex-1 touch-button bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium"
                    >
                      {t('listenMeaning')}
                    </button>
                    <button
                      onClick={() => navigate(`/?chapter=${verse.Chapter}&verse=${verse.Verse}`)}
                      className="flex-1 touch-button bg-orange-600 text-white rounded-lg text-sm font-medium"
                    >
                      {t('readFull')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {bookmarks.length > 0 && (
            <div className="mobile-card mobile-px mobile-py mt-6">
              <h3 className="mobile-text-lg font-bold text-orange-900 mb-4">{t('quickActions')}</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/flashcards')}
                  className="touch-button bg-orange-100 text-orange-700 rounded-lg p-3 flex flex-col items-center gap-2"
                >
                  <Layers className="w-5 h-5" />
                  <span className="text-sm font-medium">{t('flashcards')}</span>
                </button>
                <button
                  onClick={() => navigate('/quiz')}
                  className="touch-button bg-yellow-100 text-yellow-700 rounded-lg p-3 flex flex-col items-center gap-2"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{t('quiz')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Bookmarks; 