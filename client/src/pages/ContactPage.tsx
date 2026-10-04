import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export function ContactPage() {
  const { success, error } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Consultation Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      error('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.sendInquiry({ name, email, phone, subject, message });
      if (res.success) {
        setSubmitted(true);
        success('Inquiry submitted! Our concierge team will reach out shortly.');
      }
    } catch (err: any) {
      error(err.message || 'Failed to submit inquiry. Please try again or call us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-salon-gold text-xs uppercase tracking-[0.2em] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Salon Concierge</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight">
          Connect With Snip De Salon
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
          Whether inquiring about custom bridal troupe styling, private treatment room reservations, or career opportunities, our concierge team is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Form */}
        <div className="p-8 rounded-3xl border border-white/10 bg-[#121217] space-y-6">
          <div>
            <h3 className="text-2xl font-serif text-white">Send Us a Direct Message</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Your inquiry will be logged directly into our salon concierge desk.
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4 bg-[#16161e] rounded-2xl border border-salon-gold/30 p-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-xl font-serif text-white">Message Dispatched Successfully</h4>
              <p className="text-xs text-neutral-300">
                Thank you, {name}. A member of our concierge team will respond within 2 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setPhone('');
                  setMessage('');
                }}
                className="px-5 py-2 rounded-lg bg-salon-gold/20 text-salon-gold text-xs font-semibold uppercase tracking-wider hover:bg-salon-gold hover:text-black transition-colors"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sneha Reddy"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#181820] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-salon-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98480 12345"
                    className="w-full px-3.5 py-2.5 bg-[#181820] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-salon-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sneha@example.com"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#181820] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Topic / Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#181820] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-salon-gold"
                >
                  <option value="General Consultation Inquiry">General Consultation Inquiry</option>
                  <option value="Bridal Makeover Troupe Inquiry">Bridal Makeover Troupe Inquiry</option>
                  <option value="Private Spa Suite Booking">Private Spa Suite Booking</option>
                  <option value="Corporate / Festive Packages">Corporate / Festive Packages</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Your Message *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Share any specific dates, preferences, or questions..."
                  required
                  className="w-full px-3.5 py-2 bg-[#181820] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-salon-gold"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-salon-gold hover:bg-yellow-400 text-black font-semibold text-xs tracking-widest uppercase transition-all shadow-luxury flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {isSubmitting ? (
                  'Transmitting Message...'
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Note to Concierge
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Location & Contact Information */}
        <div className="space-y-6">
          <div className="p-8 rounded-3xl border border-white/10 bg-[#121217] space-y-6">
            <h3 className="text-2xl font-serif text-white">Salon Coordinates</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-salon-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Physical Address</h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Near Apollo Pharmacy, Main Road, Sujatha Nagar, Visakhapatnam, Andhra Pradesh 530051
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-salon-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Operating Hours</h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Monday to Sunday: 09:00 AM – 08:30 PM (Continuous operations)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-salon-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Direct Line</h4>
                  <a href="tel:+918912345678" className="text-xs text-salon-gold hover:underline mt-0.5 block">
                    +91 891 234 5678
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-salon-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Email Desk</h4>
                  <a href="mailto:concierge@snipdesalon.com" className="text-xs text-neutral-300 hover:text-white mt-0.5 block">
                    concierge@snipdesalon.com
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-4">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Support
              </a>
            </div>
          </div>

          {/* Map Frame */}
          <div className="relative h-64 rounded-3xl overflow-hidden border border-salon-gold/30 shadow-2xl">
            <iframe
              title="Snip De Salon Sujatha Nagar Map"
              src="https://maps.google.com/maps?q=Sujatha%20Nagar%20Visakhapatnam&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }}
              allowFullScreen={false}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
