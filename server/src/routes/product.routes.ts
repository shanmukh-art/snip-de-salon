import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET product categories
router.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.productCategory.findMany({
      include: {
        _count: { select: { products: true } },
      },
    });
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
});

// GET all products with filtering, search, and sorting
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, sort, isFeatured } = req.query;

    const where: any = {};

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
        { sku: { contains: String(search) } },
      ];
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') orderBy = { price: 'asc' };
    else if (sort === 'price-high') orderBy = { price: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
    });

    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
});

// GET single product
router.get('/:idOrSlug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idOrSlug } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
    });

    res.json({ success: true, product, relatedProducts });
  } catch (error) {
    next(error);
  }
});

// Admin: Create product
router.post('/', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, categoryId, description, price, discountPercent, stock, sku, image, isFeatured } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const productSku = sku || `SND-PRD-${Math.floor(100 + Math.random() * 900)}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        categoryId,
        description,
        price: parseFloat(price),
        discountPercent: discountPercent ? parseFloat(discountPercent) : 0,
        stock: parseInt(stock, 10) || 10,
        sku: productSku,
        image: image || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80',
        isFeatured: Boolean(isFeatured),
      },
      include: { category: true },
    });

    res.status(201).json({ success: true, product, message: 'Product added to catalogue successfully' });
  } catch (error) {
    next(error);
  }
});

// Admin: Edit product
router.put('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, categoryId, description, price, discountPercent, stock, sku, image, isFeatured } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        categoryId,
        description,
        price: price ? parseFloat(price) : undefined,
        discountPercent: discountPercent !== undefined ? parseFloat(discountPercent) : undefined,
        stock: stock !== undefined ? parseInt(stock, 10) : undefined,
        sku,
        image,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
      },
      include: { category: true },
    });

    res.json({ success: true, product, message: 'Product updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Admin: Delete product
router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: 'Product deleted from catalogue' });
  } catch (error) {
    next(error);
  }
});

export default router;
