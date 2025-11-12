-- Clients table
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  phone text not null,
  documents text[] default '{}',
  purchaseHistory text,
  notes text,
  created_at timestamptz default now()
);

-- Properties table
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Plot', 'House', 'Property')),
  price numeric not null,
  location text,
  description text,
  shortDescription text,
  images text[] default '{}',
  virtualTourUrl text,
  isFeatured boolean default false,
  created_at timestamptz default now()
);

-- Site visits
create table if not exists public.site_visits (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  property_id uuid references public.properties(id) on delete cascade,
  scheduled_date timestamptz not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz default now()
);

-- Virtual tours
create table if not exists public.virtual_tours (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade,
  title text not null,
  tour_url text not null,
  asset_path text,
  created_at timestamptz default now()
);

-- Receipts
create table if not exists public.receipts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  property_id uuid references public.properties(id) on delete cascade,
  amount numeric not null,
  receipt_url text not null,
  issued_at date not null,
  created_at timestamptz default now()
);

-- Suggested Storage Buckets
-- Create three buckets in Supabase Storage:
-- 1. client-documents (public read, authenticated write)
-- 2. virtual-tours (public read, authenticated write)
-- 3. receipts (authenticated read/write)

-- Example RLS policies should be added based on your security requirements.

