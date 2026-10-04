import React from 'react';
import { Sparkles, Crown, ShieldCheck, HeartHandshake, Eye, Flame } from 'lucide-react';

export function WhyChooseUs() {
  const reasons = [
    {
      icon: Crown,
      title: 'Bespoke Aesthetic Consultations',
      desc: 'No cookie-cutter haircuts or generic facials. Every appointment commences with a personalized diagnosis of your skin, scalp, and lifestyle.',
    },
    {
      icon: ShieldCheck,
      title: 'Dermatologist-Grade Precision & Hygiene',
      desc: 'Sterilized medical-grade tools, sealed single-use application sets, and hospital-tier sanitization between every single appointment.',
    },
    {
      icon: Sparkles,
      title: 'Pure Salon-Exclusive Formulations',
      desc: 'We exclusively utilize premium European and Moroccan organic bonding oils, ammonia-free Italian dyes, and pure 24K cosmetic gold.',
    },
    {
      icon: HeartHandshake,
      title: 'Private Suites & Serene Acoustics',
      desc: 'Soft warm illumination, soothing acoustic rhythms, and secluded bridal and massage suites designed for deep mental calm.',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 text-salon-gold text-xs uppercase tracking-[0.2em] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Snip De Salon Standard</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
          Why Discerning Guests Choose Us
        </h2>
        <p className="text-neutral-400 text-sm font-light">
          An unwavering commitment to aesthetic excellence, uncompromising hygiene, and gracious salon hospitality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {reasons.map((r, i) => {
          const Icon = r.icon;
          return (
            <div
              key={i}
              className="p-8 rounded-2xl border border-white/10 bg-[#131317] luxury-card-hover flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-salon-gold/10 border border-salon-gold/30 flex items-center justify-center text-salon-gold shadow-gold-glow">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif text-white font-medium leading-snug">{r.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">{r.desc}</p>
              </div>
              <div className="pt-4 border-t border-white/5 text-[11px] uppercase tracking-widest text-salon-gold/80 font-mono">
                Standard 0{i + 1}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
