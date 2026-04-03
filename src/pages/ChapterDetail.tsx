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

const LAST_READ_KEY = 'lastReadVerseByChapter';

const ChapterDetail = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const [language] = useLanguage();
  const { readVerses, markAsRead, isRead } = useReadVerses();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const [currentIdx, setCurrentIdx] = useState(() => {
    if (typeof window !== 'undefined' && number != null) {
      const lastRead = JSON.parse(localStorage.getItem(LAST_READ_KEY) || '{}');
      if (lastRead[number] != null && !isNaN(lastRead[number])) {
        return lastRead[number];
      }
    }
    return 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);

  // Get all verses for this chapter
  const verses = gitaData.filter((v: any) => v.Chapter === number);
  const chapterTitle = language === 'hindi'
    ? (hindiChapterNames[number || ''] || `अध्याय ${number}`)
    : (englishChapterNames[number || ''] || `Chapter ${number}`);

  const currentVerse = verses[currentIdx];

  // Persist last read verse index on change
  React.useEffect(() => {
    if (number != null) {
      const lastRead = JSON.parse(localStorage.getItem(LAST_READ_KEY) || '{}');
      lastRead[number] = currentIdx;
      localStorage.setItem(LAST_READ_KEY, JSON.stringify(lastRead));
    }
  }, [number, currentIdx]);

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

  // TTS function
  const speakVerse = async () => {
    if (!currentVerse) return;
    setIsPlaying(true);
    
    // Only speak the meaning (Hindi or English), not Sanskrit
    const text = language === 'hindi' ? currentVerse.HinMeaning : currentVerse.EngMeaning;
    const lang = language === 'hindi' ? 'hi-IN' : 'en-US';
    
    if (Capacitor.getPlatform() === 'web') {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      await TextToSpeech.speak({
        text,
        lang,
        rate: 0.9,
        pitch: 1.0,
        volume: 1.0,
      });
    }
    
    setTimeout(() => setIsPlaying(false), 3000);
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
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={getImageByIndex(currentIdx)} 
          alt="Krishna background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Header with semi-transparent background */}
      <div className="relative z-20 flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0">
        <button
          onClick={() => navigate(-1)}
          className="icon-button text-orange-500 bg-white/90 rounded-full p-2 shadow-md"
        >
          <ChevronLeft className="icon" />
        </button>
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
                  className="icon-button text-orange-500 bg-white/80 rounded-full p-3 shadow-md"
                  disabled={isPlaying}
                  title="Listen to this verse"
                >
                  <Volume2 className="icon" />
                </button>
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="icon-button text-orange-500 bg-white/80 rounded-full p-3 shadow-md"
                  title="Previous verse"
                >
                  <ChevronLeft className="icon" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIdx === verses.length - 1}
                  className="icon-button text-orange-500 bg-white/80 rounded-full p-3 shadow-md"
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