import React from "react";
import { CheckCircle, Play, Target, TrendingUp } from "lucide-react";
import gitaData from "@/data/Bhagwad_Gita.json";
import { hindiChapterNames, englishChapterNames } from "@/data/chapterNames";
import { useReadVerses } from "@/hooks/useReadVerses";
import { useNavigate } from "react-router-dom";
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/hooks/useLanguage';
import { getChapterImage } from '@/utils/imageUtils';
import { hapticFeedback } from '@/utils/capacitorUtils';

// Helper to extract unique chapters with title and summary from the JSON
// (moved inside component)

type ChapterInfo = {
  number: string;
  title: string;
  verseCount: number;
};

const ChapterGrid = () => {
  const { readVerses } = useReadVerses();
  const navigate = useNavigate();
  const t = useTranslation();
  const [language] = useLanguage();

  // Group verses by chapter and extract info (now language-aware)
  const chaptersMap: { [key: string]: ChapterInfo } = {};
  gitaData.forEach((verse: any) => {
    const chNum = verse.Chapter;
    if (!chaptersMap[chNum]) {
      chaptersMap[chNum] = {
        number: chNum,
        title: language === 'hindi' ? (hindiChapterNames[chNum] || `अध्याय ${chNum}`) : (englishChapterNames[chNum] || `Chapter ${chNum}`),
        verseCount: 0,
      };
    }
    chaptersMap[chNum].verseCount += 1;
  });
  const chapters = Object.values(chaptersMap).sort((a, b) => Number(a.number) - Number(b.number));

  // Map of chapter number to set of read verse numbers
  const readByChapter: { [chapter: string]: Set<string> } = {};
  readVerses.forEach((id) => {
    const verse = gitaData.find((v: any) => v.ID === id);
    if (verse) {
      if (!readByChapter[verse.Chapter]) readByChapter[verse.Chapter] = new Set();
      readByChapter[verse.Chapter].add(verse.Verse);
    }
  });

  return (
    <div className="space-y-6">
      {chapters.map((chapter, idx) => {
        const readCount = readByChapter[chapter.number]?.size || 0;
        const percent = Math.round((readCount / chapter.verseCount) * 100);
        const isComplete = readCount === chapter.verseCount;
        
        return (
          <div
            key={chapter.number}
            className="flex gap-4 items-start bg-white mobile-card p-4 rounded-xl shadow mb-2 cursor-pointer hover:bg-orange-50 transition"
            onClick={() => {
              hapticFeedback.light();
              navigate(`/chapter/${chapter.number}`);
            }}
          >
            {/* Chapter Image */}
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
              <img 
                src={getChapterImage(chapter.number)} 
                alt={chapter.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="font-bold text-orange-900 text-lg truncate">{chapter.title}</span>
                <div className="flex items-center gap-1 ml-auto">
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Target className="w-4 h-4 text-orange-500" />
                  )}
                  <span className="text-orange-700 text-sm font-semibold">
                    {readCount}/{chapter.verseCount} {t('readVerses')}
                  </span>
                </div>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="w-full h-3 bg-orange-100 rounded-full mt-2 overflow-hidden shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    isComplete 
                      ? 'bg-gradient-to-r from-green-400 to-green-500' 
                      : 'bg-gradient-to-r from-orange-400 to-orange-500'
                  }`} 
                  style={{width: `${percent}%`}}
                />
              </div>
              
              {/* Progress Details */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className="w-3 h-3 text-orange-600" />
                  <span className="text-orange-600 font-medium">{percent}% {t('percentComplete')}</span>
                  {isComplete && (
                    <span className="text-green-600 font-bold text-xs">✓ {language === 'hindi' ? 'पूर्ण' : 'Complete'}</span>
                  )}
                </div>
                
                {/* Progress Status */}
                <div className="text-xs text-gray-500">
                  {isComplete ? (
                    <span className="text-green-600 font-semibold">
                      {language === 'hindi' ? 'पूर्ण' : 'Complete'}
                    </span>
                  ) : readCount === 0 ? (
                    <span className="text-orange-600 font-semibold">
                      {language === 'hindi' ? 'शुरू करें' : 'Start'}
                    </span>
                  ) : (
                    <span className="text-orange-600 font-semibold">
                      {language === 'hindi' ? 'जारी रखें' : 'Continue'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChapterGrid;
