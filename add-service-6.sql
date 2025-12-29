-- =====================================================
-- SQL Script to Add 6th Service to RosiRo Website
-- =====================================================
-- This script adds a 6th service to the services table
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Insert 6th service
INSERT INTO services (id, home_content_id, title, description, display_order)
VALUES
  (
    'service-6',
    'home',
    'Проектни решения',
    'Разработване и предложение на оптимални проектни решения за строителни обекти.',
    6
  )
ON CONFLICT (id) DO UPDATE
SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- Verify the service was added
SELECT id, title, description, display_order
FROM services
WHERE home_content_id = 'home'
ORDER BY display_order;

