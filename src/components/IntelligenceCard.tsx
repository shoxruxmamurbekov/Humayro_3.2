import React from 'react';
import { Bookmark, Sparkles, TrendingUp, ExternalLink } from 'lucide-react';
import { Article, SupportedLanguage } from '../types';
import { isArticleBookmarked, toggleBookmark } from '../services/userStore';
import { getUiText, formatTimeAgoLocale } from '../i18n/uiTranslations';

interface IntelligenceCardProps {
  article: Article;
  onClick: () => void;
  onBookmarkChanged?: () => void;
  currentLang?: SupportedLanguage;
}

export const IntelligenceCard: React.FC<IntelligenceCardProps> = ({
  article,
  onClick,
  onBookmarkChanged,
  currentLang = 'uz'
}) => {
  const isBookmarked = isArticleBookmarked(article.id);
  const score = article.trendScore || (article.isTrending ? 92 : 84);
  const categoryTag = (article.category || 'GLOBAL').toUpperCase();
  const ui = getUiText(currentLang);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(article);
    if (onBookmarkChanged) onBookmarkChanged();
  };

  return (
    <div
      onClick={onClick}
      className="group relative p-5 sm:p-6 rounded-2xl bg-[#0B0F14] border border-white/[0.08] hover:border-[#FF6A00]/40 transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-1 shadow-lg shadow-black/30 text-left"
    >
      <div>
        {/* Top: Category Tag + Bookmark Button */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-mono tracking-[0.14em] text-[#FF6A00] font-bold">
            {categoryTag}
          </span>

          <div className="flex items-center gap-1.5">
            {article.isTrending && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-[#22C55E]">
                <TrendingUp className="w-3 h-3" />
                <span className="hidden sm:inline uppercase">{ui.card_trending}</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleBookmark}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isBookmarked
                  ? 'text-[#FF6A00] bg-[#FF6A00]/15'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05]'
              }`}
              title={isBookmarked ? (currentLang === 'uz' ? 'Saqlangan' : currentLang === 'ru' ? 'Сохранено' : 'Saved') : (currentLang === 'uz' ? 'Saqlash' : currentLang === 'ru' ? 'Сохранить' : 'Bookmark')}
              aria-label="Bookmark"
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>

        {/* Headline: Editorial typography */}
        <h3 className="font-editorial text-xl sm:text-2xl font-medium leading-[1.15] text-[#F5F7FA] group-hover:text-white transition-colors mb-3">
          {article.title}
        </h3>

        {/* AI Summary / Description excerpt */}
        {article.description && (
          <p className="text-xs sm:text-sm text-[#7C8797] line-clamp-2 leading-relaxed mb-4 font-normal">
            {article.description}
          </p>
        )}
      </div>

      {/* Footer: Source + Timestamp + AI Score */}
      <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs text-[#7C8797] font-mono">
        <div className="flex items-center gap-2 truncate">
          <span className="text-zinc-400 font-medium truncate">{article.source}</span>
          <span className="text-zinc-600">·</span>
          <span>{formatTimeAgoLocale(article.publishedAt, currentLang)}</span>
        </div>

        <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.07] text-[10px] text-zinc-300 font-bold shrink-0">
          AI {score}%
        </span>
      </div>
    </div>
  );
};
