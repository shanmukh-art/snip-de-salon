# 🚀 Snip De Salon — Deployment Guide (Vercel & Cloud)

This guide covers everything required to deploy **Snip De Salon** to production.

---

## 🌟 Overview

- **Frontend (`client`)**: Deployed to **Vercel** (Global Edge CDN, Ultra-fast caching, Automatic SSL).
- **Backend API (`server`)**: Deployed to **Render**, **Railway**, or **Fly.io** (Always-on Node.js Express server).
- **Database**: Free cloud PostgreSQL via **Neon.tech** or **Supabase** (or local SQLite for dev).

Both `client/vercel.json` and root `vercel.json` have already been created with SPA rewrite rules (`/(.*) -> /index.html`) to ensure deep-linking and page refreshes work smoothly without 404 errors.

---

## ⚡ Method 1: Deploy Frontend to Vercel via Vercel CLI (Fastest)

You can deploy directly from your local machine using the pre-installed `npx vercel`:

### Step 1: Open Terminal in the Client Directory
```bash
cd client
```

### Step 2: Run the Deploy Command
```bash
npx vercel
```

### Step 3: Answer the Interactive Prompts
1. **Log in to Vercel**: Vercel CLI will open your browser or ask for your email to authenticate.
2. **Set up and deploy?**: Type `Y` and press Enter.
3. **Which scope?**: Select your personal Vercel account.
4. **Link to existing project?**: Type `N`.
5. **What’s your project’s name?**: `snip-de-salon` (or your preferred name).
6. **In which directory is your code located?**: `./` (current directory).
7. **Want to modify build settings?**: Type `N` (Vercel automatically detects Vite).

### Step 4: Deploy to Production
Once the preview URL is generated, deploy to production with:
```bash
npx vercel --prod
```

---

## 🌐 Method 2: Deploy Frontend to Vercel via GitHub (Recommended)

This connects your repository directly to Vercel for automatic continuous deployments on every commit.

### Step 1: Initialize Git and Push to GitHub
```bash
git init
git add .
git commit -m "feat: complete Snip De Salon luxury salon platform"
git branch -M main
git remote add origin https://github.com/<your-username>/snip-de-salon.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** > **"Project"**.
3. Select your GitHub repository `snip-de-salon`.
4. Configure Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://<your-backend-api-url>/api`
6. Click **Deploy**.

---

## 🛠️ Deploying the Backend API (Render / Railway)

The backend (`server/`) is a Node.js Express application. Because Vercel serverless runs ephemerally, deploying the Express backend on **Render.com** (Free Web Service) or **Railway.app** is ideal.

### Option A: Render.com (100% Free Tier)
1. Go to [render.com](https://render.com) and sign in with GitHub.
2. Click **New +** -> **Web Service**.
3. Connect your `snip-de-salon` repository.
4. Set the following settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `DATABASE_URL`: `file:./prisma/dev.db` (or a PostgreSQL connection string)
   - `JWT_SECRET`: `<your-random-32-char-secret>`
   - `CLIENT_URL`: `https://<your-vercel-app>.vercel.app`
6. Click **Create Web Service**.
7. Copy your Render service URL (e.g. `https://snip-de-salon-api.onrender.com`) and add `VITE_API_URL=https://snip-de-salon-api.onrender.com/api` into your Vercel Project Settings.

---

## 🔒 Production Database: PostgreSQL (Neon / Supabase)

To switch from local SQLite to cloud PostgreSQL for high concurrency:
1. Create a free PostgreSQL database on [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com).
2. In `server/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Set `DATABASE_URL="postgres://..."` in your backend environment variables.
4. Run `npx prisma db push` and `npm run prisma:seed` to seed the salon services, stylists, and admin account.

---

## ✅ Deployment Checklist

- [x] `client/vercel.json` configured with SPA routing rules
- [x] `vercel.json` configured in root for monorepo detection
- [x] `client/.env.example` created with `VITE_API_URL` template
- [x] Client production build validated (`dist/` created successfully)
- [x] Backend CORS configured for cross-origin production requests
