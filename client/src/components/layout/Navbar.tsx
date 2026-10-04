import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Scissors,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Calendar,
  Sparkles,
  ChevronDown,
  LogOut,
  Shield,
  Clock,
  Phone,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { MultiStepBookingModal } from '../booking/MultiStepBookingModal';

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemsCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Offers & Packages', href: '/offers' },
    { label: 'Beauty Shop', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#121216] border-b border-white/5 py-2 px-4 text-xs text-neutral-400 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-salon-gold">
              <Sparkles className="w-3.5 h-3.5" />
              Sujatha Nagar, Visakhapatnam • Open 7 Days
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              09:00 AM – 08:30 PM
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+918912345678" className="hover:text-salon-gold transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3" /> +91 891 234 5678
            </a>
            {isAdmin && (
              <Link
                to="/admin"
                className="px-2 py-0.5 rounded bg-salon-gold/20 text-salon-gold font-semibold text-[11px] flex items-center gap-1 hover:bg-salon-gold/30"
              >
                <Shield className="w-3 h-3" /> Admin Suite
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0c0c0e]/95 backdrop-blur-md border-b border-salon-gold/20 shadow-2xl py-3.5'
            : 'bg-[#0c0c0e]/80 backdrop-blur-sm border-b border-white/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-salon-gold/40 flex items-center justify-center bg-gradient-to-br from-[#1a1a20] to-[#0e0e12] group-hover:border-salon-gold transition-all">
              <Scissors className="w-5 h-5 text-salon-gold group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div>
              <span className="font-serif text-2xl tracking-[0.15em] text-white uppercase block leading-none font-bold">
                Snip De Salon
              </span>
              <span className="text-[10px] tracking-[0.25em] text-salon-gold uppercase block mt-1 font-medium">
                Haute Coiffure & Spa • Vizag
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => {
              const active = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`transition-colors tracking-wide ${
                    active
                      ? 'text-salon-gold font-semibold'
                      : 'text-neutral-300 hover:text-salon-gold'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Cart, User Dropdown, Book CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full border border-white/10 hover:border-salon-gold/40 text-neutral-300 hover:text-white transition-all bg-[#15151a]"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-salon-gold" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-salon-gold text-black text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {itemsCount}
                </span>
              )}
            </button>

            {/* User Account / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:border-salon-gold/40 bg-[#15151a] text-xs text-white transition-all"
                >
                  <UserIcon className="w-3.5 h-3.5 text-salon-gold" />
                  <span className="max-w-[100px] truncate font-medium">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-52 bg-[#181820] border border-salon-gold/30 rounded-xl shadow-2xl py-2 z-50 text-xs"
                  >
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-neutral-400 truncate">{user.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/5 text-salon-gold"
                      >
                        <Shield className="w-4 h-4" /> Admin Console
                      </Link>
                    )}

                    <Link
                      to="/my-appointments"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/5 text-neutral-200"
                    >
                      <Calendar className="w-4 h-4 text-salon-gold" /> My Appointments
                    </Link>

                    <Link
                      to="/my-orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/5 text-neutral-200"
                    >
                      <ShoppingBag className="w-4 h-4 text-salon-gold" /> My Orders
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/5 text-neutral-200"
                    >
                      <UserIcon className="w-4 h-4 text-salon-gold" /> Account Profile
                    </Link>

                    <div className="pt-1 border-t border-white/10 mt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-rose-500/10 text-rose-300"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/10 hover:border-white/30 text-xs font-medium text-neutral-300 hover:text-white transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-salon-gold" /> Sign In
              </Link>
            )}

            {/* Admin Suite Direct Button */}
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg border border-salon-gold bg-salon-gold/15 hover:bg-salon-gold hover:text-black text-salon-gold font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-luxury"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Suite</span>
              </Link>
            )}

            {/* Primary Book Appointment CTA */}
            <button
              onClick={() => setBookingModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-salon-gold hover:bg-yellow-400 text-black font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-luxury hover:scale-[1.02]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden rounded-lg text-neutral-400 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#121216] px-6 py-6 space-y-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-neutral-200 hover:text-salon-gold py-1"
                >
                  {link.label}
                </Link>
              ))}

              {!user && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-salon-gold py-1 flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" /> Sign In / Register
                </Link>
              )}

              {user && (
                <div className="pt-3 border-t border-white/10 space-y-2 text-sm text-neutral-300">
                  <Link
                    to="/my-appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-salon-gold"
                  >
                    My Appointments
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-salon-gold"
                  >
                    My Orders
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setBookingModalOpen(true);
              }}
              className="w-full py-3 rounded-lg bg-salon-gold text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-luxury"
            >
              <Calendar className="w-4 h-4" /> Reserve Appointment
            </button>
          </div>
        )}
      </header>

      {/* Global Booking Modal */}
      <MultiStepBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </>
  );
}
