import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET all active staff
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const staff = await prisma.staff.findMany({
      where: { isActive: true },
      include: {
        services: {
          include: {
            service: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, staff });
  } catch (error) {
    next(error);
  }
});

// GET staff members capable of performing a specific service
router.get('/by-service/:serviceId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceId } = req.params;

    const staffServices = await prisma.staffService.findMany({
      where: {
        OR: [
          { serviceId },
          { service: { slug: serviceId } },
        ],
        staff: { isActive: true },
      },
      include: {
        staff: true,
      },
    });

    const staff = staffServices.map((ss) => ss.staff);

    // If no specific staff is assigned to this service yet, fallback to all active staff
    if (staff.length === 0) {
      const allActiveStaff = await prisma.staff.findMany({
        where: { isActive: true },
        take: 4,
      });
      return res.json({ success: true, staff: allActiveStaff });
    }

    res.json({ success: true, staff });
  } catch (error) {
    next(error);
  }
});

// GET single staff
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        services: {
          include: { service: true },
        },
        schedules: true,
      },
    });

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    res.json({ success: true, staff });
  } catch (error) {
    next(error);
  }
});

// Admin: Create staff
router.post('/', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, roleTitle, bio, avatar, workingHoursStart, workingHoursEnd, serviceIds } = req.body;

    const staff = await prisma.staff.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        roleTitle: roleTitle || 'Beauty Specialist',
        bio: bio || null,
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        workingHoursStart: workingHoursStart || '09:00',
        workingHoursEnd: workingHoursEnd || '20:00',
      },
    });

    if (Array.isArray(serviceIds) && serviceIds.length > 0) {
      await prisma.staffService.createMany({
        data: serviceIds.map((sId: string) => ({
          staffId: staff.id,
          serviceId: sId,
        })),
      });
    }

    res.status(201).json({ success: true, staff, message: 'Staff member added successfully' });
  } catch (error) {
    next(error);
  }
});

// Admin: Update staff
router.put('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email, phone, roleTitle, bio, avatar, isActive, workingHoursStart, workingHoursEnd, serviceIds } = req.body;

    const staff = await prisma.staff.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        roleTitle,
        bio,
        avatar,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        workingHoursStart,
        workingHoursEnd,
      },
    });

    if (Array.isArray(serviceIds)) {
      await prisma.staffService.deleteMany({ where: { staffId: id } });
      await prisma.staffService.createMany({
        data: serviceIds.map((sId: string) => ({
          staffId: id,
          serviceId: sId,
        })),
      });
    }

    res.json({ success: true, staff, message: 'Staff profile updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Admin: Delete staff
router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.staff.delete({ where: { id } });
    res.json({ success: true, message: 'Staff member removed successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
