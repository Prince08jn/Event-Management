-- Initial schema generated from database-schema.sql at project bootstrap

\echo 'Applying initial schema...'

BEGIN;

-- Copy of database-schema.sql content -- adjust over time to incremental migrations
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can only access own data" ON users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Allow user registration" ON users
    FOR INSERT WITH CHECK (true);

-- Events extensions
ALTER TABLE IF EXISTS events ADD COLUMN IF NOT EXISTS event_type TEXT;
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
ALTER TABLE IF EXISTS events ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  user_id UUID,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  amount_paise INTEGER NOT NULL DEFAULT 0 CHECK (amount_paise >= 0),
  status TEXT NOT NULL DEFAULT 'pending',
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
DROP POLICY IF EXISTS "Public read bookings" ON bookings;
CREATE POLICY "Public read bookings" ON bookings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert bookings" ON bookings;
CREATE POLICY "Allow insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Masters
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
CREATE POLICY IF NOT EXISTS "Public read event_types" ON event_types FOR SELECT USING (true);
CREATE TRIGGER update_event_types_updated_at BEFORE UPDATE ON event_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
CREATE POLICY IF NOT EXISTS "Public read categories" ON categories FOR SELECT USING (true);
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
CREATE POLICY IF NOT EXISTS "Public read languages" ON languages FOR SELECT USING (true);
CREATE TRIGGER update_languages_updated_at BEFORE UPDATE ON languages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
CREATE POLICY IF NOT EXISTS "Public read age_ratings" ON age_ratings FOR SELECT USING (true);
CREATE TRIGGER update_age_ratings_updated_at BEFORE UPDATE ON age_ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seeds
INSERT INTO event_types (name, slug, position) VALUES ('Movie','movie',1),('Event','event',2),('Sports','sports',3) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug, position) VALUES ('Comedy','comedy',1),('Music','music',2),('Workshop','workshop',3) ON CONFLICT (slug) DO NOTHING;
INSERT INTO languages (name, slug, position) VALUES ('English','english',1),('Hindi','hindi',2),('Punjabi','punjabi',3) ON CONFLICT (slug) DO NOTHING;
INSERT INTO age_ratings (code, name, slug, min_age, position) VALUES ('U','Universal','u',0,1),('U/A','Parental Guidance','ua',0,2),('A','Adults Only','a',18,3),('PG13','Parental Guidance 13','pg13',13,4) ON CONFLICT (slug) DO NOTHING;

COMMIT;


