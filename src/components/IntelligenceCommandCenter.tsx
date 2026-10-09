import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, AlertTriangle, Archive, ArrowUpRight, CheckCircle2, ChevronRight, Globe2, Radar, RotateCcw, ShieldAlert, SlidersHorizontal, Sparkles, Trash2 } from 'lucide-react';
import { Article, AiSynthesisResponse, SupportedLanguage } from '../types';
import { synthesizeAiQuery, TrendingHotspotItem } from '../services/api';

type Region = 'global' | 'central-asia' | 'europe' | 'east-asia' | 'north-america' | 'middle-east' | 'africa' | 'south-america' | 'oceania';
type ResponseMode = 'investigate' | 'monitor' | 'contain' | 'escalate';

interface Signal {
  id: string;
  region: Region;
  title: string;
  area: string;
  type: string;
  risk: number;
  detail: string;
  time: string;
  article: Article;
}

interface Assessment {
  score: number;
  region: Region;
  mode: ResponseMode;
  time: string;
  summary: string;
  keyPoints: string[];
  recommendation: string;
  sourceCount: number;
}

interface ArchiveEntry {
  id: string;
  score: number;
  region: Region;
  mode: ResponseMode;
  time: string;
  summary: string;
}

export interface IntelligenceCommandCenterProps {
  articles: Article[];
  regionalArticles: Record<string, Article[]>;
  trendingHotspots: { uzbekistan: TrendingHotspotItem[]; global: TrendingHotspotItem[] };
  isRefreshing: boolean;
  lastUpdated: Date;
  currentLang: SupportedLanguage;
  onSelectArticle: (article: Article) => void;
}

const REGION_NAMES: Record<Region, string> = {
  global: 'Global',
  'central-asia': 'Markaziy Osiyo',
  europe: 'Yevropa',
  'east-asia': 'Sharqiy Osiyo',
  'north-america': 'Shimoliy Amerika',
  'middle-east': 'Yaqin Sharq',
  africa: 'Afrika',
  'south-america': 'Janubiy Amerika',
  oceania: 'Okeaniya'
};

const REGION_ORDER: Region[] = ['global', 'central-asia', 'europe', 'east-asia', 'north-america', 'middle-east', 'africa', 'south-america', 'oceania'];

const REGION_CODES: Partial<Record<Region, string>> = {
  'central-asia': 'CA',
  europe: 'EU',
  'east-asia': 'EA',
  'north-america': 'NA',
  'middle-east': 'ME',
  africa: 'AF',
  'south-america': 'SA',
  oceania: 'OC'
};

// Approximate pin positions on the schematic 600x310 map
const PIN_POS: Partial<Record<Region, { x: number; y: number }>> = {
  'north-america': { x: 110, y: 85 },
  'south-america': { x: 165, y: 215 },
  europe: { x: 330, y: 85 },
  africa: { x: 335, y: 180 },
  'middle-east': { x: 380, y: 125 },
  'central-asia': { x: 415, y: 95 },
  'east-asia': { x: 470, y: 105 },
  oceania: { x: 495, y: 225 }
};

const RESPONSE_OPTIONS: { key: ResponseMode; label: string; desc: string; recommendation: string }[] = [
  { key: 'investigate', label: 'Chuqur tekshiruv', desc: 'Dalillarni tahlil qilish', recommendation: 'Manbalarni solishtiring va asosiy sabablarni chuqur tekshiring.' },
  { key: 'monitor', label: 'Kuzatish', desc: 'Signalni kuzatishda davom etish', recommendation: 'Signalni kuzatishda davom eting; yangi dalil kelganda qayta baholang.' },
  { key: 'contain', label: 'Cheklash', desc: 'Ta’sirni kamaytirish chorasi', recommendation: 'Ta’sir doirasini aniqlang va ehtiyot choralarini baholang.' },
  { key: 'escalate', label: 'Yuqoriga yuborish', desc: 'Mutaxassisga yo‘naltirish', recommendation: 'Natijani mas’ul tahlilchi ko‘rib chiqishi uchun yuqori darajaga yuboring.' }
];
const RESPONSE_MAP = Object.fromEntries(RESPONSE_OPTIONS.map(o => [o.key, o])) as Record<ResponseMode, typeof RESPONSE_OPTIONS[number]>;

// Risk keywords (multilingual) used to score article severity
const RISK_WORDS = [
  'war', 'urush', 'attack', 'hujum', 'strike', 'zarba', 'missile', 'raketa', 'explosion', 'portlash',
  'sanction', 'sanksiya', 'crisis', 'inqiroz', 'default', 'tanglik', 'outage', 'uzilish', 'breach',
  'hack', 'kiberhujum', 'emergency', 'favqulodda', 'earthquake', 'zilzila', 'flood', 'toshqin',
  'protest', 'norozilik', 'casualt', 'halok', 'killed', 'evacuat', 'evakuatsiya', 'shutdown'
];

const STORAGE_KEY = 'humayro.commandCenter.archive.v1';
const MAX_ARCHIVE = 10;

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

const statusOf = (risk: number) => risk >= 85 ? 'KRITIK' : risk >= 70 ? 'YUQORI' : risk >= 50 ? 'O‘RTA' : 'PAST';
const riskTone = (risk: number) => risk >= 85 ? 'text-rose-300' : risk >= 70 ? 'text-orange-300' : 'text-sky-300';
const riskBar = (risk: number) => risk >= 85 ? 'bg-rose-400' : risk >= 70 ? 'bg-orange-400' : 'bg-sky-400';
const riskHex = (risk: number) => risk >= 85 ? '#FB7185' : risk >= 70 ? '#FB923C' : '#60A5FA';

const fmtTime = (value: Date | string | undefined) => {
  if (!value) return '--:--';
  const d = typeof value === 'string' ? new Date(value) : value;
  return isNaN(d.getTime()) ? '--:--' : d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
};

const articleRisk = (a: Article, now: number) => {
  const text = `${a.title} ${a.description || ''}`.toLowerCase();
  const hits = RISK_WORDS.filter(w => text.includes(w)).length;
  const ageHours = (now - new Date(a.publishedAt).getTime()) / 3_600_000;
  const recency = ageHours <= 6 ? 8 : ageHours <= 24 ? 4 : 0;
  return clamp(30 + Math.min(hits, 4) * 12 + recency + (a.isTrending ? 8 : 0));
};

const hotspotRisk = (h: TrendingHotspotItem) => {
  // Trend scores may arrive on a 0-1, 0-10 or 0-100 scale; normalise to 0-100
  const raw = Number(h.trendScore) || 0;
  const scaled = raw <= 1 ? raw * 100 : raw <= 10 ? raw * 10 : raw;
  return clamp(scaled);
};

const loadArchive = (): ArchiveEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_ARCHIVE) : [];
  } catch {
    return [];
  }
};

export const IntelligenceCommandCenter: React.FC<IntelligenceCommandCenterProps> = ({
  articles,
  regionalArticles,
  trendingHotspots,
  isRefreshing,
  lastUpdated,
  currentLang,
  onSelectArticle
}) => {
  const [region, setRegion] = useState<Region>('global');
  const [sensitivity, setSensitivity] = useState(65);
  const [response, setResponse] = useState<ResponseMode>('investigate');
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [assessLoading, setAssessLoading] = useState(false);
  const [assessError, setAssessError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [archive, setArchive] = useState<ArchiveEntry[]>(loadArchive);
  const requestRef = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(archive));
    } catch {
      // Storage unavailable (private mode / quota): archive stays in memory only
    }
  }, [archive]);

  // Build live signals from articles and trending hotspots
  const signals = useMemo<Signal[]>(() => {
    const regionOf = new Map<string, Region>();
    for (const [key, list] of Object.entries(regionalArticles)) {
      for (const a of list) if (!regionOf.has(a.id)) regionOf.set(a.id, key as Region);
    }

    const now = Date.now();
    const seen = new Set<string>();
    const out: Signal[] = [];

    for (const a of articles) {
      if (seen.has(a.id)) continue;
      seen.add(a.id);
      const r = regionOf.get(a.id) ?? 'global';
      out.push({
        id: a.id,
        region: r,
        title: a.title,
        area: REGION_NAMES[r],
        type: (a.category || 'YANGILIK').toUpperCase(),
        risk: articleRisk(a, now),
        detail: a.description || '',
        time: a.publishedAt,
        article: a
      });
    }

    for (const h of [...trendingHotspots.uzbekistan, ...trendingHotspots.global]) {
      const id = `trend-${h.id}`;
      if (seen.has(id)) continue;
      seen.add(id);
      const r: Region = h.region === 'uzbekistan' ? 'central-asia' : 'global';
      out.push({
        id,
        region: r,
        title: h.title,
        area: REGION_NAMES[r],
        type: (h.category || 'TREND').toUpperCase(),
        risk: hotspotRisk(h),
        detail: h.publicBuzzNote || '',
        time: '',
        article: {
          id,
          title: h.title,
          description: h.publicBuzzNote || '',
          url: '#',
          source: 'Trend',
          publishedAt: new Date().toISOString(),
          category: r
        }
      });
    }

    return out.sort((a, b) => b.risk - a.risk).slice(0, 60);
  }, [articles, regionalArticles, trendingHotspots]);

  const visible = useMemo(
    () => region === 'global' ? signals : signals.filter(s => s.region === region),
    [signals, region]
  );

  const countByRegion = useMemo(() => {
    const c: Partial<Record<Region, number>> = {};
    for (const s of signals) c[s.region] = (c[s.region] || 0) + 1;
    return c;
  }, [signals]);

  const maxRiskByRegion = useMemo(() => {
    const m: Partial<Record<Region, number>> = {};
    for (const s of signals) m[s.region] = Math.max(m[s.region] ?? 0, s.risk);
    return m;
  }, [signals]);

  const highestRisk = visible.length ? Math.max(...visible.map(s => s.risk)) : 0;
  const riskScore = clamp(highestRisk * (0.55 + sensitivity / 150));
  const liveSignalCount = signals.filter(s => s.region !== 'global').length;

  // Changing any parameter invalidates the previous assessment
  const changeRegion = (r: Region) => { setRegion(r); setAssessment(null); setSaved(false); };
  const changeSensitivity = (v: number) => { setSensitivity(v); setAssessment(null); setSaved(false); };
  const changeResponse = (m: ResponseMode) => { setResponse(m); setAssessment(null); setSaved(false); };

  const runAssessment = async () => {
    const reqId = ++requestRef.current;
    const top = visible.slice(0, 5);
    const query = `${REGION_NAMES[region]} hududi bo‘yicha xavf tahlili (${RESPONSE_MAP[response].label}). ` +
      `Signallar: ${top.map(s => s.title).join('; ') || 'aniq signal yo‘q'}. ` +
      `Xavf darajasi, asosiy sabablar va tavsiyalarni qisqa bering.`;

    setAssessLoading(true);
    setAssessError(null);
    setAssessment(null);
    setSaved(false);

    try {
      const res: AiSynthesisResponse = await synthesizeAiQuery(query, currentLang);
      if (reqId !== requestRef.current) return;
      setAssessment({
        score: riskScore,
        region,
        mode: response,
        time: new Date().toISOString(),
        summary: res.summary || '',
        keyPoints: (res.keyPoints || []).slice(0, 3),
        recommendation: RESPONSE_MAP[response].recommendation,
        sourceCount: res.sources?.length ?? 0
      });
    } catch (err: any) {
      if (reqId !== requestRef.current) return;
      setAssessError(err?.message || 'Tahlil bajarilmadi. Iltimos, qayta urinib ko‘ring.');
    } finally {
      if (reqId === requestRef.current) setAssessLoading(false);
    }
  };

  const reset = () => {
    requestRef.current++;
    setRegion('global');
    setSensitivity(65);
    setResponse('investigate');
    setAssessment(null);
    setAssessError(null);
    setAssessLoading(false);
    setSaved(false);
  };

  const saveAssessment = () => {
    if (!assessment) return;
    const entry: ArchiveEntry = {
      id: `arc-${Date.now()}`,
      score: assessment.score,
      region: assessment.region,
      mode: assessment.mode,
      time: assessment.time,
      summary: assessment.summary.slice(0, 280)
    };
    setArchive(prev => [entry, ...prev].slice(0, MAX_ARCHIVE));
    setSaved(true);
  };

  const clearArchive = () => setArchive([]);

  const stats = [
    { label: 'FAOL SIGNALLAR', value: String(visible.length).padStart(2, '0'), sub: region === 'global' ? 'barcha hududlar' : REGION_NAMES[region], icon: <Activity size={15} />, tone: 'text-sky-400' },
    { label: 'ENG YUQORI XAVF', value: `${highestRisk}/100`, sub: 'xavf indikatori', icon: <ShieldAlert size={15} />, tone: 'text-orange-400' },
    { label: 'SEZGIRLIK', value: `${sensitivity}%`, sub: 'tahlil parametri', icon: <SlidersHorizontal size={15} />, tone: 'text-blue-400' },
    { label: 'JONLI OQIM', value: isRefreshing ? 'YANGILANMOQDA' : 'FAOL', sub: `oxirgi yangilanish ${fmtTime(lastUpdated)}`, icon: <CheckCircle2 size={15} />, tone: isRefreshing ? 'text-amber-400' : 'text-emerald-400' }
  ];

  return (
    <section id="command-center" className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#080B10] shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-400/[0.08] text-[#FF6A00]"><Radar size={22} /></div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-['Space_Grotesk'] text-lg font-semibold tracking-[0.1em] text-[#F5F7FA]">HUMAYRO</h2>
                <span className="rounded border border-white/10 px-2 py-0.5 font-mono text-[9px] tracking-[0.16em] text-slate-400">GLOBAL INTELLIGENCE</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">Tahliliy markaz <span className="mx-1 text-slate-700">/</span> Vaziyat paneli</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-emerald-300">
              <span className={'h-1.5 w-1.5 rounded-full bg-emerald-400 ' + (isRefreshing ? 'animate-ping' : 'animate-pulse')} /> JONLI MA’LUMOT
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-1.5 font-mono text-[10px] text-slate-400">
              <Activity size={12} className="text-sky-400" /> {articles.length} MANBA
            </span>
          </div>
        </header>

        <div className="grid grid-cols-2 border-b border-white/[0.08] sm:grid-cols-4">
          {stats.map((item, i) => (
            <div key={item.label} className={'min-w-0 px-4 py-4 sm:px-6 sm:py-5 ' + (i % 2 === 0 ? 'border-r border-white/[0.06]' : '') + (i < 2 ? ' border-b border-white/[0.06] sm:border-b-0' : '') + (i === 1 || i === 2 ? ' sm:border-r' : '')}>
              <div className="flex items-center justify-between gap-2 text-[9px] font-semibold tracking-[0.13em] text-slate-500 sm:text-[10px]"><span>{item.label}</span><span className={item.tone}>{item.icon}</span></div>
              <div className={'mt-3 truncate font-[Space_Grotesk] text-xl font-semibold tracking-tight sm:text-2xl ' + item.tone}>{item.value}</div>
              <div className="mt-1 truncate text-[10px] text-slate-600">{item.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-0 xl:grid-cols-[1.15fr_0.95fr_0.8fr]">
          {/* 01 — Radar / map */}
          <div className="min-w-0 border-b border-white/[0.08] p-4 sm:p-6 xl:border-b-0 xl:border-r">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div><p className="text-[10px] font-semibold tracking-[0.18em] text-slate-500">01 / GLOBAL RADAR</p><h3 className="mt-1 text-sm font-semibold text-slate-100">Global vaziyat xaritasi</h3></div>
              <span className="rounded-md border border-white/[0.08] px-2 py-1 font-mono text-[9px] text-slate-500">2D • SCHEMATIC</span>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#05080D]">
              <div className="pointer-events-none absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(rgba(100,116,139,.08) 1px, transparent 1px),linear-gradient(90deg,rgba(100,116,139,.08) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
              <svg viewBox="0 0 600 310" className="relative z-[1] block w-full" role="img" aria-label="Sxematik dunyo xaritasi va jonli signal nuqtalari">
                <defs>
                  <pattern id="humayro-dots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".75" fill="#475569" opacity=".7" /></pattern>
                  <radialGradient id="humayro-radar"><stop offset="0%" stopColor="#3B82F6" stopOpacity=".12" /><stop offset="100%" stopColor="#3B82F6" stopOpacity="0" /></radialGradient>
                </defs>
                <circle cx="300" cy="155" r="135" fill="url(#humayro-radar)" />
                {[55, 100, 145].map(r => <circle key={r} cx="300" cy="155" r={r} fill="none" stroke="#334155" strokeOpacity=".34" strokeDasharray="3 7" />)}
                {[65, 125, 185, 245, 305, 365, 425, 485, 545].map(x => <line key={x} x1={x} y1="12" x2={x} y2="298" stroke="#334155" strokeOpacity=".16" />)}
                {[55, 105, 155, 205, 255].map(y => <line key={y} x1="10" y1={y} x2="590" y2={y} stroke="#334155" strokeOpacity=".16" />)}
                <g fill="url(#humayro-dots)" stroke="#475569" strokeOpacity=".6" strokeWidth="1.1">
                  <path d="M54 67 L79 42 112 35 143 48 160 65 153 83 134 87 127 107 105 118 96 141 77 134 69 112 52 96Z" />
                  <path d="M133 149 L154 157 166 183 157 215 145 249 130 228 125 197 111 177Z" />
                  <path d="M249 61 L270 48 294 52 306 67 296 82 274 84 260 77Z" />
                  <path d="M300 88 L324 72 361 69 386 83 419 79 447 94 466 91 488 110 473 130 445 127 431 145 405 139 389 155 366 147 351 125 325 126 315 108Z" />
                  <path d="M325 139 L354 132 378 149 387 177 371 205 357 237 338 224 326 197 309 171Z" />
                  <path d="M468 215 L492 207 515 220 512 237 486 244 470 233Z" />
                  <path d="M526 90 L550 96 562 111 547 122 529 112Z" />
                </g>
                {(Object.keys(PIN_POS) as Region[]).map(key => {
                  const pos = PIN_POS[key]!;
                  const count = countByRegion[key] ?? 0;
                  const max = maxRiskByRegion[key] ?? 0;
                  const active = region === key;
                  const color = count > 0 ? riskHex(max) : '#475569';
                  return (
                    <g key={key} className={count > 0 ? 'cursor-pointer' : 'cursor-default'} onClick={() => count > 0 && changeRegion(key)}>
                      <circle cx={pos.x} cy={pos.y} r={active ? 17 : 12} fill={color} fillOpacity=".12" />
                      <circle cx={pos.x} cy={pos.y} r={active ? 7 : 5} fill={color} fillOpacity={count > 0 ? 1 : 0.4} />
                      {count > 0 && (
                        <circle cx={pos.x} cy={pos.y} r="13" fill="none" stroke={color} strokeOpacity=".45">
                          <animate attributeName="r" values="8;15;8" dur="3s" repeatCount="indefinite" />
                          <animate attributeName="stroke-opacity" values=".5;.08;.5" dur="3s" repeatCount="indefinite" />
                        </circle>
                      )}
                      <text x={pos.x} y={pos.y - 22} fill={color} fontSize="10" fontFamily="monospace" textAnchor="middle">
                        {`${REGION_CODES[key]} / ${count > 0 ? max : '—'}`}
                      </text>
                    </g>
                  );
                })}
                <text x="18" y="292" fill="#64748B" fontSize="9" fontFamily="monospace">SCHEMATIC MAP • LIVE SIGNAL DATA</text>
              </svg>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.06] px-4 py-3 text-[10px] text-slate-500">
                <span className="flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-sky-400" /> O‘rta</span>
                <span className="flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-orange-400" /> Yuqori</span>
                <span className="flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-rose-400" /> Kritik</span>
                <span className="ml-auto font-mono text-slate-600">{liveSignalCount} TA JONLI SIGNAL</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
              {REGION_ORDER.map(key => {
                const count = key === 'global' ? signals.length : (countByRegion[key] ?? 0);
                return (
                  <button
                    key={key}
                    onClick={() => changeRegion(key)}
                    className={'flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-[11px] transition-colors ' + (region === key ? 'border-orange-400/35 bg-orange-400/[0.08] text-orange-200' : 'border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200')}
                  >
                    <span className="truncate">{REGION_NAMES[key]}</span>
                    <span className="font-mono text-[10px] text-slate-500">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 02 — Signal feed */}
          <div className="min-w-0 border-b border-white/[0.08] p-4 sm:p-6 xl:border-b-0 xl:border-r">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div><p className="text-[10px] font-semibold tracking-[0.18em] text-slate-500">02 / SIGNAL FEED</p><h3 className="mt-1 text-sm font-semibold text-slate-100">Tahlil talab qiluvchi hodisalar</h3></div>
              <span className="font-mono text-[10px] text-slate-600">{String(Math.min(visible.length, 12)).padStart(2, '0')} / {String(visible.length).padStart(2, '0')}</span>
            </div>

            {visible.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/[0.08] p-5 text-center text-[11px] leading-relaxed text-slate-500">
                Bu hudud bo‘yicha hozircha signal yo‘q. Jonli yangiliklar yuklanishini kuting yoki boshqa hududni tanlang.
              </div>
            ) : (
              <div className="space-y-2.5">
                {visible.slice(0, 12).map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectArticle(item.article)}
                    title="Maqolani o‘qish"
                    className="group w-full rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 text-left transition-all hover:border-white/[0.15] hover:bg-white/[0.04]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className={'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ' + (item.risk >= 85 ? 'bg-rose-400/10 text-rose-300' : item.risk >= 70 ? 'bg-orange-400/10 text-orange-300' : 'bg-sky-400/10 text-sky-300')}><AlertTriangle size={15} /></span>
                        <div className="min-w-0">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[9px] tracking-[0.1em] text-slate-600">SIG-{String(idx + 1).padStart(3, '0')}</span>
                            <span className={'rounded px-1.5 py-0.5 font-mono text-[8px] tracking-wider ' + (item.risk >= 85 ? 'bg-rose-400/10 text-rose-300' : item.risk >= 70 ? 'bg-orange-400/10 text-orange-300' : 'bg-sky-400/10 text-sky-300')}>{statusOf(item.risk)}</span>
                          </div>
                          <p className="text-xs font-semibold leading-relaxed text-slate-200 group-hover:text-white">{item.title}</p>
                          {item.detail && <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-slate-500">{item.detail}</p>}
                          <p className="mt-1 text-[10px] text-slate-600">{item.area} <span className="mx-1 text-slate-700">·</span> {item.type}{fmtTime(item.time) !== '--:--' && <> <span className="mx-1 text-slate-700">·</span> {fmtTime(item.time)}</>}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="mt-1 shrink-0 text-slate-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.07]"><div className={'h-full rounded-full ' + riskBar(item.risk)} style={{ width: `${item.risk}%` }} /></div>
                      <span className={'w-12 text-right font-mono text-[10px] ' + riskTone(item.risk)}>{item.risk}/100</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <p className="mt-3 flex items-start gap-2 text-[10px] leading-relaxed text-slate-600">
              <AlertTriangle size={12} className="mt-0.5 shrink-0" /> Xavf balli kalit so‘zlar, yangilik yoshi va trend ballari asosida hisoblanadi. Signalni bosib to‘liq maqolani o‘qing.
            </p>
          </div>

          {/* 03 — Analysis controls */}
          <div className="min-w-0 p-4 sm:p-6">
            <div className="mb-4"><p className="text-[10px] font-semibold tracking-[0.18em] text-slate-500">03 / ANALYSIS CONTROLS</p><h3 className="mt-1 text-sm font-semibold text-slate-100">Tahlil parametrlarini sozlash</h3></div>

            <label className="mb-2 block text-[11px] font-medium text-slate-300" htmlFor="humayro-region">Tahlil hududi</label>
            <select id="humayro-region" value={region} onChange={e => changeRegion(e.target.value as Region)} className="w-full rounded-xl border border-white/[0.09] bg-[#0D121A] px-3 py-3 text-xs text-slate-200 outline-none transition focus:border-orange-400/50">
              {REGION_ORDER.map(key => <option key={key} value={key}>{REGION_NAMES[key]}</option>)}
            </select>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <label htmlFor="humayro-sensitivity" className="text-[11px] font-medium text-slate-300">Xavfga sezgirlik</label>
                <span className="font-mono text-xs text-orange-300">{sensitivity}%</span>
              </div>
              <input id="humayro-sensitivity" type="range" min="0" max="100" value={sensitivity} onChange={e => changeSensitivity(Number(e.target.value))} className="w-full cursor-pointer accent-[#FF6A00]" />
              <div className="mt-1 flex justify-between text-[9px] text-slate-600"><span>Past</span><span>Muvozanatli</span><span>Yuqori</span></div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-[11px] font-medium text-slate-300">Tavsiya etilgan harakat</p>
              <div className="space-y-1.5">
                {RESPONSE_OPTIONS.map(opt => (
                  <label key={opt.key} className={'flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 transition-colors ' + (response === opt.key ? 'border-orange-400/30 bg-orange-400/[0.06]' : 'border-white/[0.06] hover:border-white/[0.13]')}>
                    <input type="radio" name="humayro-response" value={opt.key} checked={response === opt.key} onChange={() => changeResponse(opt.key)} className="mt-0.5 accent-[#FF6A00]" />
                    <span className="min-w-0">
                      <span className="block text-[11px] font-medium text-slate-200">{opt.label}</span>
                      <span className="mt-0.5 block text-[10px] text-slate-500">{opt.desc}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#0C1118] p-3.5">
              <div className="flex items-center justify-between text-[10px] text-slate-500"><span>HISOBLANGAN XAVF</span><span className="font-mono text-slate-300">{riskScore}/100</span></div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className={'h-full rounded-full transition-all ' + riskBar(riskScore)} style={{ width: `${riskScore}%` }} /></div>
              <p className="mt-2 text-[10px] leading-relaxed text-slate-500">Ko‘rsatkich tanlangan hududdagi jonli signallar va sezgirlik sozlamasidan hisoblanadi.</p>
            </div>

            <button
              onClick={runAssessment}
              disabled={assessLoading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6A00] px-4 py-3 text-xs font-bold text-black transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300/50 disabled:cursor-wait disabled:opacity-60"
            >
              <Sparkles size={15} /> {assessLoading ? 'Tahlil qilinmoqda…' : 'Tahlilni ishga tushirish'} <ArrowUpRight size={14} />
            </button>
            <button onClick={reset} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2.5 text-[11px] font-medium text-slate-400 transition hover:border-white/20 hover:text-white">
              <RotateCcw size={13} /> Parametrlarni tiklash
            </button>

            {assessError && (
              <div className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[0.05] p-3.5 text-[11px] leading-relaxed text-rose-300">{assessError}</div>
            )}

            {assessment && (
              <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-3.5">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-300">
                  <CheckCircle2 size={14} /> Tahlil yakunlandi <span className="ml-auto font-mono text-[10px] text-slate-500">{fmtTime(assessment.time)}</span>
                </div>
                <div className="mt-2 flex items-end gap-2">
                  <span className="font-[Space_Grotesk] text-2xl font-semibold text-slate-100">{assessment.score}</span>
                  <span className="pb-1 text-[10px] text-slate-500">/ 100 xavf balli</span>
                </div>
                {assessment.summary && <p className="mt-3 text-[11px] leading-relaxed text-slate-300">{assessment.summary}</p>}
                {assessment.keyPoints.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {assessment.keyPoints.map((p, i) => <li key={i} className="flex gap-2 text-[10px] leading-relaxed text-slate-400"><span className="text-emerald-400">▸</span><span>{p}</span></li>)}
                  </ul>
                )}
                <p className="mt-3 text-[11px] leading-relaxed text-slate-300"><span className="text-slate-500">Tavsiya: </span>{assessment.recommendation}</p>
                {assessment.sourceCount > 0 && <p className="mt-1 font-mono text-[9px] text-slate-600">{assessment.sourceCount} ta manba asosida</p>}
                <button onClick={saveAssessment} disabled={saved} className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-emerald-300 hover:text-emerald-200 disabled:cursor-default disabled:text-slate-500">
                  <Archive size={12} /> {saved ? 'Arxivlangan' : 'Natijani arxivlash'}
                </button>
              </div>
            )}

            {archive.length > 0 && (
              <div className="mt-3 rounded-xl border border-white/[0.07] p-3">
                <div className="mb-2 flex items-center justify-between gap-2 text-[10px] font-semibold tracking-wider text-slate-400">
                  <span className="flex items-center gap-2"><Archive size={12} /> SAQLANGAN TAHLILLAR</span>
                  <button onClick={clearArchive} className="flex items-center gap-1 text-slate-500 hover:text-rose-300"><Trash2 size={11} /> Tozalash</button>
                </div>
                {archive.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-3 border-t border-white/[0.06] py-2 text-[10px]">
                    <span className="min-w-0 truncate text-slate-400">{REGION_NAMES[item.region]} · {RESPONSE_MAP[item.mode].label} · {fmtTime(item.time)}</span>
                    <span className="shrink-0 font-mono text-slate-200">{item.score}/100</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <footer className="flex flex-col gap-2 border-t border-white/[0.07] px-5 py-3 text-[9px] text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <span className="flex items-center gap-2"><Globe2 size={12} /> HUMAYRO INTELLIGENCE WORKSPACE</span>
          <span>Ma’lumotlar jonli yangiliklar oqimi va trend tahlilidan olinadi · AI xulosasi tekshirilishi kerak</span>
        </footer>
      </div>
    </section>
  );
};

export default IntelligenceCommandCenter;
