import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Clock,
  Star,
  SlidersHorizontal,
  Sparkles,
  Calendar,
  X,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Service, ServiceCategory } from '../types';
import { api } from '../services/api';
import { MultiStepBookingModal } from '../components/booking/MultiStepBookingModal';

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [maxDuration, setMaxDuration] = useState<number>(180);
  const [loading, setLoading] = useState(true);

  // Booking Modal
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Service Detail Modal
  const [detailService, setDetailService] = useState<Service | null>(null);

  useEffect(() => {
    Promise.all([api.getServiceCategories(), api.getServices()])
      .then(([catRes, srvRes]) => {
        if (catRes.success && catRes.categories) setCategories(catRes.categories);
        if (srvRes.success && srvRes.services) setServices(srvRes.services);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Filter logic
  const filteredServices = services.filter((s) => {
    const matchesCat =
      selectedCategory === 'all' ||
      s.categoryId === selectedCategory ||
      s.category?.slug === selectedCategory;

    const matchesSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice = s.price <= maxPrice;
    const matchesDuration = s.durationMinutes <= maxDuration;

    return matchesCat && matchesSearch && matchesPrice && matchesDuration;
  });

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setBookingOpen(true);
  };

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-salon-gold text-xs uppercase tracking-[0.2em] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Atelier Menu</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight">
          Services & Bespoke Rituals
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
          From couture balayage highlights to dermatologist-grade 24K gold facials and Ayurvedic wellness massages, explore our comprehensive salon menu in Sujatha Nagar, Visakhapatnam.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-6 rounded-2xl border border-white/10 bg-[#121217] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatments by name, e.g. 'Facial', 'Balayage', 'Spa', 'Keratin'..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#181820] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-salon-gold"
            />
          </div>

          {/* Price Range Filter */}
          <div className="flex items-center gap-3 bg-[#181820] px-4 py-2 rounded-xl border border-white/10">
            <span className="text-xs text-neutral-400 shrink-0">Max: ₹{maxPrice.toLocaleString('en-IN')}</span>
            <input
              type="range"
              min="1000"
              max="20000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-salon-gold cursor-pointer"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all whitespace-nowrap border ${
              selectedCategory === 'all'
                ? 'border-salon-gold bg-salon-gold text-black font-semibold shadow-gold-glow'
                : 'border-white/10 bg-[#16161c] text-neutral-300 hover:border-white/30'
            }`}
          >
            All Services ({services.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all whitespace-nowrap border ${
                selectedCategory === c.id
                  ? 'border-salon-gold bg-salon-gold text-black font-semibold shadow-gold-glow'
                  : 'border-white/10 bg-[#16161c] text-neutral-300 hover:border-white/30'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 rounded-2xl bg-[#141418] animate-pulse border border-white/5" />
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl space-y-4">
          <Sparkles className="w-10 h-10 text-salon-gold mx-auto" />
          <h3 className="text-xl font-serif text-white">No services found matching your criteria</h3>
          <p className="text-xs text-neutral-400">Try adjusting your search query, price limit, or category filter.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setMaxPrice(20000);
            }}
            className="px-5 py-2 rounded-lg bg-salon-gold text-black text-xs font-semibold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group rounded-2xl border border-white/10 bg-[#141418] overflow-hidden flex flex-col justify-between luxury-card-hover"
            >
              {/* Image banner */}
              <div
                onClick={() => setDetailService(service)}
                className="relative h-60 overflow-hidden cursor-pointer"
              >
                <img
                  src={service.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-[11px] font-semibold text-salon-gold border border-salon-gold/30">
                    {service.category?.name || 'Exclusive'}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs text-white">
                  <Clock className="w-3.5 h-3.5 text-salon-gold" />
                  <span>{service.durationMinutes} mins</span>
                </div>
              </div>

              {/* Service details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-salon-gold text-xs mb-1.5">
                    <Star className="w-3.5 h-3.5 fill-salon-gold" />
                    <span className="font-semibold text-white">{service.rating || '5.0'}</span>
                    <span className="text-neutral-500">({service.reviewCount || 10} reviews)</span>
                  </div>
                  <h3
                    onClick={() => setDetailService(service)}
                    className="text-xl font-serif text-white group-hover:text-salon-gold transition-colors leading-snug cursor-pointer"
                  >
                    {service.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Price</span>
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

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDetailService(service)}
                      className="px-3 py-2 rounded-lg border border-white/15 text-xs text-neutral-300 hover:text-white hover:border-white/30 transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleBookService(service)}
                      className="px-4 py-2 rounded-lg bg-salon-gold hover:bg-yellow-400 text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-luxury"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Service Detail Modal */}
      {detailService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-2xl bg-[#141418] border border-salon-gold/30 rounded-2xl shadow-2xl overflow-hidden my-8"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={detailService.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'}
                alt={detailService.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setDetailService(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-salon-gold/20 text-salon-gold uppercase">
                  {detailService.category?.name || 'Exclusive Treatment'}
                </span>
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-salon-gold" /> {detailService.durationMinutes} Minutes
                </span>
              </div>

              <h2 className="text-2xl font-serif text-white">{detailService.name}</h2>
              <p className="text-sm text-neutral-300 leading-relaxed font-light">{detailService.description}</p>

              {detailService.benefits && (
                <div className="p-4 rounded-xl border border-white/10 bg-[#191922] space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-salon-gold">
                    Treatment Benefits & Key Results
                  </h4>
                  <ul className="space-y-1.5 text-xs text-neutral-300">
                    {detailService.benefits.split('\n').map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-salon-gold shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block uppercase">Price</span>
                  <span className="text-2xl font-serif font-bold text-salon-gold">
                    ₹{detailService.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => {
                    const s = detailService;
                    setDetailService(null);
                    handleBookService(s);
                  }}
                  className="px-7 py-3 rounded-xl bg-salon-gold hover:bg-yellow-400 text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-luxury flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Book Appointment
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Multi-step Booking Modal */}
      <MultiStepBookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        preSelectedService={selectedService}
      />
    </div>
  );
}
