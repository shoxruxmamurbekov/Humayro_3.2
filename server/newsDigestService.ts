import { SharedCache } from './sharedCache.ts';
import { fetchRssFeed } from './newsService.ts';
import type { Article, SupportedLanguage } from '../src/types/index.ts';

// News collection for the MCP server. No AI runs here: the user's own AI client reads these
// articles and writes the digest, so this service only gathers, filters and caches headlines.

export interface DigestArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

export interface DigestSection {
  label: string;
  articles: DigestArticle[];
}

export interface DigestResult {
  country: string;
  lang: SupportedLanguage;
  hours: number;
  since: string;
  generatedAt: string;
  sections: DigestSection[];
  totalArticles: number;
}

// Google News locale per country (hl = interface language, gl = region, ceid = gl:hl).
export const LOCALES: Record<string, { hl: string; gl: string }> = {
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

export const TOPIC_QUERY: Record<string, string> = {
  iqtisodiyot: 'economy',
  texnologiya: 'technology AI',
  energiya: 'energy',
  siyosat: 'politics',
  fan: 'science'
};

// English and Russian names an AI client may pass instead of the Uzbek topic ids.
const TOPIC_ALIASES: Record<string, string> = {
  economy: 'iqtisodiyot',
  business: 'iqtisodiyot',
  technology: 'texnologiya',
  tech: 'texnologiya',
  ai: 'texnologiya',
  energy: 'energiya',
  politics: 'siyosat',
  science: 'fan'
};

export const LANGUAGE_CODES: SupportedLanguage[] = [
  'uz', 'en', 'ru', 'ko', 'kk', 'ky', 'tg', 'tk', 'az', 'tr', 'ar', 'fa'
];

export const MAX_HOURS = 24 * 14;
const MAX_SECTIONS = 8;
const MAX_KEYWORDS = 5;
const MAX_KEYWORD_LENGTH = 60;
const FEED_POOL = 40;
const CACHE_TTL_MS = 20 * 60 * 1000;
const sectionCache = new SharedCache<DigestArticle[]>('news-digest');

export function normalizeCountry(value: string | undefined): string {
  const code = (value || 'UZ').toUpperCase();
  return Object.prototype.hasOwnProperty.call(LOCALES, code) ? code : 'US';
}

export function normalizeLang(value: string | undefined): SupportedLanguage {
  return LANGUAGE_CODES.includes(value as SupportedLanguage) ? (value as SupportedLanguage) : 'uz';
}

export function normalizeTopics(values: string[]): string[] {
  const ids = values
    .map(v => String(v).trim().toLowerCase())
    .map(v => (Object.prototype.hasOwnProperty.call(TOPIC_ALIASES, v) ? TOPIC_ALIASES[v] : v))
    .filter(v => Object.prototype.hasOwnProperty.call(TOPIC_QUERY, v));
  return Array.from(new Set(ids)).sort();
}

// Free-text interests become quoted Google News search terms. Only letters, digits and spaces
// survive, so a keyword can never inject search operators such as "when:" or "site:".
export function normalizeKeywords(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  const cleaned = values
    .filter((v): v is string => typeof v === 'string')
    .map(v => v.normalize('NFKC').replace(/[^\p{L}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim())
    .map(v => v.slice(0, MAX_KEYWORD_LENGTH).trim())
    .filter(Boolean);
  return Array.from(new Set(cleaned)).slice(0, MAX_KEYWORDS);
}

export function normalizeHours(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(Math.max(Math.round(n), 1), MAX_HOURS);
}

export function normalizeLimit(value: unknown, fallback: number, max = 15): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(Math.max(Math.round(n), 1), max);
}

// Google News search accepts "when:6h" and "when:7d".
export function whenToken(hours: number): string {
  return hours <= 72 ? `when:${hours}h` : `when:${Math.ceil(hours / 24)}d`;
}

export function periodToHours(period: string | undefined): number {
  return period === 'weekly' ? 24 * 7 : 24;
}

interface SectionPlan {
  label: string;
  query: string | null; // null = the country's top headlines
}

export function planSections(topics: string[], keywords: string[]): SectionPlan[] {
  const plans: SectionPlan[] = [
    ...topics.map(t => ({ label: t, query: TOPIC_QUERY[t] })),
    ...keywords.map(k => ({ label: k, query: `"${k}"` }))
  ].slice(0, MAX_SECTIONS);
  return plans.length ? plans : [{ label: 'umumiy', query: null }];
}

function trimArticle(a: Article): DigestArticle {
  return {
    title: a.title.trim(),
    description: (a.description || '').trim().slice(0, 300),
    url: a.url,
    source: a.source,
    publishedAt: a.publishedAt
  };
}

function feedUrls(country: string, query: string | null, hours: number) {
  const loc = LOCALES[country];
  const suffix = `hl=${loc.hl}&gl=${loc.gl}&ceid=${loc.gl}:${loc.hl}`;
  if (query === null) {
    const q = encodeURIComponent(`world news ${whenToken(hours)}`);
    return [
      { url: `https://news.google.com/rss?${suffix}`, source: `Google News top (${country})` },
      { url: `https://news.google.com/rss/search?q=${q}&${suffix}`, source: `Google News (${country})` }
    ];
  }
  const q = encodeURIComponent(`${query} ${whenToken(hours)}`);
  return [{ url: `https://news.google.com/rss/search?q=${q}&${suffix}`, source: `Google News (${country})` }];
}

function filterAndSort(articles: DigestArticle[], hours: number, now = Date.now()): DigestArticle[] {
  const cutoff = now - hours * 3600 * 1000;
  const seen = new Set<string>();
  const kept: DigestArticle[] = [];
  for (const a of articles) {
    // Keep the key Unicode-safe so Cyrillic and Arabic titles are not collapsed to empty strings.
    const key = a.title.toLowerCase().slice(0, 60);
    if (!key || seen.has(key)) continue;
    const time = Date.parse(a.publishedAt);
    if (Number.isFinite(time) && time < cutoff) continue;
    seen.add(key);
    kept.push(a);
  }
  kept.sort((a, b) => (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0));
  return kept;
}

async function loadSection(country: string, plan: SectionPlan, hours: number): Promise<DigestArticle[]> {
  const key = `${country}|${plan.query ?? 'top'}|${whenToken(hours)}`;
  const hit = await sectionCache.getEntry(key);
  if (hit && Date.now() - hit.at <= CACHE_TTL_MS) return hit.data;

  const results = await Promise.allSettled(
    feedUrls(country, plan.query, hours).map(f => fetchRssFeed(f.url, f.source, 'digest'))
  );
  const raw: DigestArticle[] = [];
  let anyOk = false;
  for (const r of results) {
    if (r.status !== 'fulfilled') continue;
    anyOk = true;
    raw.push(...r.value.map(trimArticle));
  }
  // A failed upstream request falls back to a stale entry rather than an empty section.
  if (!anyOk && hit) return hit.data;

  const articles = filterAndSort(raw, hours).slice(0, FEED_POOL);
  await sectionCache.setEntry(key, { at: Date.now(), data: articles });
  return articles;
}

export interface DigestOptions {
  country?: string;
  lang?: string;
  topics?: string[];
  keywords?: unknown;
  hours: number;
  perSection: number;
}

export async function buildDigest(options: DigestOptions): Promise<DigestResult> {
  const country = normalizeCountry(options.country);
  const lang = normalizeLang(options.lang);
  const topics = normalizeTopics(options.topics || []);
  const keywords = normalizeKeywords(options.keywords);
  const hours = normalizeHours(options.hours, 24);
  const perSection = normalizeLimit(options.perSection, 5);

  const plans = planSections(topics, keywords);
  const loaded = await Promise.all(plans.map(plan => loadSection(country, plan, hours)));

  // An article shows up once, in the first section that claims it.
  const used = new Set<string>();
  const sections: DigestSection[] = plans.map((plan, i) => {
    const articles: DigestArticle[] = [];
    for (const a of loaded[i]) {
      if (articles.length >= perSection) break;
      if (used.has(a.url)) continue;
      used.add(a.url);
      articles.push(a);
    }
    return { label: plan.label, articles };
  });

  return {
    country,
    lang,
    hours,
    since: new Date(Date.now() - hours * 3600 * 1000).toISOString(),
    generatedAt: new Date().toISOString(),
    sections,
    totalArticles: sections.reduce((n, s) => n + s.articles.length, 0)
  };
}

export { filterAndSort as _filterAndSort };
