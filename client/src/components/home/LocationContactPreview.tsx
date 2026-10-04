import React from 'react';
import { MapPin, Phone, Clock, MessageCircle, Navigation, ExternalLink } from 'lucide-react';

export function LocationContactPreview() {
  return (
    <section className="py-24 bg-[#0a0a0d] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Information Column */}
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-salon-gold font-semibold">
              The Salon Sanctuary
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
              Visit Us in Sujatha Nagar, <br />
              <span className="gold-text-gradient italic font-light">Visakhapatnam</span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
              Centrally situated with convenient parking, tranquil interior design, and dedicated private consultation rooms.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl border border-white/10 bg-[#131318] flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-salon-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Salon Address</h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Near Apollo Pharmacy, Main Road, Sujatha Nagar, Visakhapatnam, Andhra Pradesh 530051
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#131318] flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-salon-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Opening Timings</h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Monday to Sunday: 09:00 AM – 08:30 PM (No Holidays)
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#131318] flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-salon-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Concierge & Inquiries</h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Call: +91 891 234 5678 • WhatsApp: +91 98765 43210
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="https://maps.google.com/?q=Sujatha+Nagar+Visakhapatnam"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-salon-gold text-black font-semibold text-xs tracking-wider uppercase hover:bg-yellow-400 transition-colors flex items-center gap-2 shadow-luxury"
              >
                <Navigation className="w-4 h-4" /> Get Directions
              </a>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Map Preview Frame */}
          <div className="relative h-[420px] rounded-3xl overflow-hidden border border-salon-gold/30 shadow-2xl bg-[#14141a]">
            {/* Embedded Google Maps View or Interactive Map Presentation */}
            <iframe
              title="Snip De Salon Location - Sujatha Nagar Visakhapatnam"
              src="https://maps.google.com/maps?q=Sujatha%20Nagar%20Visakhapatnam&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute top-4 left-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-salon-gold/40 text-xs text-white flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Snip De Salon Atelier • Sujatha Nagar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
