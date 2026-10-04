import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ShoppingBag, ArrowRight, Tag, CreditCard, Sparkles, Building } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { error, success } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'CASH'>('ONLINE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      if (user.address) setAddress(user.address);
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="py-24 px-4 text-center max-w-md mx-auto space-y-4">
        <ShoppingBag className="w-12 h-12 text-salon-gold mx-auto" />
        <h2 className="text-2xl font-serif text-white">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-neutral-400">Add products to your bag before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2.5 rounded-lg bg-salon-gold text-black font-semibold text-xs uppercase tracking-wider"
        >
          Explore Catalogue
        </button>
      </div>
    );
  }

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (code === 'SNIPLUXURY') {
      const disc = Math.min(1000, subtotal * 0.2);
      setDiscountAmount(disc);
      setAppliedCoupon({ code, discountPct: 20 });
      success('Coupon "SNIPLUXURY" applied! 20% discount activated.');
    } else if (code === 'WELCOME10') {
      const disc = Math.min(500, subtotal * 0.1);
      setDiscountAmount(disc);
      setAppliedCoupon({ code, discountPct: 10 });
      success('Coupon "WELCOME10" applied! 10% discount activated.');
    } else {
      error('Invalid or expired coupon code. Try "SNIPLUXURY" or "WELCOME10".');
    }
  };

  const finalAmount = Math.max(0, subtotal - discountAmount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !address) {
      error('Please complete all contact and delivery details');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: address,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        paymentMethod,
        couponCode: appliedCoupon?.code,
      };

      const res = await api.createOrder(payload);
      if (res.success && res.order) {
        clearCart();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#FAF8F5'],
        });
        navigate(`/order-confirmation/${res.order.orderNumber}`);
      }
    } catch (err: any) {
      error(err.message || 'Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">Luxury Order Checkout</h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light">
          Complete your contact and delivery information for insured white-glove doorstep delivery.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Customer & Delivery Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-[#121217] space-y-4">
            <h3 className="text-lg font-serif text-white">Shipping & Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Full Name *</label>
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
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98480 12345"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#181820] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div className="md:col-span-2">
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

              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Delivery Address & Pincode *</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  placeholder="Flat/House No., Street, Landmark, Sujatha Nagar or City, Visakhapatnam - 530051"
                  required
                  className="w-full px-3.5 py-2 bg-[#181820] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-salon-gold"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="p-6 rounded-2xl border border-white/10 bg-[#121217] space-y-4">
            <h3 className="text-lg font-serif text-white">Payment Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMethod('ONLINE')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'ONLINE'
                    ? 'border-salon-gold bg-salon-gold/10'
                    : 'border-white/10 bg-[#181820]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-salon-gold" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Instant Online Payment</h4>
                    <p className="text-xs text-neutral-400">Razorpay UPI, Cards & NetBanking</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('CASH')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'CASH'
                    ? 'border-salon-gold bg-salon-gold/10'
                    : 'border-white/10 bg-[#181820]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-salon-gold" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Cash / Salon Pickup</h4>
                    <p className="text-xs text-neutral-400">Pay upon delivery or at the salon counter</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Summary & Coupon */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-[#14141a] space-y-4">
            <h3 className="text-lg font-serif text-white">Order Summary</h3>

            {/* Items list */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-xs">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-2 py-2 border-b border-white/5">
                  <div className="truncate">
                    <span className="font-medium text-white block truncate">{item.product.name}</span>
                    <span className="text-neutral-400">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-semibold text-salon-gold shrink-0">
                    ₹{item.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon field */}
            <div className="pt-2">
              <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">Coupon Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. SNIPLUXURY"
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-xs text-white uppercase focus:outline-none focus:border-salon-gold"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-3 py-2 rounded-lg bg-salon-gold/20 text-salon-gold hover:bg-salon-gold hover:text-black font-semibold text-xs tracking-wider uppercase transition-colors"
                >
                  Apply
                </button>
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">Hint: Try code SNIPLUXURY for 20% off</p>
            </div>

            {/* Cost breakdown */}
            <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-400">
                <span>Doorstep Delivery</span>
                <span className="text-emerald-400 uppercase font-semibold">Free</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm">
                <span className="font-serif text-white">Final Total</span>
                <span className="text-xl font-serif font-bold text-salon-gold">
                  ₹{finalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-salon-gold hover:bg-yellow-400 text-black font-semibold text-xs uppercase tracking-widest transition-all shadow-luxury flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Confirm & Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
