import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function RegisterPage() {
  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      error('Please complete all required fields');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, phone, password });
      success('Welcome to Snip De Salon! Your account is active.');
      navigate('/');
    } catch (err: any) {
      error(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl border border-salon-gold/30 bg-[#131318] shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full border border-salon-gold/40 flex items-center justify-center bg-[#1a1a22] mx-auto text-salon-gold">
            <Scissors className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif text-white">Join Snip De Salon</h1>
          <p className="text-xs text-neutral-400">
            Create an account for personalized booking, loyalty perks, and order tracking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sneha Reddy"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#181822] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-salon-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#181822] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-salon-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98480 12345"
                className="w-full pl-10 pr-4 py-2.5 bg-[#181822] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-salon-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 bg-[#181822] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-salon-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-salon-gold hover:bg-yellow-400 text-black font-semibold text-xs uppercase tracking-widest transition-all shadow-luxury flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {loading ? (
              'Creating Account...'
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-neutral-400">
          <span>Already registered with us? </span>
          <Link to="/login" className="text-salon-gold font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
