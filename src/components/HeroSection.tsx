import React from 'react';
import { ArrowRight, Play, Radio, Sparkles } from 'lucide-react';
import { EarthCanvas } from './EarthCanvas';
import { TranslationDict } from '../i18n/translations';
import { Article } from '../types';

interface HeroSectionProps {
  dict: TranslationDict;
  onExploreClick: () => void;
  onDemoClick: () => void;
  latestArticle?: Article | null;
  totalArticlesCount?: number;
  refreshCountdown?: number;
  onSelectArticle?: (article: Article) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  dict,
  onExploreClick,
  onDemoClick,
  latestArticle,
  totalArticlesCount = 24,
  refreshCountdown = 30,
  onSelectArticle
}) => {
  return (
    <section id="home" className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Radiant ambient center glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[600px] md:h-[900px] rounded-full pointer-events-none z-0 filter blur-[90px] opacity-35"
        style={{
          background: 'radial-gradient(circle, rgba(255,106,0,0.35) 0%, transparent 65%)'
        }}
      />

      {/* 3D Wireframe Earth Sphere with telemetry arcs */}
      <EarthCanvas />

      {/* Foreground Content */}
      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Eyebrow badge with Live Stream Status */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl text-[11px] font-medium tracking-widest uppercase text-zinc-400 mb-4 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-ping" />
          <span className="text-emerald-400 font-bold">JONLI EFIR OQIMI FAOL</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400 font-mono">{refreshCountdown}s da yangilanadi</span>
        </div>

        {/* Real-time Breaking Flash Pill (If available) */}
        {latestArticle && (
          <div
            onClick={() => onSelectArticle && onSelectArticle(latestArticle)}
            className="group mb-6 max-w-2xl px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-[#FF6A00]/40 backdrop-blur-xl flex items-center justify-center gap-2 text-xs transition-all cursor-pointer shadow-lg hover:scale-102"
          >
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF6A00] text-black shrink-0">
              ⚡ SOʻNGGI: {latestArticle.source}
            </span>
            <span className="text-zinc-200 truncate group-hover:text-[#FF8A24] transition-colors font-medium">
              {latestArticle.title}
            </span>
            <span className="text-[10px] text-[#FF6A00] shrink-0 font-mono hidden sm:inline">
              Oʻqish ↗
            </span>
          </div>
        )}

        {/* Display Headline */}
        <h1 className="font-['Space_Grotesk'] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.08] mb-6">
          <span>{dict.hero_title1}</span>
          <br />
          <span className="bg-gradient-to-r from-[#FF6A00] via-[#FF8A24] to-[#FFA84D] bg-clip-text text-transparent">
            {dict.hero_title2}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed mb-8">
          {dict.hero_sub}
        </p>

        {/* Real-time Telemetry Metrics Pill Bar */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap mb-10 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
            <span>48+ Xalqaro Agentliklar</span>
          </div>
          <div className="w-px h-3 bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{totalArticlesCount} ta Real-Vaqt Hisoboti</span>
          </div>
          <div className="w-px h-3 bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFA84D]" />
            <span>3D Kiber-Sfera Monitoringi</span>
          </div>
        </div>

        {/* Call To Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExploreClick}
            className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm bg-[#FF6A00] text-black shadow-[0_10px_30px_-10px_rgba(255,106,0,0.5)] hover:shadow-[0_20px_45px_-10px_rgba(255,106,0,0.6)] hover:-translate-y-0.5 transition-all overflow-hidden cursor-pointer"
          >
            <span>{dict.hero_cta_primary}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
          </button>

          <button
            onClick={onDemoClick}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-medium text-sm bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.08] text-zinc-200 backdrop-blur-xl hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-[#FF6A00] flex items-center justify-center text-black">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </div>
            <span>{dict.hero_cta_ghost}</span>
          </button>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500 text-[10px] uppercase tracking-widest pointer-events-none">
        <span>{dict.scroll_label}</span>
        <div className="w-px h-9 bg-gradient-to-b from-[#FF6A00] to-transparent animate-pulse" />
      </div>
    </section>
  );
};
