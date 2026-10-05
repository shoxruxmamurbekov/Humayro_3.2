import React, { useState, useMemo } from 'react';
import { Radio, Play, MapPin, Youtube, AlertTriangle, Layers, ExternalLink, Flame, Globe, Sparkles, Clock, RefreshCw } from 'lucide-react';
import { TranslationDict } from '../i18n/translations';
import { Article, SupportedLanguage } from '../types';
import { useRegionLive } from '../services/useRegionLive';
import { REGIONS_INTELLIGENCE_DATA, RegionIntelligence } from '../data/regionsData';
import { RegionIntelligenceModal } from './RegionIntelligenceModal';
import { CyberGlobe3D, Hotspot3D } from './CyberGlobe3D';

interface WorldMapSectionProps {
  dict: TranslationDict;
  onSelectRegion?: (regionId: string, regionLabel: string) => void;
  onAskAi: (query: string) => void;
  regionalArticles?: Record<string, Article[]>;
  onSelectArticle?: (article: Article) => void;
  isRefreshing?: boolean;
  lastUpdated?: Date;
  lang?: SupportedLanguage;
}

interface HotspotPin extends Hotspot3D {
  cx: number;
  cy: number;
}

const BASE_HOTSPOT_PINS: HotspotPin[] = [
  {
    regionKey: 'central-asia',
    name: "O'zbekiston va Markaziy Osiyo",
    code: 'UZ/CA',
    lat: 41.3,
    lon: 69.2,
    cx: 600,
    cy: 160,
    status: 'elevated',
    statusBadge: 'Yuqori faollik',
    headline: 'Raqamli iqtisodiyot, yashil energetika yoʻlaklari va suv xavfsizligi',
    videoCount: 3,
    issueCount: 3,
    liveCount: 5
  },
  {
    regionKey: 'east-asia',
    name: 'Sharqiy Osiyo va Tinch Okeani',
    code: 'KR/EA',
    lat: 37.5,
    lon: 127.0,
    cx: 750,
    cy: 165,
    status: 'critical',
    statusBadge: 'Kritik diqqat',
    headline: 'Yarimoʻtkazgichlar ishlab chiqarish va sunʼiy intellekt chip poygasi',
    videoCount: 2,
    issueCount: 2,
    liveCount: 3
  },
  {
    regionKey: 'europe',
    name: 'Yevropa Ittifoqi',
    code: 'EU/BRU',
    lat: 50.8,
    lon: 4.3,
    cx: 490,
    cy: 145,
    status: 'elevated',
    statusBadge: 'Qonunchilik',
    headline: 'Energetika mustaqilligi, yangi AI Act qoidalari va iqtisodiy islohotlar',
    videoCount: 2,
    issueCount: 2,
    liveCount: 4
  },
  {
    regionKey: 'north-america',
    name: 'Shimoliy Amerika (AQSH / Kanada)',
    code: 'US/NA',
    lat: 38.9,
    lon: -77.0,
    cx: 210,
    cy: 175,
    status: 'critical',
    statusBadge: 'Kritik diqqat',
    headline: 'Silikon vodiysi AI inqilobi, maʼlumot markazlari va moliya bozorlari',
    videoCount: 2,
    issueCount: 2,
    liveCount: 4
  },
  {
    regionKey: 'middle-east',
    name: 'Yaqin Sharq va Fors koʻrfazi',
    code: 'ME/GULF',
    lat: 25.2,
    lon: 55.3,
    cx: 560,
    cy: 220,
    status: 'elevated',
    statusBadge: 'Strategik hab',
    headline: 'AI investitsiya fondlari, Vision 2030 va tinchlik diplomatiyasi',
    videoCount: 2,
    issueCount: 2,
    liveCount: 2
  },
  {
    regionKey: 'africa',
    name: 'Afrika qitʼasi',
    code: 'AFR',
    lat: -1.3,
    lon: 36.8,
    cx: 520,
    cy: 280,
    status: 'monitored',
    statusBadge: 'Rivojlanish',
    headline: 'Raqamli startaplar, togʻ-kon sanoati va energetika loyihalari',
    videoCount: 2,
    issueCount: 2,
    liveCount: 2
  },
  {
    regionKey: 'south-america',
    name: 'Janubiy Amerika',
    code: 'SA/BRA',
    lat: -23.5,
    lon: -46.6,
    cx: 290,
    cy: 330,
    status: 'monitored',
    statusBadge: 'Monitoring',
    headline: 'Bio-xavfsizlik, agrotexnologiyalar va qayta tiklanuvchi energiya',
    videoCount: 2,
    issueCount: 2,
    liveCount: 1
  },
  {
    regionKey: 'oceania',
    name: 'Avstraliya va Okeaniya',
    code: 'OC/SYD',
    lat: -33.8,
    lon: 151.2,
    cx: 820,
    cy: 350,
    status: 'monitored',
    statusBadge: 'Monitoring',
    headline: 'Kosmik kuzatuv stansiyalari, yashil vodorod va dengiz ekologiyasi',
    videoCount: 2,
    issueCount: 2,
    liveCount: 1
  }
];

export const WorldMapSection: React.FC<WorldMapSectionProps> = ({
  dict,
  onSelectRegion,
  onAskAi,
  regionalArticles,
  onSelectArticle,
  isRefreshing = false,
  lastUpdated,
  lang = 'uz'
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('central-asia');
  // Live, region-specific news + weather for the currently selected region (auto-refreshes every 30s)
  const regionLive = useRegionLive(selectedKey, lang);
  const [viewMode, setViewMode] = useState<'3d-globe' | '2d-radar'>('3d-globe');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeModalRegion, setActiveModalRegion] = useState<RegionIntelligence | null>(
    REGIONS_INTELLIGENCE_DATA['central-asia']
  );

  // Dynamically compute hotspots based on continuous live incoming feed
  const dynamicHotspots = useMemo(() => {
    return BASE_HOTSPOT_PINS.map(base => {
      const news = regionalArticles?.[base.regionKey] || [];
      const hasLive = news.length > 0;
      const latest = hasLive ? news[0] : null;

      const hasTrending = news.some(n => n.isTrending || (n.trendScore && n.trendScore > 90));
      const status: 'critical' | 'elevated' | 'monitored' = hasTrending
        ? 'critical'
        : hasLive
        ? 'elevated'
        : base.status;
      const statusBadge = hasTrending
        ? 'Qaynoq breaking'
        : hasLive
        ? 'Jonli efir'
        : base.statusBadge;
      const headline = latest ? latest.title : base.headline;

      return {
        ...base,
        status,
        statusBadge,
        headline,
        liveCount: news.length
      };
    });
  }, [regionalArticles]);

  const handleOpenRegion = (key: string) => {
    setSelectedKey(key);
    const data = REGIONS_INTELLIGENCE_DATA[key] || REGIONS_INTELLIGENCE_DATA['central-asia'];
    setActiveModalRegion(data);
    setModalOpen(true);
    if (onSelectRegion) {
      onSelectRegion(data.id, data.name);
    }
  };

  const handleSelectKeyOnly = (key: string) => {
    setSelectedKey(key);
    const data = REGIONS_INTELLIGENCE_DATA[key] || REGIONS_INTELLIGENCE_DATA['central-asia'];
    setActiveModalRegion(data);
  };

  const currentHotspot = dynamicHotspots.find(p => p.regionKey === selectedKey) || dynamicHotspots[0];
  const liveNewsForSelected =
    regionLive.data && regionLive.data.articles.length > 0
      ? regionLive.data.articles
      : regionalArticles?.[selectedKey] || [];
  const latestLiveNews = liveNewsForSelected.length > 0 ? liveNewsForSelected[0] : null;

  return (
    <section id="map" className="relative py-24 px-4 sm:px-6 z-10">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-medium tracking-widest uppercase text-zinc-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
            <span>Real-Vaqt Mintaqaviy Yangiliklar & Telemetriya</span>
          </div>

          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold tracking-tight mb-3">
            <span>Interaktiv Dunyo Sferasi: </span>
            <span className="bg-gradient-to-r from-[#FF6A00] via-[#FF8A24] to-[#FFA84D] bg-clip-text text-transparent">
              Jonli Lenta & YouTube Tahlillari
            </span>
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
            Yer sharidagi barcha nuqtalar doimiy ravishda real-vaqtda jonli xalqaro axborot oqimi bilan yangilanib turadi. Sferani 360° erkin aylantiring, xohlagan qit’a ustiga bosing va eng soʻnggi voqealar bilan tanishing.
          </p>

          {/* Dual Mode Switcher: 3D Sfera vs 2D Radar Xarita */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-white/[0.05] border border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('3d-globe')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                viewMode === '3d-globe'
                  ? 'bg-[#FF6A00] text-black shadow-lg font-bold scale-102'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>3D Sfera (Globus)</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 font-sans">360°</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('2d-radar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                viewMode === '2d-radar'
                  ? 'bg-[#FF6A00] text-black shadow-lg font-bold scale-102'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>2D Radar Xarita</span>
            </button>
          </div>
        </div>

        {/* Hotspots Quick Switch Bar */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
          <span className="text-xs text-zinc-500 font-mono flex items-center gap-1 mr-1">
            <Radio className="w-3.5 h-3.5 text-[#FF6A00] animate-pulse" />
            <span>Mintaqani tanlang:</span>
          </span>
          {dynamicHotspots.map(h => (
            <button
              key={h.regionKey}
              type="button"
              onClick={() => handleSelectKeyOnly(h.regionKey)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedKey === h.regionKey
                  ? 'bg-[#FF6A00] text-black font-bold shadow-[0_0_15px_rgba(255,106,0,0.5)] scale-105'
                  : 'bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-[#FF6A00]/50'
              }`}
            >
              <span>{h.code}</span>
              <span className="hidden sm:inline font-sans text-[11px]">· {h.name.split(' ')[0]}</span>
              {h.liveCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/30 text-emerald-200 font-bold">
                  ● {h.liveCount}
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">
                  ▶ {h.videoCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* View Mode 1: 3D Hologram CyberGlobe */}
        {viewMode === '3d-globe' ? (
          <CyberGlobe3D
            selectedRegionKey={selectedKey}
            onSelectRegion={handleOpenRegion}
            customHotspots={dynamicHotspots}
          />
        ) : (
          /* View Mode 2: 2D Radar SVG Map Frame */
          <div className="relative p-4 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
            {/* Top border ambient gradient light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#FF6A00] to-transparent pointer-events-none" />

            {/* Radar Sweep Effect */}
            <div className="absolute inset-0 bg-radial from-[#FF6A00]/5 to-transparent pointer-events-none opacity-40" />

            <svg
              className="w-full h-auto select-none"
              viewBox="0 0 1000 500"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Continent clickable shapes */}
              <g className="continents">
                {/* North America */}
                <path
                  d="M150,120 Q180,100 220,110 L260,130 Q280,160 270,200 L240,230 Q200,240 170,220 L140,180 Q130,150 150,120 Z"
                  className={`transition-all duration-300 cursor-pointer ${
                    selectedKey === 'north-america'
                      ? 'fill-[#FF6A00]/30 stroke-[#FF6A00] stroke-2'
                      : 'fill-[#FF6A00]/[0.08] stroke-[#FF6A00]/40 hover:fill-[#FF6A00]/25 hover:stroke-[#FF6A00]'
                  }`}
                  onClick={() => handleOpenRegion('north-america')}
                >
                  <title>Shimoliy Amerika (AQSH va Kanada) — Hodisalar & Videolar</title>
                </path>

                {/* South America */}
                <path
                  d="M260,260 Q300,260 320,300 L310,380 Q290,440 260,420 L240,360 Q230,300 260,260 Z"
                  className={`transition-all duration-300 cursor-pointer ${
                    selectedKey === 'south-america'
                      ? 'fill-[#FF6A00]/30 stroke-[#FF6A00] stroke-2'
                      : 'fill-[#FF6A00]/[0.08] stroke-[#FF6A00]/40 hover:fill-[#FF6A00]/25 hover:stroke-[#FF6A00]'
                  }`}
                  onClick={() => handleOpenRegion('south-america')}
                >
                  <title>Janubiy Amerika — Hodisalar & Videolar</title>
                </path>

                {/* Europe */}
                <path
                  d="M460,110 Q510,95 530,130 L520,165 Q480,180 460,155 L450,130 Z"
                  className={`transition-all duration-300 cursor-pointer ${
                    selectedKey === 'europe'
                      ? 'fill-[#FF6A00]/30 stroke-[#FF6A00] stroke-2'
                      : 'fill-[#FF6A00]/[0.08] stroke-[#FF6A00]/40 hover:fill-[#FF6A00]/25 hover:stroke-[#FF6A00]'
                  }`}
                  onClick={() => handleOpenRegion('europe')}
                >
                  <title>Yevropa Ittifoqi — Hodisalar & Videolar</title>
                </path>

                {/* Africa */}
                <path
                  d="M470,195 Q530,195 550,230 L560,300 Q540,380 490,360 L460,280 Q440,230 470,195 Z"
                  className={`transition-all duration-300 cursor-pointer ${
                    selectedKey === 'africa'
                      ? 'fill-[#FF6A00]/30 stroke-[#FF6A00] stroke-2'
                      : 'fill-[#FF6A00]/[0.08] stroke-[#FF6A00]/40 hover:fill-[#FF6A00]/25 hover:stroke-[#FF6A00]'
                  }`}
                  onClick={() => handleOpenRegion('africa')}
                >
                  <title>Afrika — Hodisalar & Videolar</title>
                </path>

                {/* Central Asia (Special Glowing Focus) */}
                <path
                  d="M560,130 Q630,120 660,155 L650,190 Q600,200 560,180 L550,150 Z"
                  className={`transition-all duration-300 cursor-pointer ${
                    selectedKey === 'central-asia'
                      ? 'fill-[#FF6A00]/40 stroke-[#FF6A00] stroke-2 shadow-lg filter drop-shadow-[0_0_12px_#FF6A00]'
                      : 'fill-[#FF6A00]/20 stroke-[#FF6A00] hover:fill-[#FF6A00]/35'
                  }`}
                  onClick={() => handleOpenRegion('central-asia')}
                >
                  <title>Oʻzbekiston va Markaziy Osiyo — Hodisalar & Videolar</title>
                </path>

                {/* East Asia & Asia Pacific */}
                <path
                  d="M660,130 Q780,110 820,160 L800,240 Q720,260 670,210 L660,160 Z"
                  className={`transition-all duration-300 cursor-pointer ${
                    selectedKey === 'east-asia'
                      ? 'fill-[#FF6A00]/30 stroke-[#FF6A00] stroke-2'
                      : 'fill-[#FF6A00]/[0.08] stroke-[#FF6A00]/40 hover:fill-[#FF6A00]/25 hover:stroke-[#FF6A00]'
                  }`}
                  onClick={() => handleOpenRegion('east-asia')}
                >
                  <title>Sharqiy Osiyo va Tinch Okeani — Hodisalar & Videolar</title>
                </path>

                {/* Middle East */}
                <path
                  d="M530,185 Q580,185 590,215 L580,245 Q550,260 530,235 Z"
                  className={`transition-all duration-300 cursor-pointer ${
                    selectedKey === 'middle-east'
                      ? 'fill-[#FF6A00]/30 stroke-[#FF6A00] stroke-2'
                      : 'fill-[#FF6A00]/[0.08] stroke-[#FF6A00]/40 hover:fill-[#FF6A00]/25 hover:stroke-[#FF6A00]'
                  }`}
                  onClick={() => handleOpenRegion('middle-east')}
                >
                  <title>Yaqin Sharq — Hodisalar & Videolar</title>
                </path>

                {/* Australia */}
                <path
                  d="M770,320 Q840,310 860,350 L840,400 Q780,410 760,370 Z"
                  className={`transition-all duration-300 cursor-pointer ${
                    selectedKey === 'oceania'
                      ? 'fill-[#FF6A00]/30 stroke-[#FF6A00] stroke-2'
                      : 'fill-[#FF6A00]/[0.08] stroke-[#FF6A00]/40 hover:fill-[#FF6A00]/25 hover:stroke-[#FF6A00]'
                  }`}
                  onClick={() => handleOpenRegion('oceania')}
                >
                  <title>Avstraliya va Okeaniya — Hodisalar & Videolar</title>
                </path>
              </g>

              {/* Connecting Trade & Intelligence Arcs */}
              <g className="arcs opacity-40">
                <path
                  d="M600,160 Q670,120 750,165"
                  fill="none"
                  stroke="#FF6A00"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d="M600,160 Q550,120 490,145"
                  fill="none"
                  stroke="#FF6A00"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d="M490,145 Q350,100 210,175"
                  fill="none"
                  stroke="#FFA84D"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <path
                  d="M600,160 Q580,200 560,220"
                  fill="none"
                  stroke="#FF6A00"
                  strokeWidth="1.5"
                />
              </g>

              {/* Hotspot Radar Pins */}
              {dynamicHotspots.map(pin => {
                const isSelected = selectedKey === pin.regionKey;
                const statusColor =
                  pin.status === 'critical'
                    ? '#f43f5e'
                    : pin.status === 'elevated'
                    ? '#FF6A00'
                    : '#38bdf8';

                return (
                  <g
                    key={pin.regionKey}
                    className="cursor-pointer group"
                    onClick={() => handleOpenRegion(pin.regionKey)}
                  >
                    {/* Animated Ripple Wave */}
                    <circle
                      cx={pin.cx}
                      cy={pin.cy}
                      r={isSelected ? 18 : 12}
                      fill="none"
                      stroke={statusColor}
                      strokeWidth="1.5"
                      opacity="0.6"
                      className="animate-ping"
                    />

                    {/* Beacon Aura */}
                    <circle
                      cx={pin.cx}
                      cy={pin.cy}
                      r={isSelected ? 8 : 6}
                      fill={statusColor}
                      opacity={isSelected ? 0.9 : 0.7}
                      className="transition-all duration-300"
                    />

                    {/* Core Pin */}
                    <circle
                      cx={pin.cx}
                      cy={pin.cy}
                      r={isSelected ? 4 : 3}
                      fill="#FFFFFF"
                      stroke={statusColor}
                      strokeWidth="1.5"
                    />

                    {/* Floating Code Badge */}
                    <rect
                      x={pin.cx + 8}
                      y={pin.cy - 12}
                      width={pin.code.length * 7 + 10}
                      height={18}
                      rx={4}
                      fill={isSelected ? '#FF6A00' : '#08080c'}
                      stroke={isSelected ? '#ffffff' : '#FF6A00'}
                      strokeWidth="1"
                      opacity="0.9"
                    />
                    <text
                      x={pin.cx + 13}
                      y={pin.cy + 1}
                      fill={isSelected ? '#000000' : '#ffffff'}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {pin.code}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* Interactive Floating Hotspot Intel Drawer (For Selected Region) */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-black/75 border border-[#FF6A00]/40 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FF6A00] text-black flex items-center justify-center shrink-0 font-bold shadow-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold text-white text-sm sm:text-base">
                  {currentHotspot.name}
                </span>
                <span className="font-mono text-xs text-[#FF6A00] font-bold px-2 py-0.5 rounded bg-[#FF6A00]/15 border border-[#FF6A00]/30">
                  [{currentHotspot.code}]
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 uppercase font-bold">
                  {currentHotspot.statusBadge}
                </span>
                {liveNewsForSelected.length > 0 && (
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {liveNewsForSelected.length} ta jonli xabar
                  </span>
                )}
                <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                  <Youtube className="w-3.5 h-3.5 text-red-500 fill-current" />
                  {currentHotspot.videoCount} ta video hisobot
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                {currentHotspot.headline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
            {latestLiveNews && onSelectArticle && (
              <button
                type="button"
                onClick={() => onSelectArticle(latestLiveNews)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF6A00]" />
                <span>Jonli hisobot AI tahlili</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleOpenRegion(selectedKey)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FF6A00] text-black hover:bg-[#FF8A24] transition-all cursor-pointer shadow-lg hover:scale-102"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Vaziyat va YouTube videolarni koʻrish</span>
            </button>
          </div>
        </div>

        {/* Map Legend */}
        <div className="flex items-center justify-between flex-wrap gap-4 mt-6 pt-4 border-t border-white/5 text-xs text-zinc-400">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6A00] shadow-[0_0_8px_#FF6A00] animate-pulse" />
              <span>3D Sfera & Jonli radar monitoringi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Doimiy yangilanuvchi agentliklar lentasi</span>
            </div>
            <div className="flex items-center gap-2">
              <Youtube className="w-3.5 h-3.5 text-red-500 fill-current" />
              <span>YouTube videoli hisobotlar integratsiyasi</span>
            </div>
          </div>
          <div className="font-mono text-[11px] text-zinc-500">
            HUMAYRO_3.2 // REAL-TIME 3D HOLOGRAPHIC GEO-RADAR
          </div>
        </div>
      </div>

      {/* Rich Interactive Region Intelligence & YouTube Modal */}
      <RegionIntelligenceModal
        isOpen={modalOpen}
        region={activeModalRegion}
        onClose={() => setModalOpen(false)}
        onAskAi={(query) => {
          setModalOpen(false);
          onAskAi(query);
        }}
        dict={dict}
        liveArticles={liveNewsForSelected}
        onSelectArticle={onSelectArticle}
        liveWeather={regionLive.data?.weather || []}
        liveLoading={regionLive.isLoading}
        liveError={regionLive.error}
        liveLastUpdated={regionLive.lastUpdated}
        liveCountdown={regionLive.countdown}
        onRefreshLive={regionLive.refreshNow}
      />
    </section>
  );
};
