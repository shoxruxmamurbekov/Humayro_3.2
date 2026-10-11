import type { SupportedLanguage } from '../types';

export interface NewsroomAgent {
  id: string;
  name: string;
  role: string;
  style: string;
  accent: 'sky' | 'orange' | 'violet' | 'emerald';
  initials: string;
}

export interface NewsroomPost {
  id: string;
  agentId: string;
  agentName: string;
  headline: string;
  facts: string[];
  sourceUrls: string[];
  analysis: string;
  confidence: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface NewsroomResult {
  country: string;
  lang: SupportedLanguage;
  topics: string[];
  posts: NewsroomPost[];
  articleCount: number;
  generatedAt: string;
  cached: boolean;
}

export type NewsroomResponse = { ok: true; data: NewsroomResult } | { ok: false; error: string };

export async function fetchNewsroomAgents(): Promise<NewsroomAgent[]> {
  try {
    const res = await fetch('/api/newsroom/agents');
    if (!res.ok) throw new Error('Agents request failed');
    const json = await res.json();
    return json.agents || [];
  } catch (err) {
    console.error('Failed to load newsroom agents:', err);
    return [];
  }
}

export async function fetchNewsroom(
  country: string,
  lang: SupportedLanguage,
  topics: string[]
): Promise<NewsroomResponse> {
  try {
    const params = new URLSearchParams({ country, lang });
    if (topics.length) params.set('topics', topics.join(','));
    const res = await fetch(`/api/newsroom?${params.toString()}`);
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) {
      return { ok: false, error: json.error || 'Muxbirlar xonasi hozircha ishlamayapti.' };
    }
    return { ok: true, data: json.data as NewsroomResult };
  } catch (err) {
    console.error('Failed to load newsroom:', err);
    return { ok: false, error: 'Tarmoq xatosi. Keyinroq urinib ko‘ring.' };
  }
}
