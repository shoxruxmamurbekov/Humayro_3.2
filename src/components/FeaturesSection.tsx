import React from 'react';
import {
  FileText,
  Radio,
  TrendingUp,
  Globe2,
  Mic,
  Sliders,
  Columns,
  Activity
} from 'lucide-react';
import { TranslationDict } from '../i18n/translations';

interface FeaturesSectionProps {
  dict: TranslationDict;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ dict }) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  };

  return (
    <section id="features" className="relative py-28 px-6 z-10">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-medium tracking-widest uppercase text-zinc-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
            <span>{dict.features_eyebrow}</span>
          </div>

          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            <span>{dict.features_title1} </span>
            <span className="bg-gradient-to-r from-[#FF6A00] to-[#FFA84D] bg-clip-text text-transparent">
              {dict.features_title2}
            </span>
          </h2>

          <p className="text-zinc-400 text-base sm:text-lg">
            {dict.features_sub}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. AI Summary */}
          <div
            onMouseMove={handleMouseMove}
            className="group relative p-7 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:border-[#FF6A00]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center text-[#FF6A00] group-hover:bg-[#FF6A00] group-hover:text-black group-hover:-rotate-6 transition-all duration-300 mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white mb-2">{dict.f1_title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{dict.f1_desc}</p>
            </div>
            <span className="inline-block mt-6 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase text-[#FF6A00] bg-[#FF6A00]/10 border border-[#FF6A00]/20 self-start">
              {dict.f1_tag}
            </span>
          </div>

          {/* 2. Breaking News */}
          <div
            onMouseMove={handleMouseMove}
            className="group relative p-7 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:border-[#FF6A00]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center text-[#FF6A00] group-hover:bg-[#FF6A00] group-hover:text-black group-hover:-rotate-6 transition-all duration-300 mb-5 relative">
                <Radio className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF6A00] animate-ping" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white mb-2">{dict.f2_title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{dict.f2_desc}</p>
            </div>
            <span className="inline-block mt-6 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase text-[#FF6A00] bg-[#FF6A00]/10 border border-[#FF6A00]/20 self-start">
              {dict.f2_tag}
            </span>
          </div>

          {/* 3. Trending */}
          <div
            onMouseMove={handleMouseMove}
            className="group relative p-7 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:border-[#FF6A00]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center text-[#FF6A00] group-hover:bg-[#FF6A00] group-hover:text-black group-hover:-rotate-6 transition-all duration-300 mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white mb-2">{dict.f3_title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{dict.f3_desc}</p>
            </div>
            <span className="inline-block mt-6 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase text-[#FF6A00] bg-[#FF6A00]/10 border border-[#FF6A00]/20 self-start">
              {dict.f3_tag}
            </span>
          </div>

          {/* 4. World Map */}
          <div
            onMouseMove={handleMouseMove}
            className="group relative p-7 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:border-[#FF6A00]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center text-[#FF6A00] group-hover:bg-[#FF6A00] group-hover:text-black group-hover:-rotate-6 transition-all duration-300 mb-5">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white mb-2">{dict.f4_title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{dict.f4_desc}</p>
            </div>
            <span className="inline-block mt-6 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase text-[#FF6A00] bg-[#FF6A00]/10 border border-[#FF6A00]/20 self-start">
              {dict.f4_tag}
            </span>
          </div>

          {/* 5. Voice Search */}
          <div
            onMouseMove={handleMouseMove}
            className="group relative p-7 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:border-[#FF6A00]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center text-[#FF6A00] group-hover:bg-[#FF6A00] group-hover:text-black group-hover:-rotate-6 transition-all duration-300 mb-5">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white mb-2">{dict.f5_title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{dict.f5_desc}</p>
            </div>
            <span className="inline-block mt-6 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase text-[#FF6A00] bg-[#FF6A00]/10 border border-[#FF6A00]/20 self-start">
              {dict.f5_tag}
            </span>
          </div>

          {/* 6. Personalized Feed */}
          <div
            onMouseMove={handleMouseMove}
            className="group relative p-7 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:border-[#FF6A00]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center text-[#FF6A00] group-hover:bg-[#FF6A00] group-hover:text-black group-hover:-rotate-6 transition-all duration-300 mb-5">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white mb-2">{dict.f6_title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{dict.f6_desc}</p>
            </div>
            <span className="inline-block mt-6 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase text-[#FF6A00] bg-[#FF6A00]/10 border border-[#FF6A00]/20 self-start">
              {dict.f6_tag}
            </span>
          </div>

          {/* 7. Compare Sources */}
          <div
            onMouseMove={handleMouseMove}
            className="group relative p-7 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:border-[#FF6A00]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center text-[#FF6A00] group-hover:bg-[#FF6A00] group-hover:text-black group-hover:-rotate-6 transition-all duration-300 mb-5">
                <Columns className="w-6 h-6" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white mb-2">{dict.f7_title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{dict.f7_desc}</p>
            </div>
            <span className="inline-block mt-6 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase text-[#FF6A00] bg-[#FF6A00]/10 border border-[#FF6A00]/20 self-start">
              {dict.f7_tag}
            </span>
          </div>

          {/* 8. Real-time Analysis (Wide Card) */}
          <div
            onMouseMove={handleMouseMove}
            className="group relative p-7 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:border-[#FF6A00]/40 transition-all duration-300 flex flex-col justify-between sm:col-span-2 lg:col-span-1 overflow-hidden"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center text-[#FF6A00] group-hover:bg-[#FF6A00] group-hover:text-black group-hover:-rotate-6 transition-all duration-300 mb-5">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white mb-2">{dict.f8_title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{dict.f8_desc}</p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase text-[#FF6A00] bg-[#FF6A00]/10 border border-[#FF6A00]/20">
                {dict.f8_tag}
              </span>

              {/* Real-time Equalizer Visualizer */}
              <div className="flex items-end gap-1 h-6">
                <div className="w-1 bg-[#FF6A00] rounded-full animate-pulse h-3" />
                <div className="w-1 bg-[#FF6A00] rounded-full animate-pulse h-5" style={{ animationDelay: '150ms' }} />
                <div className="w-1 bg-[#FF6A00] rounded-full animate-pulse h-4" style={{ animationDelay: '300ms' }} />
                <div className="w-1 bg-[#FF6A00] rounded-full animate-pulse h-6" style={{ animationDelay: '450ms' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
