import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

const inquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

// Submit contact form inquiry
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = inquirySchema.parse(req.body);

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone?.trim() || null,
        subject: data.subject?.trim() || 'General Inquiry',
        message: data.message.trim(),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to Snip De Salon. Our concierge team will contact you shortly.',
      inquiryId: inquiry.id,
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

// Admin: View all inquiries
router.get('/', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inquiries = await prisma.contactInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, inquiries });
  } catch (error) {
    next(error);
  }
});

// Admin: Update inquiry status (NEW, IN_PROGRESS, RESOLVED)
router.put('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const inquiry = await prisma.contactInquiry.update({
      where: { id },
      data: { status },
    });

    res.json({ success: true, inquiry, message: 'Inquiry status updated' });
  } catch (error) {
    next(error);
  }
});

export default router;
