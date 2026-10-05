import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TranslationDict } from '../i18n/translations';

interface AudioPlayerBarProps {
  textToRead: string;
  lang: SupportedLanguage;
  dict: TranslationDict;
  title?: string;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  textToRead,
  lang,
  dict,
  title
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [supported, setSupported] = useState<boolean>(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Cancel playback if text changes
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [textToRead]);

  if (!supported || !textToRead) return null;

  const handlePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown/unwanted formatting from text before speaking
    const cleanText = textToRead
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

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
    utterance.lang = langMap[lang] || 'uz-UZ';
    utterance.rate = playbackRate;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const cycleRate = () => {
    const rates = [1.0, 1.25, 1.5];
    const next = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(next);
    if (isPlaying) {
      handleStop();
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
      {/* Left: Speaker icon & status */}
      <div className="flex items-center gap-2.5">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
          isPlaying ? 'bg-[#FF6A00] text-black shadow-[0_0_12px_#FF6A00]' : 'bg-white/5 text-zinc-400'
        }`}>
          <Volume2 className="w-4 h-4" />
        </div>

        <div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>{dict.audio_listen}</span>
            {isPlaying && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#FF6A00] font-normal">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-ping" />
                {dict.audio_playing}
              </span>
            )}
          </div>
          {title && (
            <p className="text-[11px] text-zinc-400 truncate max-w-[220px] sm:max-w-[340px]">
              {title}
            </p>
          )}
        </div>
      </div>

      {/* Center: Animated Soundwave equalizer when playing */}
      <div className="flex items-center gap-1 h-5 px-2">
        {[40, 75, 100, 60, 90, 45].map((height, i) => (
          <span
            key={i}
            className={`w-0.5 rounded-full transition-all duration-200 ${
              isPlaying
                ? 'bg-[#FF6A00] animate-pulse'
                : 'bg-zinc-700'
            }`}
            style={{
              height: isPlaying ? `${height}%` : '20%',
              animationDelay: `${i * 120}ms`
            }}
          />
        ))}
      </div>

      {/* Right: Controls (Play/Pause, Stop, Speed Rate) */}
      <div className="flex items-center gap-1.5">
        {/* Speed toggle */}
        <button
          type="button"
          onClick={cycleRate}
          className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Playback speed"
        >
          {playbackRate}x
        </button>

        {/* Play/Pause */}
        {!isPlaying ? (
          <button
            type="button"
            onClick={handlePlay}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FF6A00] text-black hover:bg-[#FF8A24] transition-all cursor-pointer shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>{dict.audio_listen}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePause}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 text-black hover:bg-amber-400 transition-all cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5 fill-black" />
            <span>{dict.audio_pause}</span>
          </button>
        )}

        {/* Stop button */}
        {(isPlaying || isPaused) && (
          <button
            type="button"
            onClick={handleStop}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            title={dict.audio_stop}
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        )}
      </div>
    </div>
  );
};
