import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { TranslationDict } from '../i18n/translations';

interface PricingSectionProps {
  dict: TranslationDict;
  onSelectFree: () => void;
  onComingSoon: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  dict,
  onSelectFree,
  onComingSoon
}) => {
  return (
    <section id="pricing" className="relative py-28 px-6 z-10">
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-medium tracking-widest uppercase text-zinc-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
            <span>{dict.pricing_eyebrow}</span>
          </div>

          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            <span>{dict.pricing_title1} </span>
            <span className="bg-gradient-to-r from-[#FF6A00] to-[#FFA84D] bg-clip-text text-transparent">
              {dict.pricing_title2}
            </span>
          </h2>

          <p className="text-zinc-400 text-base sm:text-lg">
            {dict.pricing_sub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1100px] mx-auto items-stretch">
          {/* 1. Free Tier (REAL & ACTIVE) */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col justify-between hover:border-white/20 transition-all hover:-translate-y-1">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                {dict.price_free_name}
              </span>
              <div className="flex items-baseline mt-4 mb-2">
                <span className="font-['Space_Grotesk'] text-5xl font-bold text-white">$0</span>
                <span className="text-zinc-500 text-sm ml-1">{dict.per_mo}</span>
              </div>
              <p className="text-zinc-400 text-sm mb-8">{dict.price_free_desc}</p>

              <ul className="flex flex-col gap-3.5 mb-8">
                <li className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="w-4 h-4 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{dict.price_free_1}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="w-4 h-4 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{dict.price_free_2}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="w-4 h-4 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{dict.price_free_3}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="w-4 h-4 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{dict.price_free_4}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onSelectFree}
              className="w-full py-3.5 rounded-full font-semibold text-sm bg-white/[0.05] border border-white/10 hover:border-[#FF6A00] hover:text-[#FF6A00] transition-colors cursor-pointer"
            >
              {dict.price_free_cta}
            </button>
          </div>

          {/* 2. Pro Tier (HONESTLY MARKED COMING SOON) */}
          <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#FF6A00]/[0.08] to-transparent border border-[#FF6A00]/40 shadow-[0_0_60px_-15px_rgba(255,106,0,0.25)] flex flex-col justify-between scale-100 lg:scale-105 z-10 transition-all hover:-translate-y-1">
            {/* Featured Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FF6A00] text-black font-semibold text-[11px] uppercase tracking-wider shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>{dict.price_pro_badge}</span>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6A00]">
                {dict.price_pro_name}
              </span>
              <div className="flex items-baseline mt-4 mb-2">
                <span className="font-['Space_Grotesk'] text-5xl font-bold text-white">$19</span>
                <span className="text-zinc-500 text-sm ml-1">{dict.per_mo}</span>
              </div>
              <p className="text-zinc-400 text-sm mb-8">{dict.price_pro_desc}</p>

              <ul className="flex flex-col gap-3.5 mb-8">
                <li className="flex items-center gap-3 text-sm text-zinc-200">
                  <div className="w-4 h-4 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{dict.price_pro_1}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-200">
                  <div className="w-4 h-4 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{dict.price_pro_2}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-200">
                  <div className="w-4 h-4 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{dict.price_pro_3}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-200">
                  <div className="w-4 h-4 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{dict.price_pro_4}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-200">
                  <div className="w-4 h-4 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{dict.price_pro_5}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-200">
                  <div className="w-4 h-4 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{dict.price_pro_6}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onComingSoon}
              className="w-full py-3.5 rounded-full font-semibold text-sm bg-[#FF6A00] text-black hover:bg-[#FF8A24] transition-colors shadow-lg cursor-pointer"
            >
              {dict.price_pro_cta}
            </button>
          </div>

          {/* 3. Enterprise Tier */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col justify-between hover:border-white/20 transition-all hover:-translate-y-1">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                {dict.price_ent_name}
              </span>
              <div className="flex items-baseline mt-4 mb-2">
                <span className="font-['Space_Grotesk'] text-4xl font-bold text-white">{dict.price_ent_amount}</span>
              </div>
              <p className="text-zinc-400 text-sm mb-8">{dict.price_ent_desc}</p>

              <ul className="flex flex-col gap-3.5 mb-8">
                <li className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="w-4 h-4 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{dict.price_ent_1}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="w-4 h-4 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{dict.price_ent_2}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="w-4 h-4 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{dict.price_ent_3}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="w-4 h-4 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{dict.price_ent_4}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="w-4 h-4 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{dict.price_ent_5}</span>
                </li>
              </ul>
            </div>

            <a
              href="#contact"
              className="w-full py-3.5 rounded-full font-semibold text-sm bg-white/[0.05] border border-white/10 hover:border-[#FF6A00] hover:text-[#FF6A00] transition-colors text-center block cursor-pointer"
            >
              {dict.price_ent_cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
