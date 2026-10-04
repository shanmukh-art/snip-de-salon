import React from 'react';
import { Instagram, Sparkles } from 'lucide-react';

export function SocialGallery() {
  const lookbook = [
    {
      image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80',
      caption: 'French Balayage & Silk Gloss',
    },
    {
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
      caption: 'HD Airbrush Bridal Glam',
    },
    {
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
      caption: 'Champagne Russian Gel Manicure',
    },
    {
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
      caption: 'Moroccan Argan Hair Spa Detox',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 text-salon-gold text-xs uppercase tracking-[0.2em] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Salon Lookbook</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
          Captured In Sujatha Nagar
        </h2>
        <p className="text-neutral-400 text-sm font-light">
          Follow <span className="text-salon-gold font-medium">@snipdesalon</span> on Instagram for everyday hair inspiration, bridal previews, and behind-the-chair artistry.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {lookbook.map((item, i) => (
          <a
            key={i}
            href="https://instagram.com/snipdesalon"
            target="_blank"
            rel="noreferrer"
            className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-white/10 block"
          >
            <img
              src={item.image}
              alt={item.caption}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
              <div className="w-8 h-8 rounded-full bg-salon-gold/20 backdrop-blur-md flex items-center justify-center text-salon-gold mb-2">
                <Instagram className="w-4 h-4" />
              </div>
              <p className="text-xs font-serif font-medium text-white">{item.caption}</p>
              <span className="text-[10px] text-salon-gold tracking-widest uppercase mt-0.5">#SnipDeSalon</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
