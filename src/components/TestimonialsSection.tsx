import React from 'react';
import { TranslationDict } from '../i18n/translations';

interface TestimonialsSectionProps {
  dict: TranslationDict;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ dict }) => {
  return (
    <section className="relative py-28 px-6 z-10">
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-medium tracking-widest uppercase text-zinc-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
            <span>{dict.testi_eyebrow}</span>
          </div>

          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold tracking-tight">
            <span>{dict.testi_title1} </span>
            <span className="bg-gradient-to-r from-[#FF6A00] to-[#FFA84D] bg-clip-text text-transparent">
              {dict.testi_title2}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:border-[#FF6A00]/40 transition-all hover:-translate-y-1.5 flex flex-col justify-between">
            <div>
              <div className="text-[#FF6A00] text-sm tracking-widest mb-4">★★★★★</div>
              <p className="text-zinc-200 text-base leading-relaxed mb-6 font-normal italic">
                {dict.testi1_text}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6A00] to-orange-900 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                SM
              </div>
              <div>
                <strong className="block text-sm text-white font-medium">Sarah Mitchell</strong>
                <span className="text-xs text-zinc-500">{dict.testi1_role}</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:border-[#FF6A00]/40 transition-all hover:-translate-y-1.5 flex flex-col justify-between">
            <div>
              <div className="text-[#FF6A00] text-sm tracking-widest mb-4">★★★★★</div>
              <p className="text-zinc-200 text-base leading-relaxed mb-6 font-normal italic">
                {dict.testi2_text}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-900 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                JK
              </div>
              <div>
                <strong className="block text-sm text-white font-medium">James Kim</strong>
                <span className="text-xs text-zinc-500">{dict.testi2_role}</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:border-[#FF6A00]/40 transition-all hover:-translate-y-1.5 flex flex-col justify-between">
            <div>
              <div className="text-[#FF6A00] text-sm tracking-widest mb-4">★★★★★</div>
              <p className="text-zinc-200 text-base leading-relaxed mb-6 font-normal italic">
                {dict.testi3_text}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-900 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                AL
              </div>
              <div>
                <strong className="block text-sm text-white font-medium">Amara Laurent</strong>
                <span className="text-xs text-zinc-500">{dict.testi3_role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
