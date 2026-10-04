import React from 'react';
import { Sparkles, Calendar, Phone } from 'lucide-react';

interface BookingCTAProps {
  onOpenBooking: () => void;
}

export function BookingCTA({ onOpenBooking }: BookingCTAProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden border border-salon-gold/40 bg-gradient-to-br from-[#181822] via-[#121217] to-[#0c0c0e] p-8 sm:p-16 text-center space-y-6 shadow-2xl">
        <div className="inline-flex items-center gap-2 text-salon-gold text-xs uppercase tracking-[0.2em] font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Indulge in Excellence</span>
        </div>

        <h2 className="text-3xl sm:text-6xl font-serif text-white tracking-tight max-w-3xl mx-auto leading-tight">
          Ready to Experience <br />
          <span className="gold-text-gradient italic font-light">Snip De Salon?</span>
        </h2>

        <p className="text-neutral-300 text-sm sm:text-base font-light max-w-xl mx-auto leading-relaxed">
          Book your personalized consultation or treatment today. Seamless online booking, instant confirmation, and world-class care awaiting you in Sujatha Nagar.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-9 py-4 rounded-xl bg-salon-gold hover:bg-yellow-400 text-black font-semibold text-sm tracking-wide transition-all shadow-luxury hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Reserve Your Appointment</span>
          </button>

          <a
            href="tel:+918912345678"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/20 hover:border-salon-gold text-white font-medium text-sm tracking-wide transition-all flex items-center justify-center gap-2 bg-[#121216]/60 hover:bg-white/5"
          >
            <Phone className="w-4 h-4 text-salon-gold" />
            <span>Call Concierge</span>
          </a>
        </div>
      </div>
    </section>
  );
}
