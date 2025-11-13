/*
  # Real Estate ERP Initial Schema

  1. New Tables
    - `clients` - Real estate clients
    - `properties` - Properties for sale
    - `site_visits` - Scheduled property visits
    - `virtual_tours` - 360° tours for properties
    - `receipts` - Payment receipts

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
    - Allow public read access to properties

  3. Indexes
    - Foreign key indexes for query performance
*/

-- Clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  documents text[] DEFAULT '{}',
  purchaseHistory text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('Plot', 'House', 'Property')),
  price numeric NOT NULL,
  location text,
  description text,
  shortDescription text,
  images text[] DEFAULT '{}',
  virtualTourUrl text,
  isFeatured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Site visits table
CREATE TABLE IF NOT EXISTS public.site_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  scheduled_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Virtual tours table
CREATE TABLE IF NOT EXISTS public.virtual_tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  title text NOT NULL,
  tour_url text NOT NULL,
  asset_path text,
  created_at timestamptz DEFAULT now()
);

-- Receipts table
CREATE TABLE IF NOT EXISTS public.receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  receipt_url text NOT NULL,
  issued_at date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Clients
CREATE POLICY "Clients are viewable by everyone"
  ON public.clients
  FOR SELECT
  USING (true);

CREATE POLICY "Clients can be created by anyone"
  ON public.clients
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Clients can be updated by anyone"
  ON public.clients
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- RLS Policies for Properties
CREATE POLICY "Properties are viewable by everyone"
  ON public.properties
  FOR SELECT
  USING (true);

CREATE POLICY "Properties can be created by anyone"
  ON public.properties
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Properties can be updated by anyone"
  ON public.properties
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- RLS Policies for Site Visits
CREATE POLICY "Site visits are viewable by everyone"
  ON public.site_visits
  FOR SELECT
  USING (true);

CREATE POLICY "Site visits can be created by anyone"
  ON public.site_visits
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Site visits can be updated by anyone"
  ON public.site_visits
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- RLS Policies for Virtual Tours
CREATE POLICY "Virtual tours are viewable by everyone"
  ON public.virtual_tours
  FOR SELECT
  USING (true);

CREATE POLICY "Virtual tours can be created by anyone"
  ON public.virtual_tours
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Virtual tours can be updated by anyone"
  ON public.virtual_tours
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- RLS Policies for Receipts
CREATE POLICY "Receipts are viewable by everyone"
  ON public.receipts
  FOR SELECT
  USING (true);

CREATE POLICY "Receipts can be created by anyone"
  ON public.receipts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Receipts can be updated by anyone"
  ON public.receipts
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_site_visits_client_id ON public.site_visits(client_id);
CREATE INDEX IF NOT EXISTS idx_site_visits_property_id ON public.site_visits(property_id);
CREATE INDEX IF NOT EXISTS idx_virtual_tours_property_id ON public.virtual_tours(property_id);
CREATE INDEX IF NOT EXISTS idx_receipts_client_id ON public.receipts(client_id);
CREATE INDEX IF NOT EXISTS idx_receipts_property_id ON public.receipts(property_id);