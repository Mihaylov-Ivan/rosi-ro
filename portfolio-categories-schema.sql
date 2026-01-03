-- =====================================================
-- Portfolio Categories Table Schema
-- =====================================================
-- This script creates a table to store images for each portfolio category
-- =====================================================

-- Create portfolio_categories table
CREATE TABLE IF NOT EXISTS public.portfolio_categories (
  name TEXT PRIMARY KEY,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_portfolio_categories_name ON public.portfolio_categories(name);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_portfolio_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_portfolio_categories_updated_at
  BEFORE UPDATE ON public.portfolio_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolio_categories_updated_at();

-- Insert the 5 categories with NULL images initially
INSERT INTO public.portfolio_categories (name, image)
VALUES 
  ('Електроенергийни обекти', NULL),
  ('Промишлено-технологични обекти и складове', NULL),
  ('Жилищни сгради и комплекси', NULL),
  ('Обекти за обществено обслужване и търговия', NULL),
  ('Селско-стопански обекти', NULL)
ON CONFLICT (name) DO NOTHING;

-- Row Level Security (RLS) Policies
ALTER TABLE public.portfolio_categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Portfolio categories are viewable by everyone"
  ON public.portfolio_categories FOR SELECT
  USING (true);

-- Authenticated users can insert, update, delete
CREATE POLICY "Portfolio categories are editable by authenticated users"
  ON public.portfolio_categories FOR ALL
  USING (auth.role() = 'authenticated');

-- =====================================================
-- Verification Query
-- =====================================================
-- Run this to verify the schema
SELECT 
  name,
  image,
  created_at,
  updated_at
FROM public.portfolio_categories
ORDER BY name;

