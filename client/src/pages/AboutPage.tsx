import React, { useEffect, useState } from 'react';
import { Sparkles, Award, Shield, Scissors, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { Staff } from '../types';
import { api } from '../services/api';

export function AboutPage() {
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    api.getStaff()
      .then((res) => {
        if (res.success && res.staff) setStaff(res.staff);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-salon-gold text-xs uppercase tracking-[0.2em] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Atelier Philosophy</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight">
          Crafting Timeless Elegance
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
          Founded in Sujatha Nagar, Visakhapatnam, Snip De Salon combines classic European coiffure techniques with modern dermatological skincare and holistic Ayurvedic wellness.
        </p>
      </div>

      {/* Story Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-salon-gold/30 shadow-2xl h-80 sm:h-[420px]">
        <img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80"
          alt="Snip De Salon Interior"
          className="w-full h-full object-cover filter contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-8 sm:p-12">
          <span className="text-salon-gold text-xs uppercase tracking-[0.2em] font-semibold">Our Sacred Space</span>
          <h2 className="text-2xl sm:text-4xl font-serif text-white mt-1">A Haven Away From The World</h2>
        </div>
      </div>

      {/* Staff / Beauticians Section */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-serif text-white">Our Master Stylists & Aestheticians</h2>
          <p className="text-xs text-neutral-400">
            Every professional at Snip De Salon undergoes continuous international masterclass certifications in cutting, coloring, and clinical skincare.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {staff.map((st) => (
            <div
              key={st.id}
              className="p-6 rounded-2xl border border-white/10 bg-[#121217] space-y-4 luxury-card-hover flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative h-64 rounded-xl overflow-hidden bg-[#1a1a22]">
                  <img
                    src={st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={st.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-white">{st.name}</h3>
                  <span className="text-xs font-semibold text-salon-gold block mt-0.5">{st.roleTitle}</span>
                  <p className="text-xs text-neutral-400 font-light mt-2 leading-relaxed">{st.bio}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 text-[11px] text-neutral-500 font-mono">
                Available: {st.workingHoursStart} – {st.workingHoursEnd}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
