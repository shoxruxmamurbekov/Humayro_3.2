import React from 'react';
import { SupportedLanguage } from '../types';
import { getUiText } from '../i18n/uiTranslations';
import { Icon, brightFocusRing } from './icons';

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
      className="md:hidden fixed bottom-0 start-0 end-0 h-16 bg-[#0B0F14]/95 backdrop-blur-2xl border-t border-white/[0.08] z-30 flex items-center justify-around px-2"
      aria-label="Mobile Navigation"
    >
      {/* 1. Home */}
      <button
        type="button"
        onClick={() => scrollTo('home')}
        className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] text-[#7C8797] hover:text-[#F5F7FA] active:text-(--accent) transition-colors cursor-pointer rounded-md ${brightFocusRing}`}
      >
        <Icon name="home" size="sm" />
        <span className="text-[10px] font-mono tracking-wider">{ui.bnav_home}</span>
      </button>

      {/* 2. Signals */}
      <button
        type="button"
        onClick={() => scrollTo('signals')}
        className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] text-[#7C8797] hover:text-[#C1FF1A] active:text-[#C1FF1A] transition-colors cursor-pointer rounded-md ${brightFocusRing}`}
      >
        <Icon name="live" size="sm" tone="secondary" />
        <span className="text-[10px] font-mono tracking-wider text-[#C1FF1A]">{ui.bnav_signals}</span>
      </button>

      {/* 3. AI */}
      <button
        type="button"
        onClick={() => scrollTo('search')}
        className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] text-(--accent) transition-colors cursor-pointer rounded-md ${brightFocusRing}`}
      >
        <div className="w-8 h-8 rounded-full bg-(--accent) text-black flex items-center justify-center shadow-md shadow-(--accent)/30 -mt-2">
          <Icon name="aiAssistant" size="sm" tone="inherit" className="text-black" />
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
        className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] text-[#7C8797] hover:text-[#F5F7FA] active:text-(--accent) transition-colors cursor-pointer rounded-md ${brightFocusRing}`}
      >
        <Icon name="saved" size="sm" />
        <span className="text-[10px] font-mono tracking-wider">{ui.bnav_saved}</span>
      </button>

      {/* 5. Profile */}
      <button
        type="button"
        onClick={onOpenAuth}
        className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] text-[#7C8797] hover:text-[#F5F7FA] active:text-(--accent) transition-colors cursor-pointer rounded-md ${brightFocusRing}`}
      >
        <Icon name="profile" size="sm" />
        <span className="text-[10px] font-mono tracking-wider">{ui.bnav_profile}</span>
      </button>
    </nav>
  );
};
