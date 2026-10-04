import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  User,
  Scissors,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MapPin,
  ShieldCheck,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Service, Staff } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface MultiStepBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedService?: Service | null;
}

export function MultiStepBookingModal({ isOpen, onClose, preSelectedService }: MultiStepBookingModalProps) {
  const { user } = useAuth();
  const { error, success } = useToast();

  const [step, setStep] = useState<number>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'SALON'>('SALON');

  // Booking Result
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Load initial services
  useEffect(() => {
    if (isOpen) {
      api.getServices().then((res) => {
        if (res.success && res.services) {
          setServices(res.services);
        }
      });
      // Set today as default date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    }
  }, [isOpen]);

  // Pre-selected service handler
  useEffect(() => {
    if (preSelectedService) {
      setSelectedService(preSelectedService);
      setStep(2); // Jump to specialist selection
    } else {
      setSelectedService(null);
      setStep(1);
    }
  }, [preSelectedService, isOpen]);

  // Auto-fill logged in user info
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerEmail(user.email || '');
      setCustomerPhone(user.phone || '');
    }
  }, [user]);

  // Load staff when service is selected
  useEffect(() => {
    if (selectedService) {
      api.getStaffByService(selectedService.id)
        .then((res) => {
          if (res.success && res.staff) {
            setStaffList(res.staff);
          }
        })
        .catch(() => {});
    }
  }, [selectedService]);

  // Load availability slots when date or staff or service changes
  useEffect(() => {
    if (selectedService && selectedDate) {
      setIsLoadingSlots(true);
      setSelectedTime('');
      api.getAvailability(selectedService.id, selectedDate, selectedStaffId)
        .then((res) => {
          if (res.success && res.slots) {
            setAvailableSlots(res.slots);
          }
        })
        .catch((err) => {
          console.error('Failed to get slots:', err);
        })
        .finally(() => {
          setIsLoadingSlots(false);
        });
    }
  }, [selectedService, selectedDate, selectedStaffId]);

  if (!isOpen) return null;

  // Generate next 10 dates for selection
  const datesList = Array.from({ length: 10 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    return { dateStr, dayName, dayNum, month };
  });

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      error('Please complete all booking steps');
      return;
    }

    if (!customerName || !customerEmail || !customerPhone) {
      error('Please fill in your name, email, and contact number');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        serviceId: selectedService.id,
        staffId: selectedStaffId,
        date: selectedDate,
        startTime: selectedTime,
        customerName,
        customerEmail,
        customerPhone,
        notes,
        paymentMethod,
      };

      const res = await api.createAppointment(payload);
      if (res.success && res.appointment) {
        setConfirmedBooking(res.appointment);
        setStep(7); // Confirmation
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#FAF8F5', '#E5C365', '#2a2a32'],
        });
        success('Appointment confirmed successfully!');
      }
    } catch (err: any) {
      error(err.message || 'Booking slot conflict. Please choose another time.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedTime('');
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl my-8 bg-[#141418] border border-salon-gold/30 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#191920]/80">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-salon-gold" />
              <span className="text-xs uppercase tracking-widest text-salon-gold font-medium">Bespoke Reservation</span>
            </div>
            <h2 className="text-2xl font-serif text-white mt-0.5">Snip De Salon Booking Concierge</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {step < 7 && (
          <div className="px-6 pt-4 pb-2 border-b border-white/5 bg-[#101014]">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span className="text-salon-gold font-medium">STEP {step} OF 6</span>
              <span>
                {step === 1 && 'Select Signature Treatment'}
                {step === 2 && 'Select Salon Specialist'}
                {step === 3 && 'Choose Date'}
                {step === 4 && 'Pick Available Time Slot'}
                {step === 5 && 'Guest Details'}
                {step === 6 && 'Payment Preference'}
              </span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-salon-gold to-yellow-200 transition-all duration-300"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif text-white">Choose your service</h3>
                <span className="text-xs text-neutral-400">All prices include salon consultation</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {services.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      selectedService?.id === s.id
                        ? 'border-salon-gold bg-salon-gold/10'
                        : 'border-white/10 bg-[#1a1a22] hover:border-white/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-salon-gold/20 text-salon-gold">
                          {s.category?.name || 'Signature'}
                        </span>
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {s.durationMinutes} mins
                        </span>
                      </div>
                      <h4 className="font-medium text-white text-base leading-snug">{s.name}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-2 mt-1">{s.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                      <span className="text-sm font-semibold text-salon-gold">₹{s.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-neutral-300 underline underline-offset-2">Select Service</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Staff */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-serif text-white">Select your Beauty Specialist</h3>
                <p className="text-xs text-neutral-400">Choose a preferred master artist or select any available specialist</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Any Professional Option */}
                <div
                  onClick={() => setSelectedStaffId('any')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                    selectedStaffId === 'any'
                      ? 'border-salon-gold bg-salon-gold/10 shadow-gold-glow'
                      : 'border-white/10 bg-[#1a1a22] hover:border-white/30'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-salon-gold/20 border border-salon-gold/40 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-salon-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Any Available Specialist</h4>
                    <p className="text-xs text-neutral-400">Maximum flexibility & instant appointment confirmation</p>
                  </div>
                </div>

                {/* Individual Staff Cards */}
                {staffList.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStaffId(st.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      selectedStaffId === st.id
                        ? 'border-salon-gold bg-salon-gold/10'
                        : 'border-white/10 bg-[#1a1a22] hover:border-white/30'
                    }`}
                  >
                    <img
                      src={st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={st.name}
                      className="w-12 h-12 rounded-full object-cover border border-salon-gold/30 shrink-0"
                    />
                    <div>
                      <h4 className="font-semibold text-white leading-snug">{st.name}</h4>
                      <p className="text-xs text-salon-gold">{st.roleTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Select Date */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-serif text-white">Select preferred date</h3>
                <p className="text-xs text-neutral-400">Snip De Salon is open 7 days a week: 09:00 AM - 08:30 PM</p>
              </div>

              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {datesList.map((d) => (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(d.dateStr)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                      selectedDate === d.dateStr
                        ? 'border-salon-gold bg-salon-gold text-black font-semibold'
                        : 'border-white/10 bg-[#1a1a22] text-white hover:border-white/30'
                    }`}
                  >
                    <span className="text-xs opacity-75 uppercase">{d.dayName}</span>
                    <span className="text-xl font-serif font-bold my-1">{d.dayNum}</span>
                    <span className="text-xs opacity-75">{d.month}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Select Time Slot */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif text-white">Available Time Slots</h3>
                  <p className="text-xs text-neutral-400">
                    Live schedule for {new Date(selectedDate).toLocaleDateString('en-US', { dateStyle: 'full' })}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" /> Booked
                  </span>
                </div>
              </div>

              {isLoadingSlots ? (
                <div className="py-12 text-center text-neutral-400">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-salon-gold border-t-transparent mb-3" />
                  <p className="text-sm">Checking real-time salon specialist availability...</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="py-8 text-center text-neutral-400 border border-dashed border-white/10 rounded-xl">
                  <p className="text-sm">No available slots on this date. Please choose another day.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                        !slot.available
                          ? 'border-neutral-800 bg-[#16161a] text-neutral-600 cursor-not-allowed line-through'
                          : selectedTime === slot.time
                          ? 'border-salon-gold bg-salon-gold text-black font-semibold shadow-gold-glow'
                          : 'border-white/10 bg-[#1c1c24] text-white hover:border-salon-gold/50'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Guest Details */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-serif text-white">Your Contact Details</h3>
                <p className="text-xs text-neutral-400">We will send appointment confirmation & reminders to this phone and email.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Sneha Reddy"
                    className="w-full px-3.5 py-2.5 bg-[#181820] border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:border-salon-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +91 98480 12345"
                    className="w-full px-3.5 py-2.5 bg-[#181820] border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:border-salon-gold"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. sneha@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#181820] border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:border-salon-gold"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                    Special Requests / Hair or Skin Sensitivity (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="e.g. Looking for organic products, sensitive scalp, event at 6 PM..."
                    className="w-full px-3.5 py-2 bg-[#181820] border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:border-salon-gold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Payment Method & Review */}
          {step === 6 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-serif text-white">Review & Payment</h3>
                <p className="text-xs text-neutral-400">Confirm your reservation details and select payment method</p>
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#1a1a24] space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Treatment:</span>
                  <span className="text-white font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Specialist:</span>
                  <span className="text-white font-medium">
                    {selectedStaffId === 'any' ? 'Any Available Specialist' : staffList.find((s) => s.id === selectedStaffId)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Date & Time:</span>
                  <span className="text-white font-medium">
                    {selectedDate} at {selectedTime} ({selectedService?.durationMinutes} mins)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Salon Location:</span>
                  <span className="text-white font-medium">Main Road, Sujatha Nagar, Visakhapatnam</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-base">
                  <span className="font-serif text-white">Total Service Fee:</span>
                  <span className="font-semibold text-salon-gold text-lg">
                    ₹{selectedService?.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-wider text-neutral-400">Select Payment Method</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod('SALON')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'SALON'
                        ? 'border-salon-gold bg-salon-gold/10'
                        : 'border-white/10 bg-[#181820]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-salon-gold" />
                      <div>
                        <h4 className="text-sm font-semibold text-white">Pay at Salon</h4>
                        <p className="text-xs text-neutral-400">Pay via Cash, Card or UPI after your service</p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'ONLINE'
                        ? 'border-salon-gold bg-salon-gold/10'
                        : 'border-white/10 bg-[#181820]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-salon-gold" />
                      <div>
                        <h4 className="text-sm font-semibold text-white">Pay Online Now</h4>
                        <p className="text-xs text-neutral-400">Instant Razorpay UPI, Cards & NetBanking</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Confirmation */}
          {step === 7 && confirmedBooking && (
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-salon-gold/20 text-salon-gold uppercase tracking-widest">
                  Booking Confirmed
                </span>
                <h3 className="text-2xl font-serif text-white mt-2">We Look Forward to Pampering You!</h3>
                <p className="text-sm text-neutral-400 max-w-md mx-auto mt-1">
                  A confirmation SMS and email have been dispatched with your bespoke appointment details.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-salon-gold/30 bg-[#181822] max-w-md mx-auto text-left space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Booking Reference:</span>
                  <span className="text-salon-gold font-mono font-bold">{confirmedBooking.bookingReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Service:</span>
                  <span className="text-white font-medium">{confirmedBooking.service?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Date & Slot:</span>
                  <span className="text-white font-medium">
                    {confirmedBooking.date} at {confirmedBooking.startTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Payment:</span>
                  <span className="text-white font-medium">
                    ₹{confirmedBooking.totalAmount} ({confirmedBooking.paymentStatus})
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-start gap-2 text-xs text-neutral-400">
                  <MapPin className="w-4 h-4 text-salon-gold shrink-0 mt-0.5" />
                  <span>Main Road, Sujatha Nagar, Visakhapatnam, Andhra Pradesh 530051</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-lg bg-salon-gold text-black font-semibold text-sm hover:bg-yellow-400 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {step < 7 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#101014]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white px-3 py-2 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                type="button"
                disabled={
                  (step === 1 && !selectedService) ||
                  (step === 3 && !selectedDate) ||
                  (step === 4 && !selectedTime) ||
                  (step === 5 && (!customerName || !customerEmail || !customerPhone))
                }
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-salon-gold text-black font-semibold text-sm hover:bg-yellow-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-salon-gold text-black font-semibold text-sm hover:bg-yellow-400 transition-all disabled:opacity-40"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Confirming Reservation...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Complete Booking
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
