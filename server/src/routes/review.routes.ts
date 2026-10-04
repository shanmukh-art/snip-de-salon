import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// GET all public approved reviews
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      include: {
        customer: {
          include: {
            user: { select: { name: true } },
          },
        },
        service: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
});

// POST a review (by customer)
router.post('/', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const customerId = req.user?.customerId;
    if (!customerId) {
      return res.status(403).json({ success: false, message: 'Only registered customers can leave reviews' });
    }

    const { serviceId, rating, comment } = req.body;

    if (!serviceId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'serviceId, rating (1-5), and comment are required' });
    }

    const review = await prisma.review.create({
      data: {
        customerId,
        serviceId,
        rating: Math.min(5, Math.max(1, parseInt(rating, 10))),
        comment: String(comment).trim(),
        isApproved: true, // auto-approved or admin curated
      },
      include: {
        service: true,
      },
    });

    res.status(201).json({ success: true, review, message: 'Thank you for your valuable feedback!' });
  } catch (error) {
    next(error);
  }
});

// Admin: Moderate reviews
router.put('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const review = await prisma.review.update({
      where: { id },
      data: { isApproved: Boolean(isApproved) },
    });

    res.json({ success: true, review, message: 'Review updated' });
  } catch (error) {
    next(error);
  }
});

// Admin: Delete review
router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
