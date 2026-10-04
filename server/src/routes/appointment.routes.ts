import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth, optionalAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper to calculate end time given start time string "HH:mm" and duration minutes
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMins = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
}

// Helper to check if two time ranges overlap
function doTimesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  return startA < endB && endA > startB;
}

// 1. GET Availability Slots
// GET /api/appointments/availability?serviceId=...&date=YYYY-MM-DD&staffId=... (staffId can be 'any' or specific ID)
router.get('/availability', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceId, date, staffId } = req.query;

    if (!serviceId || !date) {
      return res.status(400).json({
        success: false,
        message: 'serviceId and date (YYYY-MM-DD) are required',
      });
    }

    const service = await prisma.service.findFirst({
      where: {
        OR: [{ id: String(serviceId) }, { slug: String(serviceId) }],
        isActive: true,
      },
    });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found or is currently inactive' });
    }

    const duration = service.durationMinutes || 45;
    const requestedDate = String(date);

    // Get candidate staff members
    let candidateStaff = [];
    if (staffId && staffId !== 'any') {
      const singleStaff = await prisma.staff.findUnique({
        where: { id: String(staffId), isActive: true },
      });
      if (singleStaff) candidateStaff.push(singleStaff);
    } else {
      // Find all staff who can perform this service
      const staffServices = await prisma.staffService.findMany({
        where: { serviceId: service.id, staff: { isActive: true } },
        include: { staff: true },
      });
      candidateStaff = staffServices.map((ss) => ss.staff);

      if (candidateStaff.length === 0) {
        // Fallback to all active staff
        candidateStaff = await prisma.staff.findMany({ where: { isActive: true } });
      }
    }

    if (candidateStaff.length === 0) {
      return res.json({
        success: true,
        date: requestedDate,
        slots: [],
        message: 'No salon professionals available for this service.',
      });
    }

    // Default salon hours: 09:00 to 20:00 (8:00 PM)
    const salonStartMin = 9 * 60; // 09:00 AM
    const salonEndMin = 20 * 60;  // 08:00 PM
    const intervalMin = 30;       // 30 minute slot increments

    // Fetch existing appointments on this date that are not cancelled
    const staffIds = candidateStaff.map((s) => s.id);
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        date: requestedDate,
        staffId: { in: staffIds },
        status: { not: 'CANCELLED' },
      },
    });

    const slots: { time: string; endTime: string; available: boolean; availableStaffId?: string }[] = [];

    for (let m = salonStartMin; m + duration <= salonEndMin; m += intervalMin) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const startTimeStr = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      const endTimeStr = calculateEndTime(startTimeStr, duration);

      // Check if at least one candidate staff is free during this slot
      let freeStaffMember = null;
      for (const staff of candidateStaff) {
        const hasConflict = existingAppointments.some(
          (apt) =>
            apt.staffId === staff.id &&
            doTimesOverlap(startTimeStr, endTimeStr, apt.startTime, apt.endTime)
        );

        if (!hasConflict) {
          freeStaffMember = staff;
          break;
        }
      }

      slots.push({
        time: startTimeStr,
        endTime: endTimeStr,
        available: !!freeStaffMember,
        availableStaffId: freeStaffMember?.id,
      });
    }

    res.json({
      success: true,
      service,
      date: requestedDate,
      slots,
    });
  } catch (error) {
    next(error);
  }
});

// 2. CREATE Appointment (Public / Logged-in Customer)
const bookingSchema = z.object({
  serviceId: z.string(),
  staffId: z.string().optional(), // 'any' or specific ID
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Start time must be HH:mm'),
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(8, 'Phone number is required'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['ONLINE', 'SALON']).default('SALON'),
});

router.post('/', optionalAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = bookingSchema.parse(req.body);

    const service = await prisma.service.findFirst({
      where: {
        OR: [{ id: data.serviceId }, { slug: data.serviceId }],
        isActive: true,
      },
    });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Selected service is no longer active or available.' });
    }

    const duration = service.durationMinutes || 45;
    const endTime = calculateEndTime(data.startTime, duration);

    // Resolve or find assigned staff member
    let chosenStaffId: string | null = null;
    if (data.staffId && data.staffId !== 'any') {
      // Validate staff exists and is free
      const staff = await prisma.staff.findUnique({
        where: { id: data.staffId, isActive: true },
      });
      if (!staff) {
        return res.status(400).json({ success: false, message: 'Specified staff member not found.' });
      }

      // Check conflict
      const conflict = await prisma.appointment.findFirst({
        where: {
          staffId: staff.id,
          date: data.date,
          status: { not: 'CANCELLED' },
          startTime: { lt: endTime },
          endTime: { gt: data.startTime },
        },
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: 'The selected time slot has just been booked for this specialist. Please choose another time or specialist.',
        });
      }

      chosenStaffId = staff.id;
    } else {
      // 'Any' professional: find a free qualified staff member
      const candidateStaff = await prisma.staff.findMany({
        where: { isActive: true },
      });

      for (const st of candidateStaff) {
        const conflict = await prisma.appointment.findFirst({
          where: {
            staffId: st.id,
            date: data.date,
            status: { not: 'CANCELLED' },
            startTime: { lt: endTime },
            endTime: { gt: data.startTime },
          },
        });
        if (!conflict) {
          chosenStaffId = st.id;
          break;
        }
      }

      if (!chosenStaffId && candidateStaff.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'All salon specialists are fully booked for this time slot. Please choose another time.',
        });
      }
    }

    // Resolve or create Customer record
    let customerId = req.user?.customerId;

    if (!customerId) {
      // Look up user by email or create guest customer
      let user = await prisma.user.findUnique({
        where: { email: data.customerEmail.toLowerCase().trim() },
        include: { customerProfile: true },
      });

      if (!user) {
        // Create customer user with temporary random password
        const randomPassword = Math.random().toString(36).slice(-8) + 'Aa1!';
        const passwordHash = await bcryptHash(randomPassword);

        user = await prisma.user.create({
          data: {
            name: data.customerName.trim(),
            email: data.customerEmail.toLowerCase().trim(),
            passwordHash,
            phone: data.customerPhone.trim(),
            role: 'CUSTOMER',
            customerProfile: {
              create: {},
            },
          },
          include: { customerProfile: true },
        });
      } else if (!user.customerProfile) {
        const profile = await prisma.customer.create({
          data: { userId: user.id },
        });
        customerId = profile.id;
      }

      customerId = user.customerProfile?.id || customerId;
    }

    if (!customerId) {
      return res.status(500).json({ success: false, message: 'Could not associate customer record' });
    }

    // Generate unique booking reference
    const bookingReference = `SND-${Math.floor(10000 + Math.random() * 90000)}`;

    const appointment = await prisma.appointment.create({
      data: {
        bookingReference,
        customerId,
        staffId: chosenStaffId,
        serviceId: service.id,
        date: data.date,
        startTime: data.startTime,
        endTime,
        status: 'CONFIRMED',
        notes: data.notes || null,
        totalAmount: service.price,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === 'ONLINE' ? 'PAID' : 'PENDING',
      },
      include: {
        service: true,
        staff: true,
        customer: {
          include: {
            user: {
              select: { name: true, email: true, phone: true },
            },
          },
        },
      },
    });

    // Record notification for user
    const customerUser = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { userId: true },
    });
    if (customerUser) {
      await prisma.notification.create({
        data: {
          userId: customerUser.userId,
          title: 'Appointment Confirmed',
          message: `Your booking for ${service.name} on ${data.date} at ${data.startTime} is confirmed (#${bookingReference}).`,
          type: 'BOOKING',
          link: '/my-appointments',
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Your appointment has been successfully scheduled at Snip De Salon!',
      appointment,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation error',
      });
    }
    next(error);
  }
});

async function bcryptHash(pass: string) {
  const bcrypt = await import('bcryptjs');
  return bcrypt.default.hash(pass, 10);
}

// 3. GET My Appointments (Customer authenticated)
router.get('/my-appointments', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const customerId = req.user?.customerId;
    if (!customerId) {
      return res.json({ success: true, appointments: [] });
    }

    const appointments = await prisma.appointment.findMany({
      where: { customerId },
      include: {
        service: true,
        staff: true,
      },
      orderBy: { date: 'desc' },
    });

    res.json({ success: true, appointments });
  } catch (error) {
    next(error);
  }
});

// 4. Cancel Appointment (Customer or Admin)
router.post('/:id/cancel', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Verify ownership if not admin
    if (req.user?.role !== 'ADMIN' && appointment.customerId !== req.user?.customerId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this appointment' });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: { service: true, staff: true },
    });

    res.json({
      success: true,
      message: 'Appointment has been cancelled and the time slot is now released.',
      appointment: updated,
    });
  } catch (error) {
    next(error);
  }
});

// 5. Reschedule Appointment
router.post('/:id/reschedule', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { newDate, newStartTime } = req.body;

    if (!newDate || !newStartTime) {
      return res.status(400).json({ success: false, message: 'newDate and newStartTime are required' });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (req.user?.role !== 'ADMIN' && appointment.customerId !== req.user?.customerId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const duration = appointment.service.durationMinutes || 45;
    const newEndTime = calculateEndTime(newStartTime, duration);

    // Check staff availability for new slot
    if (appointment.staffId) {
      const conflict = await prisma.appointment.findFirst({
        where: {
          id: { not: id },
          staffId: appointment.staffId,
          date: newDate,
          status: { not: 'CANCELLED' },
          startTime: { lt: newEndTime },
          endTime: { gt: newStartTime },
        },
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: 'The requested rescheduled slot is already occupied. Please select an alternate time.',
        });
      }
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        date: newDate,
        startTime: newStartTime,
        endTime: newEndTime,
        status: 'RESCHEDULED',
      },
      include: { service: true, staff: true },
    });

    res.json({
      success: true,
      message: 'Appointment successfully rescheduled.',
      appointment: updated,
    });
  } catch (error) {
    next(error);
  }
});

// 6. Admin: List Appointments (with date, status, staff filters)
router.get('/', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date, status, staffId, search } = req.query;

    const where: any = {};
    if (date) where.date = String(date);
    if (status && status !== 'all') where.status = String(status);
    if (staffId && staffId !== 'all') where.staffId = String(staffId);

    if (search) {
      where.OR = [
        { bookingReference: { contains: String(search) } },
        { customer: { user: { name: { contains: String(search) } } } },
        { customer: { user: { email: { contains: String(search) } } } },
      ];
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        service: true,
        staff: true,
        customer: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
      },
      orderBy: [{ date: 'desc' }, { startTime: 'asc' }],
    });

    res.json({ success: true, appointments });
  } catch (error) {
    next(error);
  }
});

// 7. Admin: Update appointment status (COMPLETED, CONFIRMED, NO_SHOW, CANCELLED)
router.put('/:id/status', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
      },
      include: { service: true, staff: true },
    });

    res.json({ success: true, appointment: updated, message: 'Status updated successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
