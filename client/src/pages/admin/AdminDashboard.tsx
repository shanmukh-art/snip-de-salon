import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  IndianRupee,
  ShoppingBag,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api';

export function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminDashboard()
      .then((res) => {
        if (res.success) setData(res);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-white/10 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-[#15151c] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-salon-gold uppercase tracking-wider font-semibold">Live Operational Status</span>
          <h1 className="text-3xl font-serif text-white mt-1">Salon Executive Overview</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/calendar"
            className="px-4 py-2 rounded-xl bg-salon-gold text-black font-semibold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors flex items-center gap-1.5 shadow-luxury"
          >
            <Calendar className="w-4 h-4" /> Open Calendar
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl border border-white/10 bg-[#14141a] space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-salon-gold/15 text-salon-gold flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-salon-gold">
            ₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-neutral-400">
            Services: ₹{stats.appointmentRevenue || 0} • Retail: ₹{stats.orderRevenue || 0}
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#14141a] space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Today's Appointments</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-white">
            {stats.todayAppointments || 0}
          </p>
          <p className="text-[11px] text-neutral-400">
            {stats.totalAppointments || 0} total bookings across all time
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#14141a] space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Product Orders</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-white">
            {stats.totalOrders || 0}
          </p>
          <p className="text-[11px] text-neutral-400">
            Fulfillment and doorstep deliveries
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#14141a] space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Registered Guests</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-white">
            {stats.totalCustomers || 0}
          </p>
          <p className="text-[11px] text-neutral-400">
            Salon patron profiles in database
          </p>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {data?.lowStockProducts && data.lowStockProducts.length > 0 && (
        <div className="p-5 rounded-2xl border border-amber-500/30 bg-[#1c1810] flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-amber-200">Inventory Alert: Low Product Stock</h4>
            <p className="text-xs text-amber-300/80">
              The following salon items are at or below reorder threshold (≤ 5 units):
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {data.lowStockProducts.map((p: any) => (
                <span key={p.id} className="px-2.5 py-1 rounded bg-black/40 text-[11px] text-white border border-amber-500/20">
                  {p.name} ({p.stock} units remaining • SKU: {p.sku})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid: Recent Appointments & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#14141a] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif text-white">Recent Guest Appointments</h3>
            <Link to="/admin/appointments" className="text-xs text-salon-gold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentAppointments?.map((apt: any) => (
              <div key={apt.id} className="p-3.5 rounded-xl border border-white/5 bg-[#181822] flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-medium text-white">{apt.service?.name}</h4>
                  <p className="text-neutral-400 mt-0.5">
                    {apt.customer?.user?.name || 'Guest'} • {apt.date} at {apt.startTime}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-salon-gold block">₹{apt.totalAmount}</span>
                  <span className="text-[10px] text-neutral-400 uppercase font-mono">{apt.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Product Orders */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#14141a] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif text-white">Recent Product Orders</h3>
            <Link to="/admin/orders" className="text-xs text-salon-gold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentOrders?.map((ord: any) => (
              <div key={ord.id} className="p-3.5 rounded-xl border border-white/5 bg-[#181822] flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-medium text-white">{ord.customerName}</h4>
                  <p className="text-neutral-400 mt-0.5 font-mono">
                    {ord.orderNumber} • {ord.items?.length || 1} item(s)
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-salon-gold block">₹{ord.totalAmount}</span>
                  <span className="text-[10px] text-emerald-400 uppercase">{ord.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
