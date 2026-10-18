import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { getAiProviderManagerSummary, saveAiProviderSettings } from './aiProviderManager.ts';

const previousEncryptionKey = process.env.AI_SETTINGS_ENCRYPTION_KEY;
const previousNetlify = process.env.NETLIFY;
const previousProviderKeys = {
  gemini: process.env.GEMINI_API_KEY,
  groq: process.env.GROQ_API_KEY,
  openrouter: process.env.OPENROUTER_API_KEY
};

delete process.env.NETLIFY;
delete process.env.GEMINI_API_KEY;
delete process.env.GROQ_API_KEY;
delete process.env.OPENROUTER_API_KEY;
process.env.AI_SETTINGS_ENCRYPTION_KEY = 'unit-test-encryption-key-0123456789abcdef';

after(() => {
  if (previousEncryptionKey === undefined) delete process.env.AI_SETTINGS_ENCRYPTION_KEY;
  else process.env.AI_SETTINGS_ENCRYPTION_KEY = previousEncryptionKey;
  if (previousNetlify === undefined) delete process.env.NETLIFY;
  else process.env.NETLIFY = previousNetlify;
  if (previousProviderKeys.gemini === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = previousProviderKeys.gemini;
  if (previousProviderKeys.groq === undefined) delete process.env.GROQ_API_KEY;
  else process.env.GROQ_API_KEY = previousProviderKeys.groq;
  if (previousProviderKeys.openrouter === undefined) delete process.env.OPENROUTER_API_KEY;
  else process.env.OPENROUTER_API_KEY = previousProviderKeys.openrouter;
});

test('stores provider keys without returning the secret to the UI', async () => {
  const secret = 'groq-test-secret-key-never-return-this';
  const settings = await saveAiProviderSettings({
    primaryProvider: 'groq',
    fallbackProvider: 'rss-fallback',
    models: { groq: 'llama-3.3-70b-versatile' },
    apiKeys: { groq: secret }
  });

  assert.equal(settings.primaryProvider, 'groq');
  assert.equal(settings.providers.groq.keySource, 'managed');
  assert.equal(settings.providers.groq.ready, true);
  assert.equal(JSON.stringify(settings).includes(secret), false);
});

test('removes managed provider keys without returning their contents', async () => {
  const settings = await saveAiProviderSettings({ removeKeys: ['groq'] });
  assert.equal(settings.providers.groq.keySource, 'none');
  assert.equal(settings.providers.groq.ready, false);
});

test('rejects saving API keys without a dedicated encryption secret', async () => {
  delete process.env.AI_SETTINGS_ENCRYPTION_KEY;
  await assert.rejects(
    () => saveAiProviderSettings({ apiKeys: { openrouter: 'test-openrouter-secret-key' } }),
    /AI_SETTINGS_ENCRYPTION_KEY/
  );
  process.env.AI_SETTINGS_ENCRYPTION_KEY = 'unit-test-encryption-key-0123456789abcdef';
});

test('rejects model IDs with whitespace or unexpected characters', async () => {
  await assert.rejects(
    () => saveAiProviderSettings({ models: { groq: 'llama latest' } }),
    /Invalid model name/
  );
});
