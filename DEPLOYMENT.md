# Apex Roofing Systems — Dallas, TX
## Production Deployment & Supabase Setup Guide

This guide walks through configuring Supabase and deploying the Next.js Roofing Operations Platform to **Vercel** or **Netlify**.

---

### Step 1: Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a new project (e.g. `apex-roofing-dallas`).
2. Select your closest AWS/GCP region (e.g., `us-east-1` or `us-central1`).
3. Note your **Project URL** and **Anon Public Key** under **Project Settings > API**.

---

### Step 2: Run Database Schema Script
1. Open the **SQL Editor** in your Supabase project dashboard.
2. Open [`supabase/schema.sql`](file:///c:/Users/Ali%20Ahmed/Downloads/Roofing%20Web%20App/supabase/schema.sql) from this repository.
3. Paste the contents into the SQL Editor and click **Run**.
4. This script automatically creates:
   - `jobs` table with DFW seed data.
   - `crew_checkins` table for GPS coordinates.
   - `inspection_photos` table.
   - `invoices` table for digital approvals and signatures.
   - Permissive Row-Level Security (RLS) policies for staging/testing.
   - `roofing-photos` public storage bucket.

---

### Step 3: Local Environment Setup
Copy the template file to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
```
*(Note: If these env variables are left empty, the application will automatically fall back to the built-in mock data.)*

---

### Step 4: Deploying to Vercel

1. Push your repository to GitHub / GitLab.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New > Project** and import the repository.
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Build output uses standard Next.js App Router defaults.

---

### Step 5: Production Handover Checklist
- [x] Responsive layout tested for Admin, Field Crew Mobile, and Homeowner Client Portal.
- [x] Geolocation GPS check-in with device accuracy and mock fallback.
- [x] Photo inspection uploader connected to camera / file picker and Supabase Storage bucket.
- [x] Homeowner digital signing with itemized scope calculation.
- [x] Zero TypeScript errors with strict compilation.
