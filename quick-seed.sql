-- Quick seed: Single campus team event for testing
-- Run this in your Supabase SQL Editor or psql

INSERT INTO events (
  event_name,
  slug,
  landscape_poster,
  portrait_poster,
  date,
  time,
  duration,
  age_limit,
  event_type,
  language,
  category,
  venue,
  price,
  description,
  performers,
  creator_email,
  is_team_event,
  min_team_size,
  max_team_size
) VALUES (
  'Campus Hackathon 2025',
  'campus-hackathon-2025',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=600',
  '2025-12-01',
  '09:00',
  '24 hours',
  'U',
  'event',
  'English',
  'campus-event',
  'Computer Science Building, Room 101',
  'Free',
  'Join the biggest campus hackathon of the year! Build innovative solutions to real-world problems with your team. Prizes worth ₹50,000 to be won. Form teams of 2-5 members and compete with the best minds on campus. Register now and showcase your coding skills!',
  'Tech Community, Campus Innovation Club',
  'admin@rkade.com',
  true,
  2,
  5
) ON CONFLICT (slug) DO UPDATE SET
  is_team_event = EXCLUDED.is_team_event,
  min_team_size = EXCLUDED.min_team_size,
  max_team_size = EXCLUDED.max_team_size;