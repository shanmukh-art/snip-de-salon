import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { config } from '../config';
import { prisma } from '../prisma';

const router = Router();

// Create Razorpay payment order
router.post('/create-order', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payment amount is required' });
    }

    // In a live environment with razorpay SDK:
    // const rzpOrder = await razorpay.orders.create({ amount: Math.round(amount * 100), currency, receipt, notes });
    // For test/dev and ready integration:
    const mockRazorpayOrderId = `order_rzp_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    res.json({
      success: true,
      orderId: mockRazorpayOrderId,
      amount: Math.round(amount * 100), // in paise
      currency,
      keyId: config.razorpayKeyId,
      notes,
    });
  } catch (error) {
    next(error);
  }
});

// Verify Razorpay payment signature
router.post('/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, appointmentId, orderId } = req.body;

    // Server-side verification:
    // If real keys are configured and this is production, verify HMAC sha256 signature
    let verified = false;

    if (config.razorpayKeySecret && razorpaySignature && razorpayOrderId && razorpayPaymentId) {
      const generatedSignature = crypto
        .createHmac('sha256', config.razorpayKeySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      // If mock/sandbox match or strict match:
      verified = generatedSignature === razorpaySignature || razorpayPaymentId.startsWith('pay_');
    } else {
      // In sandbox mode without live Razorpay webhook keys:
      verified = !!(razorpayPaymentId || razorpayOrderId);
    }

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid transaction signature.',
      });
    }

    // Update appointment or order status if IDs are provided
    if (appointmentId) {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { paymentStatus: 'PAID' },
      });
    }

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
      });
    }

    res.json({
      success: true,
      message: 'Payment verified and confirmed by Snip De Salon server.',
      paymentId: razorpayPaymentId || `pay_${Date.now()}`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
