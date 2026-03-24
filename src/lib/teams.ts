import { createClient } from '@supabase/supabase-js';
import { Team, TeamMember } from '@/types/event';

// Server-only: initialize admin client here to avoid bundling in the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export interface CreateTeamInput {
  eventId: string;
  teamName: string;
  creatorEmail: string;
}

export interface TeamWithMembers extends Team {
  members: TeamMember[];
}

// Create a new team
export async function createTeam(input: CreateTeamInput): Promise<Team> {
  const { data, error } = await supabaseAdmin
    .from('teams')
    .insert([
      {
        event_id: input.eventId,
        team_name: input.teamName,
        creator_email: input.creatorEmail,
      },
    ])
    .select()
    .single();
    
  if (error) throw error;
  
  // Automatically add the creator as a team member
  await supabaseAdmin
    .from('team_members')
    .insert([
      {
        team_id: data.id,
        user_email: input.creatorEmail,
      },
    ]);
    
  return data;
}

// Join a team using team code
export async function joinTeamByCode(teamCode: string, userEmail: string): Promise<void> {
  // First, get the team by code
  const { data: team, error: teamError } = await supabaseAdmin
    .from('teams')
    .select('*')
    .eq('team_code', teamCode.toUpperCase())
    .single();
    
  if (teamError || !team) {
    throw new Error('Invalid team code');
  }
  
  // Check if the user is already a member
  const { data: existingMember } = await supabaseAdmin
    .from('team_members')
    .select('id')
    .eq('team_id', team.id)
    .eq('user_email', userEmail)
    .single();
    
  if (existingMember) {
    throw new Error('You are already a member of this team');
  }
  
  // Check current team size against max team size
  const { data: event } = await supabaseAdmin
    .from('events')
    .select('max_team_size')
    .eq('id', team.event_id)
    .single();
    
  const { count } = await supabaseAdmin
    .from('team_members')
    .select('*', { count: 'exact' })
    .eq('team_id', team.id);
    
  if (event && count !== null && count >= (event.max_team_size || 10)) {
    throw new Error('Team is full');
  }
  
  // Add the user to the team
  const { error } = await supabaseAdmin
    .from('team_members')
    .insert([
      {
        team_id: team.id,
        user_email: userEmail,
      },
    ]);
    
  if (error) throw error;
}

// Get teams for an event
export async function getTeamsForEvent(eventId: string): Promise<TeamWithMembers[]> {
  const { data: teams, error: teamsError } = await supabaseAdmin
    .from('teams')
    .select('*')
    .eq('event_id', eventId);
    
  if (teamsError) throw teamsError;
  
  if (!teams || teams.length === 0) return [];
  
  // Get all team members for these teams
  const teamIds = teams.map(team => team.id);
  const { data: members, error: membersError } = await supabaseAdmin
    .from('team_members')
    .select('*')
    .in('team_id', teamIds);
    
  if (membersError) throw membersError;
  
  // Combine teams with their members
  return teams.map(team => ({
    ...team,
    members: members?.filter(member => member.team_id === team.id) || [],
  }));
}

// Get user's team for a specific event
export async function getUserTeamForEvent(eventId: string, userEmail: string): Promise<TeamWithMembers | null> {
  // Get the user's team membership for this event
  const { data: membership, error: membershipError } = await supabaseAdmin
    .from('team_members')
    .select('team_id')
    .eq('user_email', userEmail);
    
  if (membershipError || !membership || membership.length === 0) return null;
  
  // Find the team for this specific event
  const teamIds = membership.map(m => m.team_id);
  const { data: team, error: teamError } = await supabaseAdmin
    .from('teams')
    .select('*')
    .in('id', teamIds)
    .eq('event_id', eventId)
    .single();
    
  if (teamError || !team) return null;
  
  // Get all members of this team
  const { data: allMembers, error: membersError } = await supabaseAdmin
    .from('team_members')
    .select('*')
    .eq('team_id', team.id);
    
  if (membersError) throw membersError;
  
  return {
    ...team,
    members: allMembers || [],
  };
}

// Leave a team
export async function leaveTeam(teamId: string, userEmail: string): Promise<void> {
  // Check if user is the team creator
  const { data: team, error: teamError } = await supabaseAdmin
    .from('teams')
    .select('creator_email')
    .eq('id', teamId)
    .single();
    
  if (teamError) throw teamError;
  
  if (team?.creator_email === userEmail) {
    throw new Error('Team creators cannot leave their team. You can delete the team instead.');
  }
  
  const { error } = await supabaseAdmin
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('user_email', userEmail);
    
  if (error) throw error;
}

// Delete a team (only creator can do this)
export async function deleteTeam(teamId: string, userEmail: string): Promise<void> {
  // Verify the user is the team creator
  const { data: team, error: teamError } = await supabaseAdmin
    .from('teams')
    .select('creator_email')
    .eq('id', teamId)
    .single();
    
  if (teamError) throw teamError;
  
  if (team?.creator_email !== userEmail) {
    throw new Error('Only team creators can delete their team');
  }
  
  // Delete the team (cascade will handle team_members)
  const { error } = await supabaseAdmin
    .from('teams')
    .delete()
    .eq('id', teamId);
    
  if (error) throw error;
}