import type { Request, Response } from 'express';
import { consumeQuota } from './quotaService.ts';
import { NEWSROOM_PERSONAS } from './newsroomPersonas.ts';
import {
  buildCacheKey,
  generateNewsroom,
  getCachedNewsroom,
  normalizeCountry,
  normalizeLang,
  normalizeTopics
} from './newsroomService.ts';

// GET /api/newsroom/agents: public persona list for the UI cards (no prompt text).
export function newsroomAgentsHandler(_req: Request, res: Response) {
  res.json({
    success: true,
    agents: NEWSROOM_PERSONAS.map(({ id, name, role, style, accent, initials }) => ({
      id,
      name,
      role,
      style,
      accent,
      initials
    }))
  });
}

// GET /api/newsroom?country=UZ&lang=uz&topics=energiya,fan
// Cache hits are free. Only a cache miss consumes AI quota.
export async function newsroomHandler(req: Request, res: Response) {
  const country = normalizeCountry(typeof req.query.country === 'string' ? req.query.country : undefined);
  const lang = normalizeLang(typeof req.query.lang === 'string' ? req.query.lang : undefined);
  const topicsRaw = typeof req.query.topics === 'string' ? req.query.topics.split(',') : [];
  const topics = normalizeTopics(topicsRaw.map(t => t.trim()).filter(Boolean));

  const key = buildCacheKey(country, lang, topics);
  const cached = await getCachedNewsroom(key);
  if (cached) {
    return res.json({ success: true, data: cached });
  }

  const quota = await consumeQuota(req);
  if (!quota.allowed) {
    return res.status(429).json({
      success: false,
      error: quota.error || 'Daily query quota reached.',
      quota
    });
  }

  try {
    const data = await generateNewsroom(country, lang, topics);
    res.json({ success: true, data, quota });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Newsroom is temporarily unavailable. Please try again later.',
      quota
    });
  }
}
