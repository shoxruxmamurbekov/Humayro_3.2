import { Article, SearchHistoryItem, SupportedLanguage, ThemeMode, UserProfile } from '../types';

const STORAGE_KEY = 'humayro31_user_profile';
const GUEST_QUOTA_KEY = 'humayro31_guest_quota';

const DEFAULT_PROFILE: UserProfile = {
  id: 'guest',
  email: '',
  name: 'Guest Reader',
  createdAt: new Date().toISOString(),
  savedArticles: [],
  searchHistory: [],
  preferences: {
    language: 'uz',
    theme: 'dark',
    favoriteCategories: ['Technology', 'World', 'AI']
  },
  dailyQueriesUsed: 0,
  lastQueryDate: new Date().toISOString().slice(0, 10)
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notify() {
  listeners.forEach(l => l());
}

export function subscribeUserStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getUserProfile(): UserProfile {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_PROFILE;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_PROFILE;

    const today = new Date().toISOString().slice(0, 10);
    const safeProfile: UserProfile = {
      ...DEFAULT_PROFILE,
      ...parsed,
      preferences: {
        ...DEFAULT_PROFILE.preferences,
        ...(parsed.preferences || {})
      },
      savedArticles: Array.isArray(parsed.savedArticles) ? parsed.savedArticles : [],
      searchHistory: Array.isArray(parsed.searchHistory) ? parsed.searchHistory : []
    };

    if (safeProfile.lastQueryDate !== today) {
      safeProfile.dailyQueriesUsed = 0;
      safeProfile.lastQueryDate = today;
      saveUserProfile(safeProfile);
    }
    return safeProfile;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    notify();
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

export function recordAiQuery(): { allowed: boolean; remaining: number } {
  const profile = getUserProfile();
  const today = new Date().toISOString().slice(0, 10);
  const maxQueries = profile.email ? 200 : 50;

  if (profile.lastQueryDate !== today) {
    profile.dailyQueriesUsed = 0;
    profile.lastQueryDate = today;
  }

  if (profile.dailyQueriesUsed >= maxQueries) {
    return { allowed: false, remaining: 0 };
  }

  profile.dailyQueriesUsed += 1;
  saveUserProfile(profile);
  return { allowed: true, remaining: maxQueries - profile.dailyQueriesUsed };
}

export function addSearchHistory(query: string): void {
  if (!query.trim()) return;
  const profile = getUserProfile();
  const item: SearchHistoryItem = {
    id: `sh-${Date.now()}`,
    query: query.trim(),
    timestamp: new Date().toISOString()
  };
  const filtered = profile.searchHistory.filter(h => h.query.toLowerCase() !== query.trim().toLowerCase());
  profile.searchHistory = [item, ...filtered].slice(0, 30);
  saveUserProfile(profile);
}

export function clearSearchHistory(): void {
  const profile = getUserProfile();
  profile.searchHistory = [];
  saveUserProfile(profile);
}

export function toggleBookmark(article: Article): boolean {
  const profile = getUserProfile();
  const index = profile.savedArticles.findIndex(a => a.id === article.id || (a.title && a.title === article.title));
  let isBookmarked = false;

  if (index !== -1) {
    profile.savedArticles.splice(index, 1);
    isBookmarked = false;
  } else {
    profile.savedArticles.unshift(article);
    isBookmarked = true;
  }

  saveUserProfile(profile);
  return isBookmarked;
}

export function isArticleBookmarked(articleId: string, title?: string): boolean {
  const profile = getUserProfile();
  return profile.savedArticles.some(a => a.id === articleId || (title && a.title === title));
}

export function loginUser(email: string, name: string): UserProfile {
  const profile = getUserProfile();
  profile.id = `usr-${Date.now()}`;
  profile.email = email;
  profile.name = name || email.split('@')[0];
  saveUserProfile(profile);
  return profile;
}

export function logoutUser(): void {
  const current = getUserProfile();
  const resetProfile: UserProfile = {
    ...DEFAULT_PROFILE,
    preferences: current.preferences
  };
  saveUserProfile(resetProfile);
}

export function updateLanguagePref(lang: SupportedLanguage): void {
  const profile = getUserProfile();
  profile.preferences.language = lang;
  saveUserProfile(profile);
}

export function updateThemePref(theme: ThemeMode): void {
  const profile = getUserProfile();
  profile.preferences.theme = theme;
  saveUserProfile(profile);
}

export function isSupabaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}
