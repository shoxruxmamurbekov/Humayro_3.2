import React, { useState, useEffect } from 'react';
import { Radio, ChevronRight, Zap, Volume2 } from 'lucide-react';
import { Article, SupportedLanguage } from '../types';
import { getUiText, formatTimeAgoLocale } from '../i18n/uiTranslations';

interface SignalBarProps {
  articles: Article[];
  currentLang?: SupportedLanguage;
  onSelectArticle?: (article: Article) => void;
  onViewAllSignals?: () => void;
}

export const SignalBar: React.FC<SignalBarProps> = ({
  articles,
  currentLang = 'uz',
  onSelectArticle,
  onViewAllSignals
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ui = getUiText(currentLang);

  // Cycle through top 10 breaking signals
  const topSignals = articles && articles.length > 0 ? articles.slice(0, 12) : [];
  const currentSignal = topSignals[currentIndex] || topSignals[0];

  useEffect(() => {
    if (topSignals.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % topSignals.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [topSignals.length]);

  if (!currentSignal) {
    return (
      <div id="signals" className="border-y border-white/[0.07] bg-[#0B0F14]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-11 flex items-center justify-between text-xs text-[#7C8797]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#22C55E] font-bold text-[11px] tracking-wider font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              {ui.signal_live}
            </span>
            <span className="text-zinc-500">·</span>
            <span>{ui.signal_stream_active}</span>
          </div>
          <span className="font-mono text-[11px] text-zinc-500">{ui.signal_monitoring_247}</span>
        </div>
      </div>
    );
  }

  const score = currentSignal.trendScore || (currentSignal.isTrending ? 92 : 84);

  return (
    <div id="signals" className="border-y border-white/[0.07] bg-[#0B0F14] transition-colors">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-11 flex items-center justify-between gap-3 text-xs overflow-hidden">
        {/* Left: Live status + current signal title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="shrink-0 flex items-center gap-1.5 text-[#22C55E] font-bold text-[11px] tracking-wider font-mono">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            {ui.signal_live}
          </span>

          <span className="text-zinc-600 hidden sm:inline">·</span>

          <button
            type="button"
            onClick={() => onSelectArticle && onSelectArticle(currentSignal)}
            className="text-left font-medium text-[#F5F7FA] hover:text-[#FF6A00] truncate transition-colors cursor-pointer group flex items-center gap-2"
          >
            <span className="truncate">{currentSignal.title}</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#FF6A00] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Right: Source, Timestamp, and Trend Score */}
        <div className="shrink-0 flex items-center gap-3 text-xs text-[#7C8797] font-mono">
          <span className="hidden md:inline text-zinc-400 font-medium">
            {currentSignal.source}
          </span>
          <span className="hidden md:inline text-zinc-600">·</span>
          <span>{formatTimeAgoLocale(currentSignal.publishedAt, currentLang)}</span>

          <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] text-[#FF6A00] font-bold">
            {ui.signal_label} {score}%
          </span>
        </div>
      </div>
    </div>
  );
};
