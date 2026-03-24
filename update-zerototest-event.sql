-- Update the zerototest event to be a campus team event
UPDATE events 
SET 
    event_type = 'campus_event',
    is_team_event = true,
    min_team_size = 2,
    max_team_size = 5
WHERE slug = 'zerototest';