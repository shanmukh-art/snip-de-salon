import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, HeartHandshake, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AboutSection() {
  return (
    <section className="py-24 bg-[#0a0a0d] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Imagery Composition */}
          <div className="relative">
            <div className="relative h-[480px] sm:h-[540px] rounded-3xl overflow-hidden border border-salon-gold/25 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
                alt="Snip De Salon Styling Craft"
                className="w-full h-full object-cover filter contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Overlapping Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="absolute -bottom-8 -right-4 sm:-right-8 p-6 rounded-2xl bg-[#14141a]/95 border border-salon-gold/40 shadow-2xl backdrop-blur-md max-w-xs space-y-2 hidden sm:block"
            >
              <div className="flex items-center gap-2 text-salon-gold">
                <Sparkles className="w-5 h-5" />
                <span className="font-serif text-2xl font-bold text-white">10+ Years</span>
              </div>
              <p className="text-xs text-neutral-300 leading-snug">
                Of relentless dedication to artistic precision, high-fashion hair styling, and holistic wellness in Visakhapatnam.
              </p>
            </motion.div>
          </div>

          {/* Right Text Story */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-salon-gold text-xs uppercase tracking-[0.2em] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Atelier Story</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight leading-tight">
              A Sanctuary of Elegance, <br />
              <span className="italic font-light gold-text-gradient">Artistry & Tranquility</span>
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              Nestled on Main Road in Sujatha Nagar, Visakhapatnam, <strong>Snip De Salon</strong> was established with a singular vision: to elevate everyday self-care into a transcendent luxury ritual.
            </p>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
              We merge the world’s most advanced cosmetic science with traditional Ayurvedic botanical therapies. Whether crafting custom dimensional balayage, restoring delicate skin with pure 24K gold cellular infusions, or preparing brides for their sacred walk, our artists tailor every stroke to your natural allure.
            </p>

            {/* Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl border border-white/10 bg-[#121216] space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-salon-gold/10 border border-salon-gold/30 flex items-center justify-center text-salon-gold">
                  <Shield className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white">Hospital-Grade Sterilization</h4>
                <p className="text-xs text-neutral-400">Autoclaved tools, single-use linens, and unmatched hygiene protocols.</p>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#121216] space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-salon-gold/10 border border-salon-gold/30 flex items-center justify-center text-salon-gold">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white">Master Certified Stylists</h4>
                <p className="text-xs text-neutral-400">Internationally trained artists with years of couture salon experience.</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-block px-7 py-3.5 rounded-xl border border-salon-gold/50 text-salon-gold hover:bg-salon-gold hover:text-black font-semibold text-xs uppercase tracking-widest transition-all"
              >
                Learn More About Snip De Salon
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
