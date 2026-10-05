import React, { useEffect, useState, useRef } from 'react';
import { TranslationDict } from '../i18n/translations';

interface StatsSectionProps {
  dict: TranslationDict;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ dict }) => {
  const [counts, setCounts] = useState({ articles: 0, sources: 0, countries: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1800;
          const start = performance.now();

          const animate = (time: number) => {
            const elapsed = Math.min((time - start) / duration, 1);
            const easeOut = 1 - Math.pow(1 - elapsed, 3);

            setCounts({
              articles: Math.floor(100 * easeOut),
              sources: Math.floor(5000 * easeOut),
              countries: Math.floor(195 * easeOut)
            });

            if (elapsed < 1) {
              requestAnimationFrame(animate);
            } else {
              setCounts({ articles: 100, sources: 5000, countries: 195 });
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} id="about" className="relative py-24 px-6 z-10">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Stat 1 */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl text-center hover:border-[#FF6A00]/30 transition-all hover:-translate-y-1">
            <div className="flex items-baseline justify-center">
              <span className="font-['Space_Grotesk'] text-4xl sm:text-6xl font-bold bg-gradient-to-r from-[#FF6A00] to-[#FFA84D] bg-clip-text text-transparent">
                {counts.articles}
              </span>
              <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#FF6A00] ml-1">
                M+
              </span>
            </div>
            <div className="mt-3 text-xs sm:text-sm font-medium uppercase tracking-wider text-zinc-400">
              {dict.stat1_label}
            </div>
          </div>

          {/* Stat 2 */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl text-center hover:border-[#FF6A00]/30 transition-all hover:-translate-y-1">
            <div className="flex items-baseline justify-center">
              <span className="font-['Space_Grotesk'] text-4xl sm:text-6xl font-bold bg-gradient-to-r from-[#FF6A00] to-[#FFA84D] bg-clip-text text-transparent">
                {counts.sources.toLocaleString()}
              </span>
              <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#FF6A00] ml-1">
                +
              </span>
            </div>
            <div className="mt-3 text-xs sm:text-sm font-medium uppercase tracking-wider text-zinc-400">
              {dict.stat2_label}
            </div>
          </div>

          {/* Stat 3 */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl text-center hover:border-[#FF6A00]/30 transition-all hover:-translate-y-1">
            <div className="flex items-baseline justify-center">
              <span className="font-['Space_Grotesk'] text-4xl sm:text-6xl font-bold bg-gradient-to-r from-[#FF6A00] to-[#FFA84D] bg-clip-text text-transparent">
                {counts.countries}
              </span>
            </div>
            <div className="mt-3 text-xs sm:text-sm font-medium uppercase tracking-wider text-zinc-400">
              {dict.stat3_label}
            </div>
          </div>

          {/* Stat 4 */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl text-center hover:border-[#FF6A00]/30 transition-all hover:-translate-y-1">
            <div className="flex items-baseline justify-center">
              <span className="font-['Space_Grotesk'] text-4xl sm:text-6xl font-bold text-[#FF6A00]">
                24/7
              </span>
            </div>
            <div className="mt-3 text-xs sm:text-sm font-medium uppercase tracking-wider text-zinc-400">
              {dict.stat4_label}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
