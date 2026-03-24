-- Add team-related columns to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS min_team_size INTEGER DEFAULT 1;
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_team_size INTEGER DEFAULT 1;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_team_event BOOLEAN DEFAULT FALSE;

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  team_name TEXT NOT NULL,
  team_code TEXT UNIQUE NOT NULL,
  creator_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_teams_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_team_members_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  UNIQUE(team_id, user_email)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_teams_event_id ON teams(event_id);
CREATE INDEX IF NOT EXISTS idx_teams_team_code ON teams(team_code);
CREATE INDEX IF NOT EXISTS idx_teams_creator_email ON teams(creator_email);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_email ON team_members(user_email);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Teams policies
CREATE POLICY "Users can view teams for events they have access to" ON teams 
  FOR SELECT USING (
    auth.role() = 'authenticated' AND (
      -- Users can see teams they created
      creator_email = auth.email() OR 
      -- Users can see teams they are members of
      EXISTS (
        SELECT 1 FROM team_members tm 
        WHERE tm.team_id = teams.id AND tm.user_email = auth.email()
      ) OR
      -- Users can see teams for events that are public (campus events)
      EXISTS (
        SELECT 1 FROM events e 
        WHERE e.id = teams.event_id AND e.event_type = 'campus_event' AND e.is_team_event = true
      )
    )
  );
CREATE POLICY "Authenticated users can create teams" ON teams 
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    creator_email = auth.email() AND
    EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = event_id AND e.is_team_event = true
    )
  );
CREATE POLICY "Team creators can update their teams" ON teams
  FOR UPDATE USING (creator_email = auth.email());
CREATE POLICY "Team creators can delete their teams" ON teams
  FOR DELETE USING (creator_email = auth.email());

-- Team members policies
CREATE POLICY "Users can view team members for accessible teams" ON team_members 
  FOR SELECT USING (
    auth.role() = 'authenticated' AND (
      -- Users can see members of teams they belong to
      user_email = auth.email() OR
      -- Users can see members of teams they created
      EXISTS (
        SELECT 1 FROM teams t 
        WHERE t.id = team_members.team_id AND t.creator_email = auth.email()
      ) OR
      -- Users can see members of teams for public campus events
      EXISTS (
        SELECT 1 FROM teams t 
        JOIN events e ON e.id = t.event_id
        WHERE t.id = team_members.team_id 
        AND e.event_type = 'campus_event' 
        AND e.is_team_event = true
      )
    )
  );
CREATE POLICY "Authenticated users can join teams" ON team_members 
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    user_email = auth.email() AND
    EXISTS (
      SELECT 1 FROM teams t 
      JOIN events e ON e.id = t.event_id
      WHERE t.id = team_id AND e.is_team_event = true
    )
  );
CREATE POLICY "Users can leave teams" ON team_members
  FOR DELETE USING (user_email = auth.email());

-- Add triggers for updated_at
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate 6-digit alphanumeric team code
CREATE OR REPLACE FUNCTION generate_team_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
  code_exists BOOLEAN;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..6 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    SELECT EXISTS(SELECT 1 FROM teams WHERE team_code = result) INTO code_exists;
    
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate team codes
CREATE OR REPLACE FUNCTION set_team_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.team_code IS NULL OR NEW.team_code = '' THEN
    NEW.team_code := generate_team_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER teams_set_code
  BEFORE INSERT ON teams
  FOR EACH ROW
  EXECUTE FUNCTION set_team_code();