import express from 'express';
import dotenv from 'dotenv';
import serverless from 'serverless-http';
import { getLiveNewsFeed, searchNews, getCacheStats, getTrendingHotspots } from '../../server/newsService.ts';
import { synthesizeNews, generateArticle, getAiProviderInfo } from '../../server/aiService.ts';
import { getRequiredAdminSecret, timingSafeAdminCheck } from '../../server/security.ts';
import { consumeQuota, getQuotaStatus } from '../../server/quotaService.ts';
import { getRegionLive, getRegionVideos } from '../../server/regionService.ts';
import type { SupportedLanguage, SystemMetrics } from '../../src/types/index.ts';

dotenv.config();

const app = express();
const ADMIN_SECRET = getRequiredAdminSecret();
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

app.get('/user/quota', (req, res) => {
  const quota = getQuotaStatus(req);
  res.json({ success: true, quota });
});

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

// Live per-region news + weather (must mirror server.ts; previously missing here, causing 404 on Netlify)
app.get('/region/:key/live', async (req, res) => {
  try {
    const data = await getRegionLive(req.params.key, getLang(req.query.lang));
    if (!data) return res.status(404).json({ success: false, error: 'Unknown region' });
    res.json({ success: true, lang: getLang(req.query.lang), ...data });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to retrieve live region data' });
  }
});

// Live YouTube videos for the selected region
app.get('/region/:key/videos', async (req, res) => {
  try {
    const data = await getRegionVideos(req.params.key, getLang(req.query.lang));
    if (!data) return res.status(404).json({ success: false, error: 'Unknown region' });
    res.json({ success: true, lang: getLang(req.query.lang), ...data });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to retrieve region videos' });
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
  const quota = consumeQuota(req);
  if (!quota.allowed) {
    return res.status(429).json({ success: false, error: quota.error || 'Daily query quota reached.', quota });
  }
  aiRequests++;
  try {
    const { query, lang } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) return res.status(400).json({ success: false, error: 'Query is required', quota });
    const result = await synthesizeNews(query.trim(), getLang(lang));
    res.json({ success: true, data: result, quota });
  } catch {
    failedRequests++;
    res.status(500).json({ success: false, error: 'Free AI capacity is temporarily busy. Please try again later.', quota });
  }
});

app.post('/ai/article', async (req, res) => {
  const quota = consumeQuota(req);
  if (!quota.allowed) {
    return res.status(429).json({ success: false, error: quota.error || 'Daily query quota reached.', quota });
  }
  aiRequests++;
  try {
    const { topic, region, lang } = req.body;
    if (!topic || typeof topic !== 'string') return res.status(400).json({ success: false, error: 'Topic is required', quota });
    const article = await generateArticle(topic.trim(), region, getLang(lang));
    res.json({ success: true, data: article, quota });
  } catch {
    failedRequests++;
    res.status(500).json({ success: false, error: 'Failed to synthesize article brief', quota });
  }
});

app.get('/admin/metrics', async (req, res) => {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (!timingSafeAdminCheck(token, ADMIN_SECRET)) return res.status(401).json({ success: false, error: 'Unauthorized admin access' });

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