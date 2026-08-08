import { ShieldCheck, Calculator, Trophy } from 'lucide-react';
import React from 'react';
import { TRANSLATIONS } from '@/constants';
import type { Language } from '@/types/app';

interface FeaturesProps {
  language: Language;
}

const Features: React.FC<FeaturesProps> = ({ language }) => {
  const t = TRANSLATIONS[language].features;

  const steps = [
    { title: t.step1_title, desc: t.step1_desc, step: "01", icon: ShieldCheck },
    { title: t.step2_title, desc: t.step2_desc, step: "02", icon: Calculator },
    { title: t.step3_title, desc: t.step3_desc, step: "03", icon: Trophy }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-royal/20 bg-royal/5 px-4 py-1.5 text-xs font-bold tracking-wide text-royal uppercase">
            {t.heading_sub}
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-navy">
            {t.heading_main} <span className="text-royal">{t.heading_highlight}</span>
          </h2>
          <p className="mt-4 text-stone-600 text-lg">
            {t.desc}
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div className="hidden md:block absolute top-9 left-[17%] right-[17%] h-px bg-gradient-to-r from-royal/50 via-navy/40 to-royal/50" />
          {steps.map((feature, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center group">
              <div className="relative mb-6">
                <div className="relative z-10 w-[72px] h-[72px] rounded-full bg-gradient-to-br from-royal to-navy text-white flex items-center justify-center shadow-lg shadow-navy/25 ring-4 ring-white transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="w-8 h-8" />
                </div>
                <span className="absolute -top-1.5 -right-1.5 z-20 w-9 h-9 rounded-full bg-white border-2 border-royal/20 text-royal text-xs font-extrabold flex items-center justify-center shadow-md">
                  {feature.step}
                </span>
              </div>
              <h4 className="text-xl font-bold text-navy mb-3">{feature.title}</h4>
              <p className="text-stone-600 leading-relaxed max-w-xs">{feature.desc}</p>
              <div className="mt-6 h-1 w-10 rounded-full bg-gradient-to-r from-royal to-navy opacity-30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
