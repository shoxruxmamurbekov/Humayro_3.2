import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { SharedCache, setCacheBackend, type KvBackend } from './sharedCache.ts';

function mapBackend(map = new Map<string, unknown>()): KvBackend {
  return {
    async get(key) {
      return map.get(key);
    },
    async set(key, value) {
      map.set(key, value);
    }
  };
}

const failing: KvBackend = {
  async get() {
    throw new Error('blobs down');
  },
  async set() {
    throw new Error('blobs down');
  }
};

afterEach(() => setCacheBackend(null));

test('cache: an entry written by one instance is read by another on the same store', async () => {
  const store = new Map<string, unknown>();
  setCacheBackend(mapBackend(store));
  await new SharedCache<string[]>('feed').setEntry('uz_all', { at: 1, data: ['a'] });

  const otherInstance = new SharedCache<string[]>('feed');
  const hit = await otherInstance.getEntry('uz_all');
  assert.deepEqual(hit, { at: 1, data: ['a'] });
});

test('cache: returns stale entries so callers can apply their own fallback', async () => {
  setCacheBackend(mapBackend());
  const cache = new SharedCache<number>('weather');
  await cache.setEntry('k', { at: 0, data: 7 });
  const hit = await cache.getEntry('k');
  assert.equal(hit?.data, 7, 'the TTL check belongs to the caller, not the store');
});

test('cache: namespaces do not collide', async () => {
  setCacheBackend(mapBackend());
  await new SharedCache<number>('region').setEntry('uz', { at: 1, data: 1 });
  assert.equal(await new SharedCache<number>('videos').getEntry('uz'), undefined);
});

test('cache: a backend outage falls back to memory and does not throw', async () => {
  setCacheBackend(failing);
  const cache = new SharedCache<string>('newsroom');
  await cache.setEntry('uz|uz|', { at: 5, data: 'post' });
  const hit = await cache.getEntry('uz|uz|');
  assert.equal(hit?.data, 'post');
  assert.equal(cache.localSize(), 1);
});

test('cache: without a backend the cache is per-process memory', async () => {
  setCacheBackend(null);
  const cache = new SharedCache<number>('local');
  await cache.setEntry('a', { at: 1, data: 42 });
  assert.equal((await cache.getEntry('a'))?.data, 42);
});
