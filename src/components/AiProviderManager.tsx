import React, { useEffect, useState } from 'react';
import { Activity, CheckCircle2, CircleAlert, ExternalLink, KeyRound, LoaderCircle, Save, ShieldCheck, XCircle } from 'lucide-react';
import {
  fetchSystemAiSettings,
  saveSystemAiSettings,
  testSystemAiProvider,
  type AiProviderManagerSettings,
  type AiProviderId
} from '../services/api';

interface AiProviderManagerProps {
  token: string;
}

const PROVIDERS: Array<{
  id: AiProviderId;
  name: string;
  description: string;
  keyLabel: string;
  dashboardUrl: string;
}> = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Chuqur tahlil va strukturali JSON javoblar',
    keyLabel: 'Gemini API key',
    dashboardUrl: 'https://aistudio.google.com/apikey'
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Tezkor OpenAI-compatible inference',
    keyLabel: 'Groq API key',
    dashboardUrl: 'https://console.groq.com/keys'
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Bir nechta model provayderlari uchun yagona gateway',
    keyLabel: 'OpenRouter API key',
    dashboardUrl: 'https://openrouter.ai/keys'
  }
];

export const AiProviderManager: React.FC<AiProviderManagerProps> = ({ token }) => {
  const [settings, setSettings] = useState<AiProviderManagerSettings | null>(null);
  const [draftKeys, setDraftKeys] = useState<Partial<Record<AiProviderId, string>>>({});
  const [models, setModels] = useState<Partial<Record<AiProviderId, string>>>({});
  const [primaryProvider, setPrimaryProvider] = useState<AiProviderId>('gemini');
  const [fallbackProvider, setFallbackProvider] = useState<AiProviderId | 'rss-fallback'>('rss-fallback');
  const [testing, setTesting] = useState<AiProviderId | null>(null);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState<AiProviderId | null>(null);
  const [tests, setTests] = useState<Partial<Record<AiProviderId, { success: boolean; message: string; latencyMs?: number }>>>({});
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const applySettings = (next: AiProviderManagerSettings) => {
    setSettings(next);
    setPrimaryProvider(next.primaryProvider);
    setFallbackProvider(next.fallbackProvider);
    setModels({
      gemini: next.providers.gemini.model,
      groq: next.providers.groq.model,
      openrouter: next.providers.openrouter.model
    });
  };

  const loadSettings = async () => {
    setError(null);
    try {
      const next = await fetchSystemAiSettings(token);
      applySettings(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'AI sozlamalarini yuklab bo‘lmadi.');
    }
  };

  useEffect(() => {
    void loadSettings();
  }, [token]);

  const testConnection = async (provider: AiProviderId) => {
    setTesting(provider);
    setError(null);
    setMessage(null);
    try {
      const result = await testSystemAiProvider(token, {
        provider,
        apiKey: draftKeys[provider]?.trim() || undefined,
        model: models[provider]
      });
      const success = Boolean(result.success);
      setTests(prev => ({
        ...prev,
        [provider]: {
          success,
          message: result.message || result.error || (success ? 'Ulanish muvaffaqiyatli.' : 'Ulanish bajarilmadi.'),
          latencyMs: result.latencyMs
        }
      }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Provayderni tekshirib bo‘lmadi.';
      setTests(prev => ({ ...prev, [provider]: { success: false, message: msg } }));
    } finally {
      setTesting(null);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const apiKeys: Partial<Record<AiProviderId, string>> = {};
      for (const provider of PROVIDERS) {
        const value = draftKeys[provider.id]?.trim();
        if (value) apiKeys[provider.id] = value;
      }
      const next = await saveSystemAiSettings(token, {
        primaryProvider,
        fallbackProvider,
        models: {
          gemini: models.gemini || '',
          groq: models.groq || '',
          openrouter: models.openrouter || ''
        },
        apiKeys
      });
      applySettings(next);
      setDraftKeys({});
      setMessage('AI sozlamalari saqlandi. Kalitlar qayta ko‘rsatilmaydi.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'AI sozlamalarini saqlab bo‘lmadi.');
    } finally {
      setSaving(false);
    }
  };

  const removeManagedKey = async (provider: AiProviderId) => {
    if (!settings?.providers[provider] || settings.providers[provider].keySource !== 'managed') return;
    const confirmed = window.confirm(`HUMAYRO ichida saqlangan ${provider} kalitini o‘chirishni tasdiqlaysizmi?`);
    if (!confirmed) return;
    setRemoving(provider);
    setError(null);
    setMessage(null);
    try {
      const next = await saveSystemAiSettings(token, { removeKeys: [provider] });
      applySettings(next);
      setMessage(`${provider} uchun saqlangan kalit o‘chirildi. Environment variable orqali ulangan kalit saqlanib qolishi mumkin.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kalitni o‘chirib bo‘lmadi.');
    } finally {
      setRemoving(null);
    }
  };

  return (
    <section className="rounded-2xl border border-(--accent)/25 bg-[#111318] p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-(--accent)/15 text-(--accent) flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white">AI Provider Manager</h4>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Gemini, Groq va OpenRouter kalitlari, modellar hamda zaxira provayderni boshqarish.
          </p>
        </div>
        <span className="text-[9px] uppercase tracking-wider rounded-md px-2 py-1 border border-white/10 text-zinc-400 whitespace-nowrap">
          Admin only
        </span>
      </div>

      {settings && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="text-xs text-zinc-400 flex flex-col gap-1.5">
              Asosiy AI provayder
              <select
                value={primaryProvider}
                onChange={e => setPrimaryProvider(e.target.value as AiProviderId)}
                className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-(--accent)"
              >
                {PROVIDERS.map(provider => <option key={provider.id} value={provider.id}>{provider.name}</option>)}
              </select>
            </label>
            <label className="text-xs text-zinc-400 flex flex-col gap-1.5">
              Zaxira AI
              <select
                value={fallbackProvider}
                onChange={e => setFallbackProvider(e.target.value as AiProviderId | 'rss-fallback')}
                className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-(--accent)"
              >
                <option value="rss-fallback">RSS fallback (AI kalitisiz)</option>
                {PROVIDERS.filter(provider => provider.id !== primaryProvider).map(provider => (
                  <option key={provider.id} value={provider.id}>{provider.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-3 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div className="text-[11px] leading-relaxed text-zinc-400">
              <div className="text-zinc-200 font-semibold">Maxfiy kalitlar</div>
              Kalitlar frontend localStorage’da saqlanmaydi va qayta o‘qish uchun UI’ga qaytarilmaydi.
              Serverda AES-256-GCM bilan shifrlash uchun <code className="text-zinc-200">AI_SETTINGS_ENCRYPTION_KEY</code> kerak.
              Saqlash: <span className="text-zinc-200">{settings.storageMode === 'netlify-blobs' ? 'Netlify Blobs (doimiy)' : 'Local memory (restartdan keyin yo‘qoladi)'}</span>.
              {!settings.encryptionReady && (
                <span className="block text-amber-300 mt-1">
                  Hozir shifrlash kaliti sozlanmagan. API kalitini ulanish uchun tekshirishingiz mumkin, ammo saqlashdan oldin hosting environment variables’da kamida 32 belgili AI_SETTINGS_ENCRYPTION_KEY kiriting.
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {PROVIDERS.map(provider => {
              const status = settings.providers[provider.id];
              const test = tests[provider.id];
              const draft = Boolean(draftKeys[provider.id]?.trim());
              return (
                <div key={provider.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 sm:p-4 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2 items-start justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{provider.name}</span>
                        {status.ready ? (
                          <span className="text-[10px] text-emerald-300 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Ulangan</span>
                        ) : (
                          <span className="text-[10px] text-amber-300 flex items-center gap-1"><CircleAlert className="w-3 h-3" /> Kalit kerak</span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1">{provider.description}</p>
                    </div>
                    <a
                      href={provider.dashboardUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-(--accent) inline-flex items-center gap-1 hover:underline"
                    >
                      API key olish <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <label className="text-[11px] text-zinc-400 flex flex-col gap-1.5">
                    {provider.keyLabel}
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        autoComplete="new-password"
                        spellCheck={false}
                        value={draftKeys[provider.id] || ''}
                        onChange={e => setDraftKeys(prev => ({ ...prev, [provider.id]: e.target.value }))}
                        placeholder={status.ready ? 'Saqlangan kalit bor — almashtirish uchun yangisini kiriting' : 'API kalitini kiriting'}
                        className="w-full rounded-lg bg-black/40 border border-white/10 pl-9 pr-3 py-2.5 text-xs text-white font-mono outline-none focus:border-(--accent)"
                      />
                    </div>
                    <span className="text-[10px] text-zinc-600">
                      {status.keySource === 'managed' ? 'HUMAYRO’da shifrlangan holda saqlangan' : status.keySource === 'environment' ? 'Hosting environment variable’dan olinmoqda' : 'Hozircha kalit topilmadi'}
                    </span>
                  </label>

                  <label className="text-[11px] text-zinc-400 flex flex-col gap-1.5">
                    Model ID
                    <input
                      value={models[provider.id] || ''}
                      onChange={e => setModels(prev => ({ ...prev, [provider.id]: e.target.value }))}
                      placeholder={provider.id === 'gemini' ? 'gemini-3.1-flash-lite' : provider.id === 'groq' ? 'llama-3.3-70b-versatile' : 'openai/gpt-4o-mini'}
                      className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-xs text-white font-mono outline-none focus:border-(--accent)"
                    />
                  </label>

                  {test && (
                    <div className={`text-[11px] flex items-start gap-2 ${test.success ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {test.success ? <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                      <span>{test.message}{test.latencyMs !== undefined ? ` · ${test.latencyMs} ms` : ''}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void testConnection(provider.id)}
                      disabled={testing !== null}
                      className="rounded-lg border border-white/10 px-3 py-2 text-[11px] text-zinc-200 hover:bg-white/5 disabled:opacity-50 inline-flex items-center gap-1.5"
                    >
                      {testing === provider.id ? <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
                      Ulanishni tekshirish
                    </button>
                    {status.keySource === 'managed' && (
                      <button
                        type="button"
                        onClick={() => void removeManagedKey(provider.id)}
                        disabled={removing !== null}
                        className="rounded-lg border border-rose-400/20 px-3 py-2 text-[11px] text-rose-300 hover:bg-rose-400/5 disabled:opacity-50"
                      >
                        {removing === provider.id ? 'O‘chirilmoqda…' : 'Saqlangan kalitni o‘chirish'}
                      </button>
                    )}
                    {draft && <span className="text-[10px] text-amber-300">Yangi kalit saqlanmagan</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-[11px] text-zinc-400 leading-relaxed">
            <div className="text-zinc-200 font-semibold mb-1">Sarf va limitlar</div>
            HUMAYRO provayderlar kesimida faol model va ulanish holatini ko‘rsatadi. To‘lovga ta’sir qiladigan tokenlar va aniq xarajatlar provayderga bog‘liq; ishonchli billing summasini tegishli provayder dashboardidan tekshiring.
          </div>

          {error && <p role="alert" className="text-xs text-rose-300">{error}</p>}
          {message && <p role="status" className="text-xs text-emerald-300">{message}</p>}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-[10px] text-zinc-600">Yangilangan: {settings.updatedAt ? new Date(settings.updatedAt).toLocaleString() : 'hali saqlanmagan'}</p>
            <button
              type="button"
              onClick={() => void saveSettings()}
              disabled={saving || Object.values(draftKeys).some(value => Boolean(value?.trim())) && !settings.encryptionReady}
              className="rounded-full bg-(--accent) text-black px-5 py-2.5 text-xs font-bold hover:brightness-110 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {saving ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Sozlamalarni saqlash
            </button>
          </div>
        </>
      )}

      {!settings && !error && (
        <div className="py-6 text-xs text-zinc-500 inline-flex items-center justify-center gap-2">
          <LoaderCircle className="w-4 h-4 animate-spin" /> AI provider sozlamalari yuklanmoqda…
        </div>
      )}
      {error && !settings && <p role="alert" className="text-xs text-rose-300">{error}</p>}
    </section>
  );
};
