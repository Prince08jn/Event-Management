-- Add team-related columns to events table
DO $$ 
BEGIN
    -- Add is_team_event column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'is_team_event'
    ) THEN
        ALTER TABLE events ADD COLUMN is_team_event BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add min_team_size column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'min_team_size'
    ) THEN
        ALTER TABLE events ADD COLUMN min_team_size INTEGER DEFAULT 1;
    END IF;
    
    -- Add max_team_size column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'max_team_size'
    ) THEN
        ALTER TABLE events ADD COLUMN max_team_size INTEGER DEFAULT 1;
    END IF;
END $$;

-- Add Campus Event to event_types table (skip if already exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM event_types WHERE name = 'Campus Event') THEN
        INSERT INTO event_types (name, slug, position, is_active)
        VALUES ('Campus Event', 'campus-event', 4, true);
    END IF;
END $$;