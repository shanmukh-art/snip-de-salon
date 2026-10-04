import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Public: Get site settings
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: 'default' },
      });
    }

    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
});

// Admin: Update site settings
router.put('/', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    const updated = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: {
        salonName: data.salonName,
        tagline: data.tagline,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        openingHours: data.openingHours,
        googleMapsUrl: data.googleMapsUrl,
        instagramUrl: data.instagramUrl,
        facebookUrl: data.facebookUrl,
        whatsappNumber: data.whatsappNumber,
        bookingNotice: data.bookingNotice,
        cancellationPolicyHours: data.cancellationPolicyHours !== undefined ? parseInt(data.cancellationPolicyHours, 10) : undefined,
        currencySymbol: data.currencySymbol,
        taxRatePercent: data.taxRatePercent !== undefined ? parseFloat(data.taxRatePercent) : undefined,
      },
      create: {
        id: 'default',
        ...data,
      },
    });

    res.json({ success: true, settings: updated, message: 'Salon settings saved successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
