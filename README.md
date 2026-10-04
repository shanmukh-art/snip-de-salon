# Snip De Salon — Full-Stack Luxury Beauty Salon & Business Management Platform

> **Location:** Sujatha Nagar, Visakhapatnam, Andhra Pradesh, India  
> **Brand Identity:** Haute Coiffure, Advanced Dermatological Skincare, Bridal Artistry & Spa Wellness

---

## 💎 Project Overview

**Snip De Salon** is an enterprise-grade full-stack commercial platform designed specifically for luxury beauty salons, wellness parlors, and cosmetic spas. It integrates a high-converting customer-facing web application with a comprehensive administrative back-office system for appointments, inventory, order fulfillment, staff scheduling, and client management.

---

## 🏛️ Architecture & Tech Stack

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS with custom luxury tokens (Deep Black `#0c0c0e`, Warm Ivory `#FAF8F5`, Champagne Gold `#D4AF37`)
- **Typography:** *Cormorant Garamond* (Headings & Editorial Serif) + *Plus Jakarta Sans* (Clean Body/UI Sans)
- **Routing:** React Router v6
- **Animations & Micro-interactions:** Framer Motion + Canvas Confetti
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js + Express.js + TypeScript
- **Database & ORM:** PostgreSQL / SQLite ready via **Prisma ORM**
- **Authentication:** JWT (JSON Web Tokens) + secure password hashing with **bcrypt**
- **Role-Based Access Control (RBAC):** `ADMIN`, `CUSTOMER`, `STAFF`
- **Validation:** Zod schemas
- **Security:** Helmet, CORS, parameterized Prisma queries (SQL injection immune)
- **Testing:** Automated unit and integration testing via **Vitest** + **Supertest**

### Commerce & Payments
- **Appointments:** Pay at Salon / Online Razorpay integration ready with server-side signature verification
- **Retail Shop:** Full shopping cart, discount coupons (e.g. `SNIPLUXURY`, `WELCOME10`), real-time inventory tracking

---

## 📂 Repository Structure

```
snip-de-salon/
├── client/                     # Vite + React + TypeScript Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # Admin sidebar and layout components
│   │   │   ├── booking/        # Multi-step appointment booking modal
│   │   │   ├── cart/           # Slide-out luxury shopping bag drawer
│   │   │   ├── home/           # 10 editorial homepage sections
│   │   │   └── layout/         # Luxury Navbar & Footer
│   │   ├── context/            # AuthContext, CartContext, ToastContext
│   │   ├── pages/              # Public, Customer & Admin Pages
│   │   ├── services/           # Centralized API client (api.ts)
│   │   └── types/              # Complete TypeScript interfaces
│   ├── tailwind.config.js      # Luxury design tokens
│   └── vite.config.ts          # Proxy configuration to backend
│
├── server/                     # Node.js + Express + TypeScript Backend
│   ├── prisma/
│   │   ├── schema.prisma       # 20 relational database models
│   │   └── seed.ts             # Rich luxury salon seed dataset
│   ├── src/
│   │   ├── config/             # Environment & secret configurations
│   │   ├── middleware/         # Auth (JWT), roles, error handling
│   │   ├── routes/             # Modular REST API endpoints
│   │   ├── tests/              # Automated API tests
│   │   ├── prisma.ts           # Prisma client singleton
│   │   └── index.ts            # Express server entrypoint
│   └── package.json
│
├── .env.example                # Root environment sample
└── package.json                # Workspace orchestration
```

---

## ⚡ Quick Start & Development

### 1. Installation
Install all dependencies for both the frontend and backend:
```bash
# In the root folder:
cd server && npm install
cd ../client && npm install
```

### 2. Database Setup & Seeding
Generate the Prisma client, push the schema, and seed realistic demo data:
```bash
cd server
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 3. Run Automated Test Suite
Run the backend test suite:
```bash
cd server
npx vitest run
```
*Output: 8/8 tests pass (Health check, Auth, Services, Availability check, Double-booking prevention, Admin protection, Inquiry submission).*

### 4. Start Development Servers
Run the backend and frontend concurrently:
```bash
# Terminal 1 - Backend Server (Port 5000)
cd server
npm run dev

# Terminal 2 - Frontend Client (Port 5173)
cd client
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Demo & Evaluation Credentials

For instant evaluation, the platform includes pre-configured credentials (also available via one-click buttons on the `/login` screen):

### Salon Administrator
- **Email:** `admin@snipdesalon.com`
- **Password:** `SalonAdmin2026!`
- **Access:** Full Admin Suite (`/admin`, `/admin/calendar`, `/admin/appointments`, `/admin/services`, `/admin/products`, `/admin/orders`, `/admin/customers`, `/admin/staff`, `/admin/settings`, `/admin/analytics`)

### Customer Account
- **Email:** `sneha.reddy@example.com`
- **Password:** `Customer123!`
- **Access:** Customer Portal (`/my-appointments`, `/my-orders`, `/profile`)

---

## 🌐 Centralized Business Configuration (CMS)

All salon business information is managed from the database via `/admin/settings` without touching source code:
- **Salon Name:** Snip De Salon
- **Location:** Main Road, Sujatha Nagar, Visakhapatnam, Andhra Pradesh, 530051
- **Telephone:** +91 891 234 5678
- **Email:** concierge@snipdesalon.com
- **Operating Hours:** Monday – Sunday: 09:00 AM – 08:30 PM
- **Cancellation Policy:** 2 Hours notice required
- **GST / Tax:** 18% configurable

---

## 🛡️ Business Rules & Integrity

1. **Overlapping Booking Prevention:** The availability engine (`/api/appointments/availability`) checks real-time specialist schedules and booked slots. Double-bookings are rejected with `409 Conflict`.
2. **Cancellation Slot Release:** When an appointment is cancelled, the time slot is automatically released back to the pool.
3. **Negative Inventory Prevention:** Orders check warehouse stock before confirmation; product stock decrements inside a database transaction.
4. **Secure Payments:** Payment verification occurs server-side; client-side payment claims are never trusted without cryptographic verification.
