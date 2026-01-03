-- =====================================================
-- Complete Portfolio Table Schema
-- =====================================================
-- This is the complete schema for the portfolio table
-- with the new 5 categories and nullable optional fields
-- =====================================================

-- Drop existing table if you need to recreate it (use with caution!)
-- DROP TABLE IF EXISTS portfolio CASCADE;

-- Create portfolio table with nullable optional fields
CREATE TABLE IF NOT EXISTS public.portfolio (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,  -- Nullable (optional)
  year TEXT,      -- Nullable (optional)
  scope TEXT,     -- Nullable (optional)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON public.portfolio(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_created_at ON public.portfolio(created_at DESC);

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_portfolio_updated_at
  BEFORE UPDATE ON public.portfolio
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Add check constraint to ensure only valid categories are used
-- Uncomment if you want to enforce category values at the database level
/*
ALTER TABLE public.portfolio
DROP CONSTRAINT IF EXISTS portfolio_category_check;

ALTER TABLE public.portfolio
ADD CONSTRAINT portfolio_category_check 
CHECK (category IN (
  'Електроенергийни обекти',
  'Промишлено-технологични обекти и складове',
  'Жилищни сгради и комплекси',
  'Обекти за обществено обслужване и търговия',
  'Селско-стопански обекти'
));
*/

-- Row Level Security (RLS) Policies
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Portfolio is viewable by everyone"
  ON public.portfolio FOR SELECT
  USING (true);

-- Authenticated users can insert, update, delete
CREATE POLICY "Portfolio is editable by authenticated users"
  ON public.portfolio FOR ALL
  USING (auth.role() = 'authenticated');

-- =====================================================
-- Helper View (optional)
-- =====================================================
CREATE OR REPLACE VIEW portfolio_view AS
SELECT
  id,
  title,
  category,
  image,
  description,
  jsonb_build_object(
    'location', location,
    'year', year,
    'scope', scope
  ) AS details,
  created_at,
  updated_at
FROM public.portfolio;

-- =====================================================
-- Sample Data (optional - for testing)
-- =====================================================
/*
INSERT INTO public.portfolio (title, category, image, description, location, year, scope)
VALUES 
  (
    'Примерен проект 1',
    'електроенергийни обекти',
    'https://example.com/image1.jpg',
    'Описание на проекта...',
    'гр. София',
    '2024',
    'Строителен надзор'
  ),
  (
    'Примерен проект 2',
    'жилищни сгради и комплекси',
    'https://example.com/image2.jpg',
    'Описание на проекта...',
    NULL,  -- Optional field
    '2023',
    NULL   -- Optional field
  );
*/

-- =====================================================
-- Verification Query
-- =====================================================
-- Run this to verify the schema
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'portfolio'
ORDER BY ordinal_position;

