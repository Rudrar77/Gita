import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gitaData from '@/data/Bhagwad_Gita.json';
import { hindiChapterNames, englishChapterNames } from '@/data/chapterNames';
import { ChevronLeft, ChevronRight, Volume2, Star } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { useReadVerses } from '@/hooks/useReadVerses';
import { useBookmarks } from '@/hooks/useBookmarks';
// Import background image from data folder
import { getChapterImage, getImageByIndex } from '@/utils/imageUtils';
import { hapticFeedback, storage } from '@/utils/capacitorUtils';
import { devotionalTts } from '@/utils/devotionalTts';
import { userDataAPI } from '@/lib/api';
import { useAuth } from '@/hooks/AuthContext';

const ChapterDetail = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const [language] = useLanguage();
  const { readVerses, markAsRead, isRead } = useReadVerses();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const { isAuthenticated } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // Load last read index from API
  React.useEffect(() => {
    if (isAuthenticated && number != null) {
      userDataAPI.getAll().then(data => {
        const lastRead = data.lastReadVerseByChapter || {};
        if (lastRead[number] != null && !isNaN(lastRead[number])) {
          setCurrentIdx(lastRead[number]);
        }
      }).catch(err => console.error("Error loading last read index:", err));
    }
  }, [isAuthenticated, number]);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get all verses for this chapter
  const verses = gitaData.filter((v: any) => v.Chapter === number);
  const chapterTitle = language === 'hindi'
    ? (hindiChapterNames[number || ''] || `अध्याय ${number}`)
    : (englishChapterNames[number || ''] || `Chapter ${number}`);

  const currentVerse = verses[currentIdx];

  // Persist last read verse index on change
  React.useEffect(() => {
    if (isAuthenticated && number != null) {
      userDataAPI.getAll().then(data => {
        const lastRead = data.lastReadVerseByChapter || {};
        lastRead[number] = currentIdx;
        userDataAPI.updateLastRead(lastRead).catch(err => console.error("Error saving last read:", err));
      });
    }
  }, [number, currentIdx, isAuthenticated]);

  // Mark as read when verse is viewed
  React.useEffect(() => {
    if (currentVerse && !isRead(currentVerse.ID)) {
      markAsRead(currentVerse.ID);
    }
    // If this is the last verse, mark all verses in the chapter as read
    if (currentIdx === verses.length - 1) {
      verses.forEach((v: any) => {
        if (!isRead(v.ID)) markAsRead(v.ID);
      });
    }
    // eslint-disable-next-line
  }, [currentVerse?.ID]);

  // Devotional TTS function for verse meaning
  const speakVerse = async () => {
    if (!currentVerse) return;
    
    if (isPlaying) {
      // Stop current playback
      devotionalTts.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      
      if (Capacitor.getPlatform() === 'web') {
        // Use devotional TTS for web
        const meaningLang = language === 'hindi' ? 'hindi' : 'english';
        const text = language === 'hindi' ? currentVerse.HinMeaning : currentVerse.EngMeaning;
        
        await devotionalTts.speakMeaning(
          text,
          meaningLang,
          () => setIsPlaying(false)
        );
      } else {
        // Use native TTS for mobile
        const text = language === 'hindi' ? currentVerse.HinMeaning : currentVerse.EngMeaning;
        const lang = language === 'hindi' ? 'hi-IN' : 'en-US';
        
        await TextToSpeech.speak({
          text,
          lang,
          rate: 0.8,
          pitch: 1.0,
          volume: 1.0,
        });
        
        setTimeout(() => setIsPlaying(false), 3000);
      }
    }
  };

  const handlePrev = () => {
    hapticFeedback.light();
    setCurrentIdx((idx) => Math.max(0, idx - 1));
  };
  const handleNext = () => {
    hapticFeedback.light();
    setCurrentIdx((idx) => Math.min(verses.length - 1, idx + 1));
  };

  const handleBookmark = () => {
    if (!currentVerse) return;
    hapticFeedback.medium();
    if (isBookmarked(currentVerse.ID)) {
      removeBookmark(currentVerse.ID);
    } else {
      addBookmark(currentVerse.ID);
    }
  };



  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Page Background Image */}
      <div className="absolute inset-0 w-full h-full bg-orange-950">
        <img 
          src={getImageByIndex(currentIdx)} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 blur-xl scale-110"
        />
        <img 
          src={getImageByIndex(currentIdx)} 
          alt="Krishna background" 
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
      
      {/* Header with semi-transparent background */}
      <div className="relative z-20 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 text-center">
        <div>
          <h2 className="mobile-text-xl font-bold text-orange-900 drop-shadow-lg">{chapterTitle}</h2>
          <div className="text-orange-700 text-sm drop-shadow">{verses.length} श्लोक</div>
        </div>
      </div>
      
      <main className="relative z-10 flex-1 mobile-px mobile-py">
        {currentVerse && (
          <div className="mobile-card p-6 rounded-2xl shadow-lg flex flex-col gap-3 bg-white/90 backdrop-blur-sm border border-white/50 relative overflow-hidden">
            {/* Content */}
                          <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-orange-600 font-bold text-lg drop-shadow">{currentVerse.Chapter}.{currentVerse.Verse}</span>
                  {isRead(currentVerse.ID) && <span className="text-green-600 text-xs ml-2 font-semibold drop-shadow">✓ Read</span>}
                  
                <button
                  onClick={handleBookmark}
                  className={`icon-button bg-white/80 rounded-full p-2 shadow-md ${isBookmarked(currentVerse.ID) ? 'text-yellow-500' : 'text-orange-400'}`}
                  title={isBookmarked(currentVerse.ID) ? 'Remove Bookmark' : 'Bookmark this verse'}
                >
                  <Star className={`icon ${isBookmarked(currentVerse.ID) ? 'fill-yellow-400' : 'fill-none'}`} />
                </button>
                </div>
                <div className="font-sanskrit mobile-text-lg text-gray-900 mb-2 drop-shadow-lg font-bold" style={{ whiteSpace: 'pre-line' }}>
                  {currentVerse.Shloka}
                </div>
                <div className="text-orange-800 text-base mb-2 leading-relaxed drop-shadow" style={{ whiteSpace: 'pre-line' }}>
                  {language === 'hindi' ? currentVerse.HinMeaning : currentVerse.EngMeaning}
                </div>
              <div className="flex gap-3 mt-2 justify-center">
                <button
                  onClick={speakVerse}
                  className={`icon-button rounded-full p-3 shadow-md transition-all ${
                    isPlaying 
                      ? 'bg-orange-500 text-white animate-pulse' 
                      : 'bg-white/80 text-orange-500 hover:bg-orange-100'
                  }`}
                  title={isPlaying ? 'Stop listening' : 'Listen to verse meaning'}
                >
                  <Volume2 className="icon" />
                </button>
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="icon-button text-orange-500 bg-white/80 rounded-full p-3 shadow-md disabled:opacity-50"
                  title="Previous verse"
                >
                  <ChevronLeft className="icon" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIdx === verses.length - 1}
                  className="icon-button text-orange-500 bg-white/80 rounded-full p-3 shadow-md disabled:opacity-50"
                  title="Next verse"
                >
                  <ChevronRight className="icon" />
                </button>
              </div>
              <div className="mt-3 text-xs text-gray-500 text-center">
                Verse {currentIdx + 1} of {verses.length}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChapterDetail; 