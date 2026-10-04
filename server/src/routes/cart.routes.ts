import { Router, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET customer cart
router.get('/', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const customerId = req.user?.customerId;
    if (!customerId) {
      return res.json({ success: true, items: [], total: 0 });
    }

    let cart = await prisma.cart.findUnique({
      where: { customerId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { customerId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    const items = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: item.product,
      subtotal: item.product.price * (1 - item.product.discountPercent / 100) * item.quantity,
    }));

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({ success: true, cartId: cart.id, items, total });
  } catch (error) {
    next(error);
  }
});

// ADD item to cart
router.post('/items', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const customerId = req.user?.customerId;
    if (!customerId) {
      return res.status(400).json({ success: false, message: 'Customer account not found' });
    }

    const { productId, quantity = 1 } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} units available in stock.` });
    }

    let cart = await prisma.cart.findUnique({ where: { customerId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { customerId } });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    res.json({ success: true, message: 'Item added to your luxury bag' });
  } catch (error) {
    next(error);
  }
});

// UPDATE cart item quantity
router.put('/items/:itemId', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
      return res.json({ success: true, message: 'Item removed from bag' });
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    if (item.product.stock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${item.product.stock} units left in stock.` });
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    res.json({ success: true, message: 'Bag updated' });
  } catch (error) {
    next(error);
  }
});

// REMOVE item from cart
router.delete('/items/:itemId', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { itemId } = req.params;
    await prisma.cartItem.delete({ where: { id: itemId } });
    res.json({ success: true, message: 'Item removed from bag' });
  } catch (error) {
    next(error);
  }
});

export default router;
