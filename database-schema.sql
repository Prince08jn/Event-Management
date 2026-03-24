-- Create users table with all required fields
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  country_code VARCHAR(10) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  current_city VARCHAR(100) NOT NULL,
  birthday DATE,
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  profile_picture_url TEXT,
  address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only access their own data
CREATE POLICY "Users can only access own data" ON users
    FOR ALL USING (auth.uid() = id);

-- Allow insert for new user registration
CREATE POLICY "Allow user registration" ON users
    FOR INSERT WITH CHECK (true);

-- Ensure events table has event_type column (slug from event_types)
ALTER TABLE IF EXISTS events
  ADD COLUMN IF NOT EXISTS event_type TEXT;

CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  landscape_poster TEXT,
  portrait_poster TEXT,
  date DATE,
  time TEXT,
  duration TEXT,
  age_limit TEXT,
  event_type TEXT,
  language TEXT,
  category TEXT,
  venue TEXT,
  price TEXT,
  description TEXT,
  performers TEXT,
  creator_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure events table has event_type column (slug from event_types)
ALTER TABLE IF EXISTS events
  ADD COLUMN IF NOT EXISTS event_type TEXT;

CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);

-- Ensure events table has slug column for friendly URLs
ALTER TABLE IF EXISTS events
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;



CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- Enable RLS for events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to events
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);

-- Allow authenticated users to insert events
CREATE POLICY "Authenticated users can create events" ON events 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Bookings table for ticket purchases (including free events)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  user_id UUID,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  amount_paise INTEGER NOT NULL DEFAULT 0 CHECK (amount_paise >= 0),
  status TEXT NOT NULL DEFAULT 'pending', -- pending | paid | confirmed | cancelled
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_bookings_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow read to everyone (adjust later as needed)
DROP POLICY IF EXISTS "Public read bookings" ON bookings;
CREATE POLICY "Public read bookings" ON bookings FOR SELECT USING (true);

-- Allow inserts (server uses service key and bypasses RLS; this policy is permissive for dev)
DROP POLICY IF EXISTS "Allow insert bookings" ON bookings;
CREATE POLICY "Allow insert bookings" ON bookings FOR INSERT WITH CHECK (true);

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Master Data Tables
-- =============================================

-- Event Types (Movie, Event, Sports, etc.)
CREATE TABLE IF NOT EXISTS event_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  position SMALLINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_types_name ON event_types(name);
CREATE INDEX IF NOT EXISTS idx_event_types_slug ON event_types(slug);

ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read event_types" ON event_types FOR SELECT USING (true);

DROP TRIGGER IF EXISTS update_event_types_updated_at ON event_types;
CREATE TRIGGER update_event_types_updated_at
  BEFORE UPDATE ON event_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Categories (Comedy, Music, Workshop, etc.)
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  position SMALLINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Languages (English, Hindi, Punjabi, etc.)
CREATE TABLE IF NOT EXISTS languages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  position SMALLINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_languages_name ON languages(name);
CREATE INDEX IF NOT EXISTS idx_languages_slug ON languages(slug);

ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read languages" ON languages FOR SELECT USING (true);

DROP TRIGGER IF EXISTS update_languages_updated_at ON languages;
CREATE TRIGGER update_languages_updated_at
  BEFORE UPDATE ON languages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Age Ratings (U, U/A, A, PG13, etc.)
CREATE TABLE IF NOT EXISTS age_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  min_age SMALLINT,
  is_active BOOLEAN DEFAULT TRUE,
  position SMALLINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_age_ratings_code ON age_ratings(code);
CREATE INDEX IF NOT EXISTS idx_age_ratings_slug ON age_ratings(slug);

ALTER TABLE age_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read age_ratings" ON age_ratings FOR SELECT USING (true);

DROP TRIGGER IF EXISTS update_age_ratings_updated_at ON age_ratings;
CREATE TRIGGER update_age_ratings_updated_at
  BEFORE UPDATE ON age_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Subtypes (IIT Delhi, Horror, Cricket, etc.)
CREATE TABLE IF NOT EXISTS subtypes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type_slug TEXT REFERENCES event_types(slug) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_url TEXT,
  portrait_url TEXT,
  location TEXT, -- For campus subtypes
  position SMALLINT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subtypes_event_type_slug ON subtypes(event_type_slug);
CREATE INDEX IF NOT EXISTS idx_subtypes_slug ON subtypes(slug);

ALTER TABLE subtypes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read subtypes" ON subtypes FOR SELECT USING (true);

DROP TRIGGER IF EXISTS update_subtypes_updated_at ON subtypes;
CREATE TRIGGER update_subtypes_updated_at
  BEFORE UPDATE ON subtypes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Ensure events table has subtype_slug column (reference subtypes which is now created)
ALTER TABLE IF EXISTS events
  ADD COLUMN IF NOT EXISTS subtype_slug TEXT REFERENCES subtypes(slug);

CREATE INDEX IF NOT EXISTS idx_events_subtype_slug ON events(subtype_slug);

-- =============================================
-- Seed Data
-- =============================================

INSERT INTO event_types (name, slug, position)
VALUES
  ('Movie', 'movie', 1),
  ('Event', 'event', 2),
  ('Sports', 'sports', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, position)
VALUES
  ('Comedy', 'comedy', 1),
  ('Music', 'music', 2),
  ('Workshop', 'workshop', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO languages (name, slug, position)
VALUES
  ('English', 'english', 1),
  ('Hindi', 'hindi', 2),
  ('Punjabi', 'punjabi', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO age_ratings (code, name, slug, min_age, position)
VALUES
  ('U', 'Universal', 'u', 0, 1),
  ('U/A', 'Parental Guidance', 'ua', 0, 2),
  ('A', 'Adults Only', 'a', 18, 3),
  ('PG13', 'Parental Guidance 13', 'pg13', 13, 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO event_types (name, slug, position)
VALUES ('Campus', 'campus', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subtypes (event_type_slug, name, slug, location, position)
VALUES 
('campus', 'IIT Delhi', 'iit-delhi', 'New Delhi', 1)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subtypes (event_type_slug, name, slug, position)
VALUES 
('movie', 'Hindi', 'hindi-movie', 1),
('movie', 'Punjabi', 'punjabi-movie', 2),
('movie', 'English', 'english-movie', 3),
('sports', 'Cricket', 'cricket', 1),
('sports', 'Football', 'football', 2),
('sports', 'Hockey', 'hockey', 3),
('event', 'Diljit Dosanjh', 'diljit-dosanjh', 1)
ON CONFLICT (slug) DO NOTHING;