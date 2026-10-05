import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Zap,
  Building2,
  TrendingUp,
  FlaskConical,
  Rocket,
  ShieldAlert,
  HeartPulse,
  Coins,
  Terminal,
  LayoutGrid,
  Radio,
  ExternalLink,
  Activity,
  RefreshCw,
  Clock,
  Sparkles,
  Flame,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { Article, SupportedLanguage } from '../types';
import { TranslationDict } from '../i18n/translations';
import { isArticleBookmarked, toggleBookmark } from '../services/userStore';

interface FeedSectionProps {
  dict: TranslationDict;
  currentLang: SupportedLanguage;
  onSelectTopic: (topicName: string) => void;
  liveArticles?: Article[];
  onSelectArticle: (article: Article) => void;
  isRefreshing?: boolean;
  lastUpdated?: Date;
  onRefreshNow?: () => void;
  countdown?: number;
}

interface TopicConfig {
  key: string;
  code: string;
  icon: React.ReactNode;
  impact: 'high' | 'elevated' | 'stable';
  regionCode: string;
  names: Partial<Record<SupportedLanguage, string>>;
  sources: string;
}

const TOPICS: TopicConfig[] = [
  {
    key: 'ai',
    code: 'INTEL-AI.01',
    icon: <Cpu className="w-5 h-5" />,
    impact: 'high',
    regionCode: 'GLOBAL',
    names: {
      uz: "Sun'iy intellekt",
      en: 'Artificial Intelligence',
      ru: 'Искусственный интеллект',
      ko: '인공지능'
    },
    sources: 'OpenAI, Anthropic, Nature, arXiv'
  },
  {
    key: 'tech',
    code: 'SEMI-TECH.02',
    icon: <Zap className="w-5 h-5" />,
    impact: 'high',
    regionCode: 'US/EA',
    names: {
      uz: 'Texnologiya & Yarimo\'tkazgichlar',
      en: 'Technology & Semiconductors',
      ru: 'Технологии и микроэлектроника',
      ko: '기술 및 반도체'
    },
    sources: 'Bloomberg, TechCrunch, Verge'
  },
  {
    key: 'economy',
    code: 'MACRO-ECN.03',
    icon: <Coins className="w-5 h-5" />,
    impact: 'high',
    regionCode: 'EU/US/APAC',
    names: {
      uz: 'Global Iqtisodiyot va Moliya',
      en: 'Global Economy & Finance',
      ru: 'Мировая экономика и финансы',
      ko: '세계 경제 및 금융'
    },
    sources: 'FT, WSJ, Reuters, IMF'
  },
  {
    key: 'uzbekistan',
    code: 'UZ-CENTRAL.04',
    icon: <Building2 className="w-5 h-5" />,
    impact: 'elevated',
    regionCode: 'UZ/CA',
    names: {
      uz: "O'zbekiston & Markaziy Osiyo",
      en: 'Uzbekistan & Central Asia',
      ru: 'Узбекистан и Центральная Азия',
      ko: '우즈베키스탄 및 중앙아시아'
    },
    sources: "O'zA, Gazeta.uz, Dunyo IA"
  },
  {
    key: 'geopolitics',
    code: 'DIPL-GEO.05',
    icon: <ShieldAlert className="w-5 h-5" />,
    impact: 'high',
    regionCode: 'UN/GLOBAL',
    names: {
      uz: 'Xalqaro Diplomatiya va Siyosat',
      en: 'Geopolitics & World Affairs',
      ru: 'Геополитика и мировая политика',
      ko: '지정학 및 국제 정세'
    },
    sources: 'Foreign Affairs, BBC, UN Wire'
  },
  {
    key: 'science',
    code: 'SCI-DISC.06',
    icon: <FlaskConical className="w-5 h-5" />,
    impact: 'stable',
    regionCode: 'GLOBAL',
    names: {
      uz: 'Ilmiy kashfiyotlar',
      en: 'Science & Discovery',
      ru: 'Наука и открытия',
      ko: '과학 및 발견'
    },
    sources: 'Science, Cell, Phys.org'
  },
  {
    key: 'aerospace',
    code: 'AERO-SPC.07',
    icon: <Rocket className="w-5 h-5" />,
    impact: 'elevated',
    regionCode: 'US/EU/APAC',
    names: {
      uz: 'Kosmos va Aerokosmik sanoat',
      en: 'Space & Aerospace',
      ru: 'Космос и аэронавтика',
      ko: '우주 및 항공'
    },
    sources: 'NASA, ESA, SpaceNews'
  },
  {
    key: 'health',
    code: 'BIO-HLTH.08',
    icon: <HeartPulse className="w-5 h-5" />,
    impact: 'stable',
    regionCode: 'WHO/GLOBAL',
    names: {
      uz: 'Tibbiyot va Biotexnologiya',
      en: 'Biotech & Medicine',
      ru: 'Биотехнологии и медицина',
      ko: '바이오 및 의학'
    },
    sources: 'Lancet, NEJM, WHO'
  }
];

function formatTimeAgo(dateStr?: string): string {
  if (!dateStr) return 'Hozirgina';
  const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diffSec < 60) return 'Hozirgina';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} daq. oldin`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} soat oldin`;
  return `${Math.floor(diffHours / 24)} kun oldin`;
}

function getSourceBadgeClass(sourceName: string): string {
  const s = sourceName.toLowerCase();
  if (s.includes('reuters')) return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  if (s.includes('bbc')) return 'bg-red-500/15 text-red-400 border-red-500/30';
  if (s.includes('bloomberg')) return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
  if (s.includes('al jazeera')) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  if (s.includes('dw') || s.includes('deutsche')) return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
  if (s.includes('uza') || s.includes("o'za") || s.includes('gazeta')) return 'bg-teal-500/15 text-teal-400 border-teal-500/30';
  return 'bg-[#FF6A00]/15 text-[#FF8A24] border-[#FF6A00]/30';
}

export const FeedSection: React.FC<FeedSectionProps> = ({
  dict,
  currentLang,
  onSelectTopic,
  liveArticles = [],
  onSelectArticle,
  isRefreshing = false,
  lastUpdated = new Date(),
  onRefreshNow,
  countdown = 30
}) => {
  const [viewMode, setViewMode] = useState<'live-stream' | 'magazine' | 'terminal'>('live-stream');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => new Set());

  // Filter live articles by category
  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'all') return liveArticles;
    return liveArticles.filter(a => {
      const c = (a.category || '').toLowerCase();
      if (selectedCategory === 'uzbekistan') {
        return c.includes('uzbekistan') || a.source.toLowerCase().includes('oʻza') || a.source.toLowerCase().includes('gazeta');
      }
      return c.includes(selectedCategory.toLowerCase());
    });
  }, [liveArticles, selectedCategory]);

  const handleToggleBookmark = (e: React.MouseEvent, article: Article) => {
    e.stopPropagation();
    toggleBookmark(article);
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(article.id)) next.delete(article.id);
      else next.add(article.id);
      return next;
    });
  };

  const categories = [
    { id: 'all', label: 'Barcha yangiliklar', count: liveArticles.length },
    { id: 'uzbekistan', label: "O'zbekiston", count: liveArticles.filter(a => (a.category || '').toLowerCase().includes('uzbekistan')).length },
    { id: 'world', label: 'Jahon & Diplomatiya', count: liveArticles.filter(a => (a.category || '').toLowerCase().includes('world')).length },
    { id: 'technology', label: 'Texnologiya & AI', count: liveArticles.filter(a => (a.category || '').toLowerCase().includes('technology')).length },
    { id: 'economy', label: 'Iqtisodiyot & Moliya', count: liveArticles.filter(a => (a.category || '').toLowerCase().includes('economy')).length },
    { id: 'science', label: 'Ilm-fan', count: liveArticles.filter(a => (a.category || '').toLowerCase().includes('science')).length }
  ];

  return (
    <section id="feed" className="relative py-24 overflow-hidden z-10">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-8">
        {/* Header with Title and Mode Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-medium tracking-widest uppercase text-zinc-400 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Doimiy Yangilanuvchi Jonli Lenta</span>
            </div>

            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold tracking-tight">
              <span>{dict.feed_title1} </span>
              <span className="bg-gradient-to-r from-[#FF6A00] to-[#FFA84D] bg-clip-text text-transparent">
                {dict.feed_title2}
              </span>
            </h2>
          </div>

          {/* View Mode Toggle: Live Stream vs Magazine vs Terminal */}
          <div className="flex items-center gap-1 p-1 bg-white/[0.05] border border-white/10 rounded-2xl shrink-0 self-start lg:self-auto backdrop-blur-md">
            <button
              type="button"
              onClick={() => setViewMode('live-stream')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'live-stream'
                  ? 'bg-[#FF6A00] text-black shadow-[0_0_15px_rgba(255,106,0,0.35)] font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Jonli Oqim</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
                {liveArticles.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('magazine')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'magazine'
                  ? 'bg-[#FF6A00] text-black shadow-[0_0_15px_rgba(255,106,0,0.35)] font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{dict.mode_magazine}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('terminal')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'terminal'
                  ? 'bg-[#FF6A00] text-black shadow-[0_0_15px_rgba(255,106,0,0.35)] font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{dict.mode_terminal}</span>
            </button>
          </div>
        </div>

        {/* Real-time Telemetry Status Bar */}
        <div className="mt-4 p-3.5 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-wrap font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>JONLI EFIR MONITORINGI</span>
            </span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="text-zinc-400">
              Avtomatik yangilanish: <span className="text-[#FF6A00] font-bold">{countdown}s</span>
            </span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="text-zinc-500 text-[11px]">
              Oxirgi sinxronizatsiya: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onRefreshNow && (
              <button
                type="button"
                onClick={onRefreshNow}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#FF6A00] hover:text-black border border-white/10 text-zinc-300 font-mono text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF6A00]' : ''}`} />
                <span>{isRefreshing ? 'Yuklanmoqda...' : 'Hoziroq yangilash'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters for Live Stream */}
        {viewMode === 'live-stream' && (
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF6A00] text-black font-bold shadow-md scale-102'
                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-[#FF6A00]/40'
                }`}
              >
                <span>{cat.label}</span>
                {cat.count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    selectedCategory === cat.id ? 'bg-black/20 text-black' : 'bg-white/10 text-zinc-300'
                  }`}>
                    {cat.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 1. LIVE STREAM VIEW: Real Dynamic Articles Grid */}
      {viewMode === 'live-stream' && (
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          {filteredArticles.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/10">
              <RefreshCw className="w-8 h-8 text-[#FF6A00] animate-spin mx-auto mb-3" />
              <p className="text-zinc-400 font-mono text-sm">
                Xalqaro agentliklardan jonli yangiliklar oqimi olinmoqda...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredArticles.map((art, idx) => {
                const bookmarked = bookmarkedIds.has(art.id) || isArticleBookmarked(art.id);
                return (
                  <div
                    key={`${art.id}-${idx}`}
                    onClick={() => onSelectArticle(art)}
                    className="group relative p-5 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#FF6A00]/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(255,106,0,0.25)] cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header: Source & Published Time */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${getSourceBadgeClass(
                            art.source
                          )}`}
                        >
                          {art.source}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            {formatTimeAgo(art.publishedAt)}
                          </span>

                          <button
                            type="button"
                            onClick={e => handleToggleBookmark(e, art)}
                            className="p-1 rounded-lg text-zinc-400 hover:text-[#FF6A00] transition-colors"
                            title="Xatcho'pga qo'shish"
                          >
                            <Bookmark
                              className={`w-3.5 h-3.5 ${
                                bookmarked ? 'fill-[#FF6A00] text-[#FF6A00]' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-white group-hover:text-[#FF8A24] transition-colors line-clamp-2 leading-snug mb-2">
                        {art.title}
                      </h3>

                      {/* Excerpt */}
                      {art.description && (
                        <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                          {art.description}
                        </p>
                      )}
                    </div>

                    {/* Card Footer: Badges & Deep Brief Trigger */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {art.isTrending ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            <Flame className="w-3 h-3 fill-current text-rose-400" />
                            Trendda
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-zinc-400">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Tasdiqlangan
                          </span>
                        )}
                        {art.category && (
                          <span className="text-[10px] font-mono text-zinc-500">
                            #{art.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[#FF6A00] group-hover:translate-x-1 transition-transform font-semibold text-[11px]">
                        <span>AI Tahlili</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. MAGAZINE VIEW (Dynamic 3D-feeling cards stream) */}
      {viewMode === 'magazine' && (
        <div className="relative w-full overflow-hidden py-4">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />

          <div className="flex gap-5 w-max animate-[feedScroll_55s_linear_infinite] hover:[animation-play-state:paused] px-6">
            {[...TOPICS, ...TOPICS].map((topic, index) => {
              const label = topic.names[currentLang] || topic.names.uz || topic.names.en || topic.key;
              return (
                <div
                  key={`${topic.key}-${index}`}
                  onClick={() => onSelectTopic(label)}
                  className="group w-[260px] aspect-[3/4] p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#FF6A00]/50 backdrop-blur-xl flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(255,106,0,0.3)] shrink-0 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6A00]/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase text-[#FF6A00] bg-[#FF6A00]/10 border border-[#FF6A00]/20">
                        {dict.trending_now}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500">
                        {topic.regionCode}
                      </span>
                    </div>
                    <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white group-hover:text-[#FF6A00] transition-colors leading-tight">
                      {label}
                    </h3>
                  </div>

                  <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-zinc-400 font-medium truncate max-w-[150px]">
                      {topic.sources}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center text-[#FF6A00] group-hover:bg-[#FF6A00] group-hover:text-black transition-colors shrink-0">
                      {topic.icon}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. TERMINAL (PRO) VIEW (High-density Bloomberg-style table) */}
      {viewMode === 'terminal' && (
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-black/60 border border-white/10 backdrop-blur-2xl overflow-hidden shadow-2xl">
            {/* Terminal Top Command Bar */}
            <div className="flex flex-wrap items-center justify-between px-6 py-3 border-b border-white/10 bg-white/[0.02] text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-400">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold">HUMAYRO INTELLIGENCE DESK</span>
                <span className="text-zinc-600">|</span>
                <span>DESPATCHES: {liveArticles.length} ACTIVE LIVE STREAMS</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-500">
                <span>FEED: REAL-TIME SECURE</span>
                <span className="text-emerald-500">200 OK</span>
              </div>
            </div>

            {/* Dense Rows Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-500 bg-white/[0.01]">
                    <th className="py-3 px-6 font-semibold">VAQT</th>
                    <th className="py-3 px-6 font-semibold">AGENTLIK</th>
                    <th className="py-3 px-6 font-semibold">SARLAVHA</th>
                    <th className="py-3 px-6 font-semibold">TOIFA</th>
                    <th className="py-3 px-6 font-semibold text-right">AMAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {liveArticles.slice(0, 15).map((article, idx) => {
                    return (
                      <tr
                        key={article.id || idx}
                        onClick={() => onSelectArticle(article)}
                        className="hover:bg-[#FF6A00]/[0.06] transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-6 font-mono text-zinc-400 whitespace-nowrap">
                          {formatTimeAgo(article.publishedAt)}
                        </td>
                        <td className="py-3.5 px-6 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSourceBadgeClass(
                              article.source
                            )}`}
                          >
                            {article.source}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-white font-sans font-semibold text-sm group-hover:text-[#FF8A24] transition-colors max-w-md truncate">
                          {article.title}
                        </td>
                        <td className="py-3.5 px-6 font-mono text-zinc-400">
                          {article.category || 'General'}
                        </td>
                        <td className="py-3.5 px-6 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              onSelectArticle(article);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 group-hover:bg-[#FF6A00] group-hover:text-black transition-all cursor-pointer text-zinc-300"
                          >
                            <span>AI Tahlil</span>
                            <Sparkles className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom prompt status */}
            <div className="px-6 py-3 border-t border-white/10 bg-black/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>HUMAYRO_INTEL_STREAM // REAL-TIME DISPATCHES VERIFIED</span>
              <span className="text-zinc-600">CLICK ANY ROW FOR AUTONOMOUS SYNTHESIS</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
