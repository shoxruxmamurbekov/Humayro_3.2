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

interface DailyRecord {
  date: string;
  count: number;
}

// In-memory store: identifier -> DailyRecord
const quotaStore: Map<string, DailyRecord> = new Map();
let totalQuotaRejections = 0;

function getTodayUtcString(): string {
  return new Date().toISOString().slice(0, 10);
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
export function getQuotaStatus(req: Request): QuotaStatus {
  const { identifier, userType, limit } = extractClientIdentity(req);
  const today = getTodayUtcString();
  const record = quotaStore.get(identifier);

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
 */
export function consumeQuota(req: Request): QuotaStatus {
  const { identifier, userType, limit } = extractClientIdentity(req);
  const today = getTodayUtcString();
  let record = quotaStore.get(identifier);

  if (!record || record.date !== today) {
    record = { date: today, count: 0 };
    quotaStore.set(identifier, record);
  }

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
