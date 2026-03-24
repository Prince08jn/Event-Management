-- Add campus event type if not exists
INSERT INTO event_types (name, slug, position)
VALUES ('Campus', 'campus', 4)
ON CONFLICT (slug) DO NOTHING;

-- Create subtypes table
CREATE TABLE IF NOT EXISTS subtypes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type_slug TEXT REFERENCES event_types(slug) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_url TEXT,
  portrait_url TEXT,
  location TEXT,
  position SMALLINT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subtypes_event_type_slug ON subtypes(event_type_slug);
CREATE INDEX IF NOT EXISTS idx_subtypes_slug ON subtypes(slug);

ALTER TABLE subtypes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read subtypes" ON subtypes;
CREATE POLICY "Public read subtypes" ON subtypes FOR SELECT USING (true);

DROP TRIGGER IF EXISTS update_subtypes_updated_at ON subtypes;
CREATE TRIGGER update_subtypes_updated_at
  BEFORE UPDATE ON subtypes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add subtype_slug to events if not exists
ALTER TABLE IF EXISTS events
ADD COLUMN IF NOT EXISTS subtype_slug TEXT REFERENCES subtypes(slug);

CREATE INDEX IF NOT EXISTS idx_events_subtype_slug ON events(subtype_slug);

-- Seed Subtypes
-- Campus
INSERT INTO subtypes (event_type_slug, name, slug, location, position)
VALUES 
('campus', 'IIT Delhi', 'iit-delhi', 'New Delhi', 1)
ON CONFLICT (slug) DO NOTHING;

-- Movies
INSERT INTO subtypes (event_type_slug, name, slug, position)
VALUES 
('movie', 'Hindi', 'hindi-movie', 1),
('movie', 'Punjabi', 'punjabi-movie', 2),
('movie', 'English', 'english-movie', 3)
ON CONFLICT (slug) DO NOTHING;

-- Sports
INSERT INTO subtypes (event_type_slug, name, slug, position)
VALUES 
('sports', 'Cricket', 'cricket', 1),
('sports', 'Football', 'football', 2),
('sports', 'Hockey', 'hockey', 3)
ON CONFLICT (slug) DO NOTHING;

-- Events (Artists)
INSERT INTO subtypes (event_type_slug, name, slug, position)
VALUES 
('event', 'Diljit Dosanjh', 'diljit-dosanjh', 1)
ON CONFLICT (slug) DO NOTHING;
