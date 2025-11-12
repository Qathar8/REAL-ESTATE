# Real Estate ERP

Full-stack real estate ERP frontend built with React, TypeScript, Vite, Tailwind CSS, Supabase, React Router, and React Query. The application includes a marketing website for prospective buyers and an authenticated admin dashboard for managing clients, properties, site visits, virtual tours, and receipts.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `env.sample` to `.env` and supply Supabase credentials:
   ```bash
   cp env.sample .env
   ```
   ```env
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Supabase Schema Outline

Use Supabase SQL editor or migration tooling to create the following tables and storage buckets:

- `clients`: name, email, phone, documents (text[]), purchaseHistory, notes
- `properties`: name, category, price, location, description, shortDescription, images (text[]), virtualTourUrl, isFeatured
- `site_visits`: client_id (FK), property_id (FK), scheduled_date, status, notes
- `virtual_tours`: property_id (FK), title, tour_url, asset_path
- `receipts`: client_id (FK), property_id (FK), amount, receipt_url, issued_at

Storage buckets:
- `client-documents`
- `virtual-tours`
- `receipts`

Enable row level security with policies that allow the service role/admin to perform full CRUD and public read access where needed (e.g., property listings).

## Admin Credentials

Supabase Auth is used to secure the admin dashboard. Create a user through Supabase and share credentials with the operations team.

## Key Features

- Marketing website with hero search, featured properties, detailed pages, and virtual tour intake
- Contact, inquiry, and site visit request forms connected to Supabase
- Admin ERP dashboard with tabs for clients, properties, site visits, virtual tours, and receipts
- Supabase Storage integration for file uploads (client documents, virtual tours, receipt PDFs)
- Automated PDF receipt generation using `pdf-lib`
- Responsive Tailwind components designed for desktop and mobile

## Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – build production bundle
- `npm run preview` – preview production build
- `npm run lint` – run ESLint

## Folder Structure

```
frontend/
  src/
    components/      # Reusable UI components
    features/        # Supabase data access and React Query hooks
    pages/           # Route components for site and admin ERP
    lib/             # Supabase client, storage, receipts helpers
    providers/       # Auth provider
    types/           # Shared TypeScript types
```

Connect the frontend to Supabase by configuring the environment variables and ensure migrations/policies match the schema outline. Update styling and branding assets as needed.

