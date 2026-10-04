import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET all active offers
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const offers = await prisma.offer.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });
    res.json({ success: true, offers });
  } catch (error) {
    next(error);
  }
});

// Admin: Create offer
router.post('/', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, originalPrice, offerPrice, badgeText, image, validUntil, terms, isFeatured } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const offer = await prisma.offer.create({
      data: {
        title,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        description,
        originalPrice: parseFloat(originalPrice),
        offerPrice: parseFloat(offerPrice),
        badgeText,
        image: image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        validUntil,
        terms,
        isFeatured: Boolean(isFeatured),
      },
    });

    res.status(201).json({ success: true, offer, message: 'Offer package created successfully' });
  } catch (error) {
    next(error);
  }
});

// Admin: Update offer
router.put('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, originalPrice, offerPrice, badgeText, image, validUntil, terms, isActive, isFeatured } = req.body;

    const offer = await prisma.offer.update({
      where: { id },
      data: {
        title,
        description,
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        offerPrice: offerPrice ? parseFloat(offerPrice) : undefined,
        badgeText,
        image,
        validUntil,
        terms,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
      },
    });

    res.json({ success: true, offer, message: 'Offer updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Admin: Delete offer
router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.offer.delete({ where: { id } });
    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
