import { useState, useEffect } from "react";
import { userDataAPI } from "@/lib/api";
import { useAuth } from "@/hooks/AuthContext";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      userDataAPI.getAll().then(data => {
        if (data.bookmarks) setBookmarks(data.bookmarks);
      }).catch(err => console.error("Error loading bookmarks:", err));
    }
  }, [isAuthenticated]);

  const addBookmark = async (verseId: string) => {
    if (!isAuthenticated) return;
    // Optimistic update
    setBookmarks((prev) => (prev.includes(verseId) ? prev : [...prev, verseId]));
    try {
      await userDataAPI.addBookmark(verseId);
    } catch (err) {
      console.error("Error adding bookmark:", err);
    }
  };

  const removeBookmark = async (verseId: string) => {
    if (!isAuthenticated) return;
    // Optimistic update
    setBookmarks((prev) => prev.filter((id) => id !== verseId));
    try {
      await userDataAPI.removeBookmark(verseId);
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  };

  const isBookmarked = (verseId: string) => bookmarks.includes(verseId);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
}