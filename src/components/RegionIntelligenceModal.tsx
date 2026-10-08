import React, { useState, useEffect } from 'react';
import {
  X,
  Radio,
  Play,
  Flame,
  AlertTriangle,
  Youtube,
  ExternalLink,
  Sparkles,
  BarChart3,
  TrendingUp,
  Clock,
  Layers,
  Search,
  CheckCircle2
} from 'lucide-react';
import { RegionIntelligence } from '../data/regionsData';
import { TranslationDict } from '../i18n/translations';

import { Article } from '../types';
import type { RegionLiveWeather, RegionVideo } from '../services/api';

function weatherLabel(code: number | null): string {
  if (code === null) return '—';
  if (code === 0) return 'Ochiq';
  if (code <= 3) return 'Qisman bulutli';
  if (code <= 48) return 'Tumanli';
  if (code <= 67) return 'Yomgʻirli';
  if (code <= 77) return 'Qorli';
  if (code <= 82) return 'Jala';
  if (code <= 86) return 'Qor yogʻmoqda';
  return 'Momaqaldiroq';
}

function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  if (isNaN(t)) return '';
  const min = Math.max(0, Math.floor((Date.now() - t) / 60000));
  if (min < 1) return 'hozirgina';
  if (min < 60) return `${min} daqiqa oldin`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} soat oldin`;
  return `${Math.floor(h / 24)} kun oldin`;
}

interface RegionIntelligenceModalProps {
  isOpen: boolean;
  region: RegionIntelligence | null;
  onClose: () => void;
  onAskAi: (query: string) => void;
  dict: TranslationDict;
  liveArticles?: Article[];
  onSelectArticle?: (article: Article) => void;
  liveWeather?: RegionLiveWeather[];
  liveLoading?: boolean;
  liveError?: boolean;
  liveLastUpdated?: Date | null;
  liveCountdown?: number;
  onRefreshLive?: () => void;
  liveVideos?: RegionVideo[];
  videosLoading?: boolean;
  videosConfigured?: boolean;
  videosSearchUrl?: string;
}

export const RegionIntelligenceModal: React.FC<RegionIntelligenceModalProps> = ({
  isOpen,
  region,
  onClose,
  onAskAi,
  liveArticles = [],
  liveVideos = [],
  videosLoading = false,
  videosConfigured = true,
  videosSearchUrl,
  onSelectArticle,
  liveWeather = [],
  liveLoading = false,
  liveError = false,
  liveLastUpdated = null,
  liveCountdown,
  onRefreshLive
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'live-news' | 'videos' | 'analytics'>('live-news');
  const [selectedVideo, setSelectedVideo] = useState<RegionVideo | null>(null);

  useEffect(() => {
    setSelectedVideo(null);
    setActiveTab('live-news');
  }, [region]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !region) return null;

  // Breaking list is built from LIVE headlines (not static data)
  const liveEvents = liveArticles.slice(0, 6).map(a => ({
    id: a.id,
    category: a.isTrending ? 'Trend' : 'Live',
    time: new Date(a.publishedAt).toLocaleString(),
    title: a.title,
    summary: a.description,
    source: a.source
  }));

  const currentVideo = selectedVideo || liveVideos[0] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Backdrop click dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Modal Card */}
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0d0d11] border border-white/15 shadow-2xl text-zinc-100 overflow-hidden z-10 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Top ambient glow line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF6A00] to-transparent" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FF6A00]/15 border border-[#FF6A00]/30 flex items-center justify-center text-[#FF6A00] shrink-0 mt-0.5">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {region.name}
                </h2>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#FF6A00]/15 text-[#FF6A00] border border-[#FF6A00]/30">
                  {region.code}
                </span>
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold border flex items-center gap-1.5 ${
                    region.status === 'critical'
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      : 'bg-[#FF6A00]/15 text-[#FFA84D] border-[#FF6A00]/30'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                  {region.statusLabel}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                {region.headline}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 px-5 sm:px-6 pt-3 pb-2 border-b border-white/10 bg-black/40 text-xs sm:text-sm font-medium overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('live-news')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'live-news'
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-4 h-4 animate-pulse text-current" />
            <span>Jonli Agentlik Xabarlari</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
              {liveArticles.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'events'
                ? 'bg-[#FF6A00] text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Qaynoq hodisalar va Muammolar</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
              {liveEvents.length + region.publicDebates.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'videos'
                ? 'bg-[#FF6A00] text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Youtube className="w-4 h-4 text-red-500 fill-current" />
            <span>YouTube Video Hisobotlar</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
              {liveVideos.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-[#FF6A00] text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Koʻrsatkichlar va Faktlar</span>
          </button>
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {/* TAB 0: LIVE AGENTS FEED */}
          {activeTab === 'live-news' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold uppercase">
                    {region.name} boʻyicha eng soʻnggi tasdiqlangan jonli axborotlar
                  </span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 font-sans text-[11px]">
                  <span>
                    {liveLastUpdated
                      ? `Yangilandi: ${liveLastUpdated.toLocaleTimeString()}`
                      : liveLoading
                      ? 'Yuklanmoqda…'
                      : ''}
                    {typeof liveCountdown === 'number' && liveLastUpdated ? ` · ${liveCountdown}s` : ''}
                  </span>
                  {onRefreshLive && (
                    <button
                      type="button"
                      onClick={onRefreshLive}
                      disabled={liveLoading}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 cursor-pointer disabled:opacity-50"
                    >
                      {liveLoading ? '…' : 'Yangilash'}
                    </button>
                  )}
                </div>
              </div>

              {liveWeather.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {liveWeather.map(w => (
                    <div key={w.city} className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{w.city}</span>
                        <span className="font-mono text-[#FFA84D] text-base">
                          {w.temperatureC !== null ? `${Math.round(w.temperatureC)}°C` : '—'}
                        </span>
                      </div>
                      <div className="text-zinc-400">
                        {weatherLabel(w.code)}
                        {w.humidity !== null && ` · ${w.humidity}%`}
                        {w.windKmh !== null && ` · ${Math.round(w.windKmh)} km/s`}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {liveArticles.length === 0 && (
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center text-sm text-zinc-400">
                  {liveLoading
                    ? 'Soʻnggi xabarlar yuklanmoqda…'
                    : liveError
                    ? 'Jonli maʼlumotni olishda xatolik. Qayta urinib koʻring.'
                    : 'Hozircha yangi xabar topilmadi.'}
                </div>
              )}

              {liveError && liveArticles.length > 0 && (
                <div className="text-[11px] text-amber-400">Yangilashda xatolik — oxirgi maʼlumot koʻrsatilmoqda.</div>
              )}

              <div className="space-y-3.5">
                {liveArticles.map((art, i) => (
                  <div
                    key={`${art.id}-${i}`}
                    className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-white/5 border border-white/10 text-[#FF8A24]">
                          {art.source}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">
                          {art.publishedAt ? timeAgo(art.publishedAt) : 'Hozirgina'}
                        </span>
                      </div>

                      <h4 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2 leading-snug">
                        {art.title}
                      </h4>

                      {art.description && (
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                          {art.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3 flex-wrap text-xs">
                      <div className="flex items-center gap-2">
                        {art.category && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                            #{art.category}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Tasdiqlangan</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {onSelectArticle && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onSelectArticle(art);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FF6A00] text-black hover:bg-[#FF8A24] transition-all cursor-pointer font-sans"
                          >
                            <Sparkles className="w-3.5 h-3.5 fill-current" />
                            <span>AI Chuqur Tahlil</span>
                          </button>
                        )}

                        {art.url && art.url !== '#' && (
                          <a
                            href={art.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <span>Manba</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 1: Events & Public Debates */}
          {activeTab === 'events' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Region Overview Banner */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                <span className="font-semibold text-[#FF6A00] block mb-1">
                  Mintaqaviy Umumiy Manzara:
                </span>
                {region.summary}
              </div>

              {/* Public Debates & Underlying Problems */}
              <div>
                <div className="flex items-center gap-2 mb-3.5">
                  <AlertTriangle className="w-4 h-4 text-[#FF6A00]" />
                  <h3 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-white tracking-tight">
                    Jamoatchilik muhokamasiga sabab boʻlayotgan asosiy muammolar
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {region.publicDebates.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#FF6A00]/40 transition-all flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-semibold text-sm sm:text-base text-zinc-100 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
                          <span>{issue.title}</span>
                        </h4>

                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold shrink-0">
                          Taʼsir: {issue.impactLevel}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {issue.description}
                      </p>

                      {/* Causes / Factors */}
                      <div className="pt-2 border-t border-white/5 space-y-1.5">
                        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                          Asosiy sabablar va omillar:
                        </span>
                        <ul className="space-y-1 text-xs text-zinc-400">
                          {issue.causes.map((c, ci) => (
                            <li key={ci} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6A00] shrink-0 mt-0.5" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Public Sentiment & Reaction */}
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-300">
                        <span className="font-semibold text-amber-300 mr-1.5">
                          💬 Jamoatchilik munosabati:
                        </span>
                        {issue.publicReaction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Breaking Events in this Region */}
              <div>
                <div className="flex items-center gap-2 mb-3.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <h3 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-white tracking-tight">
                    Ayni daqiqalarda sodir boʻlayotgan xabarlar
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {liveEvents.map(ev => (
                    <div
                      key={ev.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2 font-mono">
                          <span className="px-2 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/10">
                            {ev.category}
                          </span>
                          <span className="flex items-center gap-1 text-zinc-500">
                            <Clock className="w-3 h-3" />
                            {ev.time}
                          </span>
                        </div>

                        <h4 className="font-semibold text-xs sm:text-sm text-white mb-2 leading-snug">
                          {ev.title}
                        </h4>

                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                          {ev.summary}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Manba: {ev.source}</span>
                        <button
                          type="button"
                          onClick={() => onAskAi(`${region.name}: ${ev.title}`)}
                          className="text-[#FF6A00] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <span>AI tahlil</span>
                          <Sparkles className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: YouTube Video Player & Playlist */}
          {activeTab === 'videos' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Primary YouTube Video Screen */}
              {currentVideo ? (
                <div className="space-y-4">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#FF6A00]/30 shadow-2xl">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${currentVideo.id}?autoplay=0&rel=0&modestbranding=1`}
                      title={currentVideo.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>

                  {/* Video Meta Info */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1">
                          <Youtube className="w-3.5 h-3.5 fill-current" />
                          {currentVideo.channel}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-xs font-mono text-zinc-400">
                          {new Date(currentVideo.published).toLocaleString()}
                        </span>
                      </div>

                      <h3 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-white mb-1">
                        {currentVideo.title}
                      </h3>
                    </div>

                    <a
                      href={`https://www.youtube.com/watch?v=${currentVideo.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-200 border border-red-500/30 text-xs font-semibold shrink-0 transition-all cursor-pointer"
                    >
                      <span>YouTube'da ochish</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-zinc-500 text-sm">
                  {videosLoading
                    ? 'Mintaqa boʻyicha eng koʻp koʻrilgan videolar yuklanmoqda...'
                    : !videosConfigured
                    ? 'YouTube API kaliti sozlanmagan. Quyidagi qidiruv orqali videolarni koʻring.'
                    : 'Hozircha bu mavzu boʻyicha mos video topilmadi. Quyidagi qidiruvni koʻring.'}
                </div>
              )}

              {/* Video Playlist / Available Video Reports */}
              <div>
                <h4 className="font-['Space_Grotesk'] text-sm font-bold text-zinc-300 uppercase tracking-wider mb-3">
                  Eng koʻp koʻrilayotgan videolar (jonli) ({liveVideos.length})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {liveVideos.map(vid => {
                    const isPlaying = currentVideo?.id === vid.id;
                    return (
                      <div
                        key={vid.id}
                        onClick={() => setSelectedVideo(vid)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isPlaying
                            ? 'bg-[#FF6A00]/10 border-[#FF6A00] shadow-[0_0_15px_rgba(255,106,0,0.2)]'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="relative w-20 h-14 rounded-lg bg-black/60 shrink-0 overflow-hidden flex items-center justify-center border border-white/10">
                          <img
                            src={vid.thumbnail || `https://img.youtube.com/vi/${vid.id}/hqdefault.jpg`}
                            alt={vid.title}
                            className="w-full h-full object-cover"
                            onError={e => {
                              // Fallback if thumbnail blocked
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play className="w-5 h-5 text-white fill-current opacity-90" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-mono text-zinc-400 block mb-0.5 truncate">
                            {vid.channel}
                          </span>
                          <h5 className="font-semibold text-xs text-white line-clamp-2 leading-snug mb-1">
                            {vid.title}
                          </h5>
                          <span className="text-[10px] font-mono text-[#FF6A00]">
                            {new Date(vid.published).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live YouTube Search Discovery Trigger */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Search className="w-4 h-4 text-[#FF6A00]" />
                  <span>
                    Ushbu mintaqaga oid boshqa jonli YouTube videolarni qidirmoqchimisiz?
                  </span>
                </div>

                <a
                  href={
                    videosSearchUrl ||
                    `https://www.youtube.com/results?search_query=${encodeURIComponent(region.name + ' yangiliklar xabarlari tahlil')}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium shrink-0 cursor-pointer"
                >
                  <span>YouTube qidiruvini ochish</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: Key Indicators & Telemetry */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {region.keyIndicators.map((ind, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center"
                  >
                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                      {ind.label}
                    </span>
                    <strong className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-white block">
                      {ind.value}
                    </strong>
                    <div className="flex items-center justify-center gap-1 text-[11px] text-[#FF6A00] mt-1 font-mono">
                      <TrendingUp className="w-3 h-3" />
                      <span>Barqaror oʻsish</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Featured Discussion Topics */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                <h4 className="font-['Space_Grotesk'] text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#FF6A00]" />
                  <span>Faol qidiruv va tahlil teglari</span>
                </h4>

                <div className="flex items-center gap-2 flex-wrap">
                  {region.featuredTopics.map((topic, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onAskAi(topic)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#FF6A00] hover:text-black border border-white/10 text-xs text-zinc-300 font-medium transition-all cursor-pointer"
                    >
                      # {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Call to Action */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF6A00]" />
            <span>
              Humayro_3.3 real-vaqt global lentalar va YouTube video monitoringi
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onAskAi(`${region.name} bo'yicha eng so'nggi yangiliklar, muammolar va tahlil`)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#FF6A00] text-black hover:bg-[#FF8A24] transition-all cursor-pointer shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI bilan chuqur tahlil qilish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
