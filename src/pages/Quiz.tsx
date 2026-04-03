import React, { useState } from 'react';
import gitaData from '@/data/Bhagwad_Gita.json';
import { hindiChapterNames, englishChapterNames } from '@/data/chapterNames';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/hooks/useTranslation';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Star, 
  Calendar, 
  HelpCircle, 
  Layers,
  CheckCircle,
  XCircle,
  RotateCcw,
  TrendingUp,
  Target,
  Award,
  Lightbulb
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Question types
const QUESTION_TYPES = {
  CHAPTER_FROM_MEANING: 'chapter_from_meaning',
  MEANING_FROM_SHLOKA: 'meaning_from_shloka',
  WORD_MEANING: 'word_meaning',
  VERSE_NUMBER: 'verse_number',
  CHARACTER_MENTIONED: 'character_mentioned'
};

// Utility to strip leading verse numbers and pipes (improved)
function stripVerseNumber(text) {
  return text.replace(/^(\|{1,2})?\s*\d+\.?\d*\s*(\|{1,2})?\s*/g, '').trim();
}

// Utility to aggressively strip any sequence of leading numbers, pipes, dots, Devanagari danda, and whitespace from the start of a string
function stripAllLeadingNumbersAndPipes(text) {
  // Remove any leading pipes, dots, spaces, Devanagari danda (।, ॥), and numbers
  return text.replace(/^([|।॥.\s]*\d+[|।॥.\s]*)+/g, '').trim();
}

// Create different types of questions
function createQuestions(language) {
  const questions = [];
  
  // Loosened filter: only require a non-empty meaning and shloka
  const goodVerses = gitaData.filter(verse => {
    if (language === 'hindi') {
      return verse.HinMeaning && verse.Shloka && /[\u0900-\u097F]/.test(verse.HinMeaning) && !/^\|{1,2}\d+\.\d+\|{1,2}/.test(verse.HinMeaning);
    } else {
      return verse.EngMeaning && verse.Shloka && /[a-zA-Z]/.test(verse.EngMeaning) && !/^\|{1,2}\d+\.\d+\|{1,2}/.test(verse.EngMeaning);
    }
  });
  // Debug: log included chapters
  const includedChapters = Array.from(new Set(goodVerses.map(v => v.Chapter)));
  console.log('Quiz included chapters:', includedChapters);

  // Question 1: Chapter from meaning
  goodVerses.forEach(verse => {
    if (language === 'hindi' && verse.HinMeaning && verse.Chapter) {
      questions.push({
        type: QUESTION_TYPES.CHAPTER_FROM_MEANING,
        question: `यह श्लोक किस अध्याय से है?\n\n"${stripAllLeadingNumbersAndPipes(verse.HinMeaning)}"`,
        correctAnswer: stripAllLeadingNumbersAndPipes(verse.HinMeaning),
        options: generateChapterOptions(verse.Chapter, language),
        verse: verse
      });
    } else if (language === 'english' && verse.EngMeaning && verse.Chapter) {
      questions.push({
        type: QUESTION_TYPES.CHAPTER_FROM_MEANING,
        question: `Which chapter is this verse from?\n\n"${stripAllLeadingNumbersAndPipes(verse.EngMeaning)}"`,
        correctAnswer: stripAllLeadingNumbersAndPipes(verse.EngMeaning),
        options: generateChapterOptions(verse.Chapter, language),
        verse: verse
      });
    }
  });

  // Question 2: Meaning from shloka
  goodVerses.forEach(verse => {
    if (language === 'hindi' && verse.Shloka && verse.HinMeaning) {
      const options = generateMeaningOptions(verse.HinMeaning, goodVerses, language);
      if (options.length >= 4) {
        questions.push({
          type: QUESTION_TYPES.MEANING_FROM_SHLOKA,
          question: `इस श्लोक का अर्थ क्या है?\n\n"${stripAllLeadingNumbersAndPipes(verse.Shloka)}"`,
          correctAnswer: stripAllLeadingNumbersAndPipes(verse.HinMeaning),
          options: options,
          verse: verse
        });
      }
    } else if (language === 'english' && verse.Shloka && verse.EngMeaning) {
      const options = generateMeaningOptions(verse.EngMeaning, goodVerses, language);
      if (options.length >= 4) {
        questions.push({
          type: QUESTION_TYPES.MEANING_FROM_SHLOKA,
          question: `What is the meaning of this verse?\n\n"${stripAllLeadingNumbersAndPipes(verse.Shloka)}"`,
          correctAnswer: stripAllLeadingNumbersAndPipes(verse.EngMeaning),
          options: options,
          verse: verse
        });
      }
    }
  });

  // Question 3: Word meaning (only Hindi/English part)
  goodVerses.forEach(verse => {
    if (verse.WordMeaning && verse.WordMeaning.includes('?')) {
      if (language === 'hindi') {
        // Only keep Hindi meanings
        const wordMeanings = verse.WordMeaning.split('?').filter(part => /[\u0900-\u097F]/.test(part) && part.trim().length > 10);
        if (wordMeanings.length >= 2) {
          const randomMeaning = wordMeanings[Math.floor(Math.random() * wordMeanings.length)];
          const word = randomMeaning.split(' ')[0];
          if (word && word.length > 2) {
            questions.push({
              type: QUESTION_TYPES.WORD_MEANING,
              question: `"${word}" शब्द का अर्थ क्या है?`,
              correctAnswer: randomMeaning.trim(),
              options: generateWordMeaningOptions(randomMeaning.trim(), wordMeanings, language),
              verse: verse
            });
          }
        }
      } else {
        // Only keep English meanings
        const wordMeanings = verse.WordMeaning.split('?').filter(part => /[a-zA-Z]/.test(part) && part.trim().length > 5);
        if (wordMeanings.length >= 2) {
          const randomMeaning = wordMeanings[Math.floor(Math.random() * wordMeanings.length)];
          const word = randomMeaning.split(' ')[0];
          if (word && word.length > 2) {
            questions.push({
              type: QUESTION_TYPES.WORD_MEANING,
              question: `What is the meaning of "${word}"?`,
              correctAnswer: randomMeaning.trim(),
              options: generateWordMeaningOptions(randomMeaning.trim(), wordMeanings, language),
              verse: verse
            });
          }
        }
      }
    }
  });

  return questions;
}

function generateChapterOptions(correctChapter, language) {
  const chapters = Object.keys(language === 'hindi' ? hindiChapterNames : englishChapterNames);
  const options = [correctChapter];
  while (options.length < 4) {
    const random = chapters[Math.floor(Math.random() * chapters.length)];
    if (!options.includes(random)) options.push(random);
  }
  return options.sort(() => Math.random() - 0.5);
}

// In generateMeaningOptions, use stripAllLeadingNumbersAndPipes for all options and correctMeaning
function generateMeaningOptions(correctMeaning, verses, language) {
  // If the correct meaning starts with a verse number pattern, do not use it
  if (/^\|{1,2}\d+\.\d+\|{1,2}/.test(correctMeaning)) {
    return [];
  }
  const options = [stripAllLeadingNumbersAndPipes(correctMeaning)];
  let otherMeanings;
  if (language === 'hindi') {
    otherMeanings = verses
      .filter(v => v.HinMeaning && v.HinMeaning !== correctMeaning && /[\u0900-\u097F]/.test(v.HinMeaning))
      .map(v => v.HinMeaning)
      .map(v => stripAllLeadingNumbersAndPipes(v))
      .filter(meaning => meaning.length > 20);
  } else {
    otherMeanings = verses
      .filter(v => v.EngMeaning && v.EngMeaning !== correctMeaning && /[a-zA-Z]/.test(v.EngMeaning))
      .map(v => v.EngMeaning)
      .map(v => stripAllLeadingNumbersAndPipes(v))
      .filter(meaning => meaning.length > 20);
  }
  while (options.length < 4 && otherMeanings.length > 0) {
    const random = otherMeanings[Math.floor(Math.random() * otherMeanings.length)];
    if (!options.includes(random)) {
      options.push(random);
      otherMeanings.splice(otherMeanings.indexOf(random), 1);
    }
  }
  // Fill remaining slots if needed
  while (options.length < 4) {
    options.push(language === 'hindi' ? "इस श्लोक का अर्थ अभी तक ज्ञात नहीं है" : "Meaning not available yet");
  }
  return options.sort(() => Math.random() - 0.5);
}

function generateWordMeaningOptions(correctMeaning, allMeanings, language) {
  const options = [correctMeaning];
  let otherMeanings;
  if (language === 'hindi') {
    otherMeanings = allMeanings.filter(m => m !== correctMeaning && m.length > 10 && /[\u0900-\u097F]/.test(m));
  } else {
    otherMeanings = allMeanings.filter(m => m !== correctMeaning && m.length > 5 && /[a-zA-Z]/.test(m));
  }
  while (options.length < 4 && otherMeanings.length > 0) {
    const random = otherMeanings[Math.floor(Math.random() * otherMeanings.length)];
    if (!options.includes(random)) {
      options.push(random);
      otherMeanings.splice(otherMeanings.indexOf(random), 1);
    }
  }
  // Fill remaining slots if needed
  while (options.length < 4) {
    options.push(language === 'hindi' ? "इस शब्द का अर्थ अभी तक ज्ञात नहीं है" : "Meaning not available yet");
  }
  return options.sort(() => Math.random() - 0.5);
}

function getRandomQuestion(language, prevId = null) {
  const allQuestions = createQuestions(language);
  let question;
  do {
    question = allQuestions[Math.floor(Math.random() * allQuestions.length)];
  } while (prevId && question.verse.ID === prevId);
  return question;
}

const Quiz = () => {
  const [language] = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(() => getRandomQuestion(language));
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const t = useTranslation();

  const navItems = [
    { label: 'होम', icon: Home, path: '/' },
    { label: 'दैनिक धर्म', icon: Calendar, path: '/daily-dharma' },
    { label: 'क्विज़', icon: HelpCircle, path: '/quiz' },
    { label: 'फ्लैशकार्ड्स', icon: Layers, path: '/flashcards' },
    { label: 'बुकमार्क', icon: Star, path: '/bookmarks' },
  ];

  const handleSelect = (answer) => {
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      setFeedback('सही उत्तर! 🎉');
    } else {
      setFeedback('गलत उत्तर। सही उत्तर देखें।');
    }
    
    setTotalAnswered(totalAnswered + 1);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setFeedback('');
    setShowExplanation(false);
    setCurrentQuestion(getRandomQuestion(language, currentQuestion.verse.ID));
  };

  const handleReset = () => {
    setScore(0);
    setTotalAnswered(0);
    setSelectedAnswer(null);
    setFeedback('');
    setShowExplanation(false);
    setIsCorrect(false);
    setCurrentQuestion(getRandomQuestion(language));
  };

  const getQuestionTypeText = (type) => {
    switch (type) {
      case QUESTION_TYPES.CHAPTER_FROM_MEANING:
        return 'अध्याय पहचानें';
      case QUESTION_TYPES.MEANING_FROM_SHLOKA:
        return 'अर्थ पहचानें';
      case QUESTION_TYPES.WORD_MEANING:
        return 'शब्दार्थ पहचानें';
      default:
        return 'प्रश्न';
    }
  };

  const getExplanation = () => {
    const verse = currentQuestion.verse;
    switch (currentQuestion.type) {
      case QUESTION_TYPES.CHAPTER_FROM_MEANING:
        return `यह श्लोक ${language === 'hindi' ? hindiChapterNames[verse.Chapter] : englishChapterNames[verse.Chapter]} (अध्याय ${verse.Chapter}) से है। श्लोक संख्या: ${verse.Verse}`;
      case QUESTION_TYPES.MEANING_FROM_SHLOKA:
        return `पूरा श्लोक: ${verse.Shloka}\n\nपूरा अर्थ: ${language === 'hindi' ? verse.HinMeaning : verse.EngMeaning}`;
      case QUESTION_TYPES.WORD_MEANING:
        return `श्लोक: ${verse.Shloka}\n\nशब्दार्थ: ${language === 'hindi' ? verse.WordMeaning.split('?').filter(part => /[\u0900-\u097F]/.test(part)).join(' ') : verse.WordMeaning.split('?').filter(part => /[a-zA-Z]/.test(part)).join(' ')} `;
      default:
        return '';
    }
  };

  const successRate = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 to-amber-25 flex flex-col mobile-content">
      <Header />
      
      <main className="flex-1 mobile-px mobile-py">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="mobile-text-2xl font-bold text-orange-900 mb-2">{t('quiz')}</h2>
            <p className="text-orange-700">{t('testYourKnowledge')}</p>
          </div>
          
          {/* Score Display */}
          <div className="mobile-card mobile-px mobile-py mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                <span className="mobile-text-lg font-bold text-orange-900">
                  {t('score')}: {score}/{totalAnswered}
                </span>
              </div>
              {totalAnswered > 0 && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-semibold">
                    {successRate}%
                  </span>
                </div>
              )}
            </div>
            
            {totalAnswered > 0 && (
              <div className="mobile-progress">
                <div 
                  className="mobile-progress-fill"
                  style={{ width: `${successRate}%` }}
                />
              </div>
            )}
          </div>

          {/* Question Card */}
          <div className="mobile-verse mobile-px mobile-py mb-6">
            {/* Question */}
            <div className="mobile-text-lg text-gray-900 mb-6 text-center leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
              {currentQuestion.question}
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => {
                // For chapter questions, display the chapter name
                let displayOption = option;
                if (currentQuestion.type === QUESTION_TYPES.CHAPTER_FROM_MEANING) {
                  displayOption = language === 'hindi' ? hindiChapterNames[option] || option : englishChapterNames[option] || option;
                }

                const isSelected = selectedAnswer === option;
                const isCorrectAnswer = option === currentQuestion.correctAnswer;
                const showResult = showExplanation && (isSelected || isCorrectAnswer);

                return (
                  <button
                    key={index}
                    onClick={() => !showExplanation && handleSelect(option)}
                    disabled={showExplanation}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      showExplanation
                        ? isCorrectAnswer
                          ? 'bg-green-50 border-green-300'
                          : isSelected && !isCorrectAnswer
                          ? 'bg-red-50 border-red-300'
                          : 'bg-gray-50 border-gray-200'
                        : isSelected
                        ? 'bg-orange-100 border-orange-300'
                        : 'bg-white border-orange-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                        showExplanation
                          ? isCorrectAnswer
                            ? 'bg-green-500 text-white'
                            : isSelected && !isCorrectAnswer
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        {showExplanation ? (
                          isCorrectAnswer ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : isSelected && !isCorrectAnswer ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-xs">{String.fromCharCode(65 + index)}</span>
                          )
                        ) : (
                          <span className="text-xs">{String.fromCharCode(65 + index)}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`mobile-text-lg ${
                          showExplanation
                            ? isCorrectAnswer
                              ? 'text-green-800'
                              : isSelected && !isCorrectAnswer
                              ? 'text-red-800'
                              : 'text-gray-600'
                            : 'text-gray-900'
                        }`}>
                          {displayOption}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`p-4 rounded-lg mb-4 ${
                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-semibold ${
                    isCorrect ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {feedback}
                  </span>
                </div>
              </div>
            )}

            {/* Explanation */}
            {showExplanation && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">{t('explanation')}</span>
                </div>
                <p className="text-sm text-blue-700 whitespace-pre-line">
                  {getExplanation()}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleNext}
                className="flex-1 touch-button bg-orange-600 text-white rounded-lg font-semibold"
              >
                {t('nextQuestion')}
              </button>
              <button
                onClick={handleReset}
                className="touch-button bg-gray-100 text-gray-700 rounded-lg p-3"
                title="Reset Quiz"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Achievement */}
          {successRate >= 80 && totalAnswered >= 5 && (
            <div className="mobile-achievement">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>{t('excellentPerformance')}</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Quiz; 