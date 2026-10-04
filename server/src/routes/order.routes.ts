import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth, optionalAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(8, 'Phone number is required'),
  shippingAddress: z.string().min(5, 'Full shipping address is required'),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'Order must contain at least one item'),
  paymentMethod: z.string().default('ONLINE'),
  couponCode: z.string().optional(),
});

// CREATE Order
router.post('/', optionalAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = createOrderSchema.parse(req.body);

    // Validate items and calculate total server-side
    let calculatedTotal = 0;
    const orderItemsToCreate: { productId: string; quantity: number; unitPrice: number }[] = [];

    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.productId} not found.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for "${product.name}". Only ${product.stock} units left in stock.`,
        });
      }

      const discountedPrice = product.price * (1 - product.discountPercent / 100);
      calculatedTotal += discountedPrice * item.quantity;

      orderItemsToCreate.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: discountedPrice,
      });
    }

    // Apply Coupon if supplied
    let discountAmount = 0;
    if (data.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: data.couponCode.toUpperCase().trim() },
      });

      if (coupon && coupon.isActive) {
        if (!coupon.minSpend || calculatedTotal >= coupon.minSpend) {
          discountAmount = (calculatedTotal * coupon.discountPct) / 100;
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        }
      }
    }

    const finalAmount = Math.max(0, calculatedTotal - discountAmount);
    const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    // Create Order and decrement stock within transaction
    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock for all items
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: req.user?.customerId || null,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          shippingAddress: data.shippingAddress,
          totalAmount: finalAmount,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          paymentMethod: data.paymentMethod,
          items: {
            create: orderItemsToCreate.map((oi) => ({
              productId: oi.productId,
              quantity: oi.quantity,
              unitPrice: oi.unitPrice,
            })),
          },
          payment: {
            create: {
              amount: finalAmount,
              currency: 'INR',
              provider: data.paymentMethod === 'ONLINE' ? 'RAZORPAY' : 'CASH',
              status: 'SUCCESS',
              transactionId: `TXN-${Date.now()}`,
            },
          },
        },
        include: {
          items: {
            include: { product: true },
          },
          payment: true,
        },
      });

      // Clear customer cart if logged in
      if (req.user?.customerId) {
        const cart = await tx.cart.findUnique({
          where: { customerId: req.user.customerId },
        });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      }

      return newOrder;
    });

    res.status(201).json({
      success: true,
      message: 'Your luxury beauty order has been confirmed!',
      order,
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

// GET My Orders (Authenticated customer)
router.get('/my-orders', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const customerId = req.user?.customerId;
    if (!customerId) {
      return res.json({ success: true, orders: [] });
    }

    const orders = await prisma.order.findMany({
      where: { customerId },
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
});

// GET Single Order by ID or Order Number
router.get('/:idOrNumber', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idOrNumber } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: idOrNumber }, { orderNumber: idOrNumber }],
      },
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
});

// Admin: GET All Orders
router.get('/', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, search } = req.query;

    const where: any = {};
    if (status && status !== 'all') where.status = String(status);
    if (search) {
      where.OR = [
        { orderNumber: { contains: String(search) } },
        { customerName: { contains: String(search) } },
        { customerEmail: { contains: String(search) } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
});

// Admin: Update Order Status
router.put('/:id/status', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
      },
    });

    res.json({ success: true, order, message: 'Order status updated successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
