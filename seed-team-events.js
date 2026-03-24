/**
 * Seed script for team events
 * Run with: node seed-team-events.js
 * 
 * Make sure to set your environment variables:
 * NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
 * SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
 */

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedTeamEvents() {
  console.log('🌱 Starting to seed team events...');

  try {
    // 1. First, add team functionality columns if they don't exist
    console.log('📝 Ensuring team functionality columns exist...');
    
    // Note: Column addition should be done via migration, this is for fallback
    // You may need to run this manually in your Supabase SQL editor:
    /*
    ALTER TABLE events ADD COLUMN IF NOT EXISTS is_team_event BOOLEAN DEFAULT FALSE;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS min_team_size INTEGER DEFAULT 1;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS max_team_size INTEGER DEFAULT 1;
    */

    // 2. Insert sample campus team events
    console.log('🎯 Inserting sample team events...');
    
    const teamEvents = [
      {
        event_name: 'Campus Hackathon 2025',
        slug: 'campus-hackathon-2025',
        landscape_poster: '/hackathon-landscape.jpg',
        portrait_poster: '/hackathon-portrait.jpg',
        date: '2025-12-01',
        time: '09:00',
        duration: '24 hours',
        age_limit: 'U',
        event_type: 'event',
        language: 'English',
        category: 'campus-event',
        venue: 'Computer Science Building, Room 101',
        price: 'Free',
        description: 'Join the biggest campus hackathon of the year! Build innovative solutions to real-world problems with your team. Prizes worth ₹50,000 to be won. Form teams of 2-5 members and compete with the best minds on campus.',
        performers: 'Tech Community, Campus Innovation Club',
        creator_email: 'admin@campus.edu',
        is_team_event: true,
        min_team_size: 2,
        max_team_size: 5
      },
      {
        event_name: 'Inter-College Cricket Tournament',
        slug: 'inter-college-cricket-tournament',
        landscape_poster: '/cricket-landscape.jpg',
        portrait_poster: '/cricket-portrait.jpg',
        date: '2025-11-30',
        time: '07:00',
        duration: '8 hours',
        age_limit: 'U',
        event_type: 'sports',
        language: 'English',
        category: 'campus-event',
        venue: 'Main Cricket Ground, Sports Complex',
        price: '₹100',
        description: 'Annual inter-college cricket tournament. Assemble your team of 11 players and compete for the championship trophy. Registration includes team jersey and refreshments.',
        performers: 'Sports Committee, Athletic Department',
        creator_email: 'sports@campus.edu',
        is_team_event: true,
        min_team_size: 11,
        max_team_size: 15
      },
      {
        event_name: 'Campus Coding Competition',
        slug: 'campus-coding-competition',
        landscape_poster: '/coding-landscape.jpg',
        portrait_poster: '/coding-portrait.jpg',
        date: '2025-12-05',
        time: '14:00',
        duration: '4 hours',
        age_limit: 'U',
        event_type: 'event',
        language: 'English',
        category: 'campus-event',
        venue: 'Engineering Building, Lab 2',
        price: '₹50',
        description: 'Test your programming skills in this competitive coding event. Teams of 2-3 members will solve algorithmic challenges. Prizes for top 3 teams and individual performers.',
        performers: 'Computer Science Department',
        creator_email: 'cs@campus.edu',
        is_team_event: true,
        min_team_size: 2,
        max_team_size: 3
      }
    ];

    const { data: events, error: eventsError } = await supabase
      .from('events')
      .insert(teamEvents)
      .select();

    if (eventsError) {
      console.error('Error inserting events:', eventsError);
      return;
    }

    console.log(`✅ Inserted ${events.length} team events`);

    // 3. Insert sample users
    console.log('👥 Inserting sample users...');
    
    const sampleUsers = [
      { email: 'student1@campus.edu', first_name: 'John', last_name: 'Doe' },
      { email: 'student2@campus.edu', first_name: 'Jane', last_name: 'Smith' },
      { email: 'student3@campus.edu', first_name: 'Mike', last_name: 'Johnson' },
      { email: 'alice.smith@campus.edu', first_name: 'Alice', last_name: 'Smith' },
      { email: 'bob.jones@campus.edu', first_name: 'Bob', last_name: 'Jones' },
      { email: 'admin@campus.edu', first_name: 'Admin', last_name: 'User' },
      { email: 'sports@campus.edu', first_name: 'Sports', last_name: 'Coordinator' },
      { email: 'cs@campus.edu', first_name: 'CS', last_name: 'Department' }
    ].map(user => ({
      ...user,
      password: '$2a$12$example.hash.for.demo', // Note: Use proper password hashing in production
      country_code: '+1',
      phone_number: `555-010${Math.floor(Math.random() * 9)}`,
      country: 'USA',
      current_city: 'Campus City'
    }));

    // Insert users (ignore conflicts for existing emails)
    for (const user of sampleUsers) {
      const { error } = await supabase
        .from('users')
        .upsert(user, { onConflict: 'email' });
      
      if (error && !error.message.includes('duplicate')) {
        console.error('Error inserting user:', error);
      }
    }

    console.log('✅ Inserted sample users');

    // 4. Insert sample teams for the hackathon
    console.log('🏆 Creating sample teams...');
    
    const hackathonEvent = events.find(e => e.slug === 'campus-hackathon-2025');
    
    if (hackathonEvent) {
      const sampleTeams = [
        {
          event_id: hackathonEvent.id,
          team_name: 'Code Warriors',
          team_code: 'CW2024',
          creator_email: 'student1@campus.edu'
        },
        {
          event_id: hackathonEvent.id,
          team_name: 'Tech Innovators',
          team_code: 'TI2024',
          creator_email: 'student2@campus.edu'
        },
        {
          event_id: hackathonEvent.id,
          team_name: 'Binary Builders',
          team_code: 'BB2024',
          creator_email: 'student3@campus.edu'
        }
      ];

      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .insert(sampleTeams)
        .select();

      if (teamsError) {
        console.error('Error inserting teams:', teamsError);
        return;
      }

      console.log(`✅ Created ${teams.length} sample teams`);

      // 5. Add team members
      console.log('👨‍👩‍👧‍👦 Adding team members...');
      
      const teamMembers = [];
      
      // Code Warriors team
      const codeWarriors = teams.find(t => t.team_code === 'CW2024');
      if (codeWarriors) {
        teamMembers.push(
          { team_id: codeWarriors.id, user_email: 'student1@campus.edu' },
          { team_id: codeWarriors.id, user_email: 'alice.smith@campus.edu' },
          { team_id: codeWarriors.id, user_email: 'bob.jones@campus.edu' }
        );
      }
      
      // Tech Innovators team
      const techInnovators = teams.find(t => t.team_code === 'TI2024');
      if (techInnovators) {
        teamMembers.push(
          { team_id: techInnovators.id, user_email: 'student2@campus.edu' },
          { team_id: techInnovators.id, user_email: 'alice.smith@campus.edu' }
        );
      }
      
      // Binary Builders team
      const binaryBuilders = teams.find(t => t.team_code === 'BB2024');
      if (binaryBuilders) {
        teamMembers.push(
          { team_id: binaryBuilders.id, user_email: 'student3@campus.edu' }
        );
      }

      const { error: membersError } = await supabase
        .from('team_members')
        .insert(teamMembers);

      if (membersError) {
        console.error('Error inserting team members:', membersError);
        return;
      }

      console.log(`✅ Added ${teamMembers.length} team memberships`);
    }

    console.log('\n🎉 Team events seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • ${events.length} team events created`);
    console.log(`   • ${sampleUsers.length} sample users added`);
    console.log(`   • 3 sample teams created for hackathon`);
    console.log(`   • Team codes: CW2024, TI2024, BB2024`);
    console.log('\n🌐 You can now visit your app and see the team functionality in action!');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

// Run the seed function
seedTeamEvents();