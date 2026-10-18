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


test('Groq adapter sends an authenticated chat-completions API request', async () => {
  const originalFetch = globalThis.fetch;
  let capturedUrl = '';
  let capturedInit: RequestInit | undefined;
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    capturedUrl = String(input);
    capturedInit = init;
    return new Response(JSON.stringify({
      choices: [{ message: { content: '{"ok":true,"service":"HUMAYRO connection test"}' } }]
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  }) as typeof fetch;

  try {
    const result = await (await import('./aiProviderManager.ts')).testAiProviderConnection(
      'groq',
      'groq-mock-api-key',
      'llama-3.3-70b-versatile'
    );
    assert.equal(result.success, true);
    assert.equal(capturedUrl, 'https://api.groq.com/openai/v1/chat/completions');
    assert.equal((capturedInit?.headers as Record<string, string>).Authorization, 'Bearer groq-mock-api-key');
    const body = JSON.parse(String(capturedInit?.body));
    assert.equal(body.model, 'llama-3.3-70b-versatile');
    assert.equal(body.response_format.type, 'json_object');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('OpenRouter adapter sends an authenticated chat-completions API request', async () => {
  const originalFetch = globalThis.fetch;
  let capturedUrl = '';
  let capturedInit: RequestInit | undefined;
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    capturedUrl = String(input);
    capturedInit = init;
    return new Response(JSON.stringify({
      choices: [{ message: { content: '{"ok":true,"service":"HUMAYRO connection test"}' } }]
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  }) as typeof fetch;

  try {
    const result = await (await import('./aiProviderManager.ts')).testAiProviderConnection(
      'openrouter',
      'openrouter-mock-api-key',
      'openai/gpt-4o-mini'
    );
    assert.equal(result.success, true);
    assert.equal(capturedUrl, 'https://openrouter.ai/api/v1/chat/completions');
    assert.equal((capturedInit?.headers as Record<string, string>).Authorization, 'Bearer openrouter-mock-api-key');
    const body = JSON.parse(String(capturedInit?.body));
    assert.equal(body.model, 'openai/gpt-4o-mini');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
