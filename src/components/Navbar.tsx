import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, User, Shield, Bookmark } from 'lucide-react';
import { SupportedLanguage, ThemeMode, UserProfile } from '../types';
import { TranslationDict } from '../i18n/translations';

interface NavbarProps {
  dict: TranslationDict;
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
  user: UserProfile;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
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
  onOpenAdmin
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div
          className={`max-w-[1240px] mx-auto px-4 sm:px-6 py-3.5 rounded-full flex items-center justify-between gap-3 sm:gap-4 transition-all duration-400 ${
            scrolled
              ? 'bg-[#080808]/85 backdrop-blur-xl border border-white/10 shadow-2xl'
              : 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08]'
          }`}
        >
          {/* Brand Logo */}
          <a href="#home" className="flex items-center gap-2.5 font-['Space_Grotesk'] font-bold text-base sm:text-lg tracking-tight shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A00] shadow-[0_0_12px_#FF6A00] animate-pulse" />
            <span>
              Humayro<span className="text-[#FF6A00]">_3.1</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-zinc-400">
            <li>
              <a href="#home" className="hover:text-white transition-colors relative py-1 hover:text-[#FF6A00]">
                {dict.nav_home}
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-white transition-colors relative py-1 hover:text-[#FF6A00]">
                {dict.nav_features}
              </a>
            </li>
            <li>
              <a href="#ai" className="hover:text-white transition-colors relative py-1 hover:text-[#FF6A00]">
                {dict.nav_ai}
              </a>
            </li>
            <li>
              <a href="#map" className="hover:text-white transition-colors relative py-1 hover:text-[#FF6A00]">
                {dict.nav_explore}
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-white transition-colors relative py-1 hover:text-[#FF6A00]">
                {dict.nav_contact}
              </a>
            </li>
          </ul>

          {/* Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* System Status / Admin Button */}
            <button
              onClick={onOpenAdmin}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:border-[#FF6A00]/40 transition-all cursor-pointer"
              title="System Metrics & Provider Status"
            >
              <Shield className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>{dict.nav_admin}</span>
            </button>

            {/* User Profile / Auth Button */}
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white/[0.05] border border-white/[0.08] hover:border-white/20 text-zinc-300 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span className="hidden sm:inline max-w-[90px] truncate">
                {user.email ? user.name : dict.nav_login}
              </span>
              {user.savedArticles.length > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-[#FF6A00] ml-0.5 font-mono">
                  <Bookmark className="w-3 h-3 fill-current" />
                  {user.savedArticles.length}
                </span>
              )}
            </button>

            {/* 3-State Theme Mode Segmented Control: Kunduzgi / Tungi / Tizim */}
            <div
              className="hidden sm:inline-flex items-center p-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] shadow-inner"
              role="group"
              aria-label="Koʻrinish rejimi"
            >
              <button
                type="button"
                onClick={() => onThemeModeChange('light')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-[#FF6A00] text-black shadow-sm font-bold scale-105'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title={`Kunduzgi (Light) — ${dict.theme_light}`}
                aria-label="Kunduzgi rejim"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onThemeModeChange('dark')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  themeMode === 'dark'
                    ? 'bg-[#FF6A00] text-black shadow-sm font-bold scale-105'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title={`Tungi (Dark) — ${dict.theme_dark}`}
                aria-label="Tungi rejim"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onThemeModeChange('system')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  themeMode === 'system'
                    ? 'bg-[#FF6A00] text-black shadow-sm font-bold scale-105'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title={`Tizimdagidek (System) — ${dict.theme_system}`}
                aria-label="Tizimdagidek rejim"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Language Switcher Dropdown (12 Languages) */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] hover:border-white/20 text-xs sm:text-sm text-zinc-300 font-medium transition-all cursor-pointer"
                aria-label="Tilni oʻzgartirish"
              >
                <span>{langMeta[currentLang]?.flag || '🇺🇿'}</span>
                <span className="font-mono text-xs">{langMeta[currentLang]?.label || 'UZ'}</span>
              </button>

              {langMenuOpen && (
                <div
                  className="absolute top-[calc(100%+8px)] right-0 w-52 max-h-80 overflow-y-auto bg-[#0d0d11] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setLangMenuOpen(false)}
                >
                  <div className="px-2 py-1 text-[10px] font-mono uppercase text-zinc-500 tracking-wider border-b border-white/5 mb-1">
                    Tilni tanlang ({Object.keys(langMeta).length})
                  </div>
                  {(Object.keys(langMeta) as SupportedLanguage[]).map(lang => (
                    <button
                      key={lang}
                      onClick={() => {
                        onLanguageChange(lang);
                        setLangMenuOpen(false);
                      }}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-left transition-colors cursor-pointer w-full ${
                        currentLang === lang
                          ? 'bg-[#FF6A00]/15 text-[#FF6A00] font-bold'
                          : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base">{langMeta[lang].flag}</span>
                        <span className="truncate">{langMeta[lang].nativeName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">
                        {langMeta[lang].label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex flex-col justify-center items-center gap-1 w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <span
                className={`w-4 h-0.5 bg-zinc-200 transition-all ${
                  mobileMenuOpen ? 'translate-y-1.5 rotate-45' : ''
                }`}
              />
              <span
                className={`w-4 h-0.5 bg-zinc-200 transition-all ${
                  mobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-4 h-0.5 bg-zinc-200 transition-all ${
                  mobileMenuOpen ? '-translate-y-1.5 -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#080808]/95 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-8 pt-24 overflow-y-auto animate-in fade-in duration-200 lg:hidden">
          <ul className="flex flex-col gap-3 font-['Space_Grotesk'] text-xl sm:text-2xl font-semibold">
            <li>
              <a href="#home" onClick={closeMobile} className="block py-2 border-b border-white/10 text-zinc-100">
                {dict.nav_home}
              </a>
            </li>
            <li>
              <a href="#features" onClick={closeMobile} className="block py-2 border-b border-white/10 text-zinc-100">
                {dict.nav_features}
              </a>
            </li>
            <li>
              <a href="#ai" onClick={closeMobile} className="block py-2 border-b border-white/10 text-zinc-100">
                {dict.nav_ai}
              </a>
            </li>
            <li>
              <a href="#map" onClick={closeMobile} className="block py-2 border-b border-white/10 text-zinc-100">
                {dict.nav_explore}
              </a>
            </li>
            <li>
              <a href="#contact" onClick={closeMobile} className="block py-2 border-b border-white/10 text-zinc-100">
                {dict.nav_contact}
              </a>
            </li>
          </ul>

          <div className="flex flex-col gap-4 pt-6 border-t border-white/10 mt-6">
            {/* Mobile 3-State Theme Buttons */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                Koʻrinish rejimi:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onThemeModeChange('light')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                    themeMode === 'light'
                      ? 'bg-[#FF6A00] text-black border-[#FF6A00] font-bold shadow-md'
                      : 'bg-white/5 border-white/10 text-zinc-300'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>{dict.theme_light || 'Kunduzgi'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onThemeModeChange('dark')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                    themeMode === 'dark'
                      ? 'bg-[#FF6A00] text-black border-[#FF6A00] font-bold shadow-md'
                      : 'bg-white/5 border-white/10 text-zinc-300'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>{dict.theme_dark || 'Tungi'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onThemeModeChange('system')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                    themeMode === 'system'
                      ? 'bg-[#FF6A00] text-black border-[#FF6A00] font-bold shadow-md'
                      : 'bg-white/5 border-white/10 text-zinc-300'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>{dict.theme_system || 'Tizim'}</span>
                </button>
              </div>
            </div>

            {/* Mobile Auth Button */}
            <button
              onClick={() => {
                closeMobile();
                onOpenAuth();
              }}
              className="w-full py-3 rounded-xl bg-[#FF6A00] text-black font-semibold text-center hover:bg-[#FF9A3D] transition-colors cursor-pointer text-sm"
            >
              {user.email ? user.name : dict.nav_get_started}
            </button>

            {/* Mobile Languages Grid (12 Languages) */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                Tilni tanlash:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-48 overflow-y-auto p-1 bg-white/[0.02] rounded-2xl border border-white/5">
                {(Object.keys(langMeta) as SupportedLanguage[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      onLanguageChange(lang);
                      closeMobile();
                    }}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-[11px] font-medium cursor-pointer transition-all truncate ${
                      currentLang === lang
                        ? 'border-[#FF6A00] text-[#FF6A00] bg-[#FF6A00]/10 font-bold'
                        : 'border-white/10 text-zinc-400 bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{langMeta[lang].flag}</span>
                    <span className="truncate">{langMeta[lang].label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
