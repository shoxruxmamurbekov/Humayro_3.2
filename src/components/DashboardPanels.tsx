import React, { useId, useState } from 'react';
import { Activity, ChevronDown, Flame, Radio, RefreshCw, Rss } from 'lucide-react';
import { Article, SupportedLanguage } from '../types';
import { TrendingHotspotItem } from '../services/api';
import { formatTimeAgoLocale, getUiText } from '../i18n/uiTranslations';
import { SignalMetrics } from './SignalMetrics';

// Region codes match the pin codes used on the world map (WorldMapSection).
const REGION_CODES: Record<string, string> = {
  'central-asia': 'UZ/CA',
  'east-asia': 'KR/EA',
  'europe': 'EU/BRU',
  'north-america': 'US/NA',
  'middle-east': 'ME/GULF',
  'africa': 'AFR',
  'south-america': 'SA/BRA',
  'oceania': 'OC/SYD'
};

const panelClass = 'rounded-2xl bg-[#0B0F14] border border-white/[0.07] p-4';
const panelTitleClass = 'flex items-center justify-between gap-2 text-[11px] font-mono tracking-wider uppercase text-[#7C8797]';

interface DashboardSidebarProps {
  lang: SupportedLanguage;
  regionalArticles?: Record<string, Article[]>;
  latestBreaking?: Article | null;
  isRefreshing: boolean;
  lastUpdated?: Date;
  countdown: number;
  onRefresh: () => void;
  onSelectArticle: (article: Article) => void;
}

/** Narrow monitoring sidebar. On small screens it collapses behind a toggle. */
export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  lang,
  regionalArticles,
  latestBreaking,
  isRefreshing,
  lastUpdated,
  countdown,
  onRefresh,
  onSelectArticle
}) => {
  const ui = getUiText(lang);
  const [open, setOpen] = useState(false);
  const contentId = useId();

  const regions = Object.entries(REGION_CODES)
    .map(([key, code]) => ({ key, code, items: regionalArticles?.[key] || [] }))
    .filter(r => r.items.length > 0);

  return (
    <aside aria-label={ui.signal_live} className="min-w-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        className="lg:hidden w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-[#0B0F14] border border-white/[0.07] text-xs font-mono tracking-wider text-[#F5F7FA] cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          {ui.signal_live}
        </span>
        <ChevronDown className={`w-4 h-4 text-[#7C8797] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <div id={contentId} className={`${open ? 'flex' : 'hidden'} lg:flex flex-col gap-3 mt-3 lg:mt-0`}>
        {/* Stream status */}
        <div className={panelClass}>
          <div className={panelTitleClass}>
            <span className="flex items-center gap-1.5 text-[#22C55E] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              {ui.signal_live}
            </span>
            <Activity className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="mt-2 text-xs text-[#F5F7FA]">{ui.signal_stream_active}</p>
          <p className="mt-1 text-[11px] font-mono text-[#7C8797]">{ui.signal_monitoring_247}</p>
          <div className="mt-3 flex flex-col gap-0.5 text-[11px] font-mono text-[#7C8797]">
            <span>
              {ui.feed_sync} {countdown}s
            </span>
            {lastUpdated && <span>{lastUpdated.toLocaleTimeString()}</span>}
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-[#F5F7FA] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? ui.feed_refreshing : ui.feed_refresh_btn}
          </button>
        </div>

        {/* Latest breaking signal */}
        {latestBreaking && (
          <div className={panelClass}>
            <div className={panelTitleClass}>
              <span>{ui.nav_live}</span>
              <Radio className="w-3.5 h-3.5 text-(--accent)" />
            </div>
            <button
              type="button"
              onClick={() => onSelectArticle(latestBreaking)}
              className="mt-2 text-left text-xs font-medium leading-relaxed text-[#F5F7FA] hover:text-(--accent) transition-colors cursor-pointer line-clamp-4"
            >
              {latestBreaking.title}
            </button>
            <p className="mt-1.5 text-[11px] font-mono text-[#7C8797] truncate">
              {latestBreaking.source} · {formatTimeAgoLocale(latestBreaking.publishedAt, lang)}
            </p>
          </div>
        )}

        {/* Regional signal counts (from live regional articles) */}
        {regions.length > 0 && (
          <div className={panelClass}>
            <div className={panelTitleClass}>
              <span>{ui.nav_regions}</span>
            </div>
            <ul className="mt-2 divide-y divide-white/[0.05]">
              {regions.map(r => (
                <li key={r.key}>
                  <button
                    type="button"
                    onClick={() => onSelectArticle(r.items[0])}
                    className="w-full flex items-center justify-between gap-2 py-2 text-xs text-[#F5F7FA] hover:text-(--accent) transition-colors cursor-pointer"
                  >
                    <span className="font-mono">{r.code}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      ● {r.items.length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
};

interface DashboardBottomPanelsProps {
  lang: SupportedLanguage;
  liveArticles: Article[];
  trendingHotspots?: { uzbekistan: TrendingHotspotItem[]; global: TrendingHotspotItem[] };
  onSelectArticle: (article: Article) => void;
  onSearch: (query: string) => void;
}

/** Compact three-panel analytics row: signal metrics, live feed summary, trending signals. */
export const DashboardBottomPanels: React.FC<DashboardBottomPanelsProps> = ({
  lang,
  liveArticles,
  trendingHotspots,
  onSelectArticle,
  onSearch
}) => {
  const ui = getUiText(lang);
  const allTrending = [
    ...(trendingHotspots?.uzbekistan || []),
    ...(trendingHotspots?.global || [])
  ].sort((a, b) => b.trendScore - a.trendScore);
  const trending = allTrending.slice(0, 5);
  const feed = liveArticles.slice(0, 5);

  return (
    <section
      aria-label={ui.metrics_activity}
      className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 items-stretch"
    >
      {/* 1. Signal metrics (real live values only) */}
      <SignalMetrics
        compact
        totalArticlesCount={liveArticles.length}
        trendingCount={allTrending.length}
        currentLang={lang}
      />

      {/* 2. Live feed summary */}
      <div className={`${panelClass} min-w-0`}>
        <div className={panelTitleClass}>
          <span>{ui.feed_title.replace(/\.$/, '')}</span>
          <Rss className="w-3.5 h-3.5 text-(--accent)" />
        </div>
        {feed.length === 0 ? (
          <p className="mt-3 text-xs text-[#7C8797]">{ui.feed_loading}</p>
        ) : (
          <ul className="mt-2 divide-y divide-white/[0.05]">
            {feed.map(a => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => onSelectArticle(a)}
                  className="w-full text-left py-2 cursor-pointer group"
                >
                  <span className="block text-xs text-[#F5F7FA] group-hover:text-(--accent) transition-colors truncate">
                    {a.title}
                  </span>
                  <span className="block text-[10px] font-mono text-[#7C8797] truncate">
                    {a.source} · {formatTimeAgoLocale(a.publishedAt, lang)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 3. Trending signals */}
      <div className={`${panelClass} min-w-0 sm:col-span-2 xl:col-span-1`}>
        <div className={panelTitleClass}>
          <span>{ui.metrics_trending}</span>
          <Flame className="w-3.5 h-3.5 text-[#22C55E]" />
        </div>
        {trending.length === 0 ? (
          <p className="mt-3 text-xs text-[#7C8797]">{ui.feed_loading}</p>
        ) : (
          <ul className="mt-2 divide-y divide-white/[0.05]">
            {trending.map(item => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSearch(item.query)}
                  className="w-full flex items-center justify-between gap-3 py-2 text-left cursor-pointer group"
                >
                  <span className="min-w-0">
                    <span className="block text-xs text-[#F5F7FA] group-hover:text-(--accent) transition-colors truncate">
                      {item.title}
                    </span>
                    <span className="block text-[10px] font-mono text-[#7C8797]">
                      {item.region === 'uzbekistan' ? ui.tab_uzbekistan : ui.tab_global}
                    </span>
                  </span>
                  <span className="shrink-0 px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] text-(--accent) font-bold font-mono">
                    {ui.signal_label} {item.trendScore}%
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
