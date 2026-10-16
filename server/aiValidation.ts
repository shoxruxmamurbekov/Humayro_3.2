// Defensive normalizers for model output. Model JSON is untrusted: fields may be missing,
// the wrong type, oversized, or contain non-http links. Each helper returns a safe value
// or undefined, so callers can fall back instead of rendering broken data.

import type { HistoricalParallel, SourceItem, TimelineItem } from '../src/types/index.ts';

const MAX_TEXT = 2000;
const MAX_LIST = 12;

export function asText(value: unknown, max = MAX_TEXT): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.replace(/\s+/g, ' ').trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

export function asTextList(value: unknown, maxItems = MAX_LIST, maxLen = 400): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value) {
    const text = asText(item, maxLen);
    if (text) out.push(text);
    if (out.length >= maxItems) break;
  }
  return out;
}

export function asHttpUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function asScore(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function normalizeTimeline(value: unknown, maxItems = 5): TimelineItem[] {
  if (!Array.isArray(value)) return [];
  const out: TimelineItem[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== 'object') continue;
    const time = asText((raw as any).time, 60);
    const event = asText((raw as any).event, 400);
    if (time && event) out.push({ time, event });
    if (out.length >= maxItems) break;
  }
  return out;
}

export function normalizeSources(value: unknown, maxItems = 10): SourceItem[] {
  if (!Array.isArray(value)) return [];
  const out: SourceItem[] = [];
  for (const raw of value) {
    const name = typeof raw === 'string'
      ? asText(raw, 120)
      : raw && typeof raw === 'object' ? asText((raw as any).name, 120) : undefined;
    if (!name) continue;
    const url = raw && typeof raw === 'object' ? asHttpUrl((raw as any).url) : undefined;
    out.push(url ? { name, url } : { name });
    if (out.length >= maxItems) break;
  }
  return out;
}

export function normalizeHistorical(value: unknown): HistoricalParallel | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const v = value as any;
  const eventName = asText(v.eventName, 200);
  const quoteText = asText(v.quote?.text, 400);
  if (!eventName || !quoteText) return undefined;
  return {
    eventName,
    yearOrEra: asText(v.yearOrEra, 60) || '',
    similarity: asText(v.similarity, 600) || '',
    historicalLesson: asText(v.historicalLesson, 600) || '',
    quote: {
      text: quoteText,
      author: asText(v.quote?.author, 120) || 'Unknown',
      sourceOrEra: asText(v.quote?.sourceOrEra, 160),
    },
  };
}
