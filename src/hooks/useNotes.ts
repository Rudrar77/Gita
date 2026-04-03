import { useState, useEffect } from "react";

const NOTES_KEY = "verseNotes";

type NotesMap = { [verseId: string]: string };

export function useNotes() {
  const [notes, setNotes] = useState<NotesMap>({});

  useEffect(() => {
    const stored = localStorage.getItem(NOTES_KEY);
    if (stored) setNotes(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  const setNote = (verseId: string, note: string) => {
    setNotes((prev) => ({ ...prev, [verseId]: note }));
  };

  const getNote = (verseId: string) => notes[verseId] || "";

  return { notes, setNote, getNote };
} 