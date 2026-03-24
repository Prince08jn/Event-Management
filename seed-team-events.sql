-- Seed data for team events
-- First, ensure we have the team functionality columns in the events table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'is_team_event'
    ) THEN
        ALTER TABLE events ADD COLUMN is_team_event BOOLEAN DEFAULT FALSE;
        ALTER TABLE events ADD COLUMN min_team_size INTEGER DEFAULT 1;
        ALTER TABLE events ADD COLUMN max_team_size INTEGER DEFAULT 1;
    END IF;
END $$;

-- Add Campus Event to event types if not exists
INSERT INTO event_types (name, slug, position)
VALUES ('Campus Event', 'campus-event', 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample campus team events
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
) VALUES
(
  'Campus Hackathon 2025',
  'campus-hackathon-2025',
  '/hackathon-landscape.jpg',
  '/hackathon-portrait.jpg',
  '2025-12-01',
  '09:00',
  '24 hours',
  'U',
  'campus-event',
  'English',
  'Technology',
  'Computer Science Building, Room 101',
  'Free',
  'Join the biggest campus hackathon of the year! Build innovative solutions to real-world problems with your team. Prizes worth ₹50,000 to be won. Form teams of 2-5 members and compete with the best minds on campus.',
  'Tech Community, Campus Innovation Club',
  'admin@campus.edu',
  true,
  2,
  5
),
(
  'Inter-College Cricket Tournament',
  'inter-college-cricket-tournament',
  '/cricket-landscape.jpg',
  '/cricket-portrait.jpg',
  '2025-11-30',
  '07:00',
  '8 hours',
  'U',
  'campus-event',
  'English',
  'Sports',
  'Main Cricket Ground, Sports Complex',
  '₹100',
  'Annual inter-college cricket tournament. Assemble your team of 11 players and compete for the championship trophy. Registration includes team jersey and refreshments.',
  'Sports Committee, Athletic Department',
  'sports@campus.edu',
  true,
  11,
  15
),
(
  'Campus Coding Competition',
  'campus-coding-competition',
  '/coding-landscape.jpg',
  '/coding-portrait.jpg',
  '2025-12-05',
  '14:00',
  '4 hours',
  'U',
  'campus-event',
  'English',
  'Technology',
  'Engineering Building, Lab 2',
  '₹50',
  'Test your programming skills in this competitive coding event. Teams of 2-3 members will solve algorithmic challenges. Prizes for top 3 teams and individual performers.',
  'Computer Science Department',
  'cs@campus.edu',
  true,
  2,
  3
),
(
  'Business Plan Competition',
  'business-plan-competition',
  '/business-landscape.jpg',
  '/business-portrait.jpg',
  '2025-12-10',
  '10:00',
  '6 hours',
  'U',
  'campus-event',
  'English',
  'Business',
  'Business School Auditorium',
  '₹200',
  'Present your innovative business ideas to industry experts and venture capitalists. Teams of 3-6 members will pitch their business plans. Winning team gets ₹25,000 seed funding.',
  'Entrepreneurship Cell, Industry Partners',
  'biz@campus.edu',
  true,
  3,
  6
),
(
  'Cultural Dance Festival',
  'cultural-dance-festival',
  '/dance-landscape.jpg',
  '/dance-portrait.jpg',
  '2025-11-28',
  '18:00',
  '3 hours',
  'U',
  'campus-event',
  'Multiple',
  'Cultural',
  'Main Auditorium',
  'Free',
  'Showcase your cultural heritage through traditional and contemporary dance forms. Teams of 4-12 performers can participate in various categories.',
  'Cultural Committee, Dance Society',
  'culture@campus.edu',
  true,
  4,
  12
);

-- Insert some sample teams for the hackathon event
INSERT INTO teams (
  event_id,
  team_name,
  team_code,
  creator_email
) VALUES
(
  (SELECT id FROM events WHERE slug = 'campus-hackathon-2025' LIMIT 1),
  'Code Warriors',
  'CW2024',
  'student1@campus.edu'
),
(
  (SELECT id FROM events WHERE slug = 'campus-hackathon-2025' LIMIT 1),
  'Tech Innovators',
  'TI2024',
  'student2@campus.edu'
),
(
  (SELECT id FROM events WHERE slug = 'campus-hackathon-2025' LIMIT 1),
  'Binary Builders',
  'BB2024',
  'student3@campus.edu'
);

-- Insert sample team members
INSERT INTO team_members (
  team_id,
  user_email
) VALUES
-- Code Warriors team
(
  (SELECT id FROM teams WHERE team_code = 'CW2024' LIMIT 1),
  'student1@campus.edu'
),
(
  (SELECT id FROM teams WHERE team_code = 'CW2024' LIMIT 1),
  'alice.smith@campus.edu'
),
(
  (SELECT id FROM teams WHERE team_code = 'CW2024' LIMIT 1),
  'bob.jones@campus.edu'
),
-- Tech Innovators team
(
  (SELECT id FROM teams WHERE team_code = 'TI2024' LIMIT 1),
  'student2@campus.edu'
),
(
  (SELECT id FROM teams WHERE team_code = 'TI2024' LIMIT 1),
  'charlie.brown@campus.edu'
),
(
  (SELECT id FROM teams WHERE team_code = 'TI2024' LIMIT 1),
  'diana.wilson@campus.edu'
),
(
  (SELECT id FROM teams WHERE team_code = 'TI2024' LIMIT 1),
  'eve.garcia@campus.edu'
),
-- Binary Builders team
(
  (SELECT id FROM teams WHERE team_code = 'BB2024' LIMIT 1),
  'student3@campus.edu'
),
(
  (SELECT id FROM teams WHERE team_code = 'BB2024' LIMIT 1),
  'frank.miller@campus.edu'
);

-- Add some sample users if they don't exist (for demo purposes)
INSERT INTO users (
  email,
  password,
  first_name,
  last_name,
  country_code,
  phone_number,
  country,
  current_city
) VALUES
('student1@campus.edu', '$2a$12$example.hash.for.demo', 'John', 'Doe', '+1', '555-0101', 'USA', 'Campus City'),
('student2@campus.edu', '$2a$12$example.hash.for.demo', 'Jane', 'Smith', '+1', '555-0102', 'USA', 'Campus City'),
('student3@campus.edu', '$2a$12$example.hash.for.demo', 'Mike', 'Johnson', '+1', '555-0103', 'USA', 'Campus City'),
('alice.smith@campus.edu', '$2a$12$example.hash.for.demo', 'Alice', 'Smith', '+1', '555-0104', 'USA', 'Campus City'),
('bob.jones@campus.edu', '$2a$12$example.hash.for.demo', 'Bob', 'Jones', '+1', '555-0105', 'USA', 'Campus City'),
('charlie.brown@campus.edu', '$2a$12$example.hash.for.demo', 'Charlie', 'Brown', '+1', '555-0106', 'USA', 'Campus City'),
('diana.wilson@campus.edu', '$2a$12$example.hash.for.demo', 'Diana', 'Wilson', '+1', '555-0107', 'USA', 'Campus City'),
('eve.garcia@campus.edu', '$2a$12$example.hash.for.demo', 'Eve', 'Garcia', '+1', '555-0108', 'USA', 'Campus City'),
('frank.miller@campus.edu', '$2a$12$example.hash.for.demo', 'Frank', 'Miller', '+1', '555-0109', 'USA', 'Campus City'),
('admin@campus.edu', '$2a$12$example.hash.for.demo', 'Admin', 'User', '+1', '555-0100', 'USA', 'Campus City'),
('sports@campus.edu', '$2a$12$example.hash.for.demo', 'Sports', 'Coordinator', '+1', '555-0200', 'USA', 'Campus City'),
('cs@campus.edu', '$2a$12$example.hash.for.demo', 'CS', 'Department', '+1', '555-0300', 'USA', 'Campus City'),
('biz@campus.edu', '$2a$12$example.hash.for.demo', 'Business', 'Department', '+1', '555-0400', 'USA', 'Campus City'),
('culture@campus.edu', '$2a$12$example.hash.for.demo', 'Cultural', 'Committee', '+1', '555-0500', 'USA', 'Campus City')
ON CONFLICT (email) DO NOTHING;