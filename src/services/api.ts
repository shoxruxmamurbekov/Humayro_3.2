import { AiArticleResponse, AiSynthesisResponse, Article, SupportedLanguage, SystemMetrics } from '../types';

export async function fetchLiveFeed(category?: string, lang: SupportedLanguage = 'uz'): Promise<Article[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (lang) params.append('lang', lang);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`/api/news/feed${queryString}`);
    if (!res.ok) throw new Error('Feed network error');
    const json = await res.json();
    return json.articles || [];
  } catch (err) {
    console.error('Failed to fetch live feed:', err);
    return [];
  }
}

export async function searchArticles(query: string, category?: string, lang: SupportedLanguage = 'uz'): Promise<Article[]> {
  try {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category && category !== 'all') params.append('category', category);
    if (lang) params.append('lang', lang);
    const res = await fetch(`/api/news/search?${params.toString()}`);
    if (!res.ok) throw new Error('Search network error');
    const json = await res.json();
    return json.articles || [];
  } catch (err) {
    console.error('Search failed:', err);
    return [];
  }
}

export async function synthesizeAiQuery(query: string, lang: SupportedLanguage): Promise<AiSynthesisResponse> {
  const res = await fetch('/api/ai/synthesize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, lang })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'AI synthesis service unavailable');
  }

  const json = await res.json();
  return json.data;
}

export async function generateAiArticle(
  topic: string,
  region: string | undefined,
  lang: SupportedLanguage
): Promise<AiArticleResponse> {
  const res = await fetch('/api/ai/article', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, region, lang })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to synthesize article');
  }

  const json = await res.json();
  return json.data;
}

export async function fetchSystemMetrics(token: string): Promise<SystemMetrics | null> {
  try {
    const res = await fetch('/api/admin/metrics', {
      headers: { 'x-admin-token': token }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.metrics;
  } catch {
    return null;
  }
}

export interface RegionLiveWeather {
  city: string;
  temperatureC: number | null;
  apparentC: number | null;
  humidity: number | null;
  windKmh: number | null;
  code: number | null;
  isDay: boolean;
  observedAt: string | null;
}

export interface RegionLiveResponse {
  regionKey: string;
  articles: Article[];
  weather: RegionLiveWeather[];
  fetchedAt: string;
}

export async function fetchRegionLive(regionKey: string, lang: SupportedLanguage = 'uz'): Promise<RegionLiveResponse> {
  const res = await fetch(`/api/region/${encodeURIComponent(regionKey)}/live?lang=${lang}`);
  if (!res.ok) throw new Error('Region live network error');
  return res.json();
}

export interface TrendingHotspotItem {
  id: string;
  query: string;
  title: string;
  category: string;
  trendScore: number;
  region: 'uzbekistan' | 'global';
  viralTag: string;
  publicBuzzNote: string;
  sourceCount: number;
}

export interface TrendingResponse {
  hotspots: {
    uzbekistan: TrendingHotspotItem[];
    global: TrendingHotspotItem[];
  };
  topViral: Article[];
  totalActiveArticles: number;
}

export async function fetchTrendingData(lang: SupportedLanguage = 'uz'): Promise<TrendingResponse | null> {
  try {
    const res = await fetch(`/api/news/trending?lang=${lang}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('Failed to fetch trending data:', err);
    return null;
  }
}
