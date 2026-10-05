import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, ArrowRight } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TranslationDict } from '../i18n/translations';
import { fetchTrendingData, TrendingHotspotItem } from '../services/api';
import { Article } from '../types';

interface SearchSectionProps {
  dict: TranslationDict;
  currentLang: SupportedLanguage;
  onSearch: (query: string) => void;
  isLoading: boolean;
  trendingHotspots?: {
    uzbekistan: TrendingHotspotItem[];
    global: TrendingHotspotItem[];
  };
  liveArticles?: Article[];
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  dict,
  currentLang,
  onSearch,
  isLoading,
  trendingHotspots: propTrends,
  liveArticles
}) => {
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [trendTab, setTrendTab] = useState<'uz' | 'gl'>('uz');
  const [uzTrends, setUzTrends] = useState<TrendingHotspotItem[]>([]);
  const [glTrends, setGlTrends] = useState<TrendingHotspotItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

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

  const activeHotspots = trendTab === 'uz' ? uzTrends : glTrends;

  // Initialize SpeechRecognition if available
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
      } catch (e) {
        console.warn('SpeechRecognition failed to initialize', e);
      }
    }
  }, [currentLang, onSearch]);

  // Global Ctrl+K / Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch {
        // Already started
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onSearch(inputVal.trim());
  };

  const handleChipClick = (text: string) => {
    setInputVal(text);
    onSearch(text);
  };

  return (
    <section id="ai" className="relative py-20 px-6 z-10">
      <div className="max-w-[780px] mx-auto p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        {/* Header label */}
        <div className="flex items-center gap-2.5 text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-5">
          <span className="w-2 h-2 rounded-full bg-[#FF6A00] shadow-[0_0_10px_#FF6A00] animate-pulse" />
          <span>{dict.search_label}</span>
        </div>

        {/* Search bar form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-black/50 border border-white/10 focus-within:border-[#FF6A00] transition-colors"
        >
          <Search className="w-5 h-5 text-zinc-500 shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder={dict.search_placeholder}
            className="flex-1 bg-transparent border-none outline-none text-white text-base sm:text-lg placeholder:text-zinc-500 min-w-0 font-medium"
            disabled={isLoading}
          />

          {/* Keyboard shortcut hint */}
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-zinc-500 shrink-0 font-mono">
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">K</kbd>
          </span>

          {/* Voice Search Microphone */}
          {voiceSupported && (
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                isListening
                  ? 'bg-[#FF6A00] text-black shadow-[0_0_15px_#FF6A00] animate-pulse'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
              title={isListening ? dict.voice_listening : 'Voice Search'}
              aria-label="Voice search"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#FF6A00] text-black hover:bg-[#FF8A24] transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            <span>{dict.search_btn}</span>
            <ArrowRight className="w-4 h-4 hidden sm:inline" />
          </button>
        </form>

        {/* Live Viral Trending Topics (Xalq ichida trend) */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                {currentLang === 'uz' ? 'Bugun xalq muhokamasidagi eng qaynoq trendlar' : currentLang === 'ru' ? 'Главные тренды и резонансные темы' : 'Hot Trending Topics & Public Buzz'}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/10 text-[10px]">
              <button
                type="button"
                onClick={() => setTrendTab('uz')}
                className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                  trendTab === 'uz'
                    ? 'bg-[#FF6A00] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🇺🇿 Oʻzbekiston
              </button>
              <button
                type="button"
                onClick={() => setTrendTab('gl')}
                className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                  trendTab === 'gl'
                    ? 'bg-[#FF6A00] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🌍 Jahon
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeHotspots.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleChipClick(item.query)}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 bg-white/[0.04] border border-white/10 hover:border-[#FF6A00] hover:text-white hover:bg-[#FF6A00]/10 transition-all cursor-pointer shadow-sm text-left"
                title={item.publicBuzzNote}
              >
                <span className="text-[10px] font-bold text-[#FF6A00] font-mono group-hover:scale-110 transition-transform">
                  {item.viralTag.slice(0, 2)}
                </span>
                <span>{item.title}</span>
                <span className="text-[10px] font-mono text-zinc-500 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                  {item.trendScore}%
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search verification note */}
        <p className="mt-4 text-xs text-zinc-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{dict.search_note}</span>
        </p>
      </div>
    </section>
  );
};
