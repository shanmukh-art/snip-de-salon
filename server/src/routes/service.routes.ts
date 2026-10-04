import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET all categories
router.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: {
          select: { services: true },
        },
      },
    });
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
});

// GET all services with filters & search
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, minPrice, maxPrice, maxDuration, isFeatured } = req.query;

    const where: any = { isActive: true };

    if (category && category !== 'all') {
      where.OR = [
        { categoryId: String(category) },
        { category: { slug: String(category) } },
      ];
    }

    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { description: { contains: String(search) } },
      ];
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(String(minPrice));
      if (maxPrice) where.price.lte = parseFloat(String(maxPrice));
    }

    if (maxDuration) {
      where.durationMinutes = { lte: parseInt(String(maxDuration), 10) };
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        category: true,
        reviews: {
          where: { isApproved: true },
          select: { rating: true },
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
    });

    const formattedServices = services.map((s) => {
      const avgRating =
        s.reviews.length > 0
          ? Number((s.reviews.reduce((acc, r) => acc + r.rating, 0) / s.reviews.length).toFixed(1))
          : 5.0;
      return {
        ...s,
        rating: avgRating,
        reviewCount: s.reviews.length,
      };
    });

    res.json({ success: true, services: formattedServices });
  } catch (error) {
    next(error);
  }
});

// GET single service by ID or Slug
router.get('/:idOrSlug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idOrSlug } = req.params;

    const service = await prisma.service.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        category: true,
        staffMembers: {
          include: {
            staff: true,
          },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            customer: {
              include: {
                user: {
                  select: { name: true },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Related services in the same category
    const relatedServices = await prisma.service.findMany({
      where: {
        categoryId: service.categoryId,
        id: { not: service.id },
        isActive: true,
      },
      take: 3,
    });

    res.json({
      success: true,
      service,
      relatedServices,
    });
  } catch (error) {
    next(error);
  }
});

// Admin: Create service
router.post('/', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, categoryId, description, benefits, durationMinutes, price, originalPrice, image, isFeatured } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const service = await prisma.service.create({
      data: {
        name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        categoryId,
        description,
        benefits,
        durationMinutes: parseInt(durationMinutes, 10) || 45,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        image: image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
        isFeatured: Boolean(isFeatured),
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({ success: true, service, message: 'Service created successfully' });
  } catch (error) {
    next(error);
  }
});

// Admin: Edit service
router.put('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, categoryId, description, benefits, durationMinutes, price, originalPrice, image, isActive, isFeatured } = req.body;

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name,
        categoryId,
        description,
        benefits,
        durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : undefined,
        price: price ? parseFloat(price) : undefined,
        originalPrice: originalPrice !== undefined ? (originalPrice ? parseFloat(originalPrice) : null) : undefined,
        image,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
      },
      include: {
        category: true,
      },
    });

    res.json({ success: true, service: updatedService, message: 'Service updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Admin: Delete service
router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id } });
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
