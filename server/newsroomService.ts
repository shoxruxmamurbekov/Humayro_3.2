import { GoogleGenAI } from '@google/genai';
import { fetchRssFeed } from './newsService.ts';
import { CANDIDATE_MODELS } from './aiService.ts';
import { NEWSROOM_PERSONAS, NEWSROOM_RULES, LANGUAGE_NAMES, NewsroomPersona } from './newsroomPersonas.ts';
import type { Article, SupportedLanguage } from '../src/types/index.ts';

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

// Google News locale per country (hl = interface language, gl = region, ceid = gl:hl).
const LOCALES: Record<string, { hl: string; gl: string }> = {
  UZ: { hl: 'uz', gl: 'UZ' },
  KZ: { hl: 'ru', gl: 'KZ' },
  KG: { hl: 'ru', gl: 'KG' },
  TJ: { hl: 'ru', gl: 'TJ' },
  TM: { hl: 'ru', gl: 'TM' },
  AZ: { hl: 'az', gl: 'AZ' },
  TR: { hl: 'tr', gl: 'TR' },
  RU: { hl: 'ru', gl: 'RU' },
  KR: { hl: 'ko', gl: 'KR' },
  SA: { hl: 'ar', gl: 'SA' },
  IR: { hl: 'fa', gl: 'IR' },
  US: { hl: 'en', gl: 'US' },
  GB: { hl: 'en', gl: 'GB' }
};

const TOPIC_QUERY: Record<string, string> = {
  iqtisodiyot: 'economy',
  texnologiya: 'technology AI',
  energiya: 'energy',
  siyosat: 'politics',
  fan: 'science'
};

const SUPPORTED_LANGS = Object.keys(LANGUAGE_NAMES) as SupportedLanguage[];
const CACHE_TTL_MS = 20 * 60 * 1000;
const CACHE_MAX_ENTRIES = 50;
const cache = new Map<string, { at: number; result: NewsroomResult }>();

export function normalizeCountry(value: string | undefined): string {
  const code = (value || 'UZ').toUpperCase();
  return LOCALES[code] ? code : 'US';
}

export function normalizeLang(value: string | undefined): SupportedLanguage {
  return SUPPORTED_LANGS.includes(value as SupportedLanguage) ? (value as SupportedLanguage) : 'uz';
}

export function normalizeTopics(values: string[]): string[] {
  return Array.from(new Set(values.filter(v => v in TOPIC_QUERY))).sort();
}

export function buildCacheKey(country: string, lang: SupportedLanguage, topics: string[]): string {
  return `${country}|${lang}|${topics.join(',')}`;
}

export function getCachedNewsroom(key: string): NewsroomResult | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return { ...hit.result, cached: true };
}

function storeCache(key: string, result: NewsroomResult): void {
  if (cache.size >= CACHE_MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, { at: Date.now(), result });
}

function buildFeedUrls(country: string, topics: string[]) {
  const loc = LOCALES[country];
  const terms = topics.length ? topics.map(t => TOPIC_QUERY[t]).join(' OR ') : 'world news';
  const q = encodeURIComponent(terms);
  return [
    {
      url: `https://news.google.com/rss/search?q=${q}&hl=${loc.hl}&gl=${loc.gl}&ceid=${loc.gl}:${loc.hl}`,
      source: `Google News (${country})`
    },
    {
      url: `https://news.google.com/rss?hl=${loc.hl}&gl=${loc.gl}&ceid=${loc.gl}:${loc.hl}`,
      source: `Google News top (${country})`
    }
  ];
}

async function collectArticles(country: string, topics: string[]): Promise<Article[]> {
  const feeds = buildFeedUrls(country, topics);
  const results = await Promise.allSettled(
    feeds.map(f => fetchRssFeed(f.url, f.source, 'newsroom'))
  );

  const seen = new Set<string>();
  const articles: Article[] = [];
  for (const r of results) {
    if (r.status !== 'fulfilled') continue;
    for (const a of r.value) {
      // Keep the key Unicode-safe so Cyrillic and Arabic titles are not collapsed to empty strings.
      const key = a.title.trim().toLowerCase().slice(0, 60);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      articles.push(a);
    }
  }

  articles.sort((a, b) => (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0));
  return articles.slice(0, 15);
}

function buildPrompt(
  personas: NewsroomPersona[],
  articles: Article[],
  lang: SupportedLanguage,
  topics: string[]
): string {
  const articleList = articles
    .map((a, i) => `[${i + 1}] ${a.title} | ${a.source} | ${a.publishedAt} | ${a.url}\n${(a.description || '').slice(0, 300)}`)
    .join('\n');
  const personaList = personas
    .map(p => `- id="${p.id}" ism="${p.name}" (${p.role}): ${p.temperament} Uslub: ${p.style}`)
    .join('\n');

  return `${NEWSROOM_RULES}

Javob tili: ${LANGUAGE_NAMES[lang] || 'English'}.
Mavzular: ${topics.length ? topics.join(', ') : 'umumiy dunyo yangiliklari'}.

Yangiliklar ro'yxati:
${articleList}

Muxbirlar:
${personaList}

Har bir muxbir uchun bitta post yozing. Faqat quyidagi JSON formatida javob bering:
{"posts":[{"agentId":"...","headline":"...","facts":["..."],"sourceUrls":["..."],"analysis":"...","confidence":"high|medium|low"}]}
sourceUrls faqat yuqoridagi ro'yxatdagi URL'lardan bo'lsin.`;
}

function parseJsonLoose(raw: string): any {
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return {};
    try {
      return JSON.parse(match[0]);
    } catch {
      return {};
    }
  }
}

function parsePosts(raw: string, articles: Article[]): NewsroomPost[] {
  const data = parseJsonLoose(raw);
  const allowedUrls = new Set(articles.map(a => a.url));
  const personaById = new Map(NEWSROOM_PERSONAS.map(p => [p.id, p]));
  const now = new Date().toISOString();
  const posts: NewsroomPost[] = [];

  const items: any[] = Array.isArray(data?.posts) ? data.posts : [];
  for (const item of items) {
    const persona = personaById.get(item?.agentId);
    if (!persona) continue;

    const facts: string[] = Array.isArray(item.facts)
      ? item.facts.map((f: unknown) => String(f).trim()).filter(Boolean).slice(0, 5)
      : [];
    const sourceUrls: string[] = Array.isArray(item.sourceUrls)
      ? item.sourceUrls.map((u: unknown) => String(u)).filter((u: string) => allowedUrls.has(u)).slice(0, 5)
      : [];

    // A post without facts or verifiable source links is dropped.
    if (facts.length === 0 || sourceUrls.length === 0) continue;

    const confidence = ['high', 'medium', 'low'].includes(item.confidence) ? item.confidence : 'low';
    posts.push({
      id: `${persona.id}-${Date.now()}-${posts.length}`,
      agentId: persona.id,
      agentName: persona.name,
      headline: String(item.headline || facts[0]).slice(0, 200),
      facts,
      sourceUrls,
      analysis: String(item.analysis || '').slice(0, 1200),
      confidence,
      createdAt: now
    });
  }
  return posts;
}

export async function generateNewsroom(
  country: string,
  lang: SupportedLanguage,
  topics: string[]
): Promise<NewsroomResult> {
  const key = buildCacheKey(country, lang, topics);
  const articles = await collectArticles(country, topics);

  let posts: NewsroomPost[] = [];
  if (articles.length > 0) {
    // GEMINI_API_KEY is read from the environment by the SDK; it is never stored in code.
    const ai = new GoogleGenAI({});
    const prompt = buildPrompt(NEWSROOM_PERSONAS, articles, lang, topics);

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        posts = parsePosts(response.text || '', articles);
        if (posts.length > 0) break;
      } catch {
        // Try the next model in the fallback list.
      }
    }
  }

  const result: NewsroomResult = {
    country,
    lang,
    topics,
    posts,
    articleCount: articles.length,
    generatedAt: new Date().toISOString(),
    cached: false
  };
  storeCache(key, result);
  return result;
}
