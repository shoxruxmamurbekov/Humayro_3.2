import React, { useState } from 'react';
import { Radio, ExternalLink, Zap, ChevronDown, ChevronUp, Pause, Play, Filter, Sparkles } from 'lucide-react';
import { Article, SupportedLanguage } from '../types';
import { TranslationDict } from '../i18n/translations';

interface BreakingTickerProps {
  articles: Article[];
  dict: TranslationDict;
  currentLang?: SupportedLanguage;
  onSelectArticle: (article: Article) => void;
}

// Visual tag colors for world-renowned news agencies
function getAgencyBadgeStyle(sourceName: string) {
  const s = sourceName.toLowerCase();
  if (s.includes('reuters')) {
    return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  }
  if (s.includes('bbc')) {
    return 'bg-red-500/15 text-red-400 border-red-500/30';
  }
  if (s.includes('associated') || s.includes('ap')) {
    return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
  }
  if (s.includes('bloomberg')) {
    return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
  }
  if (s.includes('al jazeera')) {
    return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  }
  if (s.includes('dw') || s.includes('deutsche')) {
    return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
  }
  if (s.includes('guardian')) {
    return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
  }
  if (s.includes('oʻza') || s.includes('uza') || s.includes('gazeta')) {
    return 'bg-teal-500/15 text-teal-400 border-teal-500/30';
  }
  return 'bg-[#FF6A00]/15 text-[#FF8A24] border-[#FF6A00]/30';
}

function formatRelativeTime(dateStr?: string, lang: SupportedLanguage = 'uz') {
  if (!dateStr) return '';
  const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (lang === 'uz') {
    if (diffMin < 2) return 'Hozirgina';
    if (diffMin < 60) return `${diffMin} daq. oldin`;
    if (diffHour < 24) return `${diffHour} soat oldin`;
    return 'Bugun';
  } else if (lang === 'ru') {
    if (diffMin < 2) return 'Только что';
    if (diffMin < 60) return `${diffMin} мин. назад`;
    if (diffHour < 24) return `${diffHour} ч. назад`;
    return 'Сегодня';
  } else if (lang === 'ko') {
    if (diffMin < 2) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    return '오늘';
  } else {
    if (diffMin < 2) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    return 'Today';
  }
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({
  articles,
  dict,
  currentLang = 'uz',
  onSelectArticle
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<string>('all');

  if (!articles || articles.length === 0) return null;

  // Extract unique agencies for filter
  const agencies = Array.from(new Set(articles.map(a => a.source))).slice(0, 6);

  const filteredArticles = selectedAgency === 'all'
    ? articles
    : articles.filter(a => a.source.toLowerCase() === selectedAgency.toLowerCase());

  const tickerItems = articles.slice(0, 10);

  const lentaLabels: Partial<Record<SupportedLanguage, {
    expand: string;
    close: string;
    title: string;
    subtitle: string;
    all: string;
    readBrief: string;
  }>> = {
    uz: {
      expand: "Jonli lenta",
      close: "Yopish",
      title: "Dunyoning yetakchi axborot kanallari lentasi",
      subtitle: "Reuters, BBC, Associated Press, Bloomberg, DW va OʻzA dan soʻnggi tasdiqlangan xabarlar",
      all: "Barcha manbalar",
      readBrief: "Tahlilni oʻqish"
    },
    ru: {
      expand: "Живая лента",
      close: "Скрыть",
      title: "Лента ведущих мировых информационных агентств",
      subtitle: "Последние проверенные новости от Reuters, BBC, AP, Bloomberg, DW и других",
      all: "Все источники",
      readBrief: "Читать анализ"
    },
    en: {
      expand: "Live Wire",
      close: "Close",
      title: "Premier Global News Agencies Wire",
      subtitle: "Verified breaking dispatches from Reuters, BBC, AP, Bloomberg, DW and more",
      all: "All sources",
      readBrief: "Read Brief"
    },
    ko: {
      expand: "실시간 속보",
      close: "닫기",
      title: "세계 주요 통신사 실시간 뉴스 피드",
      subtitle: "로이터, BBC, AP, 블룸버그 등 검증된 글로벌 최신 특파원 보도",
      all: "모든 언론사",
      readBrief: "분석 읽기"
    }
  };

  const currentLenta = lentaLabels[currentLang] || lentaLabels.uz!;

  return (
    <aside aria-label="Breaking news ticker" className="w-full mt-20 sm:mt-24 bg-[#0a0a0c]/95 border-y border-white/10 backdrop-blur-md relative z-30 select-none shadow-lg">
      <div className="max-w-[1440px] mx-auto flex items-center h-11 px-3 sm:px-6">
        {/* Live Badge Pill */}
        <div className="flex items-center gap-2 pr-3.5 border-r border-white/10 shrink-0 bg-black/40 z-10 py-1">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600 shadow-[0_0_8px_#f43f5e]" />
          </span>
          <span className="text-[10px] font-black tracking-widest uppercase bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30">
            {dict.ticker_live_badge}
          </span>
          <span className="text-[11px] font-mono font-bold text-zinc-300 hidden md:inline tracking-wider">
            {dict.ticker_label}
          </span>
        </div>

        {/* Marquee Content */}
        <div
          className="flex-1 overflow-hidden relative mx-3 group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`flex items-center gap-8 whitespace-nowrap animate-marquee ${
              isPaused ? '[animation-play-state:paused]' : ''
            }`}
          >
            {/* Render twice for seamless infinite scrolling loop */}
            {[...tickerItems, ...tickerItems].map((item, idx) => {
              const badgeStyle = getAgencyBadgeStyle(item.source);
              const timeStr = formatRelativeTime(item.publishedAt, currentLang);
              return (
                <button
                  key={`${item.id}-${idx}`}
                  type="button"
                  onClick={() => onSelectArticle(item)}
                  className="inline-flex items-center gap-2.5 text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer group/item py-1"
                >
                  <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded border ${badgeStyle}`}>
                    {item.source}
                  </span>

                  {item.isTrending && (
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/15 px-1.5 py-0.5 rounded border border-rose-500/30 shrink-0">
                      {item.viralTag || '🔥 Trend'}
                    </span>
                  )}

                  <span className="font-medium group-hover/item:text-[#FF8A24] transition-colors max-w-[340px] sm:max-w-[480px] truncate text-[13px]">
                    {item.title}
                  </span>

                  {timeStr && (
                    <span className="text-zinc-500 font-mono text-[10px]">
                      ({timeStr})
                    </span>
                  )}

                  <span className="text-[#FF6A00]/40 font-mono text-[10px]" aria-hidden="true">
                    ◆
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side controls: Pause/Play & Expandable Live Stream Drawer */}
        <div className="flex items-center gap-2 pl-3 border-l border-white/10 shrink-0 text-xs font-mono">
          <button
            type="button"
            onClick={() => setIsPaused(prev => !prev)}
            title={isPaused ? "Play marquee" : "Pause marquee"}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/5"
          >
            {isPaused ? <Play className="w-3 h-3 text-[#FF6A00]" /> : <Pause className="w-3 h-3" />}
          </button>

          <button
            type="button"
            onClick={() => setDrawerOpen(prev => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
              drawerOpen
                ? 'bg-[#FF6A00] text-black border-[#FF6A00] shadow-[0_0_12px_rgba(255,106,0,0.4)]'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-white/10'
            }`}
          >
            <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
            <span className="hidden sm:inline">{drawerOpen ? currentLenta.close : currentLenta.expand}</span>
            <span className="px-1 py-0.2 bg-black/40 rounded text-[9px] font-mono">
              {articles.length}
            </span>
            {drawerOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expandable Live Stream Drawer (Jonli Lenta) */}
      {drawerOpen && (
        <div className="w-full bg-[#0c0c10]/95 border-t border-white/10 px-4 sm:px-8 py-5 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="max-w-[1440px] mx-auto">
            {/* Drawer Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF6A00] shadow-[0_0_8px_#FF6A00] animate-pulse" />
                  <h3 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-white tracking-tight">
                    {currentLenta.title}
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {currentLenta.subtitle}
                </p>
              </div>

              {/* Agency Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                <button
                  type="button"
                  onClick={() => setSelectedAgency('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    selectedAgency === 'all'
                      ? 'bg-[#FF6A00] text-black shadow-sm'
                      : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {currentLenta.all}
                </button>
                {agencies.map(agency => (
                  <button
                    key={agency}
                    type="button"
                    onClick={() => setSelectedAgency(agency)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedAgency.toLowerCase() === agency.toLowerCase()
                        ? 'bg-[#FF6A00] text-black shadow-sm'
                        : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {agency}
                  </button>
                ))}
              </div>
            </div>

            {/* Dispatches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredArticles.map(item => {
                const badgeStyle = getAgencyBadgeStyle(item.source);
                const timeStr = formatRelativeTime(item.publishedAt, currentLang);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectArticle(item);
                      setDrawerOpen(false);
                    }}
                    className="group p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#FF6A00]/40 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded border ${badgeStyle}`}>
                            {item.source}
                          </span>
                          {item.isTrending && (
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/15 px-1.5 py-0.5 rounded border border-rose-500/30">
                              {item.viralTag || '🔥 Trend'}
                            </span>
                          )}
                        </div>
                        {timeStr && (
                          <span className="text-[10px] font-mono text-zinc-500">
                            {timeStr}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-[#FF8A24] transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h4>

                      {item.description && (
                        <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[11px] text-zinc-400 group-hover:text-white">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#FF6A00]">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Deep Brief</span>
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium group-hover:translate-x-0.5 transition-transform">
                        <span>{currentLenta.readBrief}</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
