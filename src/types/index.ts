export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  image?: string;
  category?: string;
  country?: string;
  language?: string;
  content?: string;
  isTrending?: boolean;
  trendScore?: number;
  viralTag?: string;
  region?: 'uzbekistan' | 'global';
  publicBuzzNote?: string;
}

export interface TimelineItem {
  time: string;
  event: string;
}

export interface SourceItem {
  name: string;
  url?: string;
}

export interface HistoricalQuote {
  text: string;
  author: string;
  sourceOrEra?: string;
}

export interface HistoricalParallel {
  eventName: string;
  yearOrEra: string;
  similarity: string;
  historicalLesson: string;
  quote: HistoricalQuote;
}

export interface AiSynthesisResponse {
  summary: string;
  keyPoints: string[];
  timeline: TimelineItem[];
  sources: SourceItem[];
  historicalParallel?: HistoricalParallel;
  confidenceNote?: string;
  isFallback?: boolean;
  viralHeadline?: string;
  publicSentiment?: string;
  trendScore?: number;
  isTrending?: boolean;
  region?: 'uzbekistan' | 'global' | 'both';
}

export interface AiArticleResponse {
  title: string;
  dek: string;
  paragraphs: string[];
  keyPoints: string[];
  sources: SourceItem[];
  historicalParallel?: HistoricalParallel;
  region?: string;
  publishedAt?: string;
  isFallback?: boolean;
}

export type SupportedLanguage =
  | 'uz'
  | 'en'
  | 'ru'
  | 'ko'
  | 'kk'
  | 'ky'
  | 'tg'
  | 'tk'
  | 'az'
  | 'tr'
  | 'ar'
  | 'fa';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface UserPreferences {
  language: SupportedLanguage;
  theme: ThemeMode;
  favoriteCategories: string[];
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  savedArticles: Article[];
  searchHistory: SearchHistoryItem[];
  preferences: UserPreferences;
  dailyQueriesUsed: number;
  lastQueryDate: string;
}

export interface SystemMetrics {
  totalSearches: number;
  aiRequests: number;
  failedRequests: number;
  cachedQueries: number;
  uptimeSeconds: number;
  primaryProvider: string;
  fallbackProvider: string;
  geminiConfigured: boolean;
  groqConfigured: boolean;
  openRouterConfigured: boolean;
  feedCount: number;
  lastIngestedAt: string;
}
