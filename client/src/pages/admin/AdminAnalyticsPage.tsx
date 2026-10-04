import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Sparkles, PieChart, Users, Calendar } from 'lucide-react';
import { api } from '../../services/api';

export function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminAnalytics()
      .then((res) => {
        if (res.success) setData(res);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs text-salon-gold uppercase tracking-wider font-semibold">Business Intelligence</span>
        <h1 className="text-3xl font-serif text-white mt-1">Performance & Analytics</h1>
      </div>

      {loading ? (
        <div className="h-64 rounded-2xl bg-[#141418] animate-pulse" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Services Ranking */}
          <div className="p-6 rounded-2xl border border-white/10 bg-[#121217] space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-salon-gold" /> Most Demanded Rituals
              </h3>
              <span className="text-xs text-neutral-400">Total Bookings</span>
            </div>

            <div className="space-y-4">
              {data?.popularServices?.map((s: any, i: number) => {
                const maxCount = Math.max(...data.popularServices.map((x: any) => x.bookingCount), 1);
                const pct = Math.round((s.bookingCount / maxCount) * 100);

                return (
                  <div key={s.id} className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-neutral-200">
                      <span className="font-medium truncate max-w-xs">{i + 1}. {s.name}</span>
                      <span className="font-semibold text-salon-gold">{s.bookingCount} bookings</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-salon-gold to-yellow-200 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Appointment Status Distribution */}
          <div className="p-6 rounded-2xl border border-white/10 bg-[#121217] space-y-5">
            <h3 className="text-lg font-serif text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-salon-gold" /> Appointment Status Distribution
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {data?.appointmentsByStatus?.map((item: any) => (
                <div key={item.status} className="p-4 rounded-xl border border-white/5 bg-[#181820] space-y-1">
                  <span className="text-2xl font-serif font-bold text-white block">{item.count}</span>
                  <span className="text-[10px] text-salon-gold font-mono uppercase tracking-wider block">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl border border-salon-gold/20 bg-salon-gold/5 text-xs text-neutral-300 space-y-1">
              <p className="font-semibold text-white">Insight:</p>
              <p className="font-light text-neutral-400">
                Salon occupancy peaks between 11:00 AM and 03:00 PM on weekends in Sujatha Nagar.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
