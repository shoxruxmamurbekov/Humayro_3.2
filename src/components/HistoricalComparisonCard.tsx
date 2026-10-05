import React from 'react';
import { History, Zap, Scale, Quote, Landmark } from 'lucide-react';
import { HistoricalParallel } from '../types';
import { TranslationDict } from '../i18n/translations';

interface HistoricalComparisonCardProps {
  currentTopic: string;
  currentSummary?: string;
  historicalParallel: HistoricalParallel;
  dict: TranslationDict;
}

export const HistoricalComparisonCard: React.FC<HistoricalComparisonCardProps> = ({
  currentTopic,
  currentSummary,
  historicalParallel,
  dict
}) => {
  if (!historicalParallel) return null;

  return (
    <div className="my-8 rounded-3xl bg-gradient-to-b from-amber-500/[0.08] via-black/40 to-black/60 border border-amber-500/25 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute top-2 right-4 opacity-5 pointer-events-none text-amber-300">
        <Landmark className="w-36 h-36" />
      </div>

      {/* Header Eyebrow */}
      <div className="flex items-center justify-between gap-3 mb-5 border-b border-amber-500/20 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {dict.history_vs_today_title}
            </h4>
            <p className="text-[11px] text-zinc-400">
              Tarixiy saboqlar va zamonaviy global jarayonlar qiyosi
            </p>
          </div>
        </div>

        {historicalParallel.yearOrEra && (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300 shrink-0">
            {historicalParallel.yearOrEra}
          </span>
        )}
      </div>

      {/* Dual Column Comparative Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {/* Left Column: Today (2026) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>{dict.today_column}</span>
            </div>
            <h5 className="text-sm sm:text-base font-bold text-white mb-2 leading-snug">
              {currentTopic}
            </h5>
            {currentSummary && (
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {currentSummary}
              </p>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>Real-time global intelligence stream</span>
          </div>
        </div>

        {/* Right Column: Historical Analog */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/[0.05] border border-amber-500/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              <History className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>{dict.history_column}</span>
            </div>
            <h5 className="text-sm sm:text-base font-bold text-amber-100 mb-2 leading-snug">
              {historicalParallel.eventName}
            </h5>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-3">
              <strong className="text-amber-300 font-medium mr-1">{dict.historical_similarity_label}:</strong>
              {historicalParallel.similarity}
            </p>
            {historicalParallel.historicalLesson && (
              <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                <strong className="text-amber-400 font-medium mr-1">⚖️ {dict.historical_lesson_label}:</strong>
                {historicalParallel.historicalLesson}
              </div>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-amber-500/15 flex items-center gap-1.5 text-[11px] text-amber-400/80 font-mono">
            <span>Analog davr: {historicalParallel.yearOrEra}</span>
          </div>
        </div>
      </div>

      {/* Wisdom Quote Box */}
      {historicalParallel.quote?.text && (
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-black/70 border-l-4 border-amber-500 shadow-xl relative z-10">
          <div className="flex items-start gap-3">
            <Quote className="w-6 h-6 text-amber-400/50 shrink-0 mt-0.5" />
            <div className="flex-1">
              <blockquote className="font-editorial italic text-amber-100 text-sm sm:text-base leading-relaxed">
                “{historicalParallel.quote.text}”
              </blockquote>
              <div className="mt-2 flex flex-wrap items-center justify-end gap-1.5 text-xs text-amber-400 font-medium">
                <span>— {historicalParallel.quote.author}</span>
                {historicalParallel.quote.sourceOrEra && (
                  <span className="text-zinc-500 font-normal">({historicalParallel.quote.sourceOrEra})</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
