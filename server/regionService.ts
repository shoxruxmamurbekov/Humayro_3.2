import { searchGoogleNews } from './newsService.ts';
import type { Article, SupportedLanguage } from '../src/types/index.ts';

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

export interface RegionLiveData {
  regionKey: string;
  articles: Article[];
  weather: RegionLiveWeather[];
  fetchedAt: string;
}

interface RegionConfig {
  // Search queries per region (international keywords work well in all Google News locales)
  queries: string[];
  // Representative cities for live weather
  cities: { name: string; lat: number; lon: number }[];
}

export const REGION_CONFIG: Record<string, RegionConfig> = {
  'central-asia': {
    queries: ['Uzbekistan OR Kazakhstan OR Kyrgyzstan OR Tajikistan OR Turkmenistan', 'Central Asia', 'Tashkent'],
    cities: [
      { name: 'Tashkent', lat: 41.2995, lon: 69.2401 },
      { name: 'Astana', lat: 51.1694, lon: 71.4491 },
      { name: 'Bishkek', lat: 42.8746, lon: 74.5698 }
    ]
  },
  'east-asia': {
    queries: ['China OR Japan OR "South Korea" OR Taiwan', 'East Asia', 'Seoul OR Tokyo OR Beijing'],
    cities: [
      { name: 'Seoul', lat: 37.5665, lon: 126.978 },
      { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
      { name: 'Beijing', lat: 39.9042, lon: 116.4074 }
    ]
  },
  europe: {
    queries: ['Europe', 'European Union', 'Brussels OR Berlin OR Paris OR London'],
    cities: [
      { name: 'Brussels', lat: 50.8503, lon: 4.3517 },
      { name: 'Berlin', lat: 52.52, lon: 13.405 },
      { name: 'Paris', lat: 48.8566, lon: 2.3522 }
    ]
  },
  'north-america': {
    queries: ['United States OR Canada', 'Washington politics economy', 'Silicon Valley'],
    cities: [
      { name: 'Washington', lat: 38.9072, lon: -77.0369 },
      { name: 'New York', lat: 40.7128, lon: -74.006 },
      { name: 'Ottawa', lat: 45.4215, lon: -75.6972 }
    ]
  },
  'middle-east': {
    queries: ['Middle East', 'Iran OR Israel OR Gaza OR Saudi Arabia', 'Dubai OR Riyadh OR Doha'],
    cities: [
      { name: 'Riyadh', lat: 24.7136, lon: 46.6753 },
      { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
      { name: 'Tehran', lat: 35.6892, lon: 51.389 }
    ]
  },
  africa: {
    queries: ['Africa', 'Egypt OR Nigeria OR Kenya OR "South Africa"', 'Cairo OR Nairobi OR Lagos'],
    cities: [
      { name: 'Cairo', lat: 30.0444, lon: 31.2357 },
      { name: 'Nairobi', lat: -1.2921, lon: 36.8219 },
      { name: 'Lagos', lat: 6.5244, lon: 3.3792 }
    ]
  },
  'south-america': {
    queries: ['South America', 'Brazil OR Argentina OR Chile', 'Sao Paulo OR "Buenos Aires"'],
    cities: [
      { name: 'São Paulo', lat: -23.5505, lon: -46.6333 },
      { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816 },
      { name: 'Santiago', lat: -33.4489, lon: -70.6693 }
    ]
  },
  oceania: {
    queries: ['Oceania', 'Australia OR "New Zealand"', 'Sydney OR Melbourne OR Auckland'],
    cities: [
      { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
      { name: 'Melbourne', lat: -37.8136, lon: 144.9631 },
      { name: 'Auckland', lat: -36.8485, lon: 174.7633 }
    ]
  }
};

export const REGION_KEYS = Object.keys(REGION_CONFIG);

const REGION_CACHE_TTL_MS = 30 * 1000;
const WEATHER_CACHE_TTL_MS = 5 * 60 * 1000;

const regionCache = new Map<string, { at: number; data: RegionLiveData }>();
const weatherCache = new Map<string, { at: number; data: RegionLiveWeather }>();

async function fetchWeather(city: { name: string; lat: number; lon: number }): Promise<RegionLiveWeather | null> {
  const key = `${city.lat},${city.lon}`;
  const hit = weatherCache.get(key);
  if (hit && Date.now() - hit.at < WEATHER_CACHE_TTL_MS) return hit.data;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day&timezone=auto`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return hit?.data ?? null;
    const json: any = await res.json();
    const c = json.current;
    if (!c) return hit?.data ?? null;

    const data: RegionLiveWeather = {
      city: city.name,
      temperatureC: c.temperature_2m ?? null,
      apparentC: c.apparent_temperature ?? null,
      humidity: c.relative_humidity_2m ?? null,
      windKmh: c.wind_speed_10m ?? null,
      code: c.weather_code ?? null,
      isDay: c.is_day === 1,
      observedAt: c.time ?? null
    };
    weatherCache.set(key, { at: Date.now(), data });
    return data;
  } catch {
    return hit?.data ?? null;
  }
}

const STOP_WORDS = new Set(['this', 'that', 'with', 'from', 'after', 'over', 'says', 'said', 'will', 'have', 'been']);

function titleTokens(title: string): Set<string> {
  const words = title
    .toLowerCase()
    .replace(/\s+-\s+[^-]+$/, '')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(w => w.length >= 4 && !STOP_WORDS.has(w));
  return new Set(words);
}

/**
 * "Buzz" score: how many OTHER articles cover the same story (share >= 2 significant words).
 * Stories reported by many outlets are treated as the most talked-about.
 */
function buzzScores(items: Article[]): number[] {
  const sets = items.map(a => titleTokens(a.title));
  return sets.map((s, i) => {
    let count = 0;
    for (let j = 0; j < sets.length; j++) {
      if (i === j) continue;
      let overlap = 0;
      for (const w of s) if (sets[j].has(w)) overlap++;
      if (overlap >= 2) count++;
    }
    return count;
  });
}

function dedupeAndSort(lists: Article[][], regionKey: string): Article[] {
  const seen = new Set<string>();
  const merged: Article[] = [];
  for (const list of lists) {
    for (const a of list) {
      const norm = a.title.toLowerCase().replace(/\s+-\s+[^-]+$/, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
      if (!norm || seen.has(norm)) continue;
      seen.add(norm);
      merged.push(a);
    }
  }

  const scores = buzzScores(merged);
  return merged
    .map((a, i) => ({ a, score: scores[i] }))
    .sort(
      (x, y) =>
        y.score - x.score || new Date(y.a.publishedAt).getTime() - new Date(x.a.publishedAt).getTime()
    )
    .slice(0, 24)
    .map(({ a, score }, i) => ({
      ...a,
      id: `${regionKey}-${i}-${a.id}`,
      category: 'Live Region',
      trendScore: score,
      isTrending: score >= 2
    }));
}

export async function getRegionLive(regionKey: string, lang: SupportedLanguage): Promise<RegionLiveData | null> {
  const cfg = REGION_CONFIG[regionKey];
  if (!cfg) return null;

  const cacheKey = `${regionKey}:${lang}`;
  const hit = regionCache.get(cacheKey);
  if (hit && Date.now() - hit.at < REGION_CACHE_TTL_MS) return hit.data;

  const [newsLists, weatherList] = await Promise.all([
    Promise.all(cfg.queries.map(q => searchGoogleNews(q, lang))),
    Promise.all(cfg.cities.map(fetchWeather))
  ]);

  const data: RegionLiveData = {
    regionKey,
    articles: dedupeAndSort(newsLists, regionKey),
    weather: weatherList.filter((w): w is RegionLiveWeather => w !== null),
    fetchedAt: new Date().toISOString()
  };

  // Don't overwrite a good cached result with an empty one (network hiccup)
  if (data.articles.length === 0 && hit && hit.data.articles.length > 0) {
    return { ...hit.data, weather: data.weather.length ? data.weather : hit.data.weather };
  }

  regionCache.set(cacheKey, { at: Date.now(), data });
  return data;
}

// ---------- Live YouTube videos for the selected region ----------

export interface RegionVideo {
  id: string;
  title: string;
  channel: string;
  published: string;
  thumbnail: string;
}

export interface RegionVideosData {
  regionKey: string;
  query: string;
  configured: boolean;
  searchUrl: string;
  videos: RegionVideo[];
  fetchedAt: string;
}

const VIDEO_CACHE_TTL_MS = 10 * 60 * 1000;
const VIDEO_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;
const videoCache = new Map<string, { at: number; data: RegionVideosData }>();

async function youtubeSearch(q: string, lang: SupportedLanguage, apiKey: string): Promise<RegionVideo[]> {
  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    // Most-watched videos from the last few days = what people are actually talking about
    order: 'viewCount',
    publishedAfter: new Date(Date.now() - VIDEO_WINDOW_MS).toISOString(),
    maxResults: '8',
    safeSearch: 'moderate',
    q,
    key: apiKey
  });
  if (/^[a-z]{2}$/.test(lang)) params.set('relevanceLanguage', lang);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`, {
      signal: controller.signal
    });
    if (!res.ok) return [];
    const json: any = await res.json();
    return (json.items ?? [])
      .map((it: any): RegionVideo => ({
        id: it.id?.videoId ?? '',
        title: it.snippet?.title ?? '',
        channel: it.snippet?.channelTitle ?? '',
        published: it.snippet?.publishedAt ?? '',
        thumbnail: it.snippet?.thumbnails?.high?.url ?? it.snippet?.thumbnails?.default?.url ?? ''
      }))
      .filter((v: RegionVideo) => v.id);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function getRegionVideos(regionKey: string, lang: SupportedLanguage): Promise<RegionVideosData | null> {
  const cfg = REGION_CONFIG[regionKey];
  if (!cfg) return null;

  const cacheKey = `${regionKey}:${lang}`;
  const hit = videoCache.get(cacheKey);
  if (hit && Date.now() - hit.at < VIDEO_CACHE_TTL_MS) return hit.data;

  // Search by the hottest live headlines first, then fall back to the region's keywords
  const live = await getRegionLive(regionKey, lang);
  const headlineQueries = (live?.articles ?? [])
    .slice(0, 2)
    .map(a => a.title.replace(/\s+-\s+[^-]+$/, '').slice(0, 90).trim())
    .filter(Boolean);
  const queries = [...headlineQueries, cfg.queries[0]];

  const apiKey = process.env.YOUTUBE_API_KEY || '';
  let usedQuery = queries[0];
  let videos: RegionVideo[] = [];

  if (apiKey) {
    for (const q of queries) {
      videos = await youtubeSearch(q, lang, apiKey);
      usedQuery = q;
      if (videos.length > 0) break;
    }
  }

  const data: RegionVideosData = {
    regionKey,
    query: usedQuery,
    configured: Boolean(apiKey),
    searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(usedQuery)}`,
    videos,
    fetchedAt: new Date().toISOString()
  };

  // Don't cache a failed lookup for long: retry sooner if the API call came back empty
  if (apiKey && videos.length === 0 && hit) return hit.data;
  videoCache.set(cacheKey, { at: Date.now(), data });
  return data;
}
