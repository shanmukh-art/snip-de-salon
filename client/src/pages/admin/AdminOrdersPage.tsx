import React, { useEffect, useState } from 'react';
import { Package, Search, Clock, CheckCircle2, Truck, X } from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { success, error } = useToast();

  const loadOrders = () => {
    setLoading(true);
    api.getAdminOrders({ status: statusFilter !== 'all' ? statusFilter : undefined, search })
      .then((res) => {
        if (res.success && res.orders) setOrders(res.orders);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, search]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await api.updateOrderStatus(id, { status });
      if (res.success) {
        success(`Order status updated to ${status}`);
        loadOrders();
        if (selectedOrder) setSelectedOrder({ ...selectedOrder, status: status as any });
      }
    } catch (err: any) {
      error(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-salon-gold uppercase tracking-wider font-semibold">Fulfillment & Commerce</span>
          <h1 className="text-3xl font-serif text-white mt-1">Retail Orders Management</h1>
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-white/10 bg-[#121217] flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number or recipient name..."
            className="w-full pl-10 pr-4 py-2 bg-[#181820] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-salon-gold"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-400">Order Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#181820] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-salon-gold"
          >
            <option value="all">All Orders</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="READY">Ready</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#121217] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#16161e] border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4">Placed On</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">No orders found.</td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-salon-gold">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block">{ord.customerName}</span>
                      <span className="text-[10px] text-neutral-400">{ord.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">
                      {ord.items?.length || 1} item(s)
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      ₹{ord.totalAmount}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded bg-[#181820] border border-white/10 focus:outline-none focus:border-salon-gold ${
                          ord.status === 'DELIVERED'
                            ? 'text-emerald-400'
                            : ord.status === 'SHIPPED'
                            ? 'text-blue-400'
                            : 'text-salon-gold'
                        }`}
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="READY">READY</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400 whitespace-nowrap">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#141418] border border-salon-gold/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-salon-gold font-bold">{selectedOrder.orderNumber}</span>
              <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-neutral-300">
              <p><strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.customerEmail} • {selectedOrder.customerPhone})</p>
              <p><strong>Shipping Address:</strong> {selectedOrder.shippingAddress}</p>
              <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount} ({selectedOrder.paymentStatus} via {selectedOrder.paymentMethod})</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-xs font-semibold text-white block uppercase">Purchased Items:</span>
              {selectedOrder.items?.map((item) => (
                <div key={item.id} className="p-2.5 rounded-lg bg-[#181822] flex justify-between text-xs">
                  <span>{item.product?.name || 'Product'} × {item.quantity}</span>
                  <span className="text-salon-gold font-semibold">₹{item.unitPrice * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
