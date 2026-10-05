import express from 'express';
import dotenv from 'dotenv';
import serverless from 'serverless-http';
import { getLiveNewsFeed, searchNews, getCacheStats, getTrendingHotspots } from '../../server/newsService.ts';
import { synthesizeNews, generateArticle, getAiProviderInfo } from '../../server/aiService.ts';
import type { SupportedLanguage, SystemMetrics } from '../../src/types/index.ts';

dotenv.config();

const app = express();
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin2026';
let totalSearches = 0;
let aiRequests = 0;
let failedRequests = 0;

const ALL_SUPPORTED_LANGUAGES: SupportedLanguage[] = ['uz','kk','ky','tg','tk','az','tr','ar','fa','en','ru','ko'];

app.use(express.json());

const getLang = (raw: unknown): SupportedLanguage => {
  const value = typeof raw === 'string' ? raw : 'uz';
  return ALL_SUPPORTED_LANGUAGES.includes(value as SupportedLanguage) ? value as SupportedLanguage : 'uz';
};

app.get('/health', (_req, res) => res.json({ status: 'ok', product: 'Humayro_3.2', uptime: 0 }));

app.get('/news/feed', async (req, res) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const lang = getLang(req.query.lang);
    const articles = await getLiveNewsFeed(lang, category);
    res.json({ success: true, articles, count: articles.length, lang, updatedAt: new Date().toISOString() });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to retrieve news feed', articles: [] });
  }
});

app.get('/news/trending', async (req, res) => {
  try {
    const lang = getLang(req.query.lang);
    const hotspots = getTrendingHotspots(lang);
    const articles = await getLiveNewsFeed(lang);
    const topViral = [...articles]
      .sort((a, b) => ((b.trendScore || 70) + (b.isTrending ? 25 : 0)) - ((a.trendScore || 70) + (a.isTrending ? 25 : 0)))
      .slice(0, 8);
    res.json({ success: true, hotspots, topViral, totalActiveArticles: articles.length });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to load trending data' });
  }
});

app.get('/news/search', async (req, res) => {
  totalSearches++;
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const lang = getLang(req.query.lang);
    const articles = await searchNews(q, category, lang);
    res.json({ success: true, query: q, articles, count: articles.length });
  } catch {
    res.status(500).json({ success: false, error: 'Search failed', articles: [] });
  }
});

app.post('/ai/synthesize', async (req, res) => {
  aiRequests++;
  try {
    const { query, lang } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) return res.status(400).json({ success: false, error: 'Query is required' });
    const result = await synthesizeNews(query.trim(), getLang(lang));
    res.json({ success: true, data: result });
  } catch {
    failedRequests++;
    res.status(500).json({ success: false, error: 'Free AI capacity is temporarily busy. Please try again later.' });
  }
});

app.post('/ai/article', async (req, res) => {
  aiRequests++;
  try {
    const { topic, region, lang } = req.body;
    if (!topic || typeof topic !== 'string') return res.status(400).json({ success: false, error: 'Topic is required' });
    const article = await generateArticle(topic.trim(), region, getLang(lang));
    res.json({ success: true, data: article });
  } catch {
    failedRequests++;
    res.status(500).json({ success: false, error: 'Failed to synthesize article brief' });
  }
});

app.get('/admin/metrics', async (req, res) => {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (token !== ADMIN_SECRET) return res.status(401).json({ success: false, error: 'Unauthorized admin access' });

  const aiInfo = getAiProviderInfo();
  const cacheStats = getCacheStats();
  const articles = await getLiveNewsFeed();
  const metrics: SystemMetrics = {
    totalSearches, aiRequests, failedRequests,
    cachedQueries: cacheStats.cachedKeys,
    uptimeSeconds: 0,
    primaryProvider: aiInfo.primary,
    fallbackProvider: aiInfo.fallback,
    geminiConfigured: aiInfo.geminiReady,
    groqConfigured: aiInfo.groqReady,
    openRouterConfigured: aiInfo.openRouterReady,
    feedCount: articles.length,
    lastIngestedAt: new Date().toISOString()
  };
  res.json({ success: true, metrics });
});

export const handler = serverless(app);