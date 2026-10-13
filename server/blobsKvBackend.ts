import { getStore } from '@netlify/blobs';
import type { KvBackend } from './sharedCache.ts';

// Shared cache storage for Netlify Functions. Reads are eventually consistent, which is fine
// for cache entries: a slightly old entry is still served within its TTL.
export function createBlobsKvBackend(): KvBackend {
  const store = getStore({ name: 'humayro-cache', consistency: 'eventual' });
  return {
    async get(key) {
      const value = await store.get(key, { type: 'json' });
      return value ?? undefined;
    },
    async set(key, value) {
      await store.setJSON(key, value);
    }
  };
}
