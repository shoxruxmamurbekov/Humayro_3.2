import React from 'react';
import { Home, Radio, Sparkles, Bookmark, User } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { getUiText } from '../i18n/uiTranslations';

interface BottomNavProps {
  onOpenAuth: () => void;
  onOpenBookmarks?: () => void;
  currentLang?: SupportedLanguage;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onOpenAuth,
  onOpenBookmarks,
  currentLang = 'uz'
}) => {
  const ui = getUiText(currentLang);
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0B0F14]/95 backdrop-blur-2xl border-t border-white/[0.08] z-30 flex items-center justify-around px-2"
      aria-label="Mobile Navigation"
    >
      {/* 1. Home */}
      <button
        type="button"
        onClick={() => scrollTo('home')}
        className="flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] text-[#7C8797] hover:text-[#F5F7FA] active:text-[#FF6A00] transition-colors cursor-pointer"
      >
        <Home className="w-4 h-4" />
        <span className="text-[10px] font-mono tracking-wider">{ui.bnav_home}</span>
      </button>

      {/* 2. Signals */}
      <button
        type="button"
        onClick={() => scrollTo('signals')}
        className="flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] text-[#7C8797] hover:text-[#22C55E] active:text-[#22C55E] transition-colors cursor-pointer"
      >
        <Radio className="w-4 h-4 text-[#22C55E]" />
        <span className="text-[10px] font-mono tracking-wider text-[#22C55E]">{ui.bnav_signals}</span>
      </button>

      {/* 3. AI */}
      <button
        type="button"
        onClick={() => scrollTo('search')}
        className="flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] text-[#FF6A00] transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-[#FF6A00] text-black flex items-center justify-center shadow-md shadow-[#FF6A00]/30 -mt-2">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-[9px] font-mono tracking-wider font-bold">{ui.bnav_ai}</span>
      </button>

      {/* 4. Saved */}
      <button
        type="button"
        onClick={() => {
          if (onOpenBookmarks) onOpenBookmarks();
          else scrollTo('feed');
        }}
        className="flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] text-[#7C8797] hover:text-[#F5F7FA] active:text-[#FF6A00] transition-colors cursor-pointer"
      >
        <Bookmark className="w-4 h-4" />
        <span className="text-[10px] font-mono tracking-wider">{ui.bnav_saved}</span>
      </button>

      {/* 5. Profile */}
      <button
        type="button"
        onClick={onOpenAuth}
        className="flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] text-[#7C8797] hover:text-[#F5F7FA] active:text-[#FF6A00] transition-colors cursor-pointer"
      >
        <User className="w-4 h-4" />
        <span className="text-[10px] font-mono tracking-wider">{ui.bnav_profile}</span>
      </button>
    </nav>
  );
};
