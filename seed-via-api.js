/**
 * Simple seed script using the app's API endpoints
 * Run this after starting your Next.js development server
 */

const BASE_URL = 'http://localhost:3000';

const sampleTeamEvents = [
  {
    eventName: 'Campus Hackathon 2025',
    landscapePoster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400',
    portraitPoster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=600',
    date: '2025-12-01',
    time: '09:00',
    duration: '24 hours',
    ageLimit: 'U',
    language: 'English',
    category: 'campus-event',
    eventType: 'event',
    venue: 'Computer Science Building, Room 101',
    price: 'Free',
    description: 'Join the biggest campus hackathon of the year! Build innovative solutions to real-world problems with your team. Prizes worth ₹50,000 to be won. Form teams of 2-5 members and compete with the best minds on campus.',
    performers: 'Tech Community, Campus Innovation Club',
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 5
  },
  {
    eventName: 'Inter-College Cricket Tournament',
    landscapePoster: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=400',
    portraitPoster: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=600',
    date: '2025-11-30',
    time: '07:00',
    duration: '8 hours',
    ageLimit: 'U',
    language: 'English',
    category: 'campus-event',
    eventType: 'sports',
    venue: 'Main Cricket Ground, Sports Complex',
    price: '₹100',
    description: 'Annual inter-college cricket tournament. Assemble your team of 11 players and compete for the championship trophy. Registration includes team jersey and refreshments.',
    performers: 'Sports Committee, Athletic Department',
    isTeamEvent: true,
    minTeamSize: 11,
    maxTeamSize: 15
  },
  {
    eventName: 'Campus Coding Competition',
    landscapePoster: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400',
    portraitPoster: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=600',
    date: '2025-12-05',
    time: '14:00',
    duration: '4 hours',
    ageLimit: 'U',
    language: 'English',
    category: 'campus-event',
    eventType: 'event',
    venue: 'Engineering Building, Lab 2',
    price: '₹50',
    description: 'Test your programming skills in this competitive coding event. Teams of 2-3 members will solve algorithmic challenges. Prizes for top 3 teams and individual performers.',
    performers: 'Computer Science Department',
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 3
  }
];

async function seedEventsViaAPI() {
  console.log('🌱 Seeding events via API...');
  
  for (const event of sampleTeamEvents) {
    try {
      console.log(`📝 Creating: ${event.eventName}`);
      
      const response = await fetch(`${BASE_URL}/api/events/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Created: ${event.eventName} (ID: ${result.event?.id})`);
      } else {
        const error = await response.json();
        console.error(`❌ Failed to create ${event.eventName}:`, error);
      }
    } catch (error) {
      console.error(`❌ Error creating ${event.eventName}:`, error);
    }
  }
  
  console.log('\n🎉 Seeding complete!');
  console.log('Visit your app to see the new team events.');
}

// Only run if this script is executed directly
if (typeof window === 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  seedEventsViaAPI();
}

export { seedEventsViaAPI, sampleTeamEvents };