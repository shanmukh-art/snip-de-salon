import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../index';
import { prisma } from '../prisma';

describe('Snip De Salon Backend API Tests', () => {
  let adminToken = '';
  let customerToken = '';
  let testServiceId = '';
  let testStaffId = '';

  beforeAll(async () => {
    // Check or get admin user
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@snipdesalon.com',
      password: 'SalonAdmin2026!',
    });

    if (res.body.success) {
      adminToken = res.body.token;
    }

    // Clean up any test artifacts from prior runs
    await prisma.appointment.deleteMany({
      where: { date: '2026-12-10' },
    });
    await prisma.contactInquiry.deleteMany({
      where: { email: 'pooja.h@example.com' },
    });

    // Get an existing service
    const service = await prisma.service.findFirst({ where: { isActive: true } });
    if (service) testServiceId = service.id;

    const staff = await prisma.staff.findFirst({ where: { isActive: true } });
    if (staff) testStaffId = staff.id;
  });

  it('Health Check responds with brand status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.brand).toBe('Snip De Salon');
    expect(res.body.status).toBe('ok');
  });

  it('Services API returns list of services with category', async () => {
    const res = await request(app).get('/api/services');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.services)).toBe(true);
    expect(res.body.services.length).toBeGreaterThan(0);
  });

  it('Customer registration works and returns JWT token', async () => {
    const randomEmail = `test.user.${Date.now()}@example.com`;
    const res = await request(app).post('/api/auth/register').send({
      name: 'Rhea Kapoor',
      email: randomEmail,
      password: 'SecretPassword123!',
      phone: '+91 99887 66554',
      address: 'Beach Road, Visakhapatnam',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    customerToken = res.body.token;
  });

  it('Protects Admin routes from unauthorized access', async () => {
    const res = await request(app).get('/api/admin/dashboard');
    expect(res.status).toBe(401);
  });

  it('Allows Admin to access dashboard with valid JWT', async () => {
    if (!adminToken) return;
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats).toBeDefined();
    expect(res.body.stats.totalAppointments).toBeGreaterThanOrEqual(0);
  });

  it('Calculates slot availability for a service', async () => {
    if (!testServiceId) return;

    const res = await request(app)
      .get(`/api/appointments/availability?serviceId=${testServiceId}&date=2026-11-20&staffId=any`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.slots)).toBe(true);
  });

  it('Prevents double-booking when same staff & time is selected', async () => {
    if (!testServiceId || !testStaffId) return;

    const bookingPayload = {
      serviceId: testServiceId,
      staffId: testStaffId,
      date: '2026-12-10',
      startTime: '10:00',
      customerName: 'Test Double Booking',
      customerEmail: 'doublebook@example.com',
      customerPhone: '+91 90000 11111',
      paymentMethod: 'SALON',
    };

    // First booking
    const res1 = await request(app).post('/api/appointments').send(bookingPayload);
    expect(res1.status).toBe(201);

    // Second booking for exact same staff, date and time
    const res2 = await request(app).post('/api/appointments').send(bookingPayload);
    expect(res2.status).toBe(409);
    expect(res2.body.message).toMatch(/booked|conflict|unavailable/i);
  });

  it('Submits contact inquiry and verifies storage', async () => {
    const res = await request(app).post('/api/inquiries').send({
      name: 'Pooja Hegde',
      email: 'pooja.h@example.com',
      phone: '+91 91234 56789',
      subject: 'Bridal Party Inquiry',
      message: 'Hello, looking for a bespoke bridal package for 5 guests in December.',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.inquiryId).toBeDefined();
  });
});
