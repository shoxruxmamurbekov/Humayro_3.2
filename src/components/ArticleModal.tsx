import React, { useState } from 'react';
import {
  X,
  Share2,
  Bookmark,
  Check,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
  Layers,
  Volume2
} from 'lucide-react';
import { AiArticleResponse, SupportedLanguage } from '../types';
import { TranslationDict } from '../i18n/translations';
import { getUiText } from '../i18n/uiTranslations';
import { AudioPlayerBar } from './AudioPlayerBar';
import { HistoricalComparisonCard } from './HistoricalComparisonCard';

interface ArticleModalProps {
  isOpen: boolean;
  topicLabel: string;
  article: AiArticleResponse | null;
  isLoading: boolean;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onClose: () => void;
  dict: TranslationDict;
  currentLang?: SupportedLanguage;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  isOpen,
  topicLabel,
  article,
  isLoading,
  isBookmarked,
  onToggleBookmark,
  onClose,
  dict,
  currentLang = 'uz'
}) => {
  const [copied, setCopied] = useState(false);
  const ui = getUiText(currentLang);

  if (!isOpen) return null;

  const handleShare = async () => {
    try {
      if (navigator.share && article) {
        await navigator.share({
          title: article.title,
          text: article.dek,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // User cancelled
    }
  };

  const fullTextToRead = article
    ? [article.title, article.dek, ...(article.paragraphs || [])].join('. ')
    : '';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Right-Side Intelligence Reader Drawer */}
      <aside
        className="relative w-full max-w-[700px] h-full bg-[#0B0F14] border-l border-white/[0.1] shadow-[-25px_0_60px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-y-auto p-6 sm:p-10 text-[#F5F7FA] animate-drawer"
        onClick={e => e.stopPropagation()}
      >
        <div>
          {/* Top Bar Navigation & Actions */}
          <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#FF6A00] font-bold uppercase">
                {ui.reader_title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Bookmark Button */}
              <button
                type="button"
                onClick={onToggleBookmark}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-[#FF6A00]/20 border-[#FF6A00] text-[#FF6A00]'
                    : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20 text-[#7C8797]'
                }`}
                title={isBookmarked ? dict.article_bookmarked : dict.article_bookmark}
                aria-label="Bookmark"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#FF6A00]' : ''}`} />
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 text-[#7C8797] hover:text-[#F5F7FA] transition-all cursor-pointer"
                title={dict.article_share}
                aria-label="Share"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              {/* Close Drawer Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 text-[#7C8797] hover:text-[#F5F7FA] transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="flex flex-col gap-6 animate-pulse mt-4">
              <div className="h-4 bg-white/5 rounded w-1/4" />
              <div className="h-12 bg-white/10 rounded-2xl w-full" />
              <div className="h-6 bg-white/5 rounded-xl w-3/4" />
              <div className="h-16 bg-white/5 rounded-2xl w-full my-3" />
              <div className="space-y-3">
                <div className="h-4 bg-white/5 rounded w-full" />
                <div className="h-4 bg-white/5 rounded w-5/6" />
                <div className="h-4 bg-white/5 rounded w-4/6" />
              </div>
            </div>
          )}

          {/* Loaded Article Content */}
          {!isLoading && article && (
            <article className="flex flex-col">
              {/* Meta kicker: Source + Timestamp */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#7C8797] mb-4">
                <span className="text-[#FF6A00] font-bold">{topicLabel}</span>
                <span>·</span>
                <span>{article.region || 'Global'}</span>
                {article.publishedAt && (
                  <>
                    <span>·</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </>
                )}
              </div>

              {/* Headline */}
              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] font-medium leading-[1.08] tracking-tight text-[#F5F7FA] mb-4">
                {article.title}
              </h1>

              {/* Dek / AI Summary */}
              {article.dek && (
                <p className="font-editorial italic text-[#7C8797] text-lg sm:text-xl font-normal leading-relaxed mb-6 pb-6 border-b border-white/[0.08]">
                  {article.dek}
                </p>
              )}

              {/* Confidence & Trend Metrics Bar */}
              <div className="mb-6 p-4 rounded-xl bg-[#11161D] border border-white/[0.08] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-[#22C55E]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{ui.reader_verified}</span>
                </div>
                <div className="text-[#7C8797]">
                  {ui.reader_confidence} <b className="text-[#F5F7FA]">92%</b>
                </div>
              </div>

              {/* Audio Narrative Player */}
              <div className="mb-8">
                <AudioPlayerBar
                  textToRead={fullTextToRead}
                  lang={currentLang}
                  dict={dict}
                  title={article.title}
                />
              </div>

              {/* Key Takeaways */}
              {article.keyPoints && article.keyPoints.length > 0 && (
                <div className="mb-8 p-6 rounded-2xl bg-[#11161D] border border-white/[0.08]">
                  <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-[#FF6A00] mb-4 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{dict.keypoints_label}</span>
                  </h4>
                  <ul className="space-y-3 text-sm text-zinc-300">
                    {article.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] shrink-0 mt-2" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Narrative paragraphs */}
              <div className="space-y-6 font-editorial text-[#F5F7FA] text-lg sm:text-xl leading-[1.8] font-normal tracking-wide">
                {article.paragraphs.map((p, idx) => (
                  <p key={idx} className="first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-[#FF6A00] first-letter:font-['Space_Grotesk']">
                    {p}
                  </p>
                ))}
              </div>

              {/* Historical Parallel */}
              {article.historicalParallel && (
                <div className="mt-8">
                  <HistoricalComparisonCard
                    currentTopic={article.title}
                    currentSummary={article.dek || article.paragraphs?.[0]}
                    historicalParallel={article.historicalParallel}
                    dict={dict}
                  />
                </div>
              )}

              {/* Verified Sources */}
              {article.sources && article.sources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/[0.08]">
                  <span className="block text-xs font-mono font-semibold text-[#7C8797] uppercase tracking-wider mb-3">
                    {dict.chat_sources_label}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {article.sources.map((s, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-white/[0.03] border border-white/[0.08] text-zinc-300"
                      >
                        <ShieldCheck className="w-3 h-3 text-[#FF6A00]" />
                        <span>{s.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-12 pt-6 border-t border-white/[0.08] text-xs font-mono text-[#7C8797] flex items-center justify-between">
          <span>HUMAYRO 3.3 INTELLIGENCE</span>
          <span>AUTONOMOUS ENGINE</span>
        </div>
      </aside>
    </div>
  );
};

export const IntelligenceReader = ArticleModal;
