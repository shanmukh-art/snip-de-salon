import React, { useEffect, useState } from 'react';
import { Sparkles, Calendar, Check, Tag } from 'lucide-react';
import { Offer } from '../types';
import { api } from '../services/api';
import { MultiStepBookingModal } from '../components/booking/MultiStepBookingModal';

export function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);

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
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-salon-gold text-xs uppercase tracking-[0.2em] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusive Indulgences</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight">
          Offers & Couture Packages
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
          Curated combinations of hair artistry, skin restoration, and holistic spa therapy offered at exceptional value for brides and festive celebrations in Visakhapatnam.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-96 rounded-2xl bg-[#141418] animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="group rounded-2xl border border-salon-gold/30 bg-[#14141a] overflow-hidden flex flex-col justify-between luxury-card-hover shadow-2xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={offer.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14141a] via-black/20 to-transparent" />
                {offer.badgeText && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-salon-gold text-black text-xs font-semibold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> {offer.badgeText}
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-serif text-white group-hover:text-salon-gold transition-colors leading-snug">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    {offer.description}
                  </p>

                  {offer.terms && (
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] text-neutral-400 space-y-1">
                      <span className="font-semibold text-salon-gold block uppercase text-[10px]">Package Terms</span>
                      <p>{offer.terms}</p>
                      {offer.validUntil && (
                        <p className="text-neutral-500">Valid until: {offer.validUntil}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Package Fee</span>
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
                    onClick={() => setBookingOpen(true)}
                    className="px-5 py-2.5 rounded-lg bg-salon-gold hover:bg-yellow-400 text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-luxury flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Book Package
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <MultiStepBookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
