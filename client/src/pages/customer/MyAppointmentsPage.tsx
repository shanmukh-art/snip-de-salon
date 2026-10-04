import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, X, CheckCircle2, RotateCcw } from 'lucide-react';
import { Appointment } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  // Reschedule state
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('11:00');
  const [isRescheduling, setIsRescheduling] = useState(false);

  const fetchAppointments = () => {
    setLoading(true);
    api.getMyAppointments()
      .then((res) => {
        if (res.success && res.appointments) {
          setAppointments(res.appointments);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you wish to cancel this salon appointment? The time slot will be released.')) {
      return;
    }

    try {
      const res = await api.cancelAppointment(id);
      if (res.success) {
        success('Appointment cancelled and slot released.');
        fetchAppointments();
      }
    } catch (err: any) {
      error(err.message || 'Failed to cancel appointment');
    }
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleAppointment || !newDate || !newTime) return;

    setIsRescheduling(true);
    try {
      const res = await api.rescheduleAppointment(rescheduleAppointment.id, {
        newDate,
        newStartTime: newTime,
      });

      if (res.success) {
        success('Appointment rescheduled successfully!');
        setRescheduleAppointment(null);
        fetchAppointments();
      }
    } catch (err: any) {
      error(err.message || 'Requested slot is unavailable. Please choose another time.');
    } finally {
      setIsRescheduling(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-serif text-white">My Appointments</h1>
        <p className="text-xs text-neutral-400">
          View, reschedule, or cancel your scheduled visits to Snip De Salon in Sujatha Nagar.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#141418] animate-pulse border border-white/5" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl p-6 space-y-3">
          <Calendar className="w-10 h-10 text-salon-gold mx-auto" />
          <h3 className="text-lg font-serif text-white">No Appointments Found</h3>
          <p className="text-xs text-neutral-400">You currently have no scheduled appointments at Snip De Salon.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-6 rounded-2xl border border-white/10 bg-[#14141a] flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-salon-gold font-bold">{apt.bookingReference}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      apt.status === 'CONFIRMED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : apt.status === 'CANCELLED'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : apt.status === 'COMPLETED'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>

                <h3 className="text-xl font-serif text-white">{apt.service?.name}</h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <Calendar className="w-4 h-4 text-salon-gold" /> {apt.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <Clock className="w-4 h-4 text-salon-gold" /> {apt.startTime} – {apt.endTime}
                  </span>
                  {apt.staff && (
                    <span>Specialist: <strong className="text-white">{apt.staff.name}</strong></span>
                  )}
                  <span>Payment: <strong className="text-salon-gold">₹{apt.totalAmount} ({apt.paymentStatus})</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setRescheduleAppointment(apt);
                      setNewDate(apt.date);
                      setNewTime(apt.startTime);
                    }}
                    className="px-3.5 py-2 rounded-lg border border-white/15 text-xs text-neutral-300 hover:text-white hover:border-white/30 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reschedule
                  </button>

                  <button
                    onClick={() => handleCancel(apt.id)}
                    className="px-3.5 py-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs transition-colors"
                  >
                    Cancel Slot
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#141418] border border-salon-gold/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif text-white">Reschedule Appointment</h3>
              <button
                onClick={() => setRescheduleAppointment(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-300">
              Rescheduling for <strong className="text-white">{rescheduleAppointment.service?.name}</strong>
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">New Start Time</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 bg-[#181820] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-salon-gold"
                >
                  {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setRescheduleAppointment(null)}
                className="px-4 py-2 rounded-lg border border-white/10 text-xs text-neutral-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                disabled={isRescheduling}
                className="px-4 py-2 rounded-lg bg-salon-gold text-black font-semibold text-xs uppercase tracking-wider"
              >
                {isRescheduling ? 'Checking Slot...' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
