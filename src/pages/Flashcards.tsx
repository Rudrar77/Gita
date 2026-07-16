import React, { useState, useEffect } from 'react';
import gitaData from '@/data/Bhagwad_Gita.json';
import Header from '@/components/Header';
import { userDataAPI } from '@/lib/api';
import { useAuth } from '@/hooks/AuthContext';
import { 
  RefreshCw, 
  RotateCcw, 
  Home, 
  Star, 
  Calendar, 
  HelpCircle, 
  Layers,
  Play,
  Pause,
  Volume2,
  BookOpen,
  Target,
  TrendingUp
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/hooks/useTranslation';

function getRandomVerse(prevId = null) {
  let idx, verse;
  do {
    idx = Math.floor(Math.random() * gitaData.length);
    verse = gitaData[idx];
  } while (prevId && verse.ID === prevId);
  return verse;
}

const Flashcards = () => {
  const [verse, setVerse] = useState(() => getRandomVerse());
  const [flipped, setFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cardCount, setCardCount] = useState(0);
  const [readCardIds, setReadCardIds] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      userDataAPI.getAll().then(data => {
        if (data.flashcardsRead) setReadCardIds(data.flashcardsRead);
      }).catch(err => console.error("Error loading flashcards read:", err));
    }
  }, [isAuthenticated]);

  const navigate = useNavigate();
  const location = useLocation();
  const [language] = useLanguage();
  const t = useTranslation();

  const navItems = [
    { label: 'होम', icon: Home, path: '/' },
    { label: 'दैनिक धर्म', icon: Calendar, path: '/daily-dharma' },
    { label: 'क्विज़', icon: HelpCircle, path: '/quiz' },
    { label: 'फ्लैशकार्ड्स', icon: Layers, path: '/flashcards' },
    { label: 'बुकमार्क', icon: Star, path: '/bookmarks' },
  ];

  const handleFlip = () => {
    setFlipped(f => !f);
    // Add haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleNext = () => {
    setVerse((prev) => {
      const next = getRandomVerse(prev.ID);
      // Add to readCardIds if not already present
      setReadCardIds((prevIds) => {
        if (!prevIds.includes(next.ID)) {
          const updated = [...prevIds, next.ID];
          if (isAuthenticated) {
            userDataAPI.updateFlashcardsRead(updated)
              .catch(err => console.error("Error saving flashcards read:", err));
          }
          return updated;
        }
        return prevIds;
      });
      return next;
    });
    setFlipped(false);
    setCardCount(prev => prev + 1);
    // Add haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  const handlePlayAudio = async () => {
    if (isPlaying) {
      if (Capacitor.getPlatform() === 'web') {
        window.speechSynthesis?.cancel();
      } else {
        await TextToSpeech.stop();
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const text = flipped ? verse.HinMeaning : verse.Shloka;
      const lang = flipped ? 'hi-IN' : 'sa-IN';
      
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
      
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 to-amber-25 flex flex-col mobile-content">
      <Header />
      
      <main className="flex-1 mobile-px mobile-py">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="mobile-text-2xl font-bold text-orange-900 mb-2">{t('flashcards')}</h2>
            <p className="text-orange-700">{t('memorizeVerses')}</p>
          </div>

          {/* Stats */}
          <div className="mobile-card mobile-px mobile-py mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-600" />
                <span className="mobile-text-lg font-bold text-orange-900">
                  {t('card')}: {readCardIds.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-semibold">
                  {t('learning')}
                </span>
              </div>
            </div>
          </div>

          {/* Flashcard */}
          <div className="w-full flex flex-col items-center">
            <div className="relative w-full max-w-md h-64 mb-6 perspective">
              <div 
                className={`absolute w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                  flipped ? 'rotate-y-180' : ''
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front - Sanskrit */}
                <div className={`absolute w-full h-full mobile-verse mobile-px mobile-py flex flex-col items-center justify-center text-center backface-hidden ${
                  flipped ? 'invisible' : 'visible'
                }`}>
                  {/* Removed 'संस्कृत' label and play button */}
                  <div className="mobile-text-xl font-sanskrit text-gray-900 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                    {verse.Shloka}
                  </div>
                  <div className="mt-4 text-xs text-orange-600">
                    {verse.Chapter}.{verse.Verse}
                  </div>
                </div>

                {/* Back - Hindi Meaning */}
                <div className={`absolute w-full h-full mobile-verse mobile-px mobile-py flex flex-col items-center justify-center text-center backface-hidden rotate-y-180 ${
                  flipped ? 'visible' : 'invisible'
                }`}>
                  <div className="mobile-text-lg text-gray-800 leading-relaxed">
                    {language === 'hindi' ? verse.HinMeaning : verse.EngMeaning}
                  </div>
                  <div className="mt-4 text-xs text-orange-600">
                    {verse.Chapter}.{verse.Verse}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 w-full max-w-md">
              <button 
                className="flex-1 touch-button bg-orange-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                onClick={handleFlip}
              >
                <RotateCcw className="w-4 h-4" />
                {flipped ? t('seeVerse') : t('seeMeaning')}
              </button>
              <button 
                className="flex-1 touch-button bg-yellow-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                onClick={handleNext}
              >
                <RefreshCw className="w-4 h-4" />
                {t('next')}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Flashcards; 