import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Offer } from '../../types';
import { api } from '../../services/api';

interface PackagesSectionProps {
  onOpenBooking: () => void;
}

export function PackagesSection({ onOpenBooking }: PackagesSectionProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOffers()
      .then((res) => {
        if (res.success && res.offers) {
          setOffers(res.offers);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-[#0a0a0d] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-salon-gold text-xs uppercase tracking-[0.2em] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Packages</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
              Exclusive Packages & Festive Rituals
            </h2>
            <p className="text-neutral-400 text-sm font-light mt-2 max-w-xl">
              Bundled luxury treatments harmoniously coordinated for weddings, festive celebrations, and complete head-to-toe renewals.
            </p>
          </div>

          <Link
            to="/offers"
            className="inline-flex items-center gap-2 text-sm text-salon-gold hover:text-white transition-colors group font-medium"
          >
            <span>Explore All Offers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-[#141418] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {offers.map((offer, idx) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-2xl border border-salon-gold/30 bg-[#14141a] overflow-hidden flex flex-col justify-between shadow-2xl luxury-card-hover"
              >
                {/* Image Banner */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={offer.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14141a] via-black/30 to-transparent" />

                  {offer.badgeText && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-salon-gold text-black text-xs font-semibold uppercase tracking-wider shadow-lg">
                      {offer.badgeText}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-xl font-serif text-white group-hover:text-salon-gold transition-colors leading-snug">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light">
                      {offer.description}
                    </p>

                    {offer.terms && (
                      <p className="text-[11px] text-neutral-500 italic pt-1">
                        * {offer.terms}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Package Price</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-serif font-bold text-salon-gold">
                          ₹{offer.offerPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-neutral-500 line-through">
                          ₹{offer.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={onOpenBooking}
                      className="px-5 py-2.5 rounded-lg bg-salon-gold hover:bg-yellow-400 text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-luxury"
                    >
                      Book Package
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
