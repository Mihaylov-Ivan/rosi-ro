-- =====================================================
-- Supabase Database Schema for RosiRo Website
-- =====================================================
-- This script creates all necessary tables for the website
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PORTFOLIO PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS portfolio (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  year TEXT NOT NULL,
  scope TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_created_at ON portfolio(created_at DESC);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_portfolio_updated_at
  BEFORE UPDATE ON portfolio
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. PORTFOLIO HEADER TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS portfolio_header (
  id TEXT PRIMARY KEY DEFAULT 'portfolio-header',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_portfolio_header_updated_at
  BEFORE UPDATE ON portfolio_header
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default portfolio header
INSERT INTO portfolio_header (id, title, description)
VALUES (
  'portfolio-header',
  'Нашето портфолио',
  'Разгледайте реализираните от нас проекти в различни области на строителството - жилищни, търговски и индустриални обекти.'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. HOME CONTENT TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS home_content (
  id TEXT PRIMARY KEY DEFAULT 'home',
  -- Hero section (stored as JSONB for flexibility)
  hero JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Services section
  services_title TEXT NOT NULL,
  -- About section
  about_title TEXT NOT NULL,
  -- Contact section (stored as JSONB)
  contact JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Footer section (stored as JSONB)
  footer JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_home_content_updated_at
  BEFORE UPDATE ON home_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default home content
INSERT INTO home_content (
  id,
  hero,
  services_title,
  about_title,
  contact,
  footer
)
VALUES (
  'home',
  '{
    "title": "Роси Ро ЕООД",
    "subtitle": "Консултант по строителен надзор",
    "description": "Професионални услуги за одит и издаване на разрешителни за строителни обекти. С дългогодишен опит и експертност в областта на строителството.",
    "buttonText": "Вижте портфолио"
  }'::jsonb,
  'Услуги',
  'За нас',
  '{
    "title": "Контакти",
    "address": "гр. Хасково, к-кс. XXI век, ет. 2, оф. 6",
    "phone": "+359 898 262 834",
    "email": "rosenaminkova@gmail.com"
  }'::jsonb,
  '{
    "copyright": "© 2025 Роси Ро ЕООД. Всички права запазени.",
    "tagline": "Консултант по строителен надзор"
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 4. SERVICES TABLE (for home page services)
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  home_content_id TEXT NOT NULL REFERENCES home_content(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_home_content_id ON services(home_content_id);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(home_content_id, display_order);

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default services
INSERT INTO services (id, home_content_id, title, description, display_order)
VALUES
  ('service-1', 'home', 'Строителен надзор', 'Професионален надзор на строителни проекти за осигуряване на качество и спазване на нормативите.', 1),
  ('service-2', 'home', 'Одити и проверки', 'Задълбочени одити на строителни обекти и техническа документация.', 2),
  ('service-3', 'home', 'Разрешителни', 'Съдействие при издаване на строителни разрешителни и необходима документация.', 3)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 5. ABOUT PARAGRAPHS TABLE (for home page about section)
-- =====================================================
CREATE TABLE IF NOT EXISTS about_paragraphs (
  id BIGSERIAL PRIMARY KEY,
  home_content_id TEXT NOT NULL REFERENCES home_content(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_bold BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_about_paragraphs_home_content_id ON about_paragraphs(home_content_id);
CREATE INDEX IF NOT EXISTS idx_about_paragraphs_display_order ON about_paragraphs(home_content_id, display_order);

CREATE TRIGGER update_about_paragraphs_updated_at
  BEFORE UPDATE ON about_paragraphs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default about paragraphs
INSERT INTO about_paragraphs (home_content_id, content, display_order, is_bold)
VALUES
  ('home', 'Роси Ро ЕООД е водеща консултантска фирма в областта на строителния надзор с дългогодишен опит в сферата на строителството. Специализирани сме в осъществяването на професионален строителен надзор, технически одити и съдействие при издаване на строителни разрешителни.', 1, FALSE),
  ('home', 'Нашият опит включва разнообразни проекти - от жилищни сгради и търговски обекти до индустриални съоръжения и инфраструктурни проекти. Гарантираме качество, прецизност и спазване на всички нормативни изисквания.', 2, FALSE),
  ('home', 'Работим с отдаденост за осигуряване на най-високи стандарти в строителната индустрия.', 3, TRUE)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. INSERT DEFAULT PORTFOLIO PROJECTS
-- =====================================================
-- NOTE: Default portfolio projects are NOT inserted here.
-- All images must be uploaded to Supabase Storage first, then projects
-- should be created via the admin panel which will use Supabase Storage URLs.
--
-- If you want to add default projects, first:
-- 1. Upload images to Supabase Storage bucket 'portfolio-images'
-- 2. Get the public URLs from Supabase Storage
-- 3. Insert projects with those URLs, or create them via admin panel
--
-- Example structure (replace with actual Supabase Storage URLs):
-- INSERT INTO portfolio (title, category, image, description, location, year, scope)
-- VALUES
--   (
--     'Жилищен комплекс',
--     'Жилищно строителство',
--     'https://[project-ref].supabase.co/storage/v1/object/public/portfolio-images/portfolio/image.jpg',
--     'Надзор на многофамилна жилищна сграда с 60 апартамента...',
--     'гр. Хасково',
--     '2023',
--     'Строителен надзор, технически одит'
--   );

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_header ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_paragraphs ENABLE ROW LEVEL SECURITY;

-- Portfolio: Public read, authenticated write
CREATE POLICY "Portfolio is viewable by everyone"
  ON portfolio FOR SELECT
  USING (true);

CREATE POLICY "Portfolio is editable by authenticated users"
  ON portfolio FOR ALL
  USING (auth.role() = 'authenticated');

-- Portfolio Header: Public read, authenticated write
CREATE POLICY "Portfolio header is viewable by everyone"
  ON portfolio_header FOR SELECT
  USING (true);

CREATE POLICY "Portfolio header is editable by authenticated users"
  ON portfolio_header FOR ALL
  USING (auth.role() = 'authenticated');

-- Home Content: Public read, authenticated write
CREATE POLICY "Home content is viewable by everyone"
  ON home_content FOR SELECT
  USING (true);

CREATE POLICY "Home content is editable by authenticated users"
  ON home_content FOR ALL
  USING (auth.role() = 'authenticated');

-- Services: Public read, authenticated write
CREATE POLICY "Services are viewable by everyone"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "Services are editable by authenticated users"
  ON services FOR ALL
  USING (auth.role() = 'authenticated');

-- About Paragraphs: Public read, authenticated write
CREATE POLICY "About paragraphs are viewable by everyone"
  ON about_paragraphs FOR SELECT
  USING (true);

CREATE POLICY "About paragraphs are editable by authenticated users"
  ON about_paragraphs FOR ALL
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 8. HELPER VIEWS FOR EASIER QUERYING
-- =====================================================

-- View for portfolio with formatted details
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
FROM portfolio;

-- View for complete home content
CREATE OR REPLACE VIEW home_content_view AS
SELECT
  hc.id,
  hc.hero,
  jsonb_build_object(
    'title', hc.services_title,
    'items', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'title', s.title,
          'description', s.description
        ) ORDER BY s.display_order
      )
      FROM services s
      WHERE s.home_content_id = hc.id),
      '[]'::jsonb
    )
  ) AS services,
  jsonb_build_object(
    'title', hc.about_title,
    'paragraphs', COALESCE(
      (SELECT jsonb_agg(ap.content ORDER BY ap.display_order)
       FROM about_paragraphs ap
       WHERE ap.home_content_id = hc.id),
      '[]'::jsonb
    )
  ) AS about,
  hc.contact,
  hc.footer,
  hc.updated_at
FROM home_content hc;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '📊 Tables created: portfolio, portfolio_header, home_content, services, about_paragraphs';
  RAISE NOTICE '🔒 Row Level Security (RLS) enabled on all tables';
  RAISE NOTICE '📈 Indexes and triggers configured';
  RAISE NOTICE '🎯 Default data inserted';
END $$;

