import React, { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Sparkles, TrendingUp, ShieldCheck, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { AiSynthesisResponse, SupportedLanguage } from '../types';
import { TranslationDict } from '../i18n/translations';
import { getUiText } from '../i18n/uiTranslations';
import { AudioPlayerBar } from './AudioPlayerBar';
import { HistoricalComparisonCard } from './HistoricalComparisonCard';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  synthesis?: AiSynthesisResponse;
  isLoading?: boolean;
  error?: string;
  timestamp: string;
}

interface ChatSectionProps {
  dict: TranslationDict;
  activeConversation: ChatMessage[];
  onSendMessage: (query: string) => void;
  isLoading: boolean;
  currentLang?: SupportedLanguage;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  dict,
  activeConversation,
  onSendMessage,
  isLoading,
  currentLang = 'uz'
}) => {
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const ui = getUiText(currentLang);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onSendMessage(inputVal.trim());
    setInputVal('');
  };

  return (
    <section id="ai" className="relative py-20 sm:py-28 px-4 sm:px-6 z-10">
      <div className="max-w-[1180px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-[#FF6A00] font-bold uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
            <span>{ui.brief_eyebrow}</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-5xl font-medium tracking-tight text-[#F5F7FA] mb-4">
            {ui.brief_title}
          </h2>

          <p className="text-[#7C8797] text-sm sm:text-base leading-relaxed font-normal max-w-xl mx-auto">
            {ui.brief_sub}
          </p>
        </div>

        {/* Intelligence Brief Container */}
        <div className="rounded-3xl bg-[#0B0F14] border border-white/[0.08] shadow-2xl shadow-black/60 overflow-hidden flex flex-col">
          {/* Workspace Status Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#05070A]/60 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[#22C55E] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span>{ui.brief_status_ready}</span>
              </span>
              <span className="text-zinc-600 hidden sm:inline">|</span>
              <span className="text-zinc-400 hidden sm:inline">GEMINI / GROQ MULTI-MODAL</span>
            </div>

            <span className="text-zinc-500 text-[11px]">{ui.brief_autonomous}</span>
          </div>

          {/* Conversation & Briefs Area */}
          <div className="p-6 sm:p-10 flex flex-col gap-8 max-h-[720px] overflow-y-auto">
            {activeConversation.length === 0 && (
              <div className="py-16 text-center text-[#7C8797] space-y-3">
                <Sparkles className="w-8 h-8 text-[#FF6A00] mx-auto opacity-70" />
                <p className="font-editorial text-xl text-[#F5F7FA]">
                  {ui.brief_empty_title}
                </p>
                <p className="text-xs font-mono max-w-md mx-auto text-zinc-500">
                  {ui.brief_empty_sub}
                </p>
              </div>
            )}

            {activeConversation.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* AI Badge Icon */}
                {msg.sender === 'ai' && (
                  <div className="w-9 h-9 rounded-xl bg-[#FF6A00]/15 border border-[#FF6A00]/30 flex items-center justify-center text-[#FF6A00] shrink-0 mt-1 font-bold text-xs">
                    AI
                  </div>
                )}

                {/* Message Surface */}
                <div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-5 sm:p-7 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#11161D] border border-white/[0.08] text-[#F5F7FA] font-medium'
                      : 'bg-[#05070A]/80 border border-white/[0.08] text-zinc-200 shadow-xl'
                  }`}
                >
                  {/* Text for user queries */}
                  {msg.text && (
                    <p className="text-sm sm:text-base leading-relaxed text-[#F5F7FA]">
                      {msg.text}
                    </p>
                  )}

                  {/* Loading indicator */}
                  {msg.isLoading && (
                    <div className="flex items-center gap-3 py-2 text-xs font-mono text-[#FF6A00]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A00] animate-ping" />
                      <span>{currentLang === 'uz' ? 'GLOBAL SIGNALLAR TAHLIL QILINMOQDA...' : currentLang === 'ru' ? 'АНАЛИЗ ГЛОБАЛЬНЫХ СИГНАЛОВ...' : 'ANALYZING GLOBAL SIGNALS...'}</span>
                    </div>
                  )}

                  {/* Error state */}
                  {msg.error && (
                    <div className="flex items-center gap-2 text-red-400 text-xs font-mono">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{msg.error}</span>
                    </div>
                  )}

                  {/* Full AI Synthesis Brief */}
                  {msg.synthesis && (
                    <div className="flex flex-col gap-6 text-left">
                      {/* 1. Viral Headline / Top Lead */}
                      {msg.synthesis.viralHeadline && (
                        <div className="p-4 rounded-xl bg-[#11161D] border border-[#FF6A00]/25">
                          <div className="flex items-center justify-between gap-2 mb-2 text-xs font-mono">
                            <span className="text-[#FF6A00] font-bold">
                              {ui.brief_top_signal}
                            </span>
                            {msg.synthesis.trendScore && (
                              <span className="text-[#F5F7FA] bg-black/40 px-2 py-0.5 rounded border border-white/10">
                                {currentLang === 'uz' ? 'Trend indeksi' : currentLang === 'ru' ? 'Индекс тренда' : 'Trend Index'}: {msg.synthesis.trendScore}%
                              </span>
                            )}
                          </div>
                          <h4 className="font-editorial text-xl sm:text-2xl font-medium text-white leading-snug">
                            {msg.synthesis.viralHeadline}
                          </h4>
                        </div>
                      )}

                      {/* 2. Executive Summary */}
                      <div>
                        <span className="block text-[10px] font-mono font-bold tracking-widest uppercase text-[#FF6A00] mb-2">
                          {ui.brief_summary}
                        </span>
                        <p className="font-editorial text-[#F5F7FA] text-lg sm:text-xl leading-relaxed">
                          {msg.synthesis.summary}
                        </p>
                      </div>

                      {/* 3. Public Sentiment & Discourse */}
                      {msg.synthesis.publicSentiment && (
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
                          <div className="flex items-center gap-2 mb-1.5 text-blue-400 font-mono font-bold uppercase tracking-wider">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{ui.brief_sentiment}</span>
                          </div>
                          <p className="text-zinc-200 leading-relaxed text-sm">
                            {msg.synthesis.publicSentiment}
                          </p>
                        </div>
                      )}

                      {/* 4. Audio Reader Bar */}
                      <AudioPlayerBar
                        textToRead={[msg.synthesis.summary, ...(msg.synthesis.keyPoints || [])].join('. ')}
                        lang={currentLang}
                        dict={dict}
                      />

                      {/* 5. Key Drivers / Points */}
                      {msg.synthesis.keyPoints && msg.synthesis.keyPoints.length > 0 && (
                        <div className="p-5 rounded-xl bg-[#11161D] border border-white/[0.08]">
                          <span className="block text-[10px] font-mono font-bold tracking-widest uppercase text-[#FF6A00] mb-3">
                            {ui.brief_keypoints}
                          </span>
                          <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-300">
                            {msg.synthesis.keyPoints.map((point, i) => (
                              <li key={i} className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] shrink-0 mt-2" />
                                <span className="leading-relaxed">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 6. Chronological Timeline */}
                      {msg.synthesis.timeline && msg.synthesis.timeline.length > 0 && (
                        <div>
                          <span className="block text-[10px] font-mono font-bold tracking-widest uppercase text-[#FF6A00] mb-2">
                            {ui.brief_timeline}
                          </span>
                          <div className="space-y-2">
                            {msg.synthesis.timeline.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-xs text-zinc-300 font-mono">
                                <span className="text-[#FF6A00] font-bold shrink-0">{item.time}</span>
                                <span className="text-zinc-600">—</span>
                                <span className="text-zinc-300 font-sans">{item.event}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 7. Historical Parallel Matrix */}
                      {msg.synthesis.historicalParallel && (
                        <HistoricalComparisonCard
                          currentTopic={dict.chat_summary_label}
                          currentSummary={msg.synthesis.summary}
                          historicalParallel={msg.synthesis.historicalParallel}
                          dict={dict}
                        />
                      )}

                      {/* 8. Verified Sources list */}
                      {msg.synthesis.sources && msg.synthesis.sources.length > 0 && (
                        <div className="pt-4 border-t border-white/[0.08]">
                          <span className="block text-[10px] font-mono font-bold tracking-widest uppercase text-[#7C8797] mb-2">
                            {ui.brief_sources}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {msg.synthesis.sources.map((src, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-white/[0.03] border border-white/[0.08] text-zinc-300"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-[#FF6A00]" />
                                <span>{src.name}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 9. Confidence note */}
                      {msg.synthesis.confidenceNote && (
                        <div className="text-[11px] font-mono text-[#7C8797] pt-2">
                          {msg.synthesis.confidenceNote}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Follow-up Interaction Form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#05070A] flex items-center gap-3"
          >
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={ui.brief_placeholder}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-[#0B0F14] border border-white/[0.1] text-sm text-[#F5F7FA] placeholder:text-zinc-500 focus:outline-none focus:border-[#FF6A00] transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="px-5 py-3 rounded-xl bg-[#FF6A00] hover:bg-[#FF8A24] text-black font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-40 flex items-center gap-2 shrink-0 shadow-md shadow-[#FF6A00]/20"
            >
              <span>{ui.brief_send}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export const AIIntelligenceBrief = ChatSection;
