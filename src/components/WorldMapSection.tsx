import React, { useState, useMemo } from 'react';
import {
  Radio,
  Play,
  MapPin,
  Youtube,
  AlertTriangle,
  Layers,
  ExternalLink,
  Flame,
  Globe,
  Sparkles,
  Clock,
  RefreshCw,
  BarChart3,
  CloudSun,
  Wind,
  Droplets,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Compass,
  Eye,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { TranslationDict } from '../i18n/translations';
import { Article, SupportedLanguage } from '../types';
import { useRegionLive, useRegionVideos } from '../services/useRegionLive';
import type { RegionVideo } from '../services/api';
import { REGIONS_INTELLIGENCE_DATA, RegionIntelligence } from '../data/regionsData';
import { RegionIntelligenceModal } from './RegionIntelligenceModal';
import { CyberGlobe3D, Hotspot3D } from './CyberGlobe3D';
import { getUiText, formatTimeAgoLocale } from '../i18n/uiTranslations';

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

function weatherLabel(code: number | null, lang: SupportedLanguage = 'uz'): string {
  if (code === null) return '—';
  if (lang === 'uz') {
    if (code === 0) return 'Ochiq';
    if (code <= 3) return 'Qisman bulutli';
    if (code <= 48) return 'Tumanli';
    if (code <= 67) return 'Yomgʻirli';
    if (code <= 77) return 'Qorli';
    if (code <= 82) return 'Jala';
    if (code <= 86) return 'Qor yogʻmoqda';
    return 'Momaqaldiroq';
  } else if (lang === 'ru') {
    if (code === 0) return 'Ясно';
    if (code <= 3) return 'Переменная облачность';
    if (code <= 48) return 'Туман';
    if (code <= 67) return 'Дождь';
    if (code <= 77) return 'Снег';
    if (code <= 82) return 'Ливень';
    if (code <= 86) return 'Снегопад';
    return 'Гроза';
  } else {
    if (code === 0) return 'Clear';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rain';
    if (code <= 77) return 'Snow';
    if (code <= 82) return 'Heavy Rain';
    if (code <= 86) return 'Snowfall';
    return 'Thunderstorm';
  }
}

// Equirectangular projection coordinates for 1000x500 viewport
const BASE_HOTSPOT_PINS: HotspotPin[] = [
  {
    regionKey: 'central-asia',
    name: "O'zbekiston va Markaziy Osiyo",
    code: 'UZ/CA',
    lat: 41.3,
    lon: 69.2,
    cx: 692,
    cy: 135,
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
    cx: 853,
    cy: 146,
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
    cx: 512,
    cy: 109,
    status: 'elevated',
    statusBadge: 'Qonunchilik & AI Act',
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
    cx: 286,
    cy: 142,
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
    cx: 654,
    cy: 180,
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
    cx: 602,
    cy: 254,
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
    cx: 371,
    cy: 315,
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
    cx: 920,
    cy: 344,
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
  const [viewMode, setViewMode] = useState<'3d-globe' | '2d-radar'>('2d-radar');
  const [workspaceTab, setWorkspaceTab] = useState<'overview' | 'events' | 'debates' | 'indicators' | 'videos' | 'live'>('overview');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeModalRegion, setActiveModalRegion] = useState<RegionIntelligence | null>(null);
  const [selectedVideoEmbed, setSelectedVideoEmbed] = useState<RegionVideo | null>(null);

  const ui = getUiText(lang);

  // Live, region-specific news + weather for the currently selected region (auto-refreshes every 30s)
  const regionLive = useRegionLive(selectedKey, lang);
  // Live YouTube videos: most-watched recent videos on this region's hottest headlines
  const regionVideos = useRegionVideos(selectedKey, lang);
  const liveVideos = regionVideos.data?.videos ?? [];

  // Dynamic hotspot pins with real article count
  const dynamicHotspots = useMemo(() => {
    return BASE_HOTSPOT_PINS.map(pin => {
      const liveArts = regionalArticles?.[pin.regionKey] || [];
      const liveCount = liveArts.length > 0 ? liveArts.length : pin.liveCount;
      return {
        ...pin,
        liveCount
      };
    });
  }, [regionalArticles]);

  const currentHotspot = useMemo(() => {
    return dynamicHotspots.find(h => h.regionKey === selectedKey) || dynamicHotspots[0];
  }, [dynamicHotspots, selectedKey]);

  const currentRegionData = useMemo(() => {
    return REGIONS_INTELLIGENCE_DATA[selectedKey] || REGIONS_INTELLIGENCE_DATA['central-asia'];
  }, [selectedKey]);

  // Priority: fresh per-region articles from server hook, fallback to global feed mapping
  const liveNewsForSelected = useMemo(() => {
    if (regionLive.data?.articles && regionLive.data.articles.length > 0) {
      return regionLive.data.articles;
    }
    return regionalArticles?.[selectedKey] || [];
  }, [regionLive.data, regionalArticles, selectedKey]);

  const latestLiveNews = liveNewsForSelected[0];

  const handleOpenRegion = (regionKey: string) => {
    setSelectedKey(regionKey);
    const data = REGIONS_INTELLIGENCE_DATA[regionKey];
    if (data) {
      setActiveModalRegion(data);
      setModalOpen(true);
      if (onSelectRegion) {
        onSelectRegion(data.id, data.name);
      }
    }
  };

  const handleSelectKeyOnly = (regionKey: string) => {
    setSelectedKey(regionKey);
    setSelectedVideoEmbed(null);
  };

  return (
    <section id="map" className="relative py-16 sm:py-24 px-4 sm:px-6 z-10">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-[#FF6A00] font-bold uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
            <span>{ui.map_eyebrow}</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-5xl font-medium tracking-tight text-[#F5F7FA] mb-3">
            {ui.map_title}
          </h2>

          <p className="text-[#7C8797] text-sm sm:text-base leading-relaxed mb-6 font-normal">
            {ui.map_sub}
          </p>

          {/* Dual Mode Switcher: 3D Sfera vs 2D Radar Xarita */}
          <div className="inline-flex items-center p-1 rounded-xl bg-[#0B0F14] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setViewMode('2d-radar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                viewMode === '2d-radar'
                  ? 'bg-[#FF6A00] text-black font-bold shadow-md shadow-[#FF6A00]/25'
                  : 'text-[#7C8797] hover:text-[#F5F7FA]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{ui.map_view_2d}</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-black/20 font-mono">TACTICAL</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('3d-globe')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                viewMode === '3d-globe'
                  ? 'bg-[#FF6A00] text-black font-bold shadow-md shadow-[#FF6A00]/25'
                  : 'text-[#7C8797] hover:text-[#F5F7FA]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{ui.map_view_3d}</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-black/20 font-sans">360°</span>
            </button>
          </div>
        </div>

        {/* Hotspots Quick Switch Bar */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
          <span className="text-xs text-zinc-500 font-mono flex items-center gap-1 mr-1">
            <Radio className="w-3.5 h-3.5 text-[#FF6A00] animate-pulse" />
            <span>{ui.map_select_region}</span>
          </span>
          {dynamicHotspots.map(h => {
            const isSelected = selectedKey === h.regionKey;
            return (
              <button
                key={h.regionKey}
                type="button"
                onClick={() => handleSelectKeyOnly(h.regionKey)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#FF6A00] text-black font-bold shadow-[0_0_15px_rgba(255,106,0,0.5)] scale-105'
                    : 'bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-[#FF6A00]/50'
                }`}
              >
                <span>{h.code}</span>
                <span className="hidden sm:inline font-sans text-[11px]">· {h.name.split(' ')[0]}</span>
                {(h.liveCount ?? 0) > 0 ? (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-black/30 text-black' : 'bg-emerald-500/25 text-emerald-300'
                  }`}>
                    ● {h.liveCount}
                  </span>
                ) : (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-zinc-400'
                  }`}>
                    ▶ {h.videoCount ?? 0}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* View Mode 1: 3D Hologram CyberGlobe */}
        {viewMode === '3d-globe' ? (
          <CyberGlobe3D
            selectedRegionKey={selectedKey}
            onSelectRegion={handleOpenRegion}
            customHotspots={dynamicHotspots}
          />
        ) : (
          /* View Mode 2: High-Fidelity 2D Tactical Radar SVG Map */
          <div className="relative p-3 sm:p-6 rounded-3xl bg-[#0B0F14]/90 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
            {/* Top ambient orange indicator line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#FF6A00] to-transparent pointer-events-none" />

            {/* Tactical HUD Header Bar */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/[0.08] text-[10px] font-mono text-[#7C8797]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-zinc-300 font-bold tracking-wider">GEO-RADAR HUD 2D</span>
                <span className="text-zinc-600 hidden sm:inline">|</span>
                <span className="text-zinc-500 hidden sm:inline">PROJECTION: EQUIRECTANGULAR WGS84</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#FF6A00] font-bold">TARGET: [{currentHotspot.code}]</span>
                <span className="text-zinc-600 hidden md:inline">|</span>
                <span className="text-zinc-400 hidden md:inline">LAT {currentHotspot.lat.toFixed(1)}° LON {currentHotspot.lon.toFixed(1)}°</span>
                <span className="text-zinc-600 hidden lg:inline">|</span>
                <span className="text-zinc-500 hidden lg:inline">FREQ: 24.2 GHz</span>
              </div>
            </div>

            {/* Radar Sweep Effect */}
            <div className="absolute inset-0 bg-radial from-[#FF6A00]/5 to-transparent pointer-events-none opacity-40" />

            <svg
              className="w-full h-auto select-none rounded-2xl bg-[#05070A]/80 border border-white/[0.05]"
              viewBox="0 0 1000 500"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Tactical grid pattern */}
                <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.5" />
                </pattern>
                {/* Glow filter for active elements */}
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                {/* Central Asia active glow */}
                <filter id="uzbekGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Tactical Matrix Grid */}
              <rect width="1000" height="500" fill="url(#radarGrid)" />

              {/* Latitude Lines (Parallels) */}
              <g className="lat-lines opacity-25" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.75" strokeDasharray="3 3">
                <line x1="0" y1="83" x2="1000" y2="83" />  {/* 60°N */}
                <line x1="0" y1="167" x2="1000" y2="167" />{/* 30°N */}
                <line x1="0" y1="250" x2="1000" y2="250" stroke="#FF6A00" strokeWidth="1" opacity="0.6" strokeDasharray="none" /> {/* Equator */}
                <line x1="0" y1="333" x2="1000" y2="333" />{/* 30°S */}
                <line x1="0" y1="417" x2="1000" y2="417" />{/* 60°S */}
              </g>

              {/* Longitude Lines (Meridians) */}
              <g className="lon-lines opacity-20" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.75" strokeDasharray="3 3">
                <line x1="167" y1="0" x2="167" y2="500" /> {/* 120°W */}
                <line x1="333" y1="0" x2="333" y2="500" /> {/* 60°W */}
                <line x1="500" y1="0" x2="500" y2="500" stroke="#FF6A00" strokeWidth="1" opacity="0.5" strokeDasharray="none" /> {/* Prime Meridian 0° */}
                <line x1="667" y1="0" x2="667" y2="500" /> {/* 60°E */}
                <line x1="833" y1="0" x2="833" y2="500" /> {/* 120°E */}
              </g>

              {/* Coordinate degree labels along borders */}
              <g className="text-labels text-[8px] font-mono fill-zinc-500 opacity-60">
                <text x="10" y="86">60°N</text>
                <text x="10" y="170">30°N</text>
                <text x="10" y="253" fill="#FF6A00">0° EQUATOR</text>
                <text x="10" y="336">30°S</text>
                <text x="10" y="420">60°S</text>

                <text x="170" y="490">120°W</text>
                <text x="336" y="490">60°W</text>
                <text x="502" y="490" fill="#FF6A00">0° GMT</text>
                <text x="670" y="490">60°E</text>
                <text x="836" y="490">120°E</text>
              </g>

              {/* Tactical Radar Concentric Circles centered around Eurasia/Central Asia */}
              <g className="radar-circles opacity-20 pointer-events-none" stroke="#FF6A00" strokeWidth="0.8" fill="none">
                <circle cx="692" cy="135" r="90" strokeDasharray="4 4" />
                <circle cx="692" cy="135" r="180" strokeDasharray="6 6" />
                <circle cx="692" cy="135" r="280" strokeDasharray="8 8" />
              </g>

              {/* High-Precision Continent Silhouette Shapes */}
              <g className="continents-layer">
                {/* 1. NORTH AMERICA */}
                <path
                  d="M120,65 L165,55 L210,65 L260,50 L285,75 L310,70 L340,90 L320,115 L295,125 L300,165 L285,190 L260,205 L245,210 L235,235 L215,225 L195,200 L180,185 L145,170 L130,135 L115,100 Z
                     M335,40 L375,35 L385,60 L360,85 L335,75 Z"
                  className={`transition-all duration-300 cursor-pointer ${
                    selectedKey === 'north-america'
                      ? 'fill-[#FF6A00]/30 stroke-[#FF6A00] stroke-[1.8] filter drop-shadow-[0_0_10px_#FF6A00]'
                      : 'fill-[#3B82F6]/[0.08] stroke-[#3B82F6]/40 hover:fill-[#FF6A00]/20 hover:stroke-[#FF6A00]'
                  }`}
                  onClick={() => handleSelectKeyOnly('north-america')}
                >
                  <title>Shimoliy Amerika (AQSH va Kanada) // [US/NA]</title>
                </path>

                {/* 2. SOUTH AMERICA */}
                <path
                  d="M245,245 L275,250 L310,270 L355,290 L375,325 L365,365 L340,410 L315,455 L295,475 L280,465 L285,420 L275,370 L255,320 L235,285 L235,260 Z"
                  className={`transition-all duration-300 cursor-pointer ${
                    selectedKey === 'south-america'
                      ? 'fill-[#FF6A00]/30 stroke-[#FF6A00] stroke-[1.8] filter drop-shadow-[0_0_10px_#FF6A00]'
                      : 'fill-[#3B82F6]/[0.08] stroke-[#3B82F6]/40 hover:fill-[#FF6A00]/20 hover:stroke-[#FF6A00]'
                  }`}
                  onClick={() => handleSelectKeyOnly('south-america')}
                >
                  <title>Janubiy Amerika // [SA/BRA]</title>
                </path>

                {/* 3. EUROPE */}
                <path
                  d="M460,80 L490,70 L520,80 L540,110 L520,135 L490,140 L465,155 L445,145 L435,120 L445,95 Z
                     M440,90 L455,85 L450,110 L435,105 Z
                     M490,50 L525,45 L535,75 L515,90 L490,65 Z"
                  className={`transition-all duration-300 cursor-pointer ${
                    selectedKey === 'europe'
                      ? 'fill-[#FF6A00]/30 stroke-[#FF6A00] stroke-[1.8] filter drop-shadow-[0_0_10px_#FF6A00]'
                      : 'fill-[#3B82F6]/[0.08] stroke-[#3B82F6]/40 hover:fill-[#FF6A00]/20 hover:stroke-[#FF6A00]'
                  }`}
                  onClick={() => handleSelectKeyOnly('europe')}
                >
                  <title>Yevropa Ittifoqi // [EU/BRU]</title>
                </path>

                {/* 4. AFRICA */}
                <path
                  d="M450,175 L510,170 L545,185 L575,220 L585,255 L555,295 L540,355 L515,405 L485,395 L465,340 L440,290 L440,240 L450,195 Z
                     M570,325 L580,335 L575,365 L565,355 Z"
                  className={`transition-all duration-300 cursor-pointer ${
                    selectedKey === 'africa'
                      ? 'fill-[#FF6A00]/30 stroke-[#FF6A00] stroke-[1.8] filter drop-shadow-[0_0_10px_#FF6A00]'
                      : 'fill-[#3B82F6]/[0.08] stroke-[#3B82F6]/40 hover:fill-[#FF6A00]/20 hover:stroke-[#FF6A00]'
                  }`}
                  onClick={() => handleSelectKeyOnly('africa')}
                >
                  <title>Afrika qitʼasi // [AFR]</title>
                </path>

                {/* 5. MIDDLE EAST */}
                <path
                  d="M545,185 L590,175 L625,190 L645,230 L615,265 L580,260 L555,225 L545,195 Z"
                  className={`transition-all duration-300 cursor-pointer ${
                    selectedKey === 'middle-east'
                      ? 'fill-[#FF6A00]/30 stroke-[#FF6A00] stroke-[1.8] filter drop-shadow-[0_0_10px_#FF6A00]'
                      : 'fill-[#3B82F6]/[0.08] stroke-[#3B82F6]/40 hover:fill-[#FF6A00]/20 hover:stroke-[#FF6A00]'
                  }`}
                  onClick={() => handleSelectKeyOnly('middle-east')}
                >
                  <title>Yaqin Sharq va Fors koʻrfazi // [ME/GULF]</title>
                </path>

                {/* 6. CENTRAL ASIA & UZBEKISTAN (Special Glowing Tactical Prominence) */}
                <path
                  d="M575,115 L645,105 L690,115 L730,135 L710,165 L660,165 L605,155 L575,135 Z"
                  className={`transition-all duration-300 cursor-pointer ${
                    selectedKey === 'central-asia'
                      ? 'fill-[#FF6A00]/45 stroke-[#FF6A00] stroke-2 filter drop-shadow-[0_0_15px_#FF6A00]'
                      : 'fill-[#FF6A00]/20 stroke-[#FF6A00] stroke-1 hover:fill-[#FF6A00]/35'
                  }`}
                  onClick={() => handleSelectKeyOnly('central-asia')}
                >
                  <title>Oʻzbekiston va Markaziy Osiyo // [UZ/CA]</title>
                </path>

                {/* Uzbekistan heartland contour marker */}
                <polygon
                  points="680,128 705,132 698,144 682,140"
                  fill="#FF6A00"
                  opacity="0.8"
                  className="animate-pulse"
                />

                {/* 7. EAST ASIA & PACIFIC RIM */}
                <path
                  d="M690,115 L770,100 L840,110 L880,135 L870,185 L845,225 L795,255 L745,240 L715,200 L680,180 L685,145 Z
                     M675,185 L720,180 L735,225 L710,265 L685,260 L675,220 Z
                     M840,135 L855,150 L845,160 Z
                     M880,120 L900,130 L890,165 L875,155 Z
                     M760,250 L810,255 L825,285 L795,315 L750,300 Z"
                  className={`transition-all duration-300 cursor-pointer ${
                    selectedKey === 'east-asia'
                      ? 'fill-[#FF6A00]/30 stroke-[#FF6A00] stroke-[1.8] filter drop-shadow-[0_0_10px_#FF6A00]'
                      : 'fill-[#3B82F6]/[0.08] stroke-[#3B82F6]/40 hover:fill-[#FF6A00]/20 hover:stroke-[#FF6A00]'
                  }`}
                  onClick={() => handleSelectKeyOnly('east-asia')}
                >
                  <title>Sharqiy Osiyo va Tinch Okeani // [KR/EA]</title>
                </path>

                {/* 8. AUSTRALIA & OCEANIA */}
                <path
                  d="M840,320 L920,310 L945,340 L935,395 L880,415 L845,385 L830,350 Z
                     M965,390 L980,415 L965,425 Z"
                  className={`transition-all duration-300 cursor-pointer ${
                    selectedKey === 'oceania'
                      ? 'fill-[#FF6A00]/30 stroke-[#FF6A00] stroke-[1.8] filter drop-shadow-[0_0_10px_#FF6A00]'
                      : 'fill-[#3B82F6]/[0.08] stroke-[#3B82F6]/40 hover:fill-[#FF6A00]/20 hover:stroke-[#FF6A00]'
                  }`}
                  onClick={() => handleSelectKeyOnly('oceania')}
                >
                  <title>Avstraliya va Okeaniya // [OC/SYD]</title>
                </path>
              </g>

              {/* Glowing Global Intelligence Interconnect Arcs (Fiber-optic data lines) */}
              <g className="arcs opacity-50" stroke="#FF6A00" fill="none">
                <path d="M692,135 Q775,100 853,146" strokeWidth="1.5" strokeDasharray="5 5" className="animate-[dash_20s_linear_infinite]" />
                <path d="M692,135 Q600,100 512,109" strokeWidth="1.5" strokeDasharray="5 5" />
                <path d="M512,109 Q400,90 286,142" strokeWidth="1.2" strokeDasharray="4 4" />
                <path d="M692,135 Q675,160 654,180" strokeWidth="1.5" />
                <path d="M654,180 Q630,220 602,254" strokeWidth="1.2" strokeDasharray="4 4" />
                <path d="M286,142 Q325,230 371,315" strokeWidth="1.2" strokeDasharray="4 4" />
                <path d="M853,146 Q890,240 920,344" strokeWidth="1.2" strokeDasharray="4 4" />
              </g>

              {/* Interactive Pulsing Hotspot Radar Beacons */}
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
                    onClick={() => handleSelectKeyOnly(pin.regionKey)}
                  >
                    {/* Sonar Ripple Pulse Ring */}
                    <circle
                      cx={pin.cx}
                      cy={pin.cy}
                      r={isSelected ? 22 : 14}
                      fill="none"
                      stroke={statusColor}
                      strokeWidth="1.5"
                      opacity={isSelected ? '0.8' : '0.4'}
                      className="animate-ping"
                    />

                    {/* Concentric Reticle Ring */}
                    <circle
                      cx={pin.cx}
                      cy={pin.cy}
                      r={isSelected ? 10 : 7}
                      fill="none"
                      stroke={statusColor}
                      strokeWidth={isSelected ? '2' : '1.2'}
                      opacity="0.9"
                    />

                    {/* Core Solid Beacon */}
                    <circle
                      cx={pin.cx}
                      cy={pin.cy}
                      r={isSelected ? 5 : 3.5}
                      fill={statusColor}
                      className="transition-all duration-300"
                    />

                    {/* White Bullseye Point */}
                    <circle
                      cx={pin.cx}
                      cy={pin.cy}
                      r="1.5"
                      fill="#FFFFFF"
                    />

                    {/* Floating Tactical Callout Badge */}
                    <rect
                      x={pin.cx + 9}
                      y={pin.cy - 12}
                      width={pin.code.length * 7 + 12}
                      height={19}
                      rx={4}
                      fill={isSelected ? '#FF6A00' : '#080c14'}
                      stroke={isSelected ? '#ffffff' : statusColor}
                      strokeWidth="1"
                      opacity="0.95"
                    />
                    <text
                      x={pin.cx + 14}
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

        {/* ========================================================================= */}
        {/* RE-ESTABLISHED & RESHAPED: REGIONAL INTELLIGENCE WORKSPACE (Mintaqalar Tahlili) */}
        {/* ========================================================================= */}
        <div className="mt-8 rounded-3xl bg-[#0B0F14] border border-white/[0.1] shadow-2xl overflow-hidden text-left">
          {/* Workspace Top Header: Region Passport & Telemetry */}
          <div className="p-6 sm:p-8 border-b border-white/[0.08] bg-gradient-to-r from-white/[0.02] via-[#FF6A00]/[0.03] to-transparent">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Region Identity */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FF6A00]/15 border border-[#FF6A00]/30 flex items-center justify-center text-[#FF6A00] shrink-0 font-bold shadow-lg shadow-[#FF6A00]/10">
                  <MapPin className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap mb-2">
                    <h3 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F7FA]">
                      {currentRegionData.name}
                    </h3>
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#FF6A00]/15 text-[#FF6A00] border border-[#FF6A00]/30">
                      [{currentRegionData.code}]
                    </span>
                    <span
                      className={`text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider font-bold border flex items-center gap-1.5 ${
                        currentRegionData.status === 'critical'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-[#FF6A00]/15 text-[#FFA84D] border-[#FF6A00]/30'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                      {currentRegionData.statusLabel}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
                    {currentRegionData.headline}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => onAskAi(`${currentRegionData.name} mintaqasi bo'yicha eng so'nggi tahliliy xulosa va geosiyosiy vaziyat`)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/[0.05] hover:bg-white/[0.1] text-[#F5F7FA] border border-white/[0.1] transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#FF6A00]" />
                  <span>{ui.map_ask_ai}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenRegion(selectedKey)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FF6A00] hover:bg-[#FF8A24] text-black transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#FF6A00]/25"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{ui.map_open_workspace}</span>
                </button>
              </div>
            </div>

            {/* Live Real-Time Weather & Environmental Telemetry Bar */}
            {regionLive.data?.weather && regionLive.data.weather.length > 0 && (
              <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center gap-4 overflow-x-auto text-xs font-mono">
                <div className="flex items-center gap-2 text-[#7C8797] shrink-0 font-medium">
                  <CloudSun className="w-4 h-4 text-[#FF6A00]" />
                  <span>{ui.map_live_weather}:</span>
                </div>
                {regionLive.data.weather.map((w, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] shrink-0"
                  >
                    <span className="text-[#F5F7FA] font-bold">{w.city}</span>
                    <span className="text-[#FF6A00] font-bold">{w.temperatureC !== null ? `${w.temperatureC > 0 ? '+' : ''}${w.temperatureC}°C` : '—'}</span>
                    <span className="text-zinc-400">· {weatherLabel(w.code, lang)}</span>
                    {w.humidity !== null && (
                      <span className="text-zinc-500 hidden sm:inline">({w.humidity}% nam)</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sub-Tab Navigation Bar */}
          <div className="px-6 border-b border-white/[0.08] bg-[#05070A]/60 flex items-center gap-2 overflow-x-auto text-xs font-mono font-medium">
            <button
              type="button"
              onClick={() => setWorkspaceTab('overview')}
              className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                workspaceTab === 'overview'
                  ? 'border-[#FF6A00] text-[#FF6A00] font-bold'
                  : 'border-transparent text-[#7C8797] hover:text-[#F5F7FA]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Strategik Tahlil</span>
            </button>

            <button
              type="button"
              onClick={() => setWorkspaceTab('events')}
              className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                workspaceTab === 'events'
                  ? 'border-[#FF6A00] text-[#FF6A00] font-bold'
                  : 'border-transparent text-[#7C8797] hover:text-[#F5F7FA]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{ui.map_active_events} ({currentRegionData.activeEvents.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setWorkspaceTab('debates')}
              className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                workspaceTab === 'debates'
                  ? 'border-[#FF6A00] text-[#FF6A00] font-bold'
                  : 'border-transparent text-[#7C8797] hover:text-[#F5F7FA]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{ui.map_debates} ({currentRegionData.publicDebates.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setWorkspaceTab('indicators')}
              className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                workspaceTab === 'indicators'
                  ? 'border-[#FF6A00] text-[#FF6A00] font-bold'
                  : 'border-transparent text-[#7C8797] hover:text-[#F5F7FA]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{ui.map_stats_facts}</span>
            </button>

            <button
              type="button"
              onClick={() => setWorkspaceTab('videos')}
              className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                workspaceTab === 'videos'
                  ? 'border-[#FF6A00] text-[#FF6A00] font-bold'
                  : 'border-transparent text-[#7C8797] hover:text-[#F5F7FA]'
              }`}
            >
              <Youtube className="w-3.5 h-3.5 text-red-500 fill-current" />
              <span>{ui.map_video_reports} ({currentRegionData.youtubeVideos.length})</span>
            </button>

            {liveNewsForSelected.length > 0 && (
              <button
                type="button"
                onClick={() => setWorkspaceTab('live')}
                className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  workspaceTab === 'live'
                    ? 'border-[#22C55E] text-[#22C55E] font-bold'
                    : 'border-transparent text-[#7C8797] hover:text-[#F5F7FA]'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-[#22C55E] animate-pulse" />
                <span>Jonli Agentliklar ({liveNewsForSelected.length})</span>
              </button>
            )}
          </div>

          {/* Tab Content Display Area */}
          <div className="p-6 sm:p-8">
            {/* TAB 1: STRATEGIC OVERVIEW & KEY STATS */}
            {workspaceTab === 'overview' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-[#11161D] border border-white/[0.08]">
                  <span className="block text-[10px] font-mono font-bold tracking-widest uppercase text-[#FF6A00] mb-2">
                    GEOSIYOSIY VA IQTISODIY HUJJAT // STRATEGIK XULOSA
                  </span>
                  <p className="font-editorial text-lg sm:text-xl text-[#F5F7FA] leading-relaxed">
                    {currentRegionData.summary}
                  </p>
                </div>

                {/* 4 KPIs Matrix Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentRegionData.keyIndicators.map((ind, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="block text-xs text-[#7C8797] font-mono mb-1">{ind.label}</span>
                      <div className="flex items-center justify-between">
                        <span className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-[#F5F7FA]">
                          {ind.value}
                        </span>
                        <span className={`text-xs font-mono font-bold ${
                          ind.trend === 'up' ? 'text-emerald-400' : ind.trend === 'down' ? 'text-rose-400' : 'text-blue-400'
                        }`}>
                          {ind.trend === 'up' ? '↗ Oʻsish' : ind.trend === 'down' ? '↘ Pasayish' : '→ Barqaror'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Prompts to Ask AI */}
                <div className="pt-2">
                  <span className="block text-xs font-mono text-[#7C8797] mb-3">
                    Ushbu mintaqa boʻyicha tezkor AI soʻrovlari:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentRegionData.featuredTopics.map((topic, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => onAskAi(topic)}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-[#FF6A00]/15 border border-white/[0.08] hover:border-[#FF6A00]/40 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-[#FF6A00]" />
                        <span>{topic}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ACTIVE GEOPOLITICAL EVENTS */}
            {workspaceTab === 'events' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentRegionData.activeEvents.map(ev => (
                  <div
                    key={ev.id}
                    className="p-5 rounded-2xl bg-[#11161D] border border-white/[0.08] hover:border-[#FF6A00]/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-[#7C8797] mb-2.5">
                        <span className="text-[#FF6A00] font-bold">{ev.category}</span>
                        <span>{ev.time}</span>
                      </div>
                      <h4 className="font-editorial text-lg font-medium text-[#F5F7FA] mb-2.5 leading-snug">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-[#7C8797] leading-relaxed line-clamp-3">
                        {ev.summary}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/[0.05] flex items-center justify-between text-xs font-mono text-[#7C8797]">
                      <span className="text-zinc-400 font-medium truncate">{ev.source}</span>
                      <button
                        type="button"
                        onClick={() => onAskAi(`${ev.title} — tafsilotlari va sabablari`)}
                        className="text-[#FF6A00] hover:text-[#FF8A24] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>AI Tahlil</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: PUBLIC DEBATES & DILEMMAS */}
            {workspaceTab === 'debates' && (
              <div className="space-y-5">
                {currentRegionData.publicDebates.map((deb, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-[#11161D] border border-white/[0.08]">
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <h4 className="font-editorial text-xl font-medium text-[#F5F7FA]">
                        {deb.title}
                      </h4>
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#FF6A00]/15 text-[#FF6A00] border border-[#FF6A00]/30 font-bold shrink-0">
                        Taʼsir: {deb.impactLevel}
                      </span>
                    </div>

                    <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                      {deb.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/[0.06] text-xs">
                      <div>
                        <span className="block font-mono text-[#FF6A00] font-bold mb-2 uppercase text-[10px]">
                          Asosiy sabablar va omillar:
                        </span>
                        <ul className="space-y-1.5 text-zinc-400">
                          {deb.causes.map((c, ci) => (
                            <li key={ci} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] shrink-0 mt-1.5" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <span className="block font-mono text-zinc-400 font-bold mb-1.5 uppercase text-[10px]">
                          Jamoatchilik munosabati:
                        </span>
                        <p className="text-zinc-300 leading-relaxed">
                          {deb.publicReaction}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: KEY INDICATORS */}
            {workspaceTab === 'indicators' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentRegionData.keyIndicators.map((ind, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-[#11161D] border border-white/[0.08] flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-mono text-[#7C8797] uppercase tracking-wider block mb-2">
                        {ind.label}
                      </span>
                      <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#F5F7FA] block">
                        {ind.value}
                      </span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500">Holat:</span>
                      <span className={`font-bold ${
                        ind.trend === 'up' ? 'text-emerald-400' : ind.trend === 'down' ? 'text-rose-400' : 'text-blue-400'
                      }`}>
                        {ind.trend === 'up' ? '↗ Oʻsishda' : ind.trend === 'down' ? '↘ Pasayishda' : '→ Barqaror'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: YOUTUBE VIDEO BRIEFS */}
            {workspaceTab === 'videos' && (
              <div className="space-y-6">
                {selectedVideoEmbed ? (
                  <div className="rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                    <div className="aspect-video w-full">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${selectedVideoEmbed.id}?autoplay=1&rel=0`}
                        title={selectedVideoEmbed.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-4 flex items-center justify-between bg-[#0B0F14]">
                      <div>
                        <h4 className="font-bold text-white text-sm">{selectedVideoEmbed.title}</h4>
                        <span className="text-xs text-zinc-400 font-mono">{selectedVideoEmbed.channel} · {new Date(selectedVideoEmbed.published).toLocaleDateString()}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedVideoEmbed(null)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-zinc-300 cursor-pointer"
                      >
                        Yopish
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {liveVideos.map(vid => (
                    <div
                      key={vid.id}
                      onClick={() => setSelectedVideoEmbed(vid)}
                      className="group p-5 rounded-2xl bg-[#11161D] border border-white/[0.08] hover:border-red-500/40 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono text-[#7C8797] mb-3">
                          <span className="flex items-center gap-1.5 text-red-400 font-bold">
                            <Youtube className="w-4 h-4 fill-current" />
                            <span>{vid.channel}</span>
                          </span>
                          <span>{new Date(vid.published).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-editorial text-lg font-medium text-[#F5F7FA] group-hover:text-red-300 transition-colors mb-2">
                          {vid.title}
                        </h4>
                        <p className="text-xs text-[#7C8797] leading-relaxed">
                          {regionVideos.data?.query ? `Mavzu: ${regionVideos.data.query}` : ''}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs text-[#FF6A00] font-mono font-bold">
                        <span>Videoni tomosha qilish</span>
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: LIVE REGIONAL ARTICLES */}
            {workspaceTab === 'live' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {liveNewsForSelected.map((art, idx) => (
                  <div
                    key={`${art.id}-${idx}`}
                    onClick={() => onSelectArticle && onSelectArticle(art)}
                    className="p-5 rounded-2xl bg-[#11161D] border border-white/[0.08] hover:border-[#FF6A00]/40 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-[#7C8797] mb-2.5">
                        <span className="text-[#FF6A00] font-bold uppercase">{art.category || 'MINTAQA'}</span>
                        <span>{formatTimeAgoLocale(art.publishedAt, lang)}</span>
                      </div>
                      <h4 className="font-editorial text-lg font-medium text-[#F5F7FA] mb-2 leading-snug">
                        {art.title}
                      </h4>
                      {art.description && (
                        <p className="text-xs text-[#7C8797] line-clamp-2 leading-relaxed">
                          {art.description}
                        </p>
                      )}
                    </div>
                    <div className="pt-3 mt-3 border-t border-white/[0.05] flex items-center justify-between text-xs font-mono text-[#7C8797]">
                      <span className="text-zinc-400 truncate">{art.source}</span>
                      <span className="text-[#FF6A00] font-bold">Batafsil →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map Legend */}
        <div className="flex items-center justify-between flex-wrap gap-4 mt-6 pt-4 border-t border-white/5 text-xs text-zinc-400">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6A00] shadow-[0_0_8px_#FF6A00] animate-pulse" />
              <span>3D Sfera & Jonli taktika radar monitoringi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Doimiy yangilanuvchi agentliklar lentasi (30s)</span>
            </div>
            <div className="flex items-center gap-2">
              <Youtube className="w-3.5 h-3.5 text-red-500 fill-current" />
              <span>YouTube video hisobotlar integratsiyasi</span>
            </div>
          </div>
          <div className="font-mono text-[11px] text-zinc-500">
            HUMAYRO_3.3 // DEFENSE-GRADE GEO-SPATIAL INTELLIGENCE
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
        liveVideos={liveVideos}
        videosLoading={regionVideos.isLoading}
        videosConfigured={regionVideos.data?.configured ?? true}
        videosSearchUrl={regionVideos.data?.searchUrl}
        liveLoading={regionLive.isLoading}
        liveError={regionLive.error}
        liveLastUpdated={regionLive.lastUpdated}
        liveCountdown={regionLive.countdown}
        onRefreshLive={regionLive.refreshNow}
      />
    </section>
  );
};

export const GlobeIntelligence = WorldMapSection;
