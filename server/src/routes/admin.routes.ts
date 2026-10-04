import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET Admin Dashboard Summary Stats
router.get('/dashboard', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      totalOrders,
      totalCustomers,
      lowStockProducts,
      recentAppointments,
      recentOrders,
      appointmentsList,
      ordersList,
    ] = await Promise.all([
      prisma.appointment.count(),
      prisma.appointment.count({ where: { date: today } }),
      prisma.appointment.count({ where: { status: 'PENDING' } }),
      prisma.appointment.count({ where: { status: 'COMPLETED' } }),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.product.findMany({
        where: { stock: { lte: 5 } },
        select: { id: true, name: true, stock: true, sku: true },
      }),
      prisma.appointment.findMany({
        take: 5,
        orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
        include: {
          service: true,
          staff: true,
          customer: {
            include: { user: { select: { name: true, phone: true } } },
          },
        },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } } },
      }),
      prisma.appointment.findMany({
        where: { paymentStatus: 'PAID' },
        select: { totalAmount: true },
      }),
      prisma.order.findMany({
        where: { paymentStatus: 'PAID' },
        select: { totalAmount: true },
      }),
    ]);

    const appointmentRevenue = appointmentsList.reduce((sum, a) => sum + a.totalAmount, 0);
    const orderRevenue = ordersList.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalRevenue = appointmentRevenue + orderRevenue;

    res.json({
      success: true,
      stats: {
        totalRevenue,
        appointmentRevenue,
        orderRevenue,
        totalAppointments,
        todayAppointments,
        pendingAppointments,
        completedAppointments,
        totalOrders,
        totalCustomers,
        lowStockAlertCount: lowStockProducts.length,
      },
      lowStockProducts,
      recentAppointments,
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
});

// GET Admin Analytics & Charts Data
router.get('/analytics', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        _count: {
          select: { appointments: true },
        },
      },
      orderBy: {
        appointments: {
          _count: 'desc',
        },
      },
      take: 6,
    });

    const statusCounts = await prisma.appointment.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    });

    res.json({
      success: true,
      popularServices: services.map((s) => ({
        id: s.id,
        name: s.name,
        bookingCount: s._count.appointments,
        price: s.price,
      })),
      appointmentsByStatus: statusCounts.map((sc) => ({
        status: sc.status,
        count: sc._count._all,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// GET All Customers with history summary
router.get('/customers', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, createdAt: true } },
        appointments: { select: { id: true, totalAmount: true, status: true } },
        orders: { select: { id: true, totalAmount: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = customers.map((c) => {
      const appointmentTotal = c.appointments
        .filter((a) => a.status === 'COMPLETED' || a.status === 'CONFIRMED')
        .reduce((sum, a) => sum + a.totalAmount, 0);
      const orderTotal = c.orders.reduce((sum, o) => sum + o.totalAmount, 0);

      return {
        id: c.id,
        userId: c.user.id,
        name: c.user.name,
        email: c.user.email,
        phone: c.user.phone,
        registeredAt: c.user.createdAt,
        appointmentCount: c.appointments.length,
        orderCount: c.orders.length,
        totalSpending: appointmentTotal + orderTotal,
      };
    });

    res.json({ success: true, customers: formatted });
  } catch (error) {
    next(error);
  }
});

// GET Single Customer full details
router.get('/customers/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, createdAt: true } },
        appointments: {
          include: { service: true, staff: true },
          orderBy: { date: 'desc' },
        },
        orders: {
          include: { items: { include: { product: true } } },
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          include: { service: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, customer });
  } catch (error) {
    next(error);
  }
});

export default router;
