-- Add Campus Event to event types
INSERT INTO event_types (name, slug, position)
VALUES ('Campus Event', 'campus-event', 4)
ON CONFLICT (slug) DO NOTHING;