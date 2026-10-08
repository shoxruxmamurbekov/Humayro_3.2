import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, User, Shield, ChevronDown, Menu, X, Radio } from 'lucide-react';
import { SupportedLanguage, ThemeMode, UserProfile } from '../types';
import { TranslationDict } from '../i18n/translations';
import { getUiText } from '../i18n/uiTranslations';

interface NavbarProps {
  dict: TranslationDict;
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
  user: UserProfile;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onSelectCategory?: (category: string) => void;
}

const langMeta: Record<SupportedLanguage, { flag: string; label: string; name: string; nativeName: string }> = {
  uz: { flag: '🇺🇿', label: 'UZ', name: "O'zbek", nativeName: "O'zbekcha" },
  kk: { flag: '🇰🇿', label: 'KZ', name: "Qozoq", nativeName: "Қазақша" },
  ky: { flag: '🇰🇬', label: 'KG', name: "Qirg'iz", nativeName: "Кыргызча" },
  tg: { flag: '🇹🇯', label: 'TJ', name: "Tojik", nativeName: "Тоҷикӣ" },
  tk: { flag: '🇹🇲', label: 'TM', name: "Turkman", nativeName: "Türkmençe" },
  az: { flag: '🇦🇿', label: 'AZ', name: "Ozarbayjon", nativeName: "Azərbaycanca" },
  tr: { flag: '🇹🇷', label: 'TR', name: "Turk", nativeName: "Türkçe" },
  ar: { flag: '🇸🇦', label: 'AR', name: "Arab", nativeName: "العربية" },
  fa: { flag: '🇮🇷', label: 'FA', name: "Fors", nativeName: "فارسی" },
  ru: { flag: '🇷🇺', label: 'RU', name: "Rus", nativeName: "Русский" },
  en: { flag: '🇬🇧', label: 'EN', name: "Ingliz", nativeName: "English" },
  ko: { flag: '🇰🇷', label: 'KO', name: "Koreys", nativeName: "한국어" }
};

export const Navbar: React.FC<NavbarProps> = ({
  dict,
  currentLang,
  onLanguageChange,
  themeMode,
  onThemeModeChange,
  user,
  onOpenAuth,
  onOpenAdmin,
  onSelectCategory
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ui = getUiText(currentLang);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);

  const scrollTo = (id: string, category?: string) => {
    closeMobile();
    if (category && onSelectCategory) {
      onSelectCategory(category);
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
          scrolled
            ? 'bg-[#05070A]/90 backdrop-blur-xl border-white/[0.08] shadow-lg shadow-black/40'
            : 'bg-[#05070A]/70 backdrop-blur-md border-white/[0.05]'
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a
            href="#home"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Humayro Home"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF6A00] shadow-[0_0_10px_#FF6A00] animate-pulse" />
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] font-bold text-base tracking-[0.14em] text-[#F5F7FA] group-hover:text-white transition-colors">
                {ui.brand_name || 'HUMAYRO'}
              </span>
              <span className="text-[9px] font-mono tracking-[0.22em] text-[#FF6A00] uppercase font-semibold">
                {ui.brand_sub || 'GLOBAL INTELLEKT'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links (Editorial style) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-wide text-[#7C8797]">
            <button
              onClick={() => scrollTo('ai')}
              className="hover:text-[#F5F7FA] transition-colors py-1 cursor-pointer"
            >
              {ui.nav_intelligence}
            </button>
            <button
              onClick={() => scrollTo('map')}
              className="hover:text-[#F5F7FA] transition-colors py-1 cursor-pointer"
            >
              {ui.nav_world}
            </button>
            <button
              onClick={() => scrollTo('feed', 'Markets')}
              className="hover:text-[#F5F7FA] transition-colors py-1 cursor-pointer"
            >
              {ui.nav_markets}
            </button>
            <button
              onClick={() => scrollTo('feed', 'Technology')}
              className="hover:text-[#F5F7FA] transition-colors py-1 cursor-pointer"
            >
              {ui.nav_technology}
            </button>
            <button
              onClick={() => scrollTo('map')}
              className="hover:text-[#F5F7FA] transition-colors py-1 cursor-pointer"
            >
              {ui.nav_regions}
            </button>
            <button
              onClick={() => scrollTo('search')}
              className="hover:text-[#F5F7FA] transition-colors py-1 cursor-pointer"
            >
              {ui.nav_search}
            </button>
            <button
              onClick={() => scrollTo('signals')}
              className="flex items-center gap-1.5 text-[#22C55E] hover:text-[#4ade80] transition-colors py-1 cursor-pointer font-bold tracking-wider"
            >
              <Radio className="w-3 h-3 animate-pulse" />
              <span>{ui.nav_live}</span>
            </button>
          </nav>

          {/* Controls: Language, Admin, Auth, Theme */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0B0F14] hover:bg-[#11161D] border border-white/[0.08] text-xs font-mono font-medium text-[#F5F7FA] transition-colors cursor-pointer"
                aria-expanded={langMenuOpen}
              >
                <span>{langMeta[currentLang]?.flag || '🌐'}</span>
                <span>{langMeta[currentLang]?.label || currentLang.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-[#7C8797]" />
              </button>

              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setLangMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 p-2 rounded-xl bg-[#0B0F14] border border-white/[0.1] shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-150 grid grid-cols-2 gap-1 max-h-72 overflow-y-auto">
                    {(Object.keys(langMeta) as SupportedLanguage[]).map(l => (
                      <button
                        key={l}
                        onClick={() => {
                          onLanguageChange(l);
                          setLangMenuOpen(false);
                        }}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                          currentLang === l
                            ? 'bg-[#FF6A00]/15 text-[#FF6A00] font-bold border border-[#FF6A00]/30'
                            : 'text-[#7C8797] hover:text-[#F5F7FA] hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="text-sm">{langMeta[l].flag}</span>
                        <div className="truncate">
                          <span className="block font-medium truncate">{langMeta[l].name}</span>
                          <span className="text-[10px] text-zinc-500 font-mono block truncate">{langMeta[l].nativeName}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Admin Console trigger */}
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-lg bg-[#0B0F14] hover:bg-[#11161D] border border-white/[0.08] text-[#7C8797] hover:text-[#FF6A00] transition-colors cursor-pointer"
              title="Admin Telemetriya & Status"
              aria-label="Admin"
            >
              <Shield className="w-3.5 h-3.5" />
            </button>

            {/* Theme Toggle (Light / Dark / System) */}
            <button
              onClick={() => {
                const next = themeMode === 'dark' ? 'light' : themeMode === 'light' ? 'system' : 'dark';
                onThemeModeChange(next);
              }}
              className="hidden sm:flex p-2 rounded-lg bg-[#0B0F14] hover:bg-[#11161D] border border-white/[0.08] text-[#7C8797] hover:text-[#F5F7FA] transition-colors cursor-pointer"
              title={`Rejim: ${themeMode}`}
              aria-label="Theme mode"
            >
              {themeMode === 'dark' ? (
                <Moon className="w-3.5 h-3.5 text-zinc-400" />
              ) : themeMode === 'light' ? (
                <Sun className="w-3.5 h-3.5 text-[#FF6A00]" />
              ) : (
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
              )}
            </button>

            {/* User Profile / Auth Button */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FF6A00] hover:bg-[#FF8A24] text-black font-semibold text-xs transition-colors cursor-pointer shadow-md shadow-[#FF6A00]/20"
            >
              <User className="w-3.5 h-3.5" />
              <span className="max-w-[110px] truncate">
                {user.email ? user.name : dict.nav_get_started}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#0B0F14] border border-white/[0.08] text-[#7C8797] hover:text-[#F5F7FA] transition-colors cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#05070A]/95 backdrop-blur-2xl flex flex-col justify-between p-6 pt-24 overflow-y-auto lg:hidden animate-in fade-in duration-200">
          <div className="space-y-4">
            <div className="pb-4 border-b border-white/[0.08]">
              <span className="text-[10px] font-mono tracking-widest text-[#FF6A00] uppercase font-bold">
                HUMAYRO GLOBAL INTELLIGENCE
              </span>
            </div>

            <nav className="flex flex-col gap-3 font-['Space_Grotesk'] text-lg font-medium">
              <button
                onClick={() => scrollTo('ai')}
                className="text-left py-2 border-b border-white/[0.05] text-[#F5F7FA]"
              >
                {ui.nav_intelligence}
              </button>
              <button
                onClick={() => scrollTo('map')}
                className="text-left py-2 border-b border-white/[0.05] text-[#F5F7FA]"
              >
                {ui.nav_world} & {ui.nav_regions}
              </button>
              <button
                onClick={() => scrollTo('feed', 'Markets')}
                className="text-left py-2 border-b border-white/[0.05] text-[#F5F7FA]"
              >
                {ui.nav_markets}
              </button>
              <button
                onClick={() => scrollTo('feed', 'Technology')}
                className="text-left py-2 border-b border-white/[0.05] text-[#F5F7FA]"
              >
                {ui.nav_technology}
              </button>
              <button
                onClick={() => scrollTo('search')}
                className="text-left py-2 border-b border-white/[0.05] text-[#F5F7FA]"
              >
                {ui.nav_search}
              </button>
              <button
                onClick={() => scrollTo('signals')}
                className="text-left py-2 border-b border-white/[0.05] text-[#22C55E] font-bold flex items-center gap-2"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>{ui.signal_live}</span>
              </button>
            </nav>
          </div>

          <div className="pt-6 border-t border-white/[0.08] space-y-4">
            {/* Theme switcher */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onThemeModeChange('light')}
                className={`py-2 rounded-lg border text-xs font-medium ${
                  themeMode === 'light' ? 'bg-[#FF6A00] text-black font-bold' : 'bg-[#0B0F14] border-white/10 text-[#7C8797]'
                }`}
              >
                {currentLang === 'uz' ? "Yorug'" : currentLang === 'ru' ? "Светлая" : "Light"}
              </button>
              <button
                onClick={() => onThemeModeChange('dark')}
                className={`py-2 rounded-lg border text-xs font-medium ${
                  themeMode === 'dark' ? 'bg-[#FF6A00] text-black font-bold' : 'bg-[#0B0F14] border-white/10 text-[#7C8797]'
                }`}
              >
                {currentLang === 'uz' ? "Qorong'i" : currentLang === 'ru' ? "Тёмная" : "Dark"}
              </button>
              <button
                onClick={() => onThemeModeChange('system')}
                className={`py-2 rounded-lg border text-xs font-medium ${
                  themeMode === 'system' ? 'bg-[#FF6A00] text-black font-bold' : 'bg-[#0B0F14] border-white/10 text-[#7C8797]'
                }`}
              >
                {currentLang === 'uz' ? "Tizim" : currentLang === 'ru' ? "Система" : "System"}
              </button>
            </div>

            <button
              onClick={() => {
                closeMobile();
                onOpenAuth();
              }}
              className="w-full py-3 rounded-xl bg-[#FF6A00] text-black font-bold text-center text-sm cursor-pointer"
            >
              {user.email ? user.name : dict.nav_get_started}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
