import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Target, 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Star,
  Bookmark,
  Lightbulb,
  Calendar,
  Clock,
  Trophy,
  Award
} from "lucide-react";
import gitaData from "@/data/Bhagwad_Gita.json";
import { hindiChapterNames } from "@/data/chapterNames";
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

interface ChapterProgress {
  chapter: string;
  totalVerses: number;
  readVerses: number;
  completed: boolean;
  lastReadDate?: string;
  timeSpent: number; // in minutes
}

interface LearningSession {
  chapter: string;
  startTime: Date;
  endTime?: Date;
  versesRead: string[];
}

const LearnMode = () => {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [chapterProgress, setChapterProgress] = useState<{ [key: string]: ChapterProgress }>({});
  const [learningSessions, setLearningSessions] = useState<LearningSession[]>([]);
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'sanskrit' | 'hindi' | 'english'>('hindi');
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(1.0);

  // Initialize chapter progress
  useEffect(() => {
    const savedProgress = localStorage.getItem('chapterProgress');
    const savedSessions = localStorage.getItem('learningSessions');
    
    if (savedProgress) {
      setChapterProgress(JSON.parse(savedProgress));
    } else {
      // Initialize progress for all chapters
      const initialProgress: { [key: string]: ChapterProgress } = {};
      gitaData.forEach(verse => {
        if (!initialProgress[verse.Chapter]) {
          initialProgress[verse.Chapter] = {
            chapter: verse.Chapter,
            totalVerses: 0,
            readVerses: 0,
            completed: false,
            timeSpent: 0
          };
        }
        initialProgress[verse.Chapter].totalVerses++;
      });
      setChapterProgress(initialProgress);
    }

    if (savedSessions) {
      setLearningSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('chapterProgress', JSON.stringify(chapterProgress));
  }, [chapterProgress]);

  useEffect(() => {
    localStorage.setItem('learningSessions', JSON.stringify(learningSessions));
  }, [learningSessions]);

  // Get verses for selected chapter
  const chapterVerses = selectedChapter 
    ? gitaData.filter(verse => verse.Chapter === selectedChapter)
    : [];

  // Start learning session
  const startLearningSession = (chapter: string) => {
    const session: LearningSession = {
      chapter,
      startTime: new Date(),
      versesRead: []
    };
    setCurrentSession(session);
    setSelectedChapter(chapter);
    setCurrentVerseIndex(0);
  };

  // End learning session
  const endLearningSession = () => {
    if (currentSession) {
      const endTime = new Date();
      const updatedSession = { ...currentSession, endTime };
      setLearningSessions(prev => [...prev, updatedSession]);
      setCurrentSession(null);
    }
  };

  // Mark verse as read
  const markVerseAsRead = (verseId: string) => {
    if (selectedChapter) {
      setChapterProgress(prev => {
        const chapter = prev[selectedChapter];
        if (!chapter.readVerses.includes(verseId)) {
          const updatedChapter = {
            ...chapter,
            readVerses: [...chapter.readVerses, verseId],
            lastReadDate: new Date().toISOString(),
            completed: chapter.readVerses.length + 1 >= chapter.totalVerses
          };
          return { ...prev, [selectedChapter]: updatedChapter };
        }
        return prev;
      });
    }
  };

  // Text-to-Speech function
  const speakText = async (text: string, lang: string) => {
    if (Capacitor.getPlatform() === 'web') {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'sanskrit' ? 'sa-IN' : lang === 'hindi' ? 'hi-IN' : 'en-US';
        utterance.rate = readingSpeed;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      await TextToSpeech.speak({
        text,
        lang: lang === 'sanskrit' ? 'sa-IN' : lang === 'hindi' ? 'hi-IN' : 'en-US',
        rate: readingSpeed,
        pitch: 1.0,
        volume: 1.0,
      });
    }
  };

  // Navigation functions
  const nextVerse = () => {
    if (currentVerseIndex < chapterVerses.length - 1) {
      markVerseAsRead(chapterVerses[currentVerseIndex].ID);
      setCurrentVerseIndex(prev => prev + 1);
    }
  };

  const previousVerse = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(prev => prev - 1);
    }
  };

  // Get verse text based on selected language
  const getVerseText = (verse: any) => {
    switch (selectedLanguage) {
      case 'sanskrit':
        return verse.Shloka;
      case 'hindi':
        return verse.HinMeaning;
      case 'english':
        return verse.EngMeaning;
      default:
        return verse.HinMeaning;
    }
  };

  // Calculate overall progress
  const overallProgress = Object.values(chapterProgress).reduce((acc, chapter) => {
    return acc + (chapter.readVerses / chapter.totalVerses);
  }, 0) / Object.keys(chapterProgress).length * 100;

  // Get total learning time
  const totalLearningTime = learningSessions.reduce((acc, session) => {
    if (session.endTime) {
      return acc + (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60);
    }
    return acc;
  }, 0);

  // Get current chapter progress
  const currentChapterProgress = selectedChapter ? chapterProgress[selectedChapter] : null;

  return (
    <div className="space-y-6">
      {/* Header with Overall Progress */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <BookOpen className="w-5 h-5" />
            सीखने का मोड
            <Badge variant="secondary" className="ml-auto">
              {Math.round(overallProgress)}% पूर्ण
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={overallProgress} className="h-3" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>कुल समय: {Math.round(totalLearningTime)} मिनट</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span>पूर्ण अध्याय: {Object.values(chapterProgress).filter(c => c.completed).length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chapter Selection */}
      {!selectedChapter && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(hindiChapterNames).map(chapterNum => {
            const progress = chapterProgress[chapterNum];
            const completionPercentage = progress ? (progress.readVerses / progress.totalVerses) * 100 : 0;
            
            return (
              <Card 
                key={chapterNum} 
                className={`cursor-pointer transition-all hover:scale-105 ${
                  progress?.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white/80 border-gray-200'
                }`}
                onClick={() => startLearningSession(chapterNum)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      {hindiChapterNames[chapterNum]}
                    </h3>
                    {progress?.completed && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  
                  <Progress value={completionPercentage} className="mb-3" />
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{progress?.readVerses || 0}/{progress?.totalVerses || 0} श्लोक</span>
                    <span>{Math.round(completionPercentage)}%</span>
                  </div>

                  {progress?.lastReadDate && (
                    <div className="mt-2 text-xs text-gray-500">
                      अंतिम पढ़ाई: {new Date(progress.lastReadDate).toLocaleDateString('hi-IN')}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Chapter Learning Interface */}
      {selectedChapter && currentChapterProgress && (
        <div className="space-y-6">
          {/* Chapter Header */}
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <BookOpen className="w-5 h-5" />
                  {hindiChapterNames[selectedChapter]}
                  <Badge variant="secondary">
                    {currentChapterProgress.readVerses}/{currentChapterProgress.totalVerses}
                  </Badge>
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => {
                    endLearningSession();
                    setSelectedChapter(null);
                    setCurrentVerseIndex(0);
                  }}
                >
                  ← वापस जाएं
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Progress 
                value={(currentChapterProgress.readVerses / currentChapterProgress.totalVerses) * 100} 
                className="h-3" 
              />
            </CardContent>
          </Card>

          {/* Verse Display */}
          {chapterVerses.length > 0 && (
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
              <CardContent className="p-6">
                {/* Language Controls */}
                <div className="flex justify-center gap-2 mb-4">
                  {(['sanskrit', 'hindi', 'english'] as const).map((lang) => (
                    <Button
                      key={lang}
                      variant={selectedLanguage === lang ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedLanguage(lang)}
                    >
                      {lang === 'sanskrit' ? 'संस्कृत' : lang === 'hindi' ? 'हिंदी' : 'English'}
                    </Button>
                  ))}
                </div>

                {/* Verse Content */}
                <div className="bg-white/70 rounded-lg p-6 border border-yellow-200">
                  <div className="text-center mb-4">
                    <Badge variant="secondary" className="mb-2">
                      श्लोक {chapterVerses[currentVerseIndex].Verse}
                    </Badge>
                  </div>

                  {/* Main Verse Text */}
                  <div className="text-xl font-sanskrit text-gray-800 leading-relaxed mb-4 text-center">
                    {getVerseText(chapterVerses[currentVerseIndex])}
                  </div>

                  {/* Transliteration Toggle */}
                  <div className="flex justify-center mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTransliteration(!showTransliteration)}
                    >
                      {showTransliteration ? 'अर्थ छिपाएं' : 'अर्थ दिखाएं'}
                    </Button>
                  </div>

                  {/* Transliteration */}
                  {showTransliteration && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                      <h4 className="font-semibold text-blue-900 mb-2">अर्थ:</h4>
                      <p className="text-blue-800">
                        {chapterVerses[currentVerseIndex].HinMeaning}
                      </p>
                    </div>
                  )}

                  {/* Audio Controls */}
                  <div className="flex justify-center gap-2 mb-4">
                    <Button
                      onClick={() => speakText(getVerseText(chapterVerses[currentVerseIndex]), selectedLanguage)}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Volume2 className="w-4 h-4 mr-1" />
                      सुनें
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setAutoPlay(!autoPlay)}
                    >
                      {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  </div>

                  {/* Reading Speed Control */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-sm text-gray-600">पढ़ने की गति:</span>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={readingSpeed}
                      onChange={(e) => setReadingSpeed(parseFloat(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-600">{readingSpeed}x</span>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                  <Button
                    onClick={previousVerse}
                    disabled={currentVerseIndex === 0}
                    variant="outline"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    पिछला
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {currentVerseIndex + 1} / {chapterVerses.length}
                    </span>
                  </div>

                  <Button
                    onClick={nextVerse}
                    disabled={currentVerseIndex === chapterVerses.length - 1}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    अगला
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Learning Tips */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <Lightbulb className="w-5 h-5" />
                सीखने के टिप्स
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-green-800">
                <p>• धीरे-धीरे पढ़ें और अर्थ को समझने की कोशिश करें</p>
                <p>• श्लोक को बार-बार सुनें और उच्चारण सीखें</p>
                <p>• अपने जीवन में इन शिक्षाओं को कैसे लागू कर सकते हैं, इस पर विचार करें</p>
                <p>• नियमित रूप से पढ़ने की आदत बनाएं</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LearnMode; 