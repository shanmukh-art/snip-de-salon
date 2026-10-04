import React, { useEffect, useState } from 'react';
import { Search, Filter, CheckCircle2, XCircle, RotateCcw, AlertCircle, Clock } from 'lucide-react';
import { Appointment } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const loadAppointments = () => {
    setLoading(true);
    api.getAdminAppointments({ status: statusFilter !== 'all' ? statusFilter : undefined, search })
      .then((res) => {
        if (res.success && res.appointments) setAppointments(res.appointments);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAppointments();
  }, [statusFilter, search]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await api.updateAppointmentStatus(id, { status });
      if (res.success) {
        success(`Appointment marked as ${status}`);
        loadAppointments();
      }
    } catch (err: any) {
      error(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-salon-gold uppercase tracking-wider font-semibold">Salon Operations</span>
          <h1 className="text-3xl font-serif text-white mt-1">All Appointments Directory</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl border border-white/10 bg-[#121217] flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reference code or customer name..."
            className="w-full pl-10 pr-4 py-2 bg-[#181820] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-salon-gold"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-400">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#181820] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-salon-gold"
          >
            <option value="all">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No-Show</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#121217] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#16161e] border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Specialist</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Fee / Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    Loading appointments...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    No appointments found matching your filter.
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-salon-gold">
                      {apt.bookingReference}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block">
                        {apt.customer?.user?.name || 'Walk-in Guest'}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {apt.customer?.user?.phone || 'No phone'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-200">
                      {apt.service?.name}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">
                      {apt.staff?.name || 'Any Specialist'}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300 whitespace-nowrap">
                      {apt.date} • {apt.startTime}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block">₹{apt.totalAmount}</span>
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider inline-block mt-0.5 ${
                          apt.status === 'CONFIRMED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : apt.status === 'COMPLETED'
                            ? 'bg-blue-500/20 text-blue-400'
                            : apt.status === 'CANCELLED'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {apt.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'COMPLETED')}
                            className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-[10px] font-medium"
                          >
                            Complete
                          </button>
                        )}
                        {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'CANCELLED')}
                            className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-[10px] font-medium"
                          >
                            Cancel
                          </button>
                        )}
                        {apt.status !== 'CONFIRMED' && apt.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'CONFIRMED')}
                            className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[10px] font-medium"
                          >
                            Confirm
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
