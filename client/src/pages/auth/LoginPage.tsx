import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function LoginPage() {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter your email and password');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      success('Welcome back to Snip De Salon!');
      navigate('/');
    } catch (err: any) {
      error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAdmin = () => {
    setEmail('admin@snipdesalon.com');
    setPassword('SalonAdmin2026!');
  };

  const setDemoCustomer = () => {
    setEmail('sneha.reddy@example.com');
    setPassword('Customer123!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl border border-salon-gold/30 bg-[#131318] shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full border border-salon-gold/40 flex items-center justify-center bg-[#1a1a22] mx-auto text-salon-gold">
            <Scissors className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif text-white">Sign In to Your Account</h1>
          <p className="text-xs text-neutral-400">
            Access your appointments, bag, and personalized salon history.
          </p>
        </div>

        {/* Demo Account Pills */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
          <span className="text-[10px] uppercase font-semibold text-salon-gold tracking-wider block text-center">
            One-Click Evaluation Credentials
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={setDemoAdmin}
              className="flex-1 py-1.5 px-2 rounded bg-salon-gold/15 hover:bg-salon-gold/30 text-salon-gold text-[11px] font-medium transition-colors border border-salon-gold/25"
            >
              Demo Admin
            </button>
            <button
              type="button"
              onClick={setDemoCustomer}
              className="flex-1 py-1.5 px-2 rounded bg-white/5 hover:bg-white/10 text-neutral-200 text-[11px] font-medium transition-colors border border-white/10"
            >
              Demo Customer
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Email Address</label>
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
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
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
              'Authenticating...'
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-neutral-400">
          <span>New to Snip De Salon? </span>
          <Link to="/register" className="text-salon-gold font-semibold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
