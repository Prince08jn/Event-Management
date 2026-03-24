-- Add creator_email to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES users(id);
ALTER TABLE events ADD COLUMN IF NOT EXISTS creator_email TEXT REFERENCES users(email);
CREATE INDEX IF NOT EXISTS idx_events_creator_email ON events(creator_email);
CREATE INDEX IF NOT EXISTS idx_events_creator_id ON events(creator_id);

-- Update bookings table to include user_email
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_email TEXT REFERENCES users(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user_email ON bookings(user_email);