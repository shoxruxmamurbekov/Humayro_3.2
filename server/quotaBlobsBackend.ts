import { getStore } from '@netlify/blobs';
import type { DailyRecord, QuotaBackend } from './quotaService.ts';

// Shared quota storage for Netlify Functions. Every function instance reads and writes the same
// store, so the daily limit is enforced across instances instead of per instance.
export function createBlobsQuotaBackend(): QuotaBackend {
  const store = getStore({ name: 'humayro-quota', consistency: 'strong' });
  return {
    async get(key) {
      const value = await store.get(key, { type: 'json' });
      return (value ?? undefined) as DailyRecord | undefined;
    },
    async set(key, record) {
      await store.setJSON(key, record);
    }
  };
}
