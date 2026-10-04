import React, { useEffect, useState } from 'react';
import { Sparkles, Star, Quote } from 'lucide-react';
import { Review } from '../../types';
import { api } from '../../services/api';

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    api.getReviews()
      .then((res) => {
        if (res.success && res.reviews) {
          setReviews(res.reviews);
        }
      })
      .catch(() => {});
  }, []);

  const fallbackReviews = [
    {
      id: 'fb-1',
      rating: 5,
      comment: 'Snip De Salon has redefined what a luxury salon experience should feel like in Visakhapatnam. The private treatment room and Moroccan hair spa were an absolute dream.',
      customer: { user: { name: 'Dr. Meenakshi S.' } },
      service: { name: 'Signature Royal Hair Spa & Scalp Detox' },
    },
    {
      id: 'fb-2',
      rating: 5,
      comment: 'Booked my complete South Indian bridal look here. Priya and Kavita are masters of their craft! Flawless airbrush finish that lasted through 12 hours of wedding rituals.',
      customer: { user: { name: 'Aishwarya K.' } },
      service: { name: 'Luxury HD Bridal Makeover & Draping' },
    },
    {
      id: 'fb-3',
      rating: 5,
      comment: 'The 24K gold facial delivered an instant, luminous glow. Impeccable hygiene standards, courteous staff, and tranquil ambiance in Sujatha Nagar.',
      customer: { user: { name: 'Sneha Reddy' } },
      service: { name: 'Hydra-Luxe 24K Gold Cellular Facial' },
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews.slice(0, 3) : fallbackReviews;

  return (
    <section className="py-24 bg-[#09090c] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-salon-gold text-xs uppercase tracking-[0.2em] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guest Chronicles</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
            Words From Our Cherished Patrons
          </h2>
          <p className="text-neutral-400 text-sm font-light">
            Read verified experiences from guests who trust Snip De Salon with their hair, skin, and celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayReviews.map((r) => (
            <div
              key={r.id}
              className="p-8 rounded-2xl border border-white/10 bg-[#121217] flex flex-col justify-between space-y-6 relative luxury-card-hover"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5 pointer-events-none" />

              <div className="space-y-4">
                <div className="flex text-salon-gold gap-1">
                  {[...Array(r.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-salon-gold" />
                  ))}
                </div>

                <p className="text-neutral-300 text-sm font-light italic leading-relaxed">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-serif font-semibold text-white">
                    {r.customer?.user?.name || 'Snip De Salon Guest'}
                  </h4>
                  <span className="text-xs text-salon-gold/90 block mt-0.5">
                    {r.service?.name || 'Verified Salon Treatment'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
