import React, { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { AiSynthesisResponse, SupportedLanguage } from '../types';
import { TranslationDict } from '../i18n/translations';
import { AudioPlayerBar } from './AudioPlayerBar';
import { HistoricalComparisonCard } from './HistoricalComparisonCard';

interface ChatMessage {
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
    <section className="relative py-28 px-6 z-10">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-medium tracking-widest uppercase text-zinc-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
            <span>{dict.chat_eyebrow}</span>
          </div>

          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold tracking-tight">
            <span>{dict.chat_title1} </span>
            <span className="bg-gradient-to-r from-[#FF6A00] to-[#FFA84D] bg-clip-text text-transparent">
              {dict.chat_title2}
            </span>
            <span> {dict.chat_title3}</span>
          </h2>
        </div>

        {/* Chat Terminal Card */}
        <div className="max-w-[820px] mx-auto rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>

            <div className="text-xs font-medium text-zinc-400 font-mono">
              {dict.chat_session}
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
              <span>{dict.chat_online}</span>
            </div>
          </div>

          {/* Conversation Stream Body */}
          <div className="p-6 sm:p-8 flex flex-col gap-6 max-h-[640px] overflow-y-auto">
            {activeConversation.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* AI Avatar */}
                {msg.sender === 'ai' && (
                  <div className="w-9 h-9 rounded-full bg-[#FF6A00] flex items-center justify-center text-black shrink-0 font-bold text-xs shadow-md">
                    <span className="w-2 h-2 rounded-full bg-black" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`p-4 sm:p-6 rounded-2xl max-w-[92%] sm:max-w-[88%] text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-white/[0.07] border border-white/10 rounded-tr-sm text-zinc-100'
                      : 'bg-[#FF6A00]/[0.04] border border-[#FF6A00]/25 rounded-tl-sm text-zinc-200'
                  }`}
                >
                  {/* Regular text or user prompt */}
                  {msg.text && <p className="font-medium">{msg.text}</p>}

                  {/* AI Structured Synthesis */}
                  {msg.synthesis && (
                    <div className="flex flex-col gap-5">
                      {/* Top Viral Lead Banner */}
                      {msg.synthesis.viralHeadline && (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/15 via-[#FF6A00]/15 to-transparent border border-rose-500/30">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/25 text-rose-300 border border-rose-500/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              {currentLang === 'uz' ? '🔥 Eng shov-shuvli yangilik' : currentLang === 'ru' ? '🔥 Главный тренд' : '🔥 Top Trending Lead'}
                            </span>
                            {msg.synthesis.trendScore && (
                              <span className="text-[11px] font-mono font-bold text-amber-400 bg-black/40 px-2 py-0.5 rounded border border-amber-400/20">
                                {currentLang === 'uz' ? `Jamoatchilik qiziqishi: ${msg.synthesis.trendScore}%` : `Buzz Index: ${msg.synthesis.trendScore}%`}
                              </span>
                            )}
                          </div>
                          <h4 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-white leading-snug">
                            {msg.synthesis.viralHeadline}
                          </h4>
                        </div>
                      )}

                      {/* Summary Section */}
                      <div>
                        <strong className="block text-[11px] font-bold uppercase tracking-wider text-[#FF6A00] mb-1.5">
                          {dict.chat_summary_label}
                        </strong>
                        <p className="font-editorial text-zinc-100 text-base sm:text-lg leading-relaxed">
                          {msg.synthesis.summary}
                        </p>
                      </div>

                      {/* Public Buzz & Social Sentiment (Xalq ichidagi muhokama) */}
                      {msg.synthesis.publicSentiment && (
                        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/25">
                          <div className="flex items-center gap-2 mb-1.5 text-blue-300 text-xs font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-blue-400" />
                            <span>
                              {currentLang === 'uz'
                                ? '💬 Xalq ichidagi muhokamalar va jamoatchilik munosabati'
                                : currentLang === 'ru'
                                ? '💬 Общественный резонанс и обсуждение'
                                : '💬 Public Discourse & Community Buzz'}
                            </span>
                          </div>
                          <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed">
                            {msg.synthesis.publicSentiment}
                          </p>
                        </div>
                      )}

                      {/* Audio Brief Player */}
                      <AudioPlayerBar
                        textToRead={[msg.synthesis.summary, ...(msg.synthesis.keyPoints || [])].join('. ')}
                        lang={currentLang}
                        dict={dict}
                      />

                      {/* Key Points */}
                      {msg.synthesis.keyPoints && msg.synthesis.keyPoints.length > 0 && (
                        <div>
                          <strong className="block text-[11px] font-bold uppercase tracking-wider text-[#FF6A00] mb-2">
                            {dict.keypoints_label}
                          </strong>
                          <ul className="flex flex-col gap-2 text-xs sm:text-sm text-zinc-300">
                            {msg.synthesis.keyPoints.map((point, i) => (
                              <li key={i} className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] shrink-0 mt-2" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Timeline */}
                      {msg.synthesis.timeline && msg.synthesis.timeline.length > 0 && (
                        <div>
                          <strong className="block text-[11px] font-bold uppercase tracking-wider text-[#FF6A00] mb-2">
                            {dict.chat_timeline_label}
                          </strong>
                          <ul className="flex flex-col gap-2 text-xs text-zinc-400">
                            {msg.synthesis.timeline.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="text-[#FF6A00] font-mono font-medium">{item.time}</span>
                                <span>—</span>
                                <span>{item.event}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Strategic History vs Today Comparison Matrix */}
                      {msg.synthesis.historicalParallel && (
                        <HistoricalComparisonCard
                          currentTopic={dict.chat_summary_label}
                          currentSummary={msg.synthesis.summary}
                          historicalParallel={msg.synthesis.historicalParallel}
                          dict={dict}
                        />
                      )}

                      {/* Verified Sources */}
                      {msg.synthesis.sources && msg.synthesis.sources.length > 0 && (
                        <div>
                          <strong className="block text-[11px] font-bold uppercase tracking-wider text-[#FF6A00] mb-2">
                            {dict.chat_sources_label}
                          </strong>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.synthesis.sources.map((src, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/[0.05] border border-white/10 text-zinc-300"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6A00]" />
                                <span>{src.name}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Verification note */}
                      {msg.synthesis.confidenceNote && (
                        <div className="text-[11px] text-zinc-500 pt-3 border-t border-white/5 flex items-center justify-between">
                          <span>{msg.synthesis.confidenceNote}</span>
                          <span className="font-mono text-[10px] text-zinc-600">ID: INTEL-SYNTH</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Loading Indicator */}
                  {msg.isLoading && (
                    <div className="flex items-center gap-2 py-1 text-xs text-zinc-400">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-bounce [animation-delay:300ms]" />
                      </div>
                      <span className="ml-2">{dict.ai_loading}</span>
                    </div>
                  )}

                  {/* Error State */}
                  {msg.error && (
                    <div className="flex items-center gap-2 text-rose-400 text-xs py-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{msg.error}</span>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {msg.sender === 'user' && (
                  <div className="w-9 h-9 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-xs font-semibold text-zinc-300 shrink-0">
                    {dict.chat_you_avatar}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Follow-up input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 p-4 border-t border-white/10 bg-black/40"
          >
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={dict.chat_input_placeholder}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF6A00] transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="w-11 h-11 rounded-2xl bg-[#FF6A00] text-black flex items-center justify-center hover:bg-[#FF8A24] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Verification Footnote */}
          <div className="px-6 py-2.5 bg-black/60 border-t border-white/5 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>{dict.chat_note}</span>
            <span className="font-mono text-[10px] text-zinc-600">ENCRYPTED TELEMETRY</span>
          </div>
        </div>
      </div>
    </section>
  );
};
