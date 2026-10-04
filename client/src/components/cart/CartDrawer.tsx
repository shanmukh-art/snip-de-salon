import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, subtotal, itemsCount, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-[#121216] border-l border-salon-gold/25 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#16161c]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-salon-gold" />
              <h2 className="text-xl font-serif text-white tracking-wide">Luxury Beauty Bag</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-salon-gold/20 text-salon-gold font-medium">
                {itemsCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-serif text-white">Your beauty bag is empty</h3>
                  <p className="text-xs text-neutral-400 max-w-xs mt-1">
                    Explore our curated collection of salon-grade hair treatments, serums, and body rituals.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/products');
                  }}
                  className="px-5 py-2.5 rounded-lg border border-salon-gold/40 text-salon-gold text-xs uppercase tracking-widest hover:bg-salon-gold hover:text-black transition-all"
                >
                  Explore Catalogue
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-white/10 bg-[#181820] flex gap-3.5 items-center"
                >
                  <img
                    src={item.product.image || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=150&q=80'}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{item.product.name}</h4>
                    <span className="text-xs text-salon-gold font-semibold">
                      ₹{(item.product.price * (1 - item.product.discountPercent / 100)).toLocaleString('en-IN')}
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-white/15 rounded-md bg-[#121216]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-salon-gold transition-colors text-neutral-400"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs px-2 font-mono text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-salon-gold transition-colors text-neutral-400"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#16161c] space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">Bag Subtotal</span>
                <span className="text-xl font-serif font-bold text-salon-gold">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Complimentary luxury salon gift packaging included with all orders.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full py-3.5 rounded-xl bg-salon-gold hover:bg-yellow-400 text-black font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-luxury"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
