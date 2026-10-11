# Phase 1: US Roofing Operations App

**Apex Roofing Systems — Dallas, TX**
Built with **Next.js (App Router)**, **Tailwind CSS**, **Lucide React**, and modular UI components.

---

## 🏗️ Architecture & Deliverables Summary

### 1. Role State & Global Context
- **Global Provider**: [`RoleProvider`](file:///c:/Users/Ali%20Ahmed/Downloads/Roofing%20Web%20App/src/context/RoleContext.tsx) in `src/context/RoleContext.tsx`.
- **Supported Roles**: `'admin'`, `'crew'`, and `'client'`.
- **Role Switcher**: [`RoleSwitcher`](file:///c:/Users/Ali%20Ahmed/Downloads/Roofing%20Web%20App/src/components/navigation/RoleSwitcher.tsx) — Sticky floating toggle bar at the bottom with quick visual active badges and persona descriptions. Persists selection across reloads via `localStorage`.

### 2. App Layouts & Shells
- **Admin View (`'admin'`)**: Desktop-first sidebar navigation layout in [`AdminLayout.tsx`](file:///c:/Users/Ali%20Ahmed/Downloads/Roofing%20Web%20App/src/components/views/AdminLayout.tsx).
  - Navigation: **Dashboard**, **Leads Kanban**, **Dispatch Calendar**, **Invoices**, **Settings**.
  - Header with search, weather alert banner (DFW storm tracking), notifications, and operator badge.
  - High-level metric cards ($ pipeline, active jobs, on-duty leads, pending invoices).
- **Crew View (`'crew'`)**: Mobile-first field app layout in [`CrewLayout.tsx`](file:///c:/Users/Ali%20Ahmed/Downloads/Roofing%20Web%20App/src/components/views/CrewLayout.tsx).
  - Navigation: Bottom sticky bar (**My Jobs**, **GPS Check-in**, **Upload Photos**, **Materials**).
  - Field Lead status header with live clock-in / off-clock toggle.
  - Job details with squares, pitch (`7/12`), direct homeowner calling, and geofenced check-in.
- **Client View (`'client'`)**: Homeowner customer portal in [`ClientLayout.tsx`](file:///c:/Users/Ali%20Ahmed/Downloads/Roofing%20Web%20App/src/components/views/ClientLayout.tsx).
  - Navigation: Header navigation (**Project Timeline**, **Photos**, **Billing & Approvals**).
  - Hero progress card with % complete (`65%`) and target completion date (`Oct 12`).
  - Milestone tracker from insurance claim through Dallas municipal permit final walk.
  - Photo inspection gallery and insurance claim deposit/balance billing breakdown.

### 3. Realistic US Roofing Mock Data Types
- Defined in [`roofing.ts`](file:///c:/Users/Ali%20Ahmed/Downloads/Roofing%20Web%20App/src/types/roofing.ts) and populated in [`mockRoofingData.ts`](file:///c:/Users/Ali%20Ahmed/Downloads/Roofing%20Web%20App/src/data/mockRoofingData.ts):
  - `RoofJob`: Job number, client info, roof pitch (e.g. `7/12`, `8/12`), squares, insurance claim carrier, status.
  - `CrewMember`: Roles, OSHA / GAF certifications, real-time geofence check-in status.
  - `Invoice`: Residential draws, quantities in roofing squares, items, and Texas contractor tax handling.
  - `PhotoInspection`: Multi-stage roofing checkpoints (Tear-off, Decking sheathing, Underlayment, Shingle courses).

---

## 🚀 Running the Project Locally

```bash
# Start development server
npm run dev

# Or build and test production bundle
npm run build
npm run start
```
Open [http://localhost:3000](http://localhost:3000) to test the app and toggle between **Operations Admin**, **Field Crew Lead**, and **Homeowner Portal**.
