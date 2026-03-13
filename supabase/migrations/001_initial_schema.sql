-- =====================================================
-- ATA FLUG TRANSFER - Initial Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY DEFAULT 'TR-' || floor(10000 + random() * 90000)::text,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  pickup TEXT NOT NULL,
  destination TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  passengers INTEGER NOT NULL DEFAULT 1,
  vehicle_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending'
    CHECK (status IN ('Pending', 'Confirmed', 'Cancelled', 'Completed', 'Rejected', 'Deleted')),
  total_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  flight_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (new bookings from the website)
CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated admin users can SELECT, UPDATE, DELETE
CREATE POLICY "Authenticated users can view all bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete bookings"
  ON public.bookings FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- SITE CONTENT TABLE (singleton)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.site_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure only one row (singleton pattern)
ALTER TABLE public.site_content ADD CONSTRAINT site_content_singleton CHECK (id = 1);

-- Row Level Security for site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public can SELECT (site needs to read content)
CREATE POLICY "Anyone can read site content"
  ON public.site_content FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users can UPDATE
CREATE POLICY "Authenticated users can update site content"
  ON public.site_content FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert site content"
  ON public.site_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =====================================================
-- BLOG POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  category TEXT,
  tags TEXT[],
  author TEXT DEFAULT 'Ata Flug Transfer',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security for blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Anyone can read published blog posts"
  ON public.blog_posts FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR auth.uid() IS NOT NULL);

-- Only authenticated users can modify
CREATE POLICY "Authenticated users can manage blog posts"
  ON public.blog_posts FOR ALL
  TO authenticated
  USING (true);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT,
  lang TEXT DEFAULT 'tr',
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'deleted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can read approved reviews
CREATE POLICY "Anyone can read approved reviews"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (status = 'approved' OR auth.uid() IS NOT NULL);

-- Public can submit reviews
CREATE POLICY "Anyone can submit reviews"
  ON public.reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can moderate
CREATE POLICY "Authenticated users can moderate reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
