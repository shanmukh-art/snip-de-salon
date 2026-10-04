import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, ArrowRight, Star, ShieldCheck, Award } from 'lucide-react';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export function HeroSection({ onOpenBooking }: HeroSectionProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
      {/* Background Ambience & Editorial Imagery */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=85"
          alt="Snip De Salon Luxury Interior"
          className="w-full h-full object-cover object-center filter brightness-[0.28] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0e] via-[#0c0c0e]/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Column: Editorial Headline & Actions */}
        <div className="max-w-2xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-salon-gold/30 bg-[#16161c]/80 backdrop-blur-md text-salon-gold text-xs uppercase tracking-[0.2em]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sujatha Nagar, Visakhapatnam</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white leading-[1.08] tracking-tight"
          >
            Beauty, <br />
            <span className="italic font-light gold-text-gradient">Refined.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed max-w-xl"
          >
            Step into Visakhapatnam’s most distinguished beauty atelier. Experience tailored couture hair artistry, 24K gold skin therapies, and tranquil holistic spa rituals curated for the discerning individual.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-2"
          >
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-salon-gold hover:bg-yellow-400 text-black font-semibold text-sm tracking-wide transition-all shadow-luxury hover:scale-[1.02] flex items-center justify-center gap-2.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            <Link
              to="/services"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/20 hover:border-salon-gold/50 bg-[#14141a]/60 backdrop-blur-sm text-white font-medium text-sm tracking-wide transition-all flex items-center justify-center gap-2 hover:bg-white/5"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4 text-salon-gold" />
            </Link>
          </motion.div>

          {/* Social Proof & Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-8 justify-center md:justify-start text-xs text-neutral-400"
          >
            <div className="flex items-center gap-2">
              <div className="flex text-salon-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-salon-gold" />
                ))}
              </div>
              <span className="text-white font-semibold">4.9 / 5.0</span>
              <span>(500+ Verified Guests)</span>
            </div>

            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-salon-gold" />
              <span className="text-white">Certified Master Colorists</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Visual Highlight Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-sm hidden md:block"
        >
          <div className="relative p-6 rounded-2xl border border-salon-gold/30 bg-[#15151c]/85 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
                alt="24K Gold Cellular Facial Treatment"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-[11px] font-semibold text-salon-gold border border-salon-gold/30">
                Signature Experience
              </div>
            </div>

            <div>
              <span className="text-xs text-salon-gold uppercase tracking-wider font-semibold">Current Spotlight</span>
              <h3 className="text-xl font-serif text-white mt-1">Hydra-Luxe 24K Gold Cellular Facial</h3>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                An ultra-luxurious revitalizing treatment with pure 24K gold leaf and hyaluronic infusion.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400 block">Experience Duration</span>
                <span className="text-sm font-medium text-white">75 Minutes</span>
              </div>
              <button
                onClick={onOpenBooking}
                className="px-4 py-2 rounded-lg bg-salon-gold/20 hover:bg-salon-gold text-salon-gold hover:text-black font-semibold text-xs tracking-wider uppercase transition-all border border-salon-gold/40"
              >
                Reserve
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
