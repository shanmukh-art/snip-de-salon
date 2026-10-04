import React, { useEffect, useState } from 'react';
import { Users, Search, IndianRupee, Calendar, ShoppingBag, X } from 'lucide-react';
import { api } from '../../services/api';

export function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  useEffect(() => {
    api.getAdminCustomers()
      .then((res) => {
        if (res.success && res.customers) setCustomers(res.customers);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const openCustomerDetails = async (id: string) => {
    try {
      const res = await api.getAdminCustomerDetails(id);
      if (res.success && res.customer) {
        setSelectedCustomer(res.customer);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-salon-gold uppercase tracking-wider font-semibold">Client Relations</span>
          <h1 className="text-3xl font-serif text-white mt-1">Salon Patrons Directory</h1>
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-white/10 bg-[#121217]">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email, or contact number..."
            className="w-full pl-10 pr-4 py-2 bg-[#181820] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-salon-gold"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#121217] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#16161e] border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Bookings</th>
                <th className="py-3 px-4">Product Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Joined On</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">Loading patrons...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">No client profiles found.</td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">
                      <div>{c.email}</div>
                      <div className="text-[10px] text-neutral-500">{c.phone || 'No phone'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-200">
                      {c.appointmentCount} visits
                    </td>
                    <td className="py-3.5 px-4 text-neutral-200">
                      {c.orderCount} orders
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-salon-gold">
                      ₹{c.totalSpending?.toLocaleString('en-IN') || 0}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400 whitespace-nowrap">
                      {new Date(c.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => openCustomerDetails(c.id)}
                        className="px-2.5 py-1 rounded bg-salon-gold/15 text-salon-gold hover:bg-salon-gold hover:text-black transition-colors"
                      >
                        History
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl my-8 p-6 rounded-2xl bg-[#141418] border border-salon-gold/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif text-white">{selectedCustomer.user?.name}</h3>
                <span className="text-xs text-neutral-400">{selectedCustomer.user?.email} • {selectedCustomer.user?.phone}</span>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <h4 className="font-semibold text-salon-gold uppercase tracking-wider text-[11px]">Appointment History:</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedCustomer.appointments?.length === 0 ? (
                  <p className="text-neutral-500">No appointments recorded yet.</p>
                ) : (
                  selectedCustomer.appointments?.map((a: any) => (
                    <div key={a.id} className="p-3 rounded-lg bg-[#181822] flex justify-between">
                      <div>
                        <span className="font-medium text-white">{a.service?.name}</span>
                        <span className="text-neutral-400 block text-[10px]">{a.date} at {a.startTime}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-salon-gold font-bold">₹{a.totalAmount}</span>
                        <span className="text-[10px] text-neutral-400 block uppercase font-mono">{a.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <h4 className="font-semibold text-salon-gold uppercase tracking-wider text-[11px] pt-2 border-t border-white/5">
                Product Purchases:
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedCustomer.orders?.length === 0 ? (
                  <p className="text-neutral-500">No orders recorded yet.</p>
                ) : (
                  selectedCustomer.orders?.map((o: any) => (
                    <div key={o.id} className="p-2.5 rounded-lg bg-[#181822] flex justify-between">
                      <span>Order {o.orderNumber} ({o.items?.length || 1} items)</span>
                      <span className="text-salon-gold font-semibold">₹{o.totalAmount}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
