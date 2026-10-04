import React, { useEffect, useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  X,
} from 'lucide-react';
import { Appointment, Staff, Service } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export function AdminCalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('all');
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  // New appointment modal
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newServiceId, setNewServiceId] = useState('');
  const [newStaffId, setNewStaffId] = useState('');
  const [newDateStr, setNewDateStr] = useState('');
  const [newTimeStr, setNewTimeStr] = useState('11:00');
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { success, error } = useToast();

  const formattedDate = currentDate.toISOString().split('T')[0];

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getAdminAppointments({ date: viewMode === 'day' ? formattedDate : undefined }),
      api.getStaff(),
      api.getServices(),
    ])
      .then(([aptRes, staffRes, srvRes]) => {
        if (aptRes.success && aptRes.appointments) setAppointments(aptRes.appointments);
        if (staffRes.success && staffRes.staff) setStaffList(staffRes.staff);
        if (srvRes.success && srvRes.services) {
          setServices(srvRes.services);
          if (srvRes.services[0]) setNewServiceId(srvRes.services[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    setNewDateStr(formattedDate);
  }, [formattedDate, viewMode]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await api.updateAppointmentStatus(id, { status });
      if (res.success) {
        success(`Appointment status updated to ${status}`);
        setSelectedApt(null);
        loadData();
      }
    } catch (err: any) {
      error(err.message || 'Failed to update status');
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone || !newCustEmail) {
      error('Please fill in customer details');
      return;
    }

    setIsCreating(true);
    try {
      const res = await api.createAppointment({
        serviceId: newServiceId,
        staffId: newStaffId || 'any',
        date: newDateStr,
        startTime: newTimeStr,
        customerName: newCustName,
        customerEmail: newCustEmail,
        customerPhone: newCustPhone,
        paymentMethod: 'SALON',
      });

      if (res.success) {
        success('Appointment booked on calendar!');
        setNewModalOpen(false);
        loadData();
      }
    } catch (err: any) {
      error(err.message || 'Slot conflict. Specialist is booked at this time.');
    } finally {
      setIsCreating(false);
    }
  };

  const hoursList = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-salon-gold uppercase tracking-wider font-semibold">Salon Scheduling</span>
          <h1 className="text-3xl font-serif text-white mt-1">Specialist Calendar</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-[#14141a] border border-white/10 p-1 text-xs">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'day' ? 'bg-salon-gold text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'week' ? 'bg-salon-gold text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              All Recent
            </button>
          </div>

          <button
            onClick={() => setNewModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-salon-gold text-black font-semibold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors flex items-center gap-1.5 shadow-luxury"
          >
            <Plus className="w-4 h-4" /> New Booking
          </button>
        </div>
      </div>

      {/* Date Navigator & Staff Filter */}
      <div className="p-4 rounded-2xl border border-white/10 bg-[#14141a] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const d = new Date(currentDate);
              d.setDate(d.getDate() - 1);
              setCurrentDate(d);
            }}
            className="p-2 rounded-lg bg-[#181820] border border-white/10 hover:border-white/30 text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#181820] text-sm text-white font-medium">
            <CalendarIcon className="w-4 h-4 text-salon-gold" />
            <span>{currentDate.toLocaleDateString('en-US', { dateStyle: 'full' })}</span>
          </div>
          <button
            onClick={() => {
              const d = new Date(currentDate);
              d.setDate(d.getDate() + 1);
              setCurrentDate(d);
            }}
            className="p-2 rounded-lg bg-[#181820] border border-white/10 hover:border-white/30 text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Staff Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-400">Specialist:</span>
          <select
            value={selectedStaffFilter}
            onChange={(e) => setSelectedStaffFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
          >
            <option value="all">All Specialists</option>
            {staffList.map((st) => (
              <option key={st.id} value={st.id}>{st.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="p-6 rounded-2xl border border-white/10 bg-[#121217] space-y-4">
        <div className="space-y-3">
          {hoursList.map((time) => {
            const timeAppointments = appointments.filter((a) => {
              const matchesStaff = selectedStaffFilter === 'all' || a.staffId === selectedStaffFilter;
              return a.startTime.startsWith(time.split(':')[0]) && matchesStaff;
            });

            return (
              <div key={time} className="flex gap-4 items-start pb-3 border-b border-white/5">
                <span className="text-xs font-mono text-neutral-400 w-14 shrink-0 pt-2 font-medium">
                  {time}
                </span>

                <div className="flex-1 flex flex-wrap gap-3">
                  {timeAppointments.length === 0 ? (
                    <div className="text-[11px] text-neutral-600 italic py-2">Available for reservations</div>
                  ) : (
                    timeAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        onClick={() => setSelectedApt(apt)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all max-w-sm ${
                          apt.status === 'CONFIRMED'
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 hover:border-emerald-400'
                            : apt.status === 'COMPLETED'
                            ? 'bg-blue-950/40 border-blue-500/40 text-blue-200 hover:border-blue-400'
                            : apt.status === 'CANCELLED'
                            ? 'bg-rose-950/40 border-rose-500/40 text-rose-200 hover:border-rose-400'
                            : 'bg-yellow-950/40 border-yellow-500/40 text-yellow-200 hover:border-yellow-400'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 font-semibold mb-1">
                          <span>{apt.startTime} – {apt.endTime}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40">
                            {apt.bookingReference}
                          </span>
                        </div>
                        <h4 className="font-medium text-white text-xs">{apt.service?.name}</h4>
                        <div className="text-[11px] text-neutral-300 mt-1">
                          Guest: <strong className="text-white">{apt.customer?.user?.name || 'Guest'}</strong>
                          {apt.staff && (
                            <span className="ml-2">• With: {apt.staff.name}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointment Detail / Status Management Modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#141418] border border-salon-gold/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-salon-gold font-bold">{selectedApt.bookingReference}</span>
              <button onClick={() => setSelectedApt(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-serif text-white">{selectedApt.service?.name}</h3>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs text-neutral-300">
              <p><strong>Guest:</strong> {selectedApt.customer?.user?.name || 'Guest'}</p>
              <p><strong>Phone:</strong> {selectedApt.customer?.user?.phone || 'Not specified'}</p>
              <p><strong>Date & Time:</strong> {selectedApt.date} from {selectedApt.startTime} to {selectedApt.endTime}</p>
              <p><strong>Specialist:</strong> {selectedApt.staff?.name || 'Any Specialist'}</p>
              <p><strong>Total Amount:</strong> ₹{selectedApt.totalAmount} ({selectedApt.paymentStatus})</p>
              {selectedApt.notes && <p><strong>Notes:</strong> {selectedApt.notes}</p>}
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">Update Appointment Status</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleStatusUpdate(selectedApt.id, 'CONFIRMED')}
                  className="py-2 px-3 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors font-medium"
                >
                  Mark Confirmed
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedApt.id, 'COMPLETED')}
                  className="py-2 px-3 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors font-medium"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedApt.id, 'NO_SHOW')}
                  className="py-2 px-3 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors font-medium"
                >
                  Mark No-Show
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedApt.id, 'CANCELLED')}
                  className="py-2 px-3 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition-colors font-medium"
                >
                  Cancel Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#141418] border border-salon-gold/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif text-white">Create Walk-in / Phone Booking</h3>
              <button onClick={() => setNewModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Service Treatment</label>
                <select
                  value={newServiceId}
                  onChange={(e) => setNewServiceId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} (₹{s.price} - {s.durationMinutes}m)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Assign Specialist</label>
                <select
                  value={newStaffId}
                  onChange={(e) => setNewStaffId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                >
                  <option value="any">Any Available Specialist</option>
                  {staffList.map((st) => (
                    <option key={st.id} value={st.id}>{st.name} ({st.roleTitle})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={newDateStr}
                    onChange={(e) => setNewDateStr(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Start Time</label>
                  <select
                    value={newTimeStr}
                    onChange={(e) => setNewTimeStr(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                  >
                    {hoursList.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="Guest name"
                    required
                    className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="+91..."
                    required
                    className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  placeholder="guest@example.com"
                  required
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 rounded-lg bg-salon-gold text-black font-semibold text-xs uppercase tracking-wider"
                >
                  {isCreating ? 'Booking...' : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
