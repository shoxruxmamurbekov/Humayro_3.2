import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Check,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { AiArticleResponse, SupportedLanguage } from '../types';
import { TranslationDict } from '../i18n/translations';
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
      // User cancelled or clipboard denied
    }
  };

  // Full article narrative string for the audio player
  const fullTextToRead = article
    ? [article.title, article.dek, ...(article.paragraphs || [])].join('. ')
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex justify-center p-3 sm:p-6 md:p-10 animate-in fade-in duration-200">
      <div className="bg-[#0e0e11] border border-white/10 rounded-3xl max-w-3xl w-full p-6 sm:p-10 my-auto shadow-2xl relative flex flex-col justify-between overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF6A00]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div>
          {/* Top Bar Navigation & Actions */}
          <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
            {/* Back button */}
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer border border-white/5"
            >
              <ArrowLeft className="w-4 h-4 text-[#FF6A00]" />
              <span>{dict.article_back}</span>
            </button>

            {/* Action buttons: Bookmark & Share */}
            <div className="flex items-center gap-2">
              {/* Bookmark Button */}
              <button
                onClick={onToggleBookmark}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-[#FF6A00]/20 border-[#FF6A00] text-[#FF6A00]'
                    : 'bg-white/5 border-white/10 hover:border-white/20 text-zinc-300'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#FF6A00]' : ''}`} />
                <span>{isBookmarked ? dict.article_bookmarked : dict.article_bookmark}</span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 hover:border-[#FF6A00] text-zinc-300 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? dict.article_share_copied : dict.article_share}</span>
              </button>
            </div>
          </div>

          {/* Topic Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/20 text-[11px] font-semibold uppercase tracking-wider text-[#FF6A00] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
            <span>{topicLabel}</span>
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="flex flex-col gap-5 animate-pulse mt-4">
              <div className="h-10 sm:h-14 bg-white/10 rounded-2xl w-11/12" />
              <div className="h-5 bg-white/5 rounded-xl w-3/4" />
              <div className="h-12 bg-white/5 rounded-2xl w-full my-3" />
              <div className="h-4 bg-white/5 rounded-lg w-full mt-4" />
              <div className="h-4 bg-white/5 rounded-lg w-full" />
              <div className="h-4 bg-white/5 rounded-lg w-4/5" />
              <div className="h-4 bg-white/5 rounded-lg w-5/6 mt-4" />
              <div className="h-4 bg-white/5 rounded-lg w-2/3" />
              <div className="h-28 bg-white/5 rounded-2xl w-full mt-6" />
            </div>
          )}

          {/* Loaded Article Content */}
          {!isLoading && article && (
            <article className="flex flex-col">
              <h1 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                {article.title}
              </h1>

              {article.dek && (
                <p className="font-editorial italic text-zinc-400 text-lg sm:text-xl font-normal leading-relaxed mb-6 pb-6 border-b border-white/5">
                  {article.dek}
                </p>
              )}

              {/* Audio Brief Player */}
              <div className="mb-8">
                <AudioPlayerBar
                  textToRead={fullTextToRead}
                  lang={currentLang}
                  dict={dict}
                  title={article.title}
                />
              </div>

              {/* Main article narrative with prestigious Editorial Serif font */}
              <div className="flex flex-col gap-6 font-editorial text-zinc-100 text-lg sm:text-xl leading-[1.85] font-normal tracking-wide">
                {article.paragraphs.map((p, idx) => (
                  <p key={idx} className="first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:text-[#FF6A00] first-letter:font-['Space_Grotesk']">
                    {p}
                  </p>
                ))}
              </div>

              {/* Strategic Key Takeaways Box */}
              {article.keyPoints && article.keyPoints.length > 0 && (
                <div className="mt-10 p-6 sm:p-7 rounded-3xl bg-white/[0.03] border border-[#FF6A00]/25 shadow-lg">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF6A00] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF6A00]" />
                    <span>{dict.keypoints_label}</span>
                  </h4>
                  <ul className="flex flex-col gap-2.5">
                    {article.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] shrink-0 mt-2" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* History vs Today Strategic Comparison Matrix */}
              {article.historicalParallel && (
                <HistoricalComparisonCard
                  currentTopic={article.title}
                  currentSummary={article.dek || article.paragraphs?.[0]}
                  historicalParallel={article.historicalParallel}
                  dict={dict}
                />
              )}

              {/* Verified Sources list */}
              {article.sources && article.sources.length > 0 && (
                <div className="mt-4">
                  <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                    {dict.chat_sources_label}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {article.sources.map((s, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-zinc-300"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#FF6A00]" />
                        <span>{s.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          )}
        </div>

        {/* Footer disclosure */}
        <div className="mt-14 pt-6 border-t border-white/10 text-xs text-zinc-500 leading-normal flex items-center justify-between">
          <p>{dict.article_disclosure}</p>
          <span className="text-[10px] font-mono text-zinc-600">ID: HUMAYRO-AI-3.1</span>
        </div>
      </div>
    </div>
  );
};
