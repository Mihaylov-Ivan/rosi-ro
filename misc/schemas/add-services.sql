-- =====================================================
-- SQL Script to Add 2 New Services to RosiRo Website
-- =====================================================
-- This script adds 2 additional services to the services table
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Insert 2 new services (4th and 5th service)
INSERT INTO services (id, home_content_id, title, description, display_order)
VALUES
  (
    'service-4',
    'home',
    'Техническа документация',
    'Изготвяне и анализ на техническа документация за строителни проекти.',
    4
  ),
  (
    'service-5',
    'home',
    'Консултации',
    'Професионални консултации по строителни проекти и нормативни изисквания.',
    5
  )
ON CONFLICT (id) DO UPDATE
SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- Verify the services were added
SELECT id, title, description, display_order
FROM services
WHERE home_content_id = 'home'
ORDER BY display_order;

