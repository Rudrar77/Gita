import { useState, useEffect } from "react";
import { userDataAPI } from "@/lib/api";
import { useAuth } from "@/hooks/AuthContext";

type NotesMap = { [verseId: string]: string };

export function useNotes() {
  const [notes, setNotes] = useState<NotesMap>({});
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      userDataAPI.getAll().then(data => {
        if (data.notes) setNotes(data.notes);
      }).catch(err => console.error("Error loading notes:", err));
    }
  }, [isAuthenticated]);

  const setNote = async (verseId: string, note: string) => {
    if (!isAuthenticated) return;
    // Optimistic update
    setNotes((prev) => ({ ...prev, [verseId]: note }));
    try {
      await userDataAPI.setNote(verseId, note);
    } catch (err) {
      console.error("Error setting note:", err);
    }
  };

  const getNote = (verseId: string) => notes[verseId] || "";

  return { notes, setNote, getNote };
}