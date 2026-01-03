-- =====================================================
-- Update Portfolio Categories to Start with Capital Letter
-- =====================================================
-- This script updates all category names to start with a capital letter
-- =====================================================

-- Update categories to start with capital letter
UPDATE public.portfolio
SET category = CASE 
  WHEN category = 'електроенергийни обекти' THEN 'Електроенергийни обекти'
  WHEN category = 'промишлено-технологични обекти и складове' THEN 'Промишлено-технологични обекти и складове'
  WHEN category = 'жилищни сгради и комплекси' THEN 'Жилищни сгради и комплекси'
  WHEN category = 'обекти за обществено обслужване и търговия' THEN 'Обекти за обществено обслужване и търговия'
  WHEN category = 'селско-стопански обекти' THEN 'Селско-стопански обекти'
  ELSE category
END;

-- Verify the update
SELECT category, COUNT(*) as project_count
FROM public.portfolio
GROUP BY category
ORDER BY category;

