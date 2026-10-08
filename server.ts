import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getLiveNewsFeed, searchNews, getCacheStats, getTrendingHotspots } from './server/newsService.ts';
import { synthesizeNews, generateArticle, getAiProviderInfo } from './server/aiService.ts';
import { getRegionLive, getRegionVideos } from './server/regionService.ts';
import { getRequiredAdminSecret, timingSafeAdminCheck } from './server/security.ts';
import { generalApiLimiter, aiApiLimiter } from './server/rateLimit.ts';
import { consumeQuota, getQuotaStatus } from './server/quotaService.ts';
import type { SupportedLanguage, SystemMetrics } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Security: Fail-fast startup if ADMIN_SECRET is not configured
const ADMIN_SECRET = getRequiredAdminSecret();

const startTime = Date.now();
let totalSearches = 0;
let aiRequests = 0;
let failedRequests = 0;

const ALL_SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  'uz', 'kk', 'ky', 'tg', 'tk', 'az', 'tr', 'ar', 'fa', 'en', 'ru', 'ko'
];

app.use(express.json());

// Rate Limiting
app.use('/api', generalApiLimiter);
app.use('/api/ai', aiApiLimiter);

// API: News Feed with Language Adaptation
app.get('/api/news/feed', async (req, res) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const langRaw = req.query.lang as string;
    const lang: SupportedLanguage = ALL_SUPPORTED_LANGUAGES.includes(langRaw as SupportedLanguage) ? (langRaw as SupportedLanguage) : 'uz';
    const articles = await getLiveNewsFeed(lang, category);

    res.json({
      success: true,
      articles,
      count: articles.length,
      lang,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve news feed', articles: [] });
  }
});

// API: Live per-region intelligence (latest news + live weather for the selected map region)
app.get('/api/region/:key/live', async (req, res) => {
  try {
    const langRaw = req.query.lang as string;
    const lang: SupportedLanguage = ALL_SUPPORTED_LANGUAGES.includes(langRaw as SupportedLanguage) ? (langRaw as SupportedLanguage) : 'uz';
    const data = await getRegionLive(req.params.key, lang);
    if (!data) {
      return res.status(404).json({ success: false, error: 'Unknown region' });
    }
    res.json({ success: true, lang, ...data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve live region data' });
  }
});

// API: Live YouTube videos for the selected region (most-watched recent videos on the hottest headlines)
app.get('/api/region/:key/videos', async (req, res) => {
  try {
    const langRaw = req.query.lang as string;
    const lang: SupportedLanguage = ALL_SUPPORTED_LANGUAGES.includes(langRaw as SupportedLanguage) ? (langRaw as SupportedLanguage) : 'uz';
    const data = await getRegionVideos(req.params.key, lang);
    if (!data) {
      return res.status(404).json({ success: false, error: 'Unknown region' });
    }
    res.json({ success: true, lang, ...data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve region videos' });
  }
});

// API: Trending Hotspots & Viral Topics
app.get('/api/news/trending', async (req, res) => {
  try {
    const langRaw = req.query.lang as string;
    const lang: SupportedLanguage = ALL_SUPPORTED_LANGUAGES.includes(langRaw as SupportedLanguage) ? (langRaw as SupportedLanguage) : 'uz';
    const hotspots = getTrendingHotspots(lang);
    const articles = await getLiveNewsFeed(lang);

    // Top viral articles with highest trend score
    const topViral = [...articles]
      .sort((a, b) => ((b.trendScore || 70) + (b.isTrending ? 25 : 0)) - ((a.trendScore || 70) + (a.isTrending ? 25 : 0)))
      .slice(0, 8);

    res.json({
      success: true,
      hotspots,
      topViral,
      totalActiveArticles: articles.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to load trending data' });
  }
});

// API: Search Articles
app.get('/api/news/search', async (req, res) => {
  totalSearches++;
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const langRaw = req.query.lang as string;
    const lang: SupportedLanguage = ALL_SUPPORTED_LANGUAGES.includes(langRaw as SupportedLanguage) ? (langRaw as SupportedLanguage) : 'uz';
    const articles = await searchNews(q, category, lang);

    res.json({
      success: true,
      query: q,
      articles,
      count: articles.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Search failed', articles: [] });
  }
});

// API: User Quota Status
app.get('/api/user/quota', (req, res) => {
  const quota = getQuotaStatus(req);
  res.json({
    success: true,
    quota
  });
});

// API: AI Synthesis (Quick answer with sources & timeline)
app.post('/api/ai/synthesize', async (req, res) => {
  const quota = consumeQuota(req);
  if (!quota.allowed) {
    return res.status(429).json({
      success: false,
      error: quota.error || 'Daily query quota reached.',
      quota
    });
  }

  aiRequests++;
  try {
    const { query, lang } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ success: false, error: 'Query is required', quota });
    }

    const validLang: SupportedLanguage = ALL_SUPPORTED_LANGUAGES.includes(lang) ? lang : 'uz';
    const result = await synthesizeNews(query.trim(), validLang);

    res.json({
      success: true,
      data: result,
      quota
    });
  } catch (error) {
    failedRequests++;
    res.status(500).json({
      success: false,
      error: 'Free AI capacity is temporarily busy. Please try again later.',
      quota
    });
  }
});

// API: AI Deep Article
app.post('/api/ai/article', async (req, res) => {
  const quota = consumeQuota(req);
  if (!quota.allowed) {
    return res.status(429).json({
      success: false,
      error: quota.error || 'Daily query quota reached.',
      quota
    });
  }

  aiRequests++;
  try {
    const { topic, region, lang } = req.body;
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ success: false, error: 'Topic is required', quota });
    }

    const validLang: SupportedLanguage = ALL_SUPPORTED_LANGUAGES.includes(lang) ? lang : 'uz';
    const article = await generateArticle(topic.trim(), region, validLang);

    res.json({
      success: true,
      data: article,
      quota
    });
  } catch (error) {
    failedRequests++;
    res.status(500).json({
      success: false,
      error: 'Failed to synthesize article brief',
      quota
    });
  }
});

// API: Admin Metrics & System Status (Protected)
app.get('/api/admin/metrics', async (req, res) => {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (!timingSafeAdminCheck(token, ADMIN_SECRET)) {
    return res.status(401).json({ success: false, error: 'Unauthorized admin access' });
  }

  const aiInfo = getAiProviderInfo();
  const cacheStats = getCacheStats();
  const articles = await getLiveNewsFeed();

  const metrics: SystemMetrics = {
    totalSearches,
    aiRequests,
    failedRequests,
    cachedQueries: cacheStats.cachedKeys,
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    primaryProvider: aiInfo.primary,
    fallbackProvider: aiInfo.fallback,
    geminiConfigured: aiInfo.geminiReady,
    groqConfigured: aiInfo.groqReady,
    openRouterConfigured: aiInfo.openRouterReady,
    feedCount: articles.length,
    lastIngestedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    metrics
  });
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    product: 'Humayro_3.3',
    uptime: Math.floor((Date.now() - startTime) / 1000)
  });
});

// Vite middleware or static serving
async function setupServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Humayro_3.1] Intelligence server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch(err => {
  console.error('[Humayro_3.1] Failed to start server:', err);
});
