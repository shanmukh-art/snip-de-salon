import React, { useEffect, useState } from 'react';
import { Package, Clock, ShoppingBag, ArrowRight } from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

export function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyOrders()
      .then((res) => {
        if (res.success && res.orders) {
          setOrders(res.orders);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-serif text-white">My Salon Product Orders</h1>
        <p className="text-xs text-neutral-400">
          Track fulfillment status and view receipts for your salon hair and skincare purchases.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-[#141418] animate-pulse border border-white/5" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl p-6 space-y-4">
          <ShoppingBag className="w-10 h-10 text-salon-gold mx-auto" />
          <h3 className="text-lg font-serif text-white">No Orders Placed Yet</h3>
          <p className="text-xs text-neutral-400">Browse our salon-grade hair elixirs and 24K gold serums.</p>
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 rounded-lg bg-salon-gold text-black text-xs font-semibold uppercase tracking-wider"
          >
            Visit Beauty Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-2xl border border-white/10 bg-[#14141a] space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/10 text-xs">
                <div>
                  <span className="text-neutral-400">Order: </span>
                  <span className="font-mono text-salon-gold font-bold">{order.orderNumber}</span>
                  <span className="text-neutral-500 ml-3">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px] font-semibold ${
                      order.status === 'DELIVERED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-salon-gold/20 text-salon-gold border border-salon-gold/30'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 text-xs">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-neutral-300">
                    <span className="font-medium text-white">{item.product?.name || 'Salon Care Item'} × {item.quantity}</span>
                    <span className="text-salon-gold font-semibold">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                <span className="text-neutral-400">Total: <strong className="text-white text-sm">₹{order.totalAmount.toLocaleString('en-IN')}</strong> ({order.paymentStatus})</span>
                <span className="text-neutral-500">Delivering to: {order.shippingAddress}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
