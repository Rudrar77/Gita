const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Get auth token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Set auth token
export const setToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Remove auth token
export const removeToken = (): void => {
  localStorage.removeItem('authToken');
};

// Base fetch with auth header
const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// ===== Auth API =====

export const authAPI = {
  register: (name: string, email: string, password: string) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => apiFetch('/auth/me'),
};

// ===== User Data API =====

export const userDataAPI = {
  // Get all user data
  getAll: () => apiFetch('/userdata'),

  // Update all user data
  updateAll: (data: Record<string, any>) =>
    apiFetch('/userdata', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Bookmarks
  addBookmark: (verseId: string) =>
    apiFetch('/userdata/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ verseId }),
    }),

  removeBookmark: (verseId: string) =>
    apiFetch(`/userdata/bookmarks/${verseId}`, {
      method: 'DELETE',
    }),

  // Notes
  setNote: (verseId: string, note: string) =>
    apiFetch('/userdata/notes', {
      method: 'PUT',
      body: JSON.stringify({ verseId, note }),
    }),

  // Read Verses
  markAsRead: (verseId: string) =>
    apiFetch('/userdata/readverses', {
      method: 'POST',
      body: JSON.stringify({ verseId }),
    }),

  // Chapter Progress
  updateChapterProgress: (chapterProgress: Record<string, any>) =>
    apiFetch('/userdata/chapter-progress', {
      method: 'PUT',
      body: JSON.stringify({ chapterProgress }),
    }),

  // Learning Sessions
  updateLearningSessions: (learningSessions: any[]) =>
    apiFetch('/userdata/learning-sessions', {
      method: 'PUT',
      body: JSON.stringify({ learningSessions }),
    }),

  // Settings
  updateSettings: (settings: { appLanguage?: string; dailyVerseNotificationEnabled?: boolean }) =>
    apiFetch('/userdata/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),

  // Flashcards Read
  updateFlashcardsRead: (flashcardsRead: string[]) =>
    apiFetch('/userdata/flashcards-read', {
      method: 'PUT',
      body: JSON.stringify({ flashcardsRead }),
    }),

  // Last Read Position
  updateLastRead: (lastReadVerseByChapter: Record<string, number>) =>
    apiFetch('/userdata/last-read', {
      method: 'PUT',
      body: JSON.stringify({ lastReadVerseByChapter }),
    }),
};
