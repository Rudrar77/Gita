import { useState, useEffect } from "react";
import { userDataAPI } from "@/lib/api";
import { useAuth } from "@/hooks/AuthContext";

export function useReadVerses() {
  const [readVerses, setReadVerses] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      userDataAPI.getAll().then(data => {
        if (data.readVerses) setReadVerses(data.readVerses);
      }).catch(err => console.error("Error loading read verses:", err));
    }
  }, [isAuthenticated]);

  const markAsRead = async (verseId: string) => {
    if (!isAuthenticated) return;
    // Optimistic update
    setReadVerses((prev) => {
      if (prev.includes(verseId)) return prev;
      return [...prev, verseId];
    });
    
    try {
      await userDataAPI.markAsRead(verseId);
    } catch (err) {
      console.error("Error marking verse as read:", err);
    }
  };

  const isRead = (verseId: string) => readVerses.includes(verseId);

  return { readVerses, markAsRead, isRead };
}