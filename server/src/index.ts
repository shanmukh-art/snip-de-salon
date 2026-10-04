import { execSync } from 'child_process';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { prisma } from './prisma';
import { seedDatabase } from './seed';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/auth.routes';
import serviceRoutes from './routes/service.routes';
import staffRoutes from './routes/staff.routes';
import appointmentRoutes from './routes/appointment.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import offerRoutes from './routes/offer.routes';
import reviewRoutes from './routes/review.routes';
import inquiryRoutes from './routes/inquiry.routes';
import settingsRoutes from './routes/settings.routes';
import paymentRoutes from './routes/payment.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

// Security and utility middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root route status & interactive developer landing page
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    res.setHeader('Content-Type', 'text/html');
    return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Snip De Salon — Backend API Server</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at 50% 20%, #1a1714 0%, #0d0c0b 100%);
      color: #e5e5e5;
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: rgba(26, 25, 23, 0.85);
      border: 1px solid rgba(212, 175, 55, 0.35);
      border-radius: 24px;
      max-width: 620px;
      width: 100%;
      padding: 40px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(212, 175, 55, 0.08);
      backdrop-filter: blur(12px);
      text-align: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: rgba(34, 197, 94, 0.12);
      border: 1px solid rgba(34, 197, 94, 0.4);
      color: #4ade80;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 20px;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 10px #22c55e;
    }
    h1 {
      font-family: 'Cinzel', serif;
      font-size: 32px;
      letter-spacing: 2px;
      color: #f7eedb;
      margin-bottom: 8px;
    }
    p.subtitle {
      color: #c9a96e;
      font-size: 13px;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 24px;
    }
    p.desc {
      color: #a3a3a3;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .cta-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 30px;
    }
    .btn-primary {
      display: block;
      padding: 16px 28px;
      background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
      color: #0c0b0a;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      border-radius: 12px;
      letter-spacing: 0.5px;
      transition: all 0.2s ease;
      box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(212, 175, 55, 0.45);
    }
    .btn-secondary {
      display: block;
      padding: 14px 28px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(212, 175, 55, 0.3);
      color: #e5d8b8;
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      border-radius: 12px;
      transition: all 0.2s ease;
    }
    .btn-secondary:hover {
      background: rgba(212, 175, 55, 0.15);
      border-color: #d4af37;
    }
    .endpoints-card {
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 18px;
      text-align: left;
    }
    .endpoints-header {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #a3a3a3;
      margin-bottom: 12px;
    }
    .pill-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .pill {
      font-family: monospace;
      font-size: 12px;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #d4af37;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .pill:hover {
      background: rgba(212, 175, 55, 0.2);
      border-color: #d4af37;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <span class="pulse-dot"></span>
      Backend API Online (Port 5000)
    </div>
    <h1>SNIP DE SALON</h1>
    <p class="subtitle">Luxury Beauty, Hair & Wellness Sanctuary</p>
    <p class="desc">
      You are viewing the backend Express API server. The luxury salon customer website & interactive UI is running on <strong>Port 5173</strong>.
    </p>

    <div class="cta-container">
      <a href="${config.clientUrl}" class="btn-primary">
        ✨ Open Main Website (localhost:5173) ➔
      </a>
      <a href="${config.clientUrl}/admin" class="btn-secondary">
        🛡️ Open Admin Portal (localhost:5173/admin)
      </a>
    </div>

    <div class="endpoints-card">
      <div class="endpoints-header">Live REST Endpoints</div>
      <div class="pill-list">
        <a class="pill" href="/api/health" target="_blank">GET /api/health</a>
        <a class="pill" href="/api/services" target="_blank">GET /api/services</a>
        <a class="pill" href="/api/products" target="_blank">GET /api/products</a>
        <a class="pill" href="/api/staff" target="_blank">GET /api/staff</a>
        <a class="pill" href="/api/offers" target="_blank">GET /api/offers</a>
      </div>
    </div>
  </div>
</body>
</html>`);
  }

  res.json({
    status: 'online',
    message: '✨ Snip De Salon Backend API is running successfully!',
    frontendUrl: config.clientUrl,
    healthCheck: '/api/health',
    docs: 'Refer to README.md for endpoint documentation'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'Snip De Salon',
    location: 'Sujatha Nagar, Visakhapatnam, Andhra Pradesh',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Central error handler
app.use(errorHandler);

// Start server with automatic database initialization if not in test mode
if (process.env.NODE_ENV !== 'test') {
  async function bootstrap() {
    try {
      await prisma.user.count();
    } catch (err: any) {
      console.log('📦 Database tables not yet initialized. Running prisma db push...');
      try {
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
      } catch (pushErr) {
        console.error('Failed to run prisma db push automatically:', pushErr);
      }
    }

    try {
      const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      if (!admin) {
        console.log('🌱 No admin user found in database. Running seed...');
        await seedDatabase(prisma);
      }
    } catch (seedErr) {
      console.error('Error during auto-seed check:', seedErr);
    }

    app.listen(config.port, () => {
      console.log(`\n========================================================`);
      console.log(`✨ Snip De Salon Backend API is running on http://localhost:${config.port}`);
      console.log(`💎 Location: Sujatha Nagar, Visakhapatnam, AP, India`);
      console.log(`📡 Environment: ${config.nodeEnv}`);
      console.log(`========================================================\n`);
    });
  }

  bootstrap();
}

export default app;
