import type { Request } from 'express';

export interface QuotaStatus {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  userType: 'registered' | 'guest';
  identifier: string;
  error?: string;
}

export const GUEST_DAILY_LIMIT = 50;
export const REGISTERED_DAILY_LIMIT = 200;

export interface DailyRecord {
  date: string;
  count: number;
}

// Storage behind the quota. The default is per-process memory, which is only correct for a
// single long-running server. On Netlify, a shared backend (Netlify Blobs) is installed at startup
// so that every serverless instance counts against the same daily limit.
export interface QuotaBackend {
  get(key: string): Promise<DailyRecord | undefined>;
  set(key: string, record: DailyRecord): Promise<void>;
}

export function createMemoryBackend(): QuotaBackend {
  const store = new Map<string, DailyRecord>();
  return {
    async get(key) {
      return store.get(key);
    },
    async set(key, record) {
      store.set(key, record);
    }
  };
}

let backend: QuotaBackend = createMemoryBackend();
const memoryFallback = createMemoryBackend();
let totalQuotaRejections = 0;

export function setQuotaBackend(next: QuotaBackend): void {
  backend = next;
}

// A storage outage must not take the AI endpoints down. On error the count is kept in memory
// for that request path, and the failure is logged so it shows up in the function logs.
async function readRecord(key: string): Promise<DailyRecord | undefined> {
  try {
    return await backend.get(key);
  } catch (err) {
    console.warn('[quota] shared store read failed, using memory fallback:', err);
    return memoryFallback.get(key);
  }
}

async function writeRecord(key: string, record: DailyRecord): Promise<void> {
  try {
    await backend.set(key, record);
  } catch (err) {
    console.warn('[quota] shared store write failed, using memory fallback:', err);
    await memoryFallback.set(key, record);
  }
}

function getTodayUtcString(): string {
  return new Date().toISOString().slice(0, 10);
}

function storageKey(identifier: string): string {
  return `quota/${encodeURIComponent(identifier)}`;
}

/**
 * Extracts a stable client identifier from request headers and IP fallback.
 */
export function extractClientIdentity(req: Request): { identifier: string; userType: 'registered' | 'guest'; limit: number } {
  const userId = req.headers['x-user-id'];
  const guestToken = req.headers['x-guest-token'];

  // Check if authenticated / registered user
  if (typeof userId === 'string' && userId.trim() && userId.trim() !== 'guest') {
    const cleanId = userId.trim().slice(0, 80);
    return {
      identifier: `registered:${cleanId}`,
      userType: 'registered',
      limit: REGISTERED_DAILY_LIMIT
    };
  }

  // Guest token provided by client
  if (typeof guestToken === 'string' && guestToken.trim()) {
    const cleanGuest = guestToken.trim().slice(0, 80);
    return {
      identifier: `guest:${cleanGuest}`,
      userType: 'guest',
      limit: GUEST_DAILY_LIMIT
    };
  }

  // Fallback to IP address
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : (req.ip || req.socket?.remoteAddress || 'unknown-client');
  return {
    identifier: `guest_ip:${ip}`,
    userType: 'guest',
    limit: GUEST_DAILY_LIMIT
  };
}

/**
 * Reads current quota status without incrementing.
 */
export async function getQuotaStatus(req: Request): Promise<QuotaStatus> {
  const { identifier, userType, limit } = extractClientIdentity(req);
  const today = getTodayUtcString();
  const record = await readRecord(storageKey(identifier));

  const used = record && record.date === today ? record.count : 0;
  const remaining = Math.max(0, limit - used);
  const allowed = remaining > 0;

  return {
    allowed,
    used,
    limit,
    remaining,
    userType,
    identifier: identifier.replace(/:.+$/, ':***') // Mask in return payload
  };
}

/**
 * Checks and consumes 1 quota unit.
 * Returns quota status with graceful error message if limit is exceeded.
 *
 * Note: the shared backend is read-modify-write, so two requests that arrive at the same instant
 * can both pass the check. This makes the limit slightly lenient under heavy parallel use,
 * but it cannot be bypassed by simply retrying.
 */
export async function consumeQuota(req: Request): Promise<QuotaStatus> {
  const { identifier, userType, limit } = extractClientIdentity(req);
  const today = getTodayUtcString();
  const key = storageKey(identifier);
  const existing = await readRecord(key);
  const record: DailyRecord = existing && existing.date === today ? existing : { date: today, count: 0 };

  if (record.count >= limit) {
    totalQuotaRejections++;
    return {
      allowed: false,
      used: record.count,
      limit,
      remaining: 0,
      userType,
      identifier: identifier.replace(/:.+$/, ':***'),
      error: `Daily query quota reached (${limit} queries/day for ${userType}s). Please ${userType === 'guest' ? 'register an account or ' : ''}try again tomorrow.`
    };
  }

  record.count += 1;
  await writeRecord(key, record);
  const remaining = Math.max(0, limit - record.count);

  return {
    allowed: true,
    used: record.count,
    limit,
    remaining,
    userType,
    identifier: identifier.replace(/:.+$/, ':***')
  };
}

export function getQuotaRejectionsCount(): number {
  return totalQuotaRejections;
}
