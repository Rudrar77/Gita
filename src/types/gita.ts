
export interface Verse {
  ID: string;
  Chapter: string;
  Verse: string;
  Shloka: string;
  Transliteration: string;
  HinMeaning: string;
  EngMeaning: string;
  WordMeaning: string;
}

export interface Chapter {
  number: number;
  title: string;
  titleSanskrit: string;
  summary: string;
  verseCount: number;
}

export interface UserProgress {
  chaptersCompleted: number[];
  versesRead: string[];
  bookmarkedVerses: string[];
  dailyStreak: number;
  lastReadDate: string;
  totalReadingTime: number;
}

export interface StudyNote {
  verseId: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}
