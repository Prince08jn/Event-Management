-- =============================================================================
-- rkade — Supabase Seed SQL
-- Run this in the Supabase SQL Editor after a project restart / pause recovery.
-- It creates the required tables (if missing) and seeds fallback event data.
-- =============================================================================

-- ── Events table ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  event_name    TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  landscape_poster TEXT,
  portrait_poster  TEXT,
  date          TEXT,
  time          TEXT,
  duration      TEXT,
  age_limit     TEXT DEFAULT 'U',
  event_type    TEXT NOT NULL,
  language      TEXT DEFAULT 'English',
  category      TEXT,
  venue         TEXT,
  price         TEXT DEFAULT 'FREE',
  description   TEXT,
  performers    TEXT,
  creator_email TEXT,
  is_team_event BOOLEAN DEFAULT FALSE,
  min_team_size INTEGER,
  max_team_size INTEGER,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Bookings table ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  event_id            TEXT REFERENCES events(id),
  user_email          TEXT NOT NULL,
  quantity            INTEGER NOT NULL DEFAULT 1,
  amount_paise        INTEGER NOT NULL DEFAULT 0,
  status              TEXT NOT NULL DEFAULT 'pending',
  razorpay_order_id   TEXT,
  razorpay_payment_id TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── Seed events (ON CONFLICT DO NOTHING so it's idempotent) ──────────────────

-- Campus events
INSERT INTO events (id, event_name, slug, landscape_poster, portrait_poster, date, time, duration, age_limit, event_type, language, category, venue, price, description, performers, creator_email)
VALUES
('c1', 'Campus Hackathon 2025', 'campus-hackathon-2025', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=600&fit=crop', '2025-12-01', '09:00', '24 hours', 'U', 'campus_event', 'English', 'campus-event', 'Computer Science Building, IIT Delhi', 'FREE', 'Join the biggest campus hackathon of the year!', 'Tech Community', 'admin@rkade.com'),
('c2', 'Mood Indigo 2025 — IIT Bombay Fest', 'mood-indigo-2025', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=600&fit=crop', '2025-12-22', '16:00', '4 days', 'U', 'campus_event', 'English', 'campus-event', 'IIT Bombay, Powai, Mumbai', '₹399', 'Asia''s largest college cultural festival.', 'Nucleya, Prateek Kuhad, Ritviz', 'admin@rkade.com'),
('c3', 'Entrepreneurship Summit 2025', 'entrepreneurship-summit-2025', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=600&fit=crop', '2025-11-18', '10:00', '8 hours', 'U', 'campus_event', 'English', 'campus-event', 'IIM Ahmedabad, Gujarat', 'FREE', 'Connect with top founders, VCs and innovators.', 'Kunal Shah, Ghazal Alagh', 'admin@rkade.com'),
('c7', 'Techfest — IIT Bombay Science Festival', 'techfest-iit-bombay-2025', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop', '2025-12-28', '09:00', '3 days', 'U', 'campus_event', 'English', 'campus-event', 'IIT Bombay, Mumbai', '₹199', 'Asia''s largest science & technology festival.', 'NASA Scientists, IIT Professors', 'admin@rkade.com')
ON CONFLICT (id) DO NOTHING;

-- Sports events
INSERT INTO events (id, event_name, slug, landscape_poster, portrait_poster, date, time, duration, age_limit, event_type, language, category, venue, price, description, performers, creator_email)
VALUES
('s1', 'East Bengal FC vs Real Kashmir FC', 'east-bengal-fc-vs-real-kashmir-fc', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=600&fit=crop', '2025-12-01', '19:30', '90 min', 'U', 'sports', 'English', 'Football', 'Salt Lake Stadium, Kolkata', '₹599', 'Witness the thrilling I-League clash.', 'East Bengal FC, Real Kashmir FC', 'admin@rkade.com'),
('s2', 'IPL 2025 — MI vs CSK', 'ipl-mi-vs-csk-2025', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=600&fit=crop', '2025-04-15', '19:30', '4 hours', 'U', 'sports', 'English', 'Cricket', 'Wankhede Stadium, Mumbai', '₹1499', 'The El Clásico of Indian cricket.', 'Rohit Sharma, MS Dhoni', 'admin@rkade.com'),
('s5', 'BWF India Open Badminton 2025', 'bwf-india-open-2025', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=600&fit=crop', '2025-01-14', '10:00', '5 days', 'U', 'sports', 'English', 'Badminton', 'K.D. Jadhav Indoor Hall, New Delhi', '₹799', 'Super 750 tournament featuring world''s best shuttlers.', 'PV Sindhu, Viktor Axelsen', 'admin@rkade.com'),
('s7', 'NBA India Games 2025', 'nba-india-games-2025', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=600&fit=crop', '2025-10-05', '19:00', '2.5 hours', 'U', 'sports', 'English', 'Basketball', 'Dome @ NSCI, Mumbai', '₹2499', 'NBA comes to India! Pre-season exhibition games.', 'Sacramento Kings vs Indiana Pacers', 'admin@rkade.com')
ON CONFLICT (id) DO NOTHING;

-- Movie events
INSERT INTO events (id, event_name, slug, landscape_poster, portrait_poster, date, time, duration, age_limit, event_type, language, category, venue, price, description, performers, creator_email)
VALUES
('m1', 'GO GOA GONE 2', 'go-goa-gone-2', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop', '2025-11-20', '18:30', '150 min', 'U/A', 'movie', 'Hindi', 'Comedy', 'PVR Cinemas, Select City Walk, Delhi', '₹199', 'The much-awaited sequel to the cult zombie comedy.', 'Kunal Kemmu, Vir Das', 'admin@rkade.com'),
('m2', 'Kantara: A Legend — Chapter 1', 'kantara-a-legend-chapter-1', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop', '2025-11-15', '20:00', '150 min', 'U/A', 'movie', 'Kannada', 'Drama', 'INOX Megaplex, Saket, New Delhi', '₹149', 'Experience the epic mythological tale.', 'Rishab Shetty, Sapthami Gowda', 'admin@rkade.com'),
('m4', 'RRR 2 — Ranam Raaram Raaram', 'rrr-2-2025', 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=600&fit=crop', '2025-12-25', '18:00', '185 min', 'U/A', 'movie', 'Telugu', 'Action', 'IMAX, PVR Anupam, New Delhi', '₹350', 'SS Rajamouli returns with the most anticipated sequel.', 'Ram Charan, Jr NTR', 'admin@rkade.com'),
('m7', 'Jawan 2', 'jawan-2-2025', 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=600&fit=crop', '2025-08-08', '19:30', '160 min', 'U/A', 'movie', 'Hindi', 'Action', 'PVR ECX, New Delhi', '₹349', 'SRK reprises his dual role.', 'Shah Rukh Khan, Nayanthara', 'admin@rkade.com')
ON CONFLICT (id) DO NOTHING;

-- General events
INSERT INTO events (id, event_name, slug, landscape_poster, portrait_poster, date, time, duration, age_limit, event_type, language, category, venue, price, description, performers, creator_email)
VALUES
('e1', 'Travis Scott — Circus Maximus Tour Delhi', 'travis-scott-circus-maximus-tour-delhi', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop', '2025-12-15', '19:00', '120 min', 'PG13', 'event', 'English', 'Music', 'Jawaharlal Nehru Stadium, New Delhi', '₹2999', 'Experience Travis Scott live in Delhi.', 'Travis Scott', 'admin@rkade.com'),
('e2', 'Karan Aujla — Making Memories India Tour', 'karan-aujla-india-tour', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=600&fit=crop', '2025-12-10', '19:30', '120 min', 'PG13', 'event', 'Punjabi', 'Music', 'Thyagaraj Stadium, New Delhi', '₹1999', 'Karan Aujla live in concert.', 'Karan Aujla', 'admin@rkade.com'),
('e5', 'Coldplay India 2025', 'Coldplay-india-2025', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=600&fit=crop', '2025-01-31', '14:00', '2 days', 'PG13', 'event', 'English', 'Music Festival', 'Mahalaxmi Race Course, Mumbai', '₹4999', 'India''s premier multi-genre music festival.', 'Imagine Dragons, Anuv Jain, Prateek Kuhad', 'admin@rkade.com'),
('e6', 'Zakir Khan — Haq Se Single Tour', 'zakir-khan-standup-2025', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=600&fit=crop', '2025-11-30', '20:00', '90 min', 'U/A', 'event', 'Hindi', 'Stand-up Comedy', 'Siri Fort Auditorium, New Delhi', '₹799', 'The biggest stand-up comedian in India is back.', 'Zakir Khan', 'admin@rkade.com')
ON CONFLICT (id) DO NOTHING;
