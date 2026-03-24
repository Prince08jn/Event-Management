-- Add specific sports categories to make event matching easier
INSERT INTO categories (name, slug, position)
VALUES
  ('Cricket', 'cricket', 10),
  ('Hockey', 'hockey', 11),
  ('Boxing', 'boxing', 12),
  ('Football', 'football', 13),
  ('Basketball', 'basketball', 14),
  ('Tennis', 'tennis', 15),
  ('Badminton', 'badminton', 16),
  ('Swimming', 'swimming', 17),
  ('Athletics', 'athletics', 18),
  ('Volleyball', 'volleyball', 19)
ON CONFLICT (slug) DO NOTHING;

-- Update existing generic categories positions to make room
UPDATE categories SET position = 4 WHERE slug = 'comedy';
UPDATE categories SET position = 5 WHERE slug = 'music';
UPDATE categories SET position = 6 WHERE slug = 'workshop';