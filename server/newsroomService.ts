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
  return Object.prototype.hasOwnProperty.call(LOCALES, code) ? code : 'US';
}

export function normalizeLang(value: string | undefined): SupportedLanguage {
  return SUPPORTED_LANGS.includes(value as SupportedLanguage) ? (value as SupportedLanguage) : 'uz';
}

export function normalizeTopics(values: string[]): string[] {
  return Array.from(new Set(values.filter(v => Object.prototype.hasOwnProperty.call(TOPIC_QUERY, v)))).sort();
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

// Gives every agent its own article so posts do not repeat the same story.
// Tezkor and Kreativ take the freshest unused items, Sekin takes the one with the most
// context (longest description), Mintaqa takes the next fresh item.
export function assignArticles(articles: Article[], personas: NewsroomPersona[]): Map<string, Article> {
  const assignment = new Map<string, Article>();
  const used = new Set<string>();

  const pick = (persona: NewsroomPersona, score: (article: Article, index: number) => number) => {
    let best: Article | undefined;
    let bestScore = -Infinity;
    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      if (used.has(article.url)) continue;
      const s = score(article, index);
      if (s > bestScore) {
        bestScore = s;
        best = article;
      }
    }
    if (best) {
      assignment.set(persona.id, best);
      used.add(best.url);
    }
  };

  for (const persona of personas) {
    if (persona.id === 'sekin-tahlilchi') {
      pick(persona, a => (a.description || '').length);
    } else {
      pick(persona, (_a, index) => -index);
    }
  }
  return assignment;
}

function buildPrompt(assignment: Map<string, Article>, lang: SupportedLanguage, topics: string[]): string {
  const blocks = NEWSROOM_PERSONAS.filter(p => assignment.has(p.id)).map(p => {
    const a = assignment.get(p.id)!;
    return `- agentId="${p.id}" ism="${p.name}" (${p.role}): ${p.temperament} Uslub: ${p.style}
  Berilgan maqola: ${a.title} | ${a.source} | ${a.publishedAt} | ${a.url}
  Tavsif: ${(a.description || '').slice(0, 300)}`;
  });

  return `${NEWSROOM_RULES}

Javob tili: ${LANGUAGE_NAMES[lang] || 'English'}.
Mavzular: ${topics.length ? topics.join(', ') : 'umumiy dunyo yangiliklari'}.

Har bir muxbir faqat o'ziga berilgan maqola asosida yozadi. Boshqa muxbirlarning maqolalaridan foydalanmang.

Muxbirlar va ularning maqolalari:
${blocks.join('\n')}

Har bir muxbir uchun bitta post yozing. Faqat quyidagi JSON formatida javob bering:
{"posts":[{"agentId":"...","headline":"...","facts":["..."],"analysis":"...","confidence":"high|medium|low"}]}`;
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

// A fact may only contain numbers that appear in the assigned article's text.
// Invented figures are the most common AI error in news summaries, so they are rejected here.
export function isNumberGrounded(fact: string, article: Article): boolean {
  const numbers = fact.match(/\d+(?:[.,]\d+)?/g) || [];
  if (numbers.length === 0) return true;
  const sourceText = `${article.title} ${article.description || ''}`;
  return numbers.every(n => sourceText.includes(n));
}

// Rule 3 of NEWSROOM_RULES: the analysis is commentary and must say so.
// The model does not always follow this, so a missing opinion marker is added here.
const OPINION_MARKER = /^(menimcha|tahlilimga ko'ra|tahlilimizga ko'ra|по моему мнению|по моему|на мой взгляд|in my view|in my opinion|bence|görüşüme göre|من وجهة نظري|به نظر من|제 생각에는)/i;
const OPINION_PREFIX: Record<string, string> = {
  uz: 'Menimcha, ',
  ru: 'По моему мнению, ',
  en: 'In my view, ',
  tr: 'Bence, ',
  ar: 'من وجهة نظري، ',
  fa: 'به نظر من، ',
  ko: '제 생각에는 '
};

export function ensureOpinionMarker(analysis: string, lang: string): string {
  const text = analysis.trim();
  if (!text) return '';
  // Normalize Uzbek apostrophe variants (ʻ ʼ ’ ‘ `) before matching.
  const normalized = text.replace(/[ʻʼ’‘`]/g, "'");
  if (OPINION_MARKER.test(normalized)) return text;
  return (OPINION_PREFIX[lang] ?? OPINION_PREFIX.en) + text;
}

export function parsePosts(raw: string, assignment: Map<string, Article>, lang: string = 'uz'): NewsroomPost[] {
  const data = parseJsonLoose(raw);
  const personaById = new Map(NEWSROOM_PERSONAS.map(p => [p.id, p]));
  const now = new Date().toISOString();
  const posts: NewsroomPost[] = [];

  const items: any[] = Array.isArray(data?.posts) ? data.posts : [];
  for (const item of items) {
    const persona = personaById.get(item?.agentId);
    const article = persona ? assignment.get(persona.id) : undefined;
    if (!persona || !article) continue;

    const facts: string[] = Array.isArray(item.facts)
      ? item.facts
          .map((f: unknown) => String(f).trim())
          .filter(Boolean)
          .filter((f: string) => isNumberGrounded(f, article))
          .slice(0, 5)
      : [];

    // A post without grounded facts is dropped. Its source is always the assigned article,
    // never a URL the model wrote itself.
    if (facts.length === 0) continue;

    const confidence = ['high', 'medium', 'low'].includes(item.confidence) ? item.confidence : 'low';
    posts.push({
      id: `${persona.id}-${Date.now()}-${posts.length}`,
      agentId: persona.id,
      agentName: persona.name,
      headline: String(item.headline || facts[0]).slice(0, 200),
      facts,
      sourceUrls: [article.url],
      analysis: ensureOpinionMarker(String(item.analysis || ''), lang).slice(0, 1200),
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
  const assignment = assignArticles(articles, NEWSROOM_PERSONAS);

  let posts: NewsroomPost[] = [];
  if (assignment.size > 0) {
    // GEMINI_API_KEY is read from the environment by the SDK; it is never stored in code.
    const ai = new GoogleGenAI({});
    const prompt = buildPrompt(assignment, lang, topics);

    // Keep the best attempt across models. Stop early once every agent has a post.
    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        const attempt = parsePosts(response.text || '', assignment, lang);
        if (attempt.length > posts.length) posts = attempt;
        if (posts.length === assignment.size) break;
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
