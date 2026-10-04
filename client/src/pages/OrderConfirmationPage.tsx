import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, Package, MapPin } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';

export function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      api.getOrder(orderNumber)
        .then((res) => {
          if (res.success && res.order) {
            setOrder(res.order);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [orderNumber]);

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center space-y-8">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-salon-gold">
          Order Successfully Placed
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif text-white">Thank You for Your Order!</h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-md mx-auto">
          Your luxury salon care package is being prepared with customized care and will be delivered shortly.
        </p>
      </div>

      {order && (
        <div className="p-6 rounded-2xl border border-salon-gold/30 bg-[#14141a] text-left space-y-4 text-xs">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-neutral-400">Order Reference:</span>
            <span className="text-salon-gold font-mono font-bold text-sm">{order.orderNumber}</span>
          </div>

          <div className="space-y-2">
            <span className="text-neutral-400 uppercase font-semibold text-[10px] block">Products Ordered:</span>
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between text-neutral-300">
                <span>{item.product?.name || 'Salon Care Item'} × {item.quantity}</span>
                <span className="text-white font-medium">₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-between items-center text-sm">
            <span className="text-neutral-400">Total Paid:</span>
            <span className="text-xl font-serif font-bold text-salon-gold">₹{order.totalAmount.toLocaleString('en-IN')}</span>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-start gap-2 text-neutral-400">
            <MapPin className="w-4 h-4 text-salon-gold shrink-0 mt-0.5" />
            <span>Shipping to: {order.shippingAddress} ({order.customerName})</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/products"
          className="px-6 py-2.5 rounded-lg border border-white/20 text-neutral-300 hover:text-white hover:border-white/40 text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          to="/my-orders"
          className="px-6 py-2.5 rounded-lg bg-salon-gold hover:bg-yellow-400 text-black text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
        >
          View My Orders <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
