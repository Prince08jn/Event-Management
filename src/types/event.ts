export interface Event {
  id: string;
  event_name: string;
  slug: string;
  landscape_poster: string;
  portrait_poster: string;
  date: string | null;
  time: string;
  duration: string;
  age_limit: string;
  event_type: string;
  language: string;
  category: string;
  venue: string;
  price: string;
  description: string;
  performers: string;
  creator_email: string;
  created_at: string;
  min_team_size?: number;
  max_team_size?: number;
  is_team_event?: boolean;
}

export interface Team {
  id: string;
  event_id: string;
  team_name: string;
  team_code: string;
  creator_email: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_email: string;
  joined_at: string;
}

export interface Booking {
  id: string;
  user_email: string;
  event_id: string;
  created_at: string;
  event: Event;
}