import { useState, useEffect } from "react";

const BOOKMARKS_KEY = "bookmarkedVerses";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    if (stored) setBookmarks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (verseId: string) => {
    setBookmarks((prev) => (prev.includes(verseId) ? prev : [...prev, verseId]));
  };

  const removeBookmark = (verseId: string) => {
    setBookmarks((prev) => prev.filter((id) => id !== verseId));
  };

  const isBookmarked = (verseId: string) => bookmarks.includes(verseId);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
} 