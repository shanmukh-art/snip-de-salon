import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Star, ArrowRight, Sparkles } from 'lucide-react';
import { Service, ServiceCategory } from '../../types';
import { api } from '../../services/api';

interface FeaturedServicesProps {
  onSelectService: (service: Service) => void;
}

export function FeaturedServices({ onSelectService }: FeaturedServicesProps) {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getServiceCategories(), api.getServices()])
      .then(([catRes, srvRes]) => {
        if (catRes.success && catRes.categories) setCategories(catRes.categories);
        if (srvRes.success && srvRes.services) setServices(srvRes.services);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredServices =
    activeCategory === 'all'
      ? services.slice(0, 6)
      : services.filter((s) => s.categoryId === activeCategory || s.category?.slug === activeCategory);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-salon-gold text-xs uppercase tracking-[0.2em] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Salon Menu</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
            Featured Couture Treatments
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base font-light mt-2 max-w-xl">
            Each ritual at Snip De Salon is customized to harmonize with your unique hair texture, skin tone, and wellness desires.
          </p>
        </div>

        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-sm text-salon-gold hover:text-white transition-colors group font-medium"
        >
          <span>View All 20+ Rituals</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-5 py-2 rounded-full text-xs tracking-wider uppercase transition-all whitespace-nowrap border ${
            activeCategory === 'all'
              ? 'border-salon-gold bg-salon-gold text-black font-semibold shadow-gold-glow'
              : 'border-white/10 bg-[#16161c] text-neutral-300 hover:border-white/30'
          }`}
        >
          All Treatments
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 rounded-full text-xs tracking-wider uppercase transition-all whitespace-nowrap border ${
              activeCategory === cat.id
                ? 'border-salon-gold bg-salon-gold text-black font-semibold shadow-gold-glow'
                : 'border-white/10 bg-[#16161c] text-neutral-300 hover:border-white/30'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 rounded-2xl bg-[#141418] animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-2xl border border-white/10 bg-[#141418] overflow-hidden flex flex-col justify-between luxury-card-hover"
            >
              {/* Image & Badges */}
              <div className="relative h-60 overflow-hidden">
                <img
                  src={service.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-[11px] font-semibold text-salon-gold border border-salon-gold/30">
                    {service.category?.name || 'Exclusive'}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs text-white">
                  <Clock className="w-3.5 h-3.5 text-salon-gold" />
                  <span>{service.durationMinutes} mins</span>
                </div>
              </div>

              {/* Service Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-salon-gold text-xs mb-1.5">
                    <Star className="w-3.5 h-3.5 fill-salon-gold" />
                    <span className="font-semibold text-white">{service.rating || '5.0'}</span>
                    <span className="text-neutral-500">({service.reviewCount || 12} reviews)</span>
                  </div>
                  <h3 className="text-xl font-serif text-white group-hover:text-salon-gold transition-colors leading-snug">
                    {service.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Price & Book Button */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-serif font-bold text-salon-gold">
                        ₹{service.price.toLocaleString('en-IN')}
                      </span>
                      {service.originalPrice && (
                        <span className="text-xs text-neutral-500 line-through">
                          ₹{service.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectService(service)}
                    className="px-5 py-2.5 rounded-lg bg-salon-gold hover:bg-yellow-400 text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-luxury"
                  >
                    Reserve Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
