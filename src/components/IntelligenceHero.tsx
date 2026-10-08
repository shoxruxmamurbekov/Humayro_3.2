import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, ArrowRight, Sparkles, Loader2, Command } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TranslationDict } from '../i18n/translations';
import { getUiText } from '../i18n/uiTranslations';
import { fetchTrendingData, TrendingHotspotItem } from '../services/api';

interface IntelligenceHeroProps {
  dict: TranslationDict;
  currentLang: SupportedLanguage;
  onSearch: (query: string) => void;
  isLoading: boolean;
  trendingHotspots?: {
    uzbekistan: TrendingHotspotItem[];
    global: TrendingHotspotItem[];
  };
}

export const IntelligenceHero: React.FC<IntelligenceHeroProps> = ({
  dict,
  currentLang,
  onSearch,
  isLoading,
  trendingHotspots: propTrends
}) => {
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [uzTrends, setUzTrends] = useState<TrendingHotspotItem[]>([]);
  const [glTrends, setGlTrends] = useState<TrendingHotspotItem[]>([]);
  const [trendTab, setTrendTab] = useState<'uz' | 'gl'>('uz');
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const ui = getUiText(currentLang);

  useEffect(() => {
    if (propTrends?.uzbekistan && propTrends.uzbekistan.length > 0) {
      setUzTrends(propTrends.uzbekistan);
      setGlTrends(propTrends.global || []);
    } else {
      fetchTrendingData(currentLang).then(data => {
        if (data?.hotspots) {
          setUzTrends(data.hotspots.uzbekistan || []);
          setGlTrends(data.hotspots.global || []);
        }
      }).catch(() => {});
    }
  }, [currentLang, propTrends]);

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setVoiceSupported(true);
      try {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;

        const langMap: Record<SupportedLanguage, string> = {
          uz: 'uz-UZ',
          kk: 'kk-KZ',
          ky: 'ky-KG',
          tg: 'tg-TJ',
          tk: 'tk-TM',
          az: 'az-AZ',
          tr: 'tr-TR',
          ar: 'ar-SA',
          fa: 'fa-IR',
          en: 'en-US',
          ru: 'ru-RU',
          ko: 'ko-KR'
        };
        recog.lang = langMap[currentLang] || 'en-US';

        recog.onstart = () => setIsListening(true);
        recog.onend = () => setIsListening(false);
        recog.onerror = () => setIsListening(false);
        recog.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (transcript) {
            setInputVal(transcript);
            onSearch(transcript);
          }
        };

        recognitionRef.current = recog;
      } catch {
        setVoiceSupported(false);
      }
    }
  }, [currentLang, onSearch]);

  const handleVoiceClick = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onSearch(inputVal.trim());
  };

  const activeHotspots = trendTab === 'uz' ? uzTrends : glTrends;

  return (
    <section id="search" className="relative pt-16 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 text-center z-10">
      <div className="max-w-[980px] mx-auto">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-[#FF6A00] font-bold uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
          <span>{ui.hero_eyebrow}</span>
        </div>

        {/* Editorial Headline */}
        <h1 className="font-editorial text-4xl sm:text-6xl lg:text-[76px] font-medium leading-[1.02] tracking-tight text-[#F5F7FA] max-w-[860px] mx-auto">
          {ui.hero_title_1}<br />
          <span className="italic text-[#FF6A00]">{ui.hero_title_2}</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base text-[#7C8797] max-w-[620px] mx-auto leading-relaxed font-normal">
          {ui.hero_sub}
        </p>

        {/* Intelligence Search Box */}
        <div className="mt-8 max-w-[760px] mx-auto">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center p-2 rounded-2xl bg-[#0B0F14] border border-white/[0.12] focus-within:border-[#FF6A00] focus-within:ring-1 focus-within:ring-[#FF6A00]/40 transition-all shadow-2xl shadow-black/60"
          >
            <div className="pl-3.5 pr-2 text-[#7C8797]">
              <Search className="w-5 h-5 text-zinc-400" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={ui.hero_placeholder}
              disabled={isLoading}
              className="flex-1 bg-transparent border-0 outline-none text-[#F5F7FA] placeholder:text-zinc-500 text-sm sm:text-base py-3 px-2 font-normal"
            />

            <div className="flex items-center gap-2 pr-1">
              {/* Keyboard shortcut badge */}
              <div className="hidden sm:flex items-center gap-0.5 px-2 py-1 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] font-mono text-zinc-400">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>

              {/* Voice Search Button */}
              {voiceSupported && (
                <button
                  type="button"
                  onClick={handleVoiceClick}
                  disabled={isLoading}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isListening
                      ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
                      : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                  title={isListening ? (currentLang === 'uz' ? 'Eshitmoqda…' : currentLang === 'ru' ? 'Слушаю…' : 'Listening…') : (currentLang === 'uz' ? 'Ovozli qidiruv' : currentLang === 'ru' ? 'Голосовой поиск' : 'Voice Search')}
                  aria-label="Voice Search"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isLoading || !inputVal.trim()}
                className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-[#FF6A00] hover:bg-[#FF8A24] text-black font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#FF6A00]/25"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">{ui.hero_analyzing}</span>
                  </>
                ) : (
                  <>
                    <span>{ui.hero_analyze}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Trending Suggestions */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-zinc-500 font-mono text-[11px]">{ui.hero_trending}</span>

            {/* Quick switcher tab */}
            <div className="inline-flex items-center rounded-lg bg-white/[0.03] border border-white/[0.07] p-0.5 mr-1 font-mono text-[10px]">
              <button
                type="button"
                onClick={() => setTrendTab('uz')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  trendTab === 'uz' ? 'bg-[#FF6A00] text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {ui.tab_uzbekistan}
              </button>
              <button
                type="button"
                onClick={() => setTrendTab('gl')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  trendTab === 'gl' ? 'bg-[#FF6A00] text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {ui.tab_global}
              </button>
            </div>

            {/* Suggested topics */}
            {activeHotspots.slice(0, 5).map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setInputVal(item.query);
                  onSearch(item.query);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] text-zinc-300 hover:text-white transition-colors cursor-pointer text-xs"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
