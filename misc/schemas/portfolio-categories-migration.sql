-- Migration script to update portfolio categories
-- This script assigns existing projects to one of 4 predefined categories
-- and ensures the category field is properly set up

-- First, let's define the 4 categories we'll use:
-- 1. Жилищно строителство (Residential Construction)
-- 2. Търговско строителство (Commercial Construction)
-- 3. Индустриално строителство (Industrial Construction)
-- 4. Реновации (Renovations)

-- Update existing projects to assign them to random categories
-- This distributes them evenly across the 4 categories
-- Note: This will update ALL projects, assigning them to one of the 4 categories
UPDATE public.portfolio
SET category = CASE 
  WHEN id % 4 = 0 THEN 'Жилищно строителство'
  WHEN id % 4 = 1 THEN 'Търговско строителство'
  WHEN id % 4 = 2 THEN 'Индустриално строителство'
  WHEN id % 4 = 3 THEN 'Реновации'
  ELSE 'Жилищно строителство'
END;

-- Optional: Add a check constraint to ensure only valid categories are used
-- Uncomment if you want to enforce category values at the database level
/*
ALTER TABLE public.portfolio
DROP CONSTRAINT IF EXISTS portfolio_category_check;

ALTER TABLE public.portfolio
ADD CONSTRAINT portfolio_category_check 
CHECK (category IN (
  'Жилищно строителство',
  'Търговско строителство',
  'Индустриално строителство',
  'Реновации'
));
*/

-- Verify the update
SELECT category, COUNT(*) as project_count
FROM public.portfolio
GROUP BY category
ORDER BY category;

