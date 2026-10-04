import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageCircle, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#08080a] border-t border-white/10 text-neutral-400 text-sm">
      {/* Top Pre-Footer Newsletter & Heritage Banner */}
      <div className="border-b border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-salon-gold mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest font-semibold">Join Our Salon Atelier</span>
            </div>
            <h3 className="text-2xl font-serif text-white">Receive Exclusive Private Previews & Offers</h3>
          </div>
          <div className="flex w-full md:w-auto max-w-md gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="px-4 py-2.5 bg-[#141418] border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-salon-gold flex-1"
            />
            <button className="px-5 py-2.5 rounded-lg bg-salon-gold text-black font-semibold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-salon-gold/40 flex items-center justify-center bg-[#14141a]">
              <Scissors className="w-5 h-5 text-salon-gold" />
            </div>
            <div>
              <span className="font-serif text-2xl tracking-[0.15em] text-white uppercase font-bold">
                Snip De Salon
              </span>
              <span className="text-[10px] tracking-[0.25em] text-salon-gold uppercase block font-medium">
                Sujatha Nagar • Visakhapatnam
              </span>
            </div>
          </Link>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
            Visakhapatnam’s sanctuary for bespoke hair styling, dermatologist-grade cellular facials, couture bridal artistry, and therapeutic Ayurvedic spa wellness.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://instagram.com/snipdesalon"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-salon-gold hover:text-salon-gold transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com/snipdesalon"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-salon-gold hover:text-salon-gold transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-400 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Services Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-salon-gold">Signature Rituals</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/services?category=hair-services" className="hover:text-white transition-colors">Hair Styling & Spa</Link></li>
            <li><Link to="/services?category=facial-skin-care" className="hover:text-white transition-colors">24K Gold Cellular Facials</Link></li>
            <li><Link to="/services?category=makeup-bridal" className="hover:text-white transition-colors">HD Bridal Makeover</Link></li>
            <li><Link to="/services?category=nails-hand-care" className="hover:text-white transition-colors">Russian Gel Nails</Link></li>
            <li><Link to="/services?category=spa-wellness" className="hover:text-white transition-colors">Swedish Body Massages</Link></li>
            <li><Link to="/services?category=waxing-body-silking" className="hover:text-white transition-colors">Rica Body Silking</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-salon-gold">Salon Atelier</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/offers" className="hover:text-white transition-colors">Bridal & Festive Packages</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors">Salon Care Products</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">Our Master Stylists</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Salon Location & Map</Link></li>
            <li><Link to="/my-appointments" className="hover:text-white transition-colors">Manage Appointments</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-salon-gold">Salon Concierge</h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-salon-gold shrink-0 mt-0.5" />
              <span>Main Road, Sujatha Nagar, Visakhapatnam, Andhra Pradesh 530051</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-salon-gold shrink-0" />
              <a href="tel:+918912345678" className="hover:text-white transition-colors">+91 891 234 5678</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-salon-gold shrink-0" />
              <a href="mailto:concierge@snipdesalon.com" className="hover:text-white transition-colors">concierge@snipdesalon.com</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-salon-gold shrink-0" />
              <span>Mon - Sun: 09:00 AM - 08:30 PM</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Snip De Salon. All rights reserved. Sujatha Nagar, Visakhapatnam, AP, India.</p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-neutral-400 transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-neutral-400 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-neutral-400 transition-colors">Cancellation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
