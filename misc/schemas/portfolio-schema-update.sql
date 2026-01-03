-- =====================================================
-- Portfolio Schema Update
-- =====================================================
-- This script updates the portfolio table to:
-- 1. Make location, year, and scope nullable (optional fields)
-- 2. Update categories to the new 5 categories
-- =====================================================

-- Step 1: Make optional fields nullable
ALTER TABLE public.portfolio
  ALTER COLUMN location DROP NOT NULL,
  ALTER COLUMN year DROP NOT NULL,
  ALTER COLUMN scope DROP NOT NULL;

-- Step 2: Update existing projects to new categories
-- Distribute existing projects evenly across the 5 new categories
UPDATE public.portfolio
SET category = CASE 
  WHEN id % 5 = 0 THEN 'Електроенергийни обекти'
  WHEN id % 5 = 1 THEN 'Промишлено-технологични обекти и складове'
  WHEN id % 5 = 2 THEN 'Жилищни сгради и комплекси'
  WHEN id % 5 = 3 THEN 'Обекти за обществено обслужване и търговия'
  WHEN id % 5 = 4 THEN 'Селско-стопански обекти'
  ELSE 'Електроенергийни обекти'
END;

-- Step 3: Optional - Add check constraint to ensure only valid categories are used
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

-- Step 4: Verify the update
SELECT category, COUNT(*) as project_count
FROM public.portfolio
GROUP BY category
ORDER BY category;

-- =====================================================
-- Complete Schema (for reference)
-- =====================================================
/*
CREATE TABLE IF NOT EXISTS portfolio (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,  -- Now nullable
  year TEXT,      -- Now nullable
  scope TEXT,     -- Now nullable
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_created_at ON portfolio(created_at DESC);
*/

