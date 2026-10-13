import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { Request } from 'express';
import {
  consumeQuota,
  createMemoryBackend,
  getQuotaStatus,
  GUEST_DAILY_LIMIT,
  setQuotaBackend,
  type DailyRecord,
  type QuotaBackend
} from './quotaService.ts';
import { CSP_REPORT_ONLY, SECURITY_HEADERS } from './securityHeaders.ts';

const req = (token: string) =>
  ({ headers: { 'x-guest-token': token }, socket: {} }) as unknown as Request;

// Shared store: two objects pointing at the same map simulate two function instances.
function sharedBackend(map = new Map<string, DailyRecord>()): QuotaBackend {
  return {
    async get(key) {
      return map.get(key);
    },
    async set(key, record) {
      map.set(key, { ...record });
    }
  };
}

const failingBackend: QuotaBackend = {
  async get() {
    throw new Error('store down');
  },
  async set() {
    throw new Error('store down');
  }
};

afterEach(() => setQuotaBackend(createMemoryBackend()));

test('quota: counts per client and stops at the guest limit', async () => {
  setQuotaBackend(createMemoryBackend());
  let last = await consumeQuota(req('limit-test'));
  for (let i = 1; i < GUEST_DAILY_LIMIT; i++) last = await consumeQuota(req('limit-test'));
  assert.equal(last.used, GUEST_DAILY_LIMIT);
  const denied = await consumeQuota(req('limit-test'));
  assert.equal(denied.allowed, false);
  assert.match(denied.error ?? '', /quota reached/);
});

test('quota: two instances on one store share a single limit', async () => {
  const map = new Map<string, DailyRecord>();
  const instanceA = sharedBackend(map);
  const instanceB = sharedBackend(map);
  const half = GUEST_DAILY_LIMIT / 2;

  setQuotaBackend(instanceA);
  for (let i = 0; i < half; i++) await consumeQuota(req('multi-instance'));
  setQuotaBackend(instanceB);
  for (let i = 0; i < half; i++) await consumeQuota(req('multi-instance'));

  const denied = await consumeQuota(req('multi-instance'));
  assert.equal(denied.allowed, false, 'the limit is enforced across both instances');
  assert.equal(denied.used, GUEST_DAILY_LIMIT);
});

test('quota: a storage outage falls back to memory instead of failing the request', async () => {
  setQuotaBackend(failingBackend);
  const first = await consumeQuota(req('outage-test'));
  assert.equal(first.allowed, true);
  assert.equal(first.used, 1);
  const second = await consumeQuota(req('outage-test'));
  assert.equal(second.used, 2, 'the fallback keeps counting while storage is down');
});

test('security: CSP ships in report-only mode with safe defaults', () => {
  assert.equal(SECURITY_HEADERS['Content-Security-Policy-Report-Only'], CSP_REPORT_ONLY);
  assert.equal(SECURITY_HEADERS['Content-Security-Policy'], undefined, 'not enforced yet');
  assert.match(CSP_REPORT_ONLY, /object-src 'none'/);
  assert.match(CSP_REPORT_ONLY, /frame-ancestors 'self'/);
  assert.doesNotMatch(CSP_REPORT_ONLY, /unsafe-eval/);
});
