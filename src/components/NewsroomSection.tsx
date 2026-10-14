import React, { useCallback, useEffect, useState } from 'react';
import { ExternalLink, Newspaper, RefreshCw } from 'lucide-react';
import type { SupportedLanguage } from '../types';
import {
  fetchNewsroom,
  fetchNewsroomAgents,
  NewsroomAgent,
  NewsroomPost,
  NewsroomResult
} from '../services/newsroomApi';

const STORAGE_KEY = 'humayro.newsroom.prefs';

const COUNTRY_OPTIONS = [
  { code: 'UZ', label: 'O‘zbekiston' },
  { code: 'KZ', label: 'Qozog‘iston' },
  { code: 'KG', label: 'Qirg‘iziston' },
  { code: 'TJ', label: 'Tojikiston' },
  { code: 'TM', label: 'Turkmaniston' },
  { code: 'AZ', label: 'Ozarbayjon' },
  { code: 'TR', label: 'Turkiya' },
  { code: 'RU', label: 'Rossiya' },
  { code: 'KR', label: 'Janubiy Koreya' },
  { code: 'SA', label: 'Saudiya Arabistoni' },
  { code: 'IR', label: 'Eron' },
  { code: 'US', label: 'AQSH' },
  { code: 'GB', label: 'Buyuk Britaniya' }
];

const TOPIC_OPTIONS = [
  { id: 'iqtisodiyot', label: 'Iqtisodiyot' },
  { id: 'texnologiya', label: 'Texnologiya' },
  { id: 'energiya', label: 'Energiya' },
  { id: 'siyosat', label: 'Siyosat' },
  { id: 'fan', label: 'Fan' }
];

const CONFIDENCE_LABEL: Record<NewsroomPost['confidence'], string> = {
  high: 'Yuqori ishonch',
  medium: 'O‘rta ishonch',
  low: 'Past ishonch'
};

const ACCENT_CLASSES: Record<NewsroomAgent['accent'], { chip: string; badge: string; active: string }> = {
  sky: {
    chip: 'bg-[#A3AAB6]/15 text-[#A3AAB6] border-[#A3AAB6]/30',
    badge: 'text-[#A3AAB6] bg-[#A3AAB6]/10',
    active: 'border-[#A3AAB6]/50 bg-[#A3AAB6]/[0.08]'
  },
  orange: {
    chip: 'bg-[#FF00AE]/15 text-[#FF00AE] border-[#FF00AE]/30',
    badge: 'text-[#FF00AE] bg-[#FF00AE]/10',
    active: 'border-[#FF00AE]/50 bg-[#FF00AE]/[0.08]'
  },
  violet: {
    chip: 'bg-[#A3AAB6]/15 text-[#A3AAB6] border-[#A3AAB6]/30',
    badge: 'text-[#A3AAB6] bg-[#A3AAB6]/10',
    active: 'border-[#A3AAB6]/50 bg-[#A3AAB6]/[0.08]'
  },
  emerald: {
    chip: 'bg-[#C1FF1A]/15 text-[#C1FF1A] border-[#C1FF1A]/30',
    badge: 'text-[#C1FF1A] bg-[#C1FF1A]/10',
    active: 'border-[#C1FF1A]/50 bg-[#C1FF1A]/[0.08]'
  }
};

interface Prefs {
  country: string;
  topics: string[];
}

function guessCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.startsWith('Asia/Tashkent') || tz.startsWith('Asia/Samarkand')) return 'UZ';
    if (tz === 'Asia/Almaty') return 'KZ';
    if (tz === 'Asia/Seoul') return 'KR';
    if (tz === 'Europe/Istanbul') return 'TR';
  } catch {
    // Fall through to the default.
  }
  return 'UZ';
}

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Prefs;
      if (parsed && typeof parsed.country === 'string' && Array.isArray(parsed.topics)) return parsed;
    }
  } catch {
    // Ignore corrupt storage.
  }
  return { country: guessCountry(), topics: [] };
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export const NewsroomSection: React.FC<{ currentLang: SupportedLanguage }> = ({ currentLang }) => {
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);
  const [agents, setAgents] = useState<NewsroomAgent[]>([]);
  const [result, setResult] = useState<NewsroomResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<string>('all');

  useEffect(() => {
    fetchNewsroomAgents().then(setAgents);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Storage may be unavailable (private mode); preferences then last only for this visit.
    }
  }, [prefs]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await fetchNewsroom(prefs.country, currentLang, prefs.topics);
    if (response.ok) {
      setResult(response.data);
    } else {
      setError(response.error);
    }
    setLoading(false);
  }, [prefs, currentLang]);

  // Changing country, topics or language triggers a fetch. Cache hits on the server are free.
  useEffect(() => {
    load();
  }, [load]);

  const toggleTopic = (id: string) => {
    setPrefs(p => ({
      ...p,
      topics: p.topics.includes(id) ? p.topics.filter(t => t !== id) : [...p.topics, id]
    }));
  };

  const posts = (result?.posts || []).filter(p => activeAgent === 'all' || p.agentId === activeAgent);

  return (
    <section id="newsroom" className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/[0.08] bg-[#0C1118] p-4 sm:p-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#FF00AE]/20 bg-[#FF00AE]/[0.08] text-[#FF00AE]">
              <Newspaper size={22} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-['Space_Grotesk'] text-lg font-semibold tracking-[0.08em] text-[#F5F7FA]">
                  Muxbirlar xonasi
                </h2>
                <span className="rounded border border-white/10 px-2 py-0.5 font-mono text-[9px] tracking-[0.16em] text-slate-400">
                  AI
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Sizning mamlakatingiz va mavzularingiz bo‘yicha AI muxbirlar tahlili
              </p>
            </div>
          </div>
          <button
            onClick={() => load()}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-white/[0.1] px-3 py-2 text-[11px] text-slate-300 hover:border-white/25 disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Yangilash
          </button>
        </header>

        <div className="mt-5 grid gap-3 md:grid-cols-[220px_1fr]">
          <label className="flex flex-col gap-1 text-[11px] text-slate-400">
            Mamlakat
            <select
              value={prefs.country}
              onChange={e => setPrefs(p => ({ ...p, country: e.target.value }))}
              className="rounded-lg border border-white/[0.1] bg-[#05070A] px-3 py-2 text-sm text-slate-200"
            >
              {COUNTRY_OPTIONS.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </label>
          <div className="flex flex-col gap-1 text-[11px] text-slate-400">
            Mavzular (tanlamasangiz, umumiy)
            <div className="flex flex-wrap gap-2 pt-1">
              {TOPIC_OPTIONS.map(t => {
                const on = prefs.topics.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleTopic(t.id)}
                    className={
                      'rounded-full border px-3 py-1.5 text-[11px] transition-colors ' +
                      (on ? 'border-[#FF00AE]/40 bg-[#FF00AE]/[0.1] text-[#FF00AE]' : 'border-white/[0.08] text-slate-400 hover:text-slate-200')
                    }
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {agents.length > 0 && (
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveAgent('all')}
              className={
                'shrink-0 rounded-xl border px-4 py-3 text-left text-[11px] transition-colors ' +
                (activeAgent === 'all' ? 'border-white/30 bg-white/[0.06] text-white' : 'border-white/[0.08] text-slate-400')
              }
            >
              Barcha muxbirlar
            </button>
            {agents.map(a => {
              const cls = ACCENT_CLASSES[a.accent];
              const active = activeAgent === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => setActiveAgent(a.id)}
                  className={'flex min-w-[200px] shrink-0 items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ' + (active ? cls.active : 'border-white/[0.08] hover:border-white/20')}
                >
                  <span className={'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] font-semibold ' + cls.chip}>
                    {a.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold text-slate-200">{a.name}</span>
                    <span className="block truncate text-[10px] text-slate-500">{a.role}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-5 space-y-4">
          {loading && !result && (
            <p className="py-8 text-center text-xs text-slate-500">Muxbirlar yangiliklarni o‘qimoqda…</p>
          )}

          {error && (
            <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.05] p-4 text-xs text-rose-300">{error}</div>
          )}

          {!loading && !error && result && result.posts.length === 0 && (
            <p className="py-8 text-center text-xs text-slate-500">
              Hozircha tekshirilgan manbali post chiqmadi. Boshqa mamlakat yoki mavzu sinab ko‘ring.
            </p>
          )}

          {posts.map(post => {
            const agent = agents.find(a => a.id === post.agentId);
            const cls = agent ? ACCENT_CLASSES[agent.accent] : ACCENT_CLASSES.sky;
            return (
              <article key={post.id} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                  <span className="flex items-center gap-2">
                    <span className={'rounded px-2 py-0.5 font-semibold ' + cls.badge}>{post.agentName}</span>
                    {agent && <span>{agent.role}</span>}
                  </span>
                  <span className="font-mono">{new Date(post.createdAt).toLocaleString()}</span>
                </div>

                <h3 className="mt-3 text-sm font-semibold leading-relaxed text-slate-100">{post.headline}</h3>

                <div className="mt-3">
                  <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-500">FAKTLAR</p>
                  <ul className="mt-1.5 list-disc space-y-1 ps-5 text-xs leading-relaxed text-slate-300">
                    {post.facts.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.sourceUrls.map(u => (
                      <a
                        key={u}
                        href={u}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded border border-white/[0.08] px-2 py-1 text-[10px] text-[#A3AAB6] hover:border-[#A3AAB6]/30"
                      >
                        <ExternalLink size={10} /> {hostOf(u)}
                      </a>
                    ))}
                  </div>
                </div>

                {post.analysis && (
                  <div className="mt-4 rounded-lg border border-white/[0.06] bg-[#05070A] p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-500">MUXBIR TAHLILI (AI FIKRI)</p>
                      <span className="font-mono text-[10px] text-slate-500">{CONFIDENCE_LABEL[post.confidence]}</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">{post.analysis}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <p className="mt-6 border-t border-white/[0.06] pt-4 text-[10px] leading-relaxed text-slate-600">
          Bu bo‘lim AI tomonidan yaratiladi. Faktlarni asl manbada tekshirib chiqing. Muxbir tahlili faqat fikr hisoblanadi.
        </p>
      </div>
    </section>
  );
};

export default NewsroomSection;
