import { useState, useEffect } from "react";

const STORAGE_KEY = "readVerses";

export function useReadVerses() {
  const [readVerses, setReadVerses] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readVerses));
  }, [readVerses]);

  const markAsRead = (verseId: string) => {
    setReadVerses((prev) => (prev.includes(verseId) ? prev : [...prev, verseId]));
  };

  const isRead = (verseId: string) => readVerses.includes(verseId);

  return { readVerses, markAsRead, isRead };
} 