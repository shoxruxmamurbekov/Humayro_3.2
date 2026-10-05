import React from 'react';
import { TranslationDict } from '../i18n/translations';

interface FooterProps {
  dict: TranslationDict;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ dict, onOpenAdmin }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative pt-20 pb-12 px-6 border-t border-white/10 z-10 bg-black/40">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <a href="#home" className="flex items-center gap-2.5 font-['Space_Grotesk'] font-bold text-xl text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A00] shadow-[0_0_12px_#FF6A00] animate-pulse" />
              <span>
                Humayro<span className="text-[#FF6A00]">_3.1</span>
              </span>
            </a>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              {dict.footer_tagline}
            </p>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Col 1 */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 font-mono">
                {dict.footer_product}
              </h4>
              <ul className="flex flex-col gap-2.5 text-sm text-zinc-400">
                <li><a href="#features" className="hover:text-[#FF6A00] transition-colors">{dict.footer_features}</a></li>
                <li><a href="#map" className="hover:text-[#FF6A00] transition-colors">{dict.nav_explore}</a></li>
                <li>
                  <button onClick={onOpenAdmin} className="hover:text-[#FF6A00] transition-colors text-left cursor-pointer">
                    {dict.nav_admin}
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 font-mono">
                {dict.footer_company}
              </h4>
              <ul className="flex flex-col gap-2.5 text-sm text-zinc-400">
                <li><a href="#home" className="hover:text-[#FF6A00] transition-colors">{dict.footer_careers}</a></li>
                <li><a href="#contact" className="hover:text-[#FF6A00] transition-colors">{dict.footer_contact}</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 font-mono">
                {dict.footer_legal}
              </h4>
              <ul className="flex flex-col gap-2.5 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-[#FF6A00] transition-colors">{dict.footer_privacy}</a></li>
                <li><a href="#" className="hover:text-[#FF6A00] transition-colors">{dict.footer_terms}</a></li>
                <li><a href="#" className="hover:text-[#FF6A00] transition-colors">{dict.footer_security}</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 font-mono">
                {dict.footer_connect}
              </h4>
              <ul className="flex flex-col gap-2.5 text-sm text-zinc-400">
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6A00] transition-colors">GitHub</a></li>
                <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6A00] transition-colors">Twitter (X)</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6A00] transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {currentYear} Humayro_3.1. {dict.footer_copy}
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span>Free-First Architecture</span>
            <span>•</span>
            <span>Multi-Source Verification</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
