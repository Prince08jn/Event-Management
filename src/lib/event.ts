import { createClient } from '@supabase/supabase-js';

// Server-only: initialize admin client here to avoid bundling in the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export interface CreateEventInput {
  eventName: string;
  landscapePoster: string;
  portraitPoster: string;
  slug?: string;
  date?: string;
  time: string;
  duration: string;
  ageLimit: string;
  language: string;
  category: string;
  eventType: string;
  venue: string;
  price: string;
  description: string;
  performers: string;
  creatorEmail: string;
  minTeamSize?: number;
  maxTeamSize?: number;
  isTeamEvent?: boolean;
}

export async function createEvent(event: CreateEventInput) {
  const { data, error } = await supabaseAdmin
    .from('events')
    .insert([
      {
        event_name: event.eventName,
        slug: event.slug ?? event.eventName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-'),
        landscape_poster: event.landscapePoster,
        portrait_poster: event.portraitPoster,
        date: event.date && event.date.trim() !== '' ? event.date : null,
        time: event.time,
        duration: event.duration,
        age_limit: event.ageLimit,
        event_type: event.eventType,
        language: event.language,
        category: event.category,
        venue: event.venue,
        price: event.price,
        description: event.description,
        performers: event.performers,
        creator_email: event.creatorEmail,
        min_team_size: event.isTeamEvent ? (event.minTeamSize || 1) : 1,
        max_team_size: event.isTeamEvent ? (event.maxTeamSize || 10) : 1,
        is_team_event: event.isTeamEvent || false,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getEventBySlug(slug?: string) {
  if (!slug) return null;
  const normalized = slug.toString().toLowerCase();
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('slug', normalized)
    .limit(1)
    .single();
  if (error) {
    // Return null on not found or other error; caller can decide how to handle
    return null;
  }
  return data;
}

// Client-side function to fetch events
export async function getEvents() {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  
  return data || [];
}

// Client-side function to fetch events by category
export async function getEventsByCategory(category: string) {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching events by category:', error);
    return [];
  }
  
  return data || [];
}

// Client-side function to fetch events by event type
export async function getEventsByType(eventType: string) {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('event_type', eventType)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching events by type:', error);
    return [];
  }
  
  return data || [];
}

// Client-side function to fetch featured events
export async function getFeaturedEvents(limit: number = 3) {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching featured events:', error);
    return [];
  }
  
  return data || [];
}