import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { getStore } from '@netlify/blobs';

export const AI_PROVIDERS = ['gemini', 'groq', 'openrouter'] as const;
export type AiProviderId = typeof AI_PROVIDERS[number];
export type AiFallbackId = AiProviderId | 'rss-fallback';

type EncryptedSecret = { iv: string; tag: string; ciphertext: string };
type StoredSettings = {
  primaryProvider?: AiProviderId;
  fallbackProvider?: AiFallbackId;
  models?: Partial<Record<AiProviderId, string>>;
  encryptedKeys?: Partial<Record<AiProviderId, EncryptedSecret>>;
  updatedAt?: string;
};

type EffectiveConfig = {
  primaryProvider: AiProviderId;
  fallbackProvider: AiFallbackId;
  models: Record<AiProviderId, string>;
  keys: Partial<Record<AiProviderId, string>>;
};

const STORE_NAME = 'humayro-ai-settings';
const STORE_KEY = 'provider-manager-v1';
const ENV_KEY_NAMES: Record<AiProviderId, string> = {
  gemini: 'GEMINI_API_KEY',
  groq: 'GROQ_API_KEY',
  openrouter: 'OPENROUTER_API_KEY'
};
const MODEL_ENV_NAMES: Record<AiProviderId, string> = {
  gemini: 'AI_MODEL_GEMINI',
  groq: 'AI_MODEL_GROQ',
  openrouter: 'AI_MODEL_OPENROUTER'
};
const DEFAULT_MODELS: Record<AiProviderId, string> = {
  gemini: 'gemini-3.1-flash-lite',
  groq: 'llama-3.3-70b-versatile',
  openrouter: 'openai/gpt-4o-mini'
};
const DEFAULT_MODEL_CANDIDATES: Record<AiProviderId, string[]> = {
  gemini: ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'],
  groq: ['llama-3.3-70b-versatile'],
  openrouter: ['openai/gpt-4o-mini']
};

let localRecord: StoredSettings | null = null;

function isProvider(value: unknown): value is AiProviderId {
  return typeof value === 'string' && AI_PROVIDERS.includes(value as AiProviderId);
}

function isFallbackProvider(value: unknown): value is AiFallbackId {
  return value === 'rss-fallback' || isProvider(value);
}

function isEncryptionReady(): boolean {
  const value = process.env.AI_SETTINGS_ENCRYPTION_KEY;
  return typeof value === 'string' && value.trim().length >= 32;
}

function encryptionKey(): Buffer {
  const secret = process.env.AI_SETTINGS_ENCRYPTION_KEY;
  if (!secret || secret.trim().length < 32) {
    throw new Error('AI_SETTINGS_ENCRYPTION_KEY must be at least 32 characters.');
  }
  return createHash('sha256').update(secret, 'utf8').digest();
}

function encryptApiKey(value: string): EncryptedSecret {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return {
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    ciphertext: ciphertext.toString('base64')
  };
}

function decryptApiKey(value: EncryptedSecret): string {
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(value.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(value.tag, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(value.ciphertext, 'base64')),
    decipher.final()
  ]).toString('utf8');
}

function canDecryptApiKey(value: EncryptedSecret | undefined): boolean {
  if (!value || !isEncryptionReady()) return false;
  try {
    return Boolean(decryptApiKey(value));
  } catch {
    return false;
  }
}

async function readStoredSettings(): Promise<StoredSettings | null> {
  if (!process.env.NETLIFY) return localRecord;
  try {
    const store = getStore({ name: STORE_NAME, consistency: 'strong' });
    const record = await store.get(STORE_KEY, { type: 'json' });
    return record && typeof record === 'object' ? record as StoredSettings : null;
  } catch {
    throw new Error('AI settings storage is unavailable. Check Netlify Blobs configuration.');
  }
}

async function writeStoredSettings(record: StoredSettings): Promise<void> {
  if (!process.env.NETLIFY) {
    localRecord = record;
    return;
  }
  try {
    const store = getStore({ name: STORE_NAME, consistency: 'strong' });
    await store.setJSON(STORE_KEY, record);
  } catch {
    throw new Error('AI settings could not be saved to persistent storage.');
  }
}

function envApiKey(provider: AiProviderId): string | undefined {
  const value = process.env[ENV_KEY_NAMES[provider]];
  return value && value.trim() ? value.trim() : undefined;
}

function envModel(provider: AiProviderId): string | undefined {
  const value = process.env[MODEL_ENV_NAMES[provider]];
  return value && value.trim() ? value.trim() : undefined;
}

function providerHasEnvironmentKey(provider: AiProviderId): boolean {
  return Boolean(envApiKey(provider));
}

function primaryFromEnvironment(): AiProviderId | undefined {
  return isProvider(process.env.AI_PROVIDER) ? process.env.AI_PROVIDER : undefined;
}

function fallbackFromEnvironment(): AiFallbackId | undefined {
  return isFallbackProvider(process.env.FALLBACK_AI_PROVIDER) ? process.env.FALLBACK_AI_PROVIDER : undefined;
}

async function getEffectiveConfig(): Promise<EffectiveConfig> {
  const stored = await readStoredSettings();
  const keys: Partial<Record<AiProviderId, string>> = {};
  for (const provider of AI_PROVIDERS) {
    const encrypted = stored?.encryptedKeys?.[provider];
    if (encrypted && isEncryptionReady()) {
      try {
        keys[provider] = decryptApiKey(encrypted);
        continue;
      } catch {
        // If a managed key cannot be decrypted after a secret rotation, keep the
        // deployment environment key as a safe fallback instead of breaking all AI requests.
      }
    }
    const key = envApiKey(provider);
    if (key) keys[provider] = key;
  }

  const primaryProvider = stored?.primaryProvider
    ?? primaryFromEnvironment()
    ?? AI_PROVIDERS.find(provider => Boolean(keys[provider]))
    ?? 'gemini';
  const fallbackProvider = stored?.fallbackProvider
    ?? fallbackFromEnvironment()
    ?? AI_PROVIDERS.find(provider => provider !== primaryProvider && Boolean(keys[provider]))
    ?? 'rss-fallback';

  const models = {} as Record<AiProviderId, string>;
  for (const provider of AI_PROVIDERS) {
    models[provider] = stored?.models?.[provider] || envModel(provider) || DEFAULT_MODELS[provider];
  }

  return { primaryProvider, fallbackProvider, models, keys };
}

export async function getAiProviderManagerSummary() {
  const stored = await readStoredSettings();
  const primaryProvider = stored?.primaryProvider
    ?? primaryFromEnvironment()
    ?? AI_PROVIDERS.find(provider => providerHasEnvironmentKey(provider))
    ?? 'gemini';
  const fallbackProvider = stored?.fallbackProvider
    ?? fallbackFromEnvironment()
    ?? AI_PROVIDERS.find(provider => provider !== primaryProvider && (
      Boolean(stored?.encryptedKeys?.[provider]) || providerHasEnvironmentKey(provider)
    ))
    ?? 'rss-fallback';

  const providers = {} as Record<AiProviderId, {
    configured: boolean;
    keySource: 'managed' | 'environment' | 'none';
    model: string;
    ready: boolean;
  }>;

  for (const provider of AI_PROVIDERS) {
    const encryptedKey = stored?.encryptedKeys?.[provider];
    const managedKey = Boolean(encryptedKey);
    const managedKeyUsable = canDecryptApiKey(encryptedKey);
    const environmentKey = providerHasEnvironmentKey(provider);
    const keySource = managedKeyUsable ? 'managed' : environmentKey ? 'environment' : managedKey ? 'managed' : 'none';
    const ready = managedKeyUsable || environmentKey;
    providers[provider] = {
      configured: ready,
      keySource,
      model: stored?.models?.[provider] || envModel(provider) || DEFAULT_MODELS[provider],
      ready
    };
  }

  return {
    primaryProvider,
    fallbackProvider,
    providers,
    encryptionReady: isEncryptionReady(),
    storageMode: process.env.NETLIFY ? 'netlify-blobs' : 'local-memory',
    updatedAt: stored?.updatedAt ?? null
  };
}

export async function getAiProviderInfo() {
  const settings = await getAiProviderManagerSummary();
  return {
    primary: settings.primaryProvider,
    fallback: settings.fallbackProvider,
    geminiReady: settings.providers.gemini.ready,
    groqReady: settings.providers.groq.ready,
    openRouterReady: settings.providers.openrouter.ready
  };
}

export async function saveAiProviderSettings(input: unknown) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Invalid settings payload.');
  }
  const body = input as Record<string, unknown>;
  const stored = await readStoredSettings() ?? {};
  const next: StoredSettings = {
    ...stored,
    models: { ...(stored.models ?? {}) },
    encryptedKeys: { ...(stored.encryptedKeys ?? {}) }
  };

  if (body.primaryProvider !== undefined) {
    if (!isProvider(body.primaryProvider)) throw new Error('Choose a supported primary AI provider.');
    next.primaryProvider = body.primaryProvider;
  }
  if (body.fallbackProvider !== undefined) {
    if (!isFallbackProvider(body.fallbackProvider)) throw new Error('Choose a supported fallback provider.');
    next.fallbackProvider = body.fallbackProvider;
  }

  if (body.models !== undefined) {
    if (!body.models || typeof body.models !== 'object' || Array.isArray(body.models)) {
      throw new Error('Invalid model settings.');
    }
    const models = body.models as Record<string, unknown>;
    for (const provider of AI_PROVIDERS) {
      if (!(provider in models)) continue;
      const model = models[provider];
      if (typeof model !== 'string') {
        throw new Error(`Invalid model name for ${provider}.`);
      }
      if (!model.trim()) {
        delete next.models![provider];
        continue;
      }
      if (!/^[A-Za-z0-9._:/-]{1,160}$/.test(model.trim())) {
        throw new Error(`Invalid model name for ${provider}.`);
      }
      next.models![provider] = model.trim();
    }
  }

  if (body.apiKeys !== undefined) {
    if (!body.apiKeys || typeof body.apiKeys !== 'object' || Array.isArray(body.apiKeys)) {
      throw new Error('Invalid API keys payload.');
    }
    const apiKeys = body.apiKeys as Record<string, unknown>;
    for (const provider of AI_PROVIDERS) {
      const value = apiKeys[provider];
      if (value === undefined || value === null || value === '') continue;
      if (typeof value !== 'string' || value.trim().length < 8 || value.trim().length > 4096) {
        throw new Error(`Invalid API key value for ${provider}.`);
      }
      next.encryptedKeys![provider] = encryptApiKey(value.trim());
    }
  }

  if (body.removeKeys !== undefined) {
    if (!Array.isArray(body.removeKeys) || !body.removeKeys.every(isProvider)) {
      throw new Error('Invalid API key removal request.');
    }
    for (const provider of body.removeKeys) delete next.encryptedKeys![provider];
  }

  next.updatedAt = new Date().toISOString();
  await writeStoredSettings(next);
  return getAiProviderManagerSummary();
}

async function requestProvider(
  provider: AiProviderId,
  apiKey: string,
  model: string,
  prompt: string
): Promise<string> {
  if (provider === 'gemini') {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return response.text || '';
  }

  const endpoint = provider === 'groq'
    ? 'https://api.groq.com/openai/v1/chat/completions'
    : 'https://openrouter.ai/api/v1/chat/completions';
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
  if (provider === 'openrouter' && process.env.APP_URL) {
    headers['HTTP-Referer'] = process.env.APP_URL;
    headers['X-Title'] = 'HUMAYRO';
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 2600,
      response_format: { type: 'json_object' }
    }),
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    // Do not include provider response bodies because some vendors echo sensitive request data.
    throw new Error(`Provider HTTP ${response.status}`);
  }
  const data = await response.json() as {
    choices?: Array<{ message?: { content?: string | Array<{ type?: string; text?: string }> } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.map(part => part.text || '').join('');
  return '';
}

export async function testAiProviderConnection(
  providerValue: unknown,
  apiKeyInput?: unknown,
  modelInput?: unknown
) {
  if (!isProvider(providerValue)) throw new Error('Choose a supported AI provider.');
  const provider = providerValue;
  const config = await getEffectiveConfig();
  const apiKey = typeof apiKeyInput === 'string' && apiKeyInput.trim()
    ? apiKeyInput.trim()
    : config.keys[provider];
  const model = typeof modelInput === 'string' && /^[A-Za-z0-9._:/-]{1,160}$/.test(modelInput.trim())
    ? modelInput.trim()
    : config.models[provider];

  if (!apiKey) return { success: false, provider, latencyMs: 0, error: 'API key is not configured.' };

  const started = Date.now();
  try {
    const responseText = await requestProvider(
      provider,
      apiKey,
      model,
      'Return only this JSON object: {"ok":true,"service":"HUMAYRO connection test"}'
    );
    if (!responseText.trim()) {
      return { success: false, provider, latencyMs: Date.now() - started, error: 'Provider returned an empty response.' };
    }
    return { success: true, provider, model, latencyMs: Date.now() - started, message: 'Valid response received.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const status = message.match(/HTTP (\d{3})/)?.[1];
    const friendly = status === '401' || status === '403'
      ? 'Authentication failed. Check the API key and permissions.'
      : status === '429'
        ? 'Provider rate limit or quota reached.'
        : 'Connection failed. Check the API key, model name, and provider status.';
    return { success: false, provider, model, latencyMs: Date.now() - started, error: friendly };
  }
}

export async function* generateAiJsonResponses(prompt: string): AsyncGenerator<{
  provider: AiProviderId;
  model: string;
  responseText: string;
}> {
  let config: EffectiveConfig;
  try {
    config = await getEffectiveConfig();
  } catch (error) {
    console.warn('[AI] Provider configuration could not be loaded.');
    return;
  }

  // Honor the selected fallback explicitly. If RSS fallback is selected, do not silently
  // spend credits on any other configured provider after the primary one fails.
  const ordered = [...new Set<AiProviderId>([
    config.primaryProvider,
    ...(isProvider(config.fallbackProvider) ? [config.fallbackProvider] : [])
  ])];

  for (const provider of ordered) {
    const apiKey = config.keys[provider];
    if (!apiKey) continue;

    const defaultCandidates = DEFAULT_MODEL_CANDIDATES[provider];
    const modelCandidates = [...new Set([config.models[provider], ...defaultCandidates])];
    for (const model of modelCandidates) {
      try {
        const responseText = await requestProvider(provider, apiKey, model, prompt);
        if (responseText.trim()) yield { provider, model, responseText };
      } catch {
        console.warn(`[AI] ${provider} model ${model} failed; trying the next configured option.`);
      }
    }
  }
}
