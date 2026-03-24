import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a singleton client instance to prevent recreation
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  }
});

// Fallback events used when Supabase is unreachable (e.g. project paused)
const FALLBACK_EVENTS = [
  // ── CAMPUS EVENTS ─────────────────────────────────────────────────────────
  {
    id: 'c1', event_name: 'Campus Hackathon 2025', slug: 'campus-hackathon-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=600&fit=crop',
    date: '2025-12-01', time: '09:00', duration: '24 hours', age_limit: 'U',
    event_type: 'campus_event', language: 'English', category: 'campus-event',
    venue: 'Computer Science Building, IIT Delhi', price: 'FREE',
    description: 'Join the biggest campus hackathon of the year! 24 hours of coding, innovation and prizes worth ₹1 lakh.',
    performers: 'Tech Community', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'c2', event_name: 'Mood Indigo 2025 — IIT Bombay Fest', slug: 'mood-indigo-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=600&fit=crop',
    date: '2025-12-22', time: '16:00', duration: '4 days', age_limit: 'U',
    event_type: 'campus_event', language: 'English', category: 'campus-event',
    venue: 'IIT Bombay, Powai, Mumbai', price: '₹399',
    description: "Asia's largest college cultural festival returns with bigger acts and unforgettable experiences.",
    performers: 'Nucleya, Prateek Kuhad, Ritviz', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'c3', event_name: 'Entrepreneurship Summit 2025', slug: 'entrepreneurship-summit-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=600&fit=crop',
    date: '2025-11-18', time: '10:00', duration: '8 hours', age_limit: 'U',
    event_type: 'campus_event', language: 'English', category: 'campus-event',
    venue: 'IIM Ahmedabad, Gujarat', price: 'FREE',
    description: 'Connect with top founders, VCs and innovators. Talks, workshops and networking sessions.',
    performers: 'Kunal Shah, Ghazal Alagh, Ritesh Agarwal', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'c4', event_name: 'Inter-IIT Sports Meet 2025', slug: 'inter-iit-sports-meet-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=600&fit=crop',
    date: '2025-12-05', time: '08:00', duration: '5 days', age_limit: 'U',
    event_type: 'campus_event', language: 'English', category: 'campus-event',
    venue: 'IIT Madras, Chennai', price: 'FREE',
    description: 'Annual sports championship among all IITs. Compete in 30+ sports disciplines.',
    performers: 'IIT Students Across India', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'c5', event_name: 'Code Warriors — Competitive Programming', slug: 'code-warriors-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=600&fit=crop',
    date: '2025-11-28', time: '10:00', duration: '6 hours', age_limit: 'U',
    event_type: 'campus_event', language: 'English', category: 'campus-event',
    venue: 'BITS Pilani, Rajasthan', price: 'FREE',
    description: 'Annual competitive programming contest. Win cash prizes up to ₹1 lakh.',
    performers: 'Competitive Programmers', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'c6', event_name: 'Udgaar 2025 — Youth Cultural Festival', slug: 'udgaar-2025-youth-cultural-festival',
    landscape_poster: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&h=600&fit=crop',
    date: '2025-12-20', time: '18:00', duration: '300 min', age_limit: 'U',
    event_type: 'campus_event', language: 'Hindi', category: 'campus-event',
    venue: 'Delhi University Campus, North Campus', price: '₹299',
    description: 'Join us for the biggest youth cultural festival of the year featuring music, dance and art.',
    performers: 'DJ Snake (Tribute), Arijit Singh Tribute', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'c7', event_name: 'Techfest — IIT Bombay Science Festival', slug: 'techfest-iit-bombay-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop',
    date: '2025-12-28', time: '09:00', duration: '3 days', age_limit: 'U',
    event_type: 'campus_event', language: 'English', category: 'campus-event',
    venue: 'IIT Bombay, Mumbai', price: '₹199',
    description: "Asia's largest science & technology festival. Robotics, AI, space tech and more.",
    performers: 'NASA Scientists, IIT Professors', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },

  // ── SPORTS EVENTS ─────────────────────────────────────────────────────────
  {
    id: 's1', event_name: 'East Bengal FC vs Real Kashmir FC', slug: 'east-bengal-fc-vs-real-kashmir-fc',
    landscape_poster: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=600&fit=crop',
    date: '2025-12-01', time: '19:30', duration: '90 min', age_limit: 'U',
    event_type: 'sports', language: 'English', category: 'Football',
    venue: 'Salt Lake Stadium, Kolkata', price: '₹599',
    description: 'Witness the thrilling I-League clash between two passionate fan bases.',
    performers: 'East Bengal FC, Real Kashmir FC', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 's2', event_name: 'IPL 2025 — MI vs CSK', slug: 'ipl-mi-vs-csk-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=600&fit=crop',
    date: '2025-04-15', time: '19:30', duration: '4 hours', age_limit: 'U',
    event_type: 'sports', language: 'English', category: 'Cricket',
    venue: 'Wankhede Stadium, Mumbai', price: '₹1499',
    description: "The El Clásico of Indian cricket — Mumbai Indians vs CSK. India's biggest rivalry.",
    performers: 'Rohit Sharma, MS Dhoni, Virat Kohli', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 's3', event_name: 'Pro Kabaddi — Patna Pirates vs UP Yoddhas', slug: 'pkl-patna-vs-up-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1563804447971-6e113ab80713?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1563804447971-6e113ab80713?w=400&h=600&fit=crop',
    date: '2025-11-25', time: '20:00', duration: '2 hours', age_limit: 'U',
    event_type: 'sports', language: 'Hindi', category: 'Kabaddi',
    venue: 'Patliputra Sports Complex, Patna', price: '₹299',
    description: 'Pro Kabaddi action at its finest. Witness the Raiders in full flow.',
    performers: 'Patna Pirates, UP Yoddhas', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 's4', event_name: 'ISL — ATK Mohun Bagan vs Bengaluru FC', slug: 'isl-atkmb-vs-bfc-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1522778034537-20a2486be803?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1522778034537-20a2486be803?w=400&h=600&fit=crop',
    date: '2025-12-10', time: '19:30', duration: '2 hours', age_limit: 'U',
    event_type: 'sports', language: 'English', category: 'Football',
    venue: 'VYBK Stadium, Kolkata', price: '₹499',
    description: "ISL's most attended match. The Mariners host Bengaluru FC in a top-of-the-table clash.",
    performers: 'ATKMB, Bengaluru FC', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 's5', event_name: 'BWF India Open Badminton 2025', slug: 'bwf-india-open-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=600&fit=crop',
    date: '2025-01-14', time: '10:00', duration: '5 days', age_limit: 'U',
    event_type: 'sports', language: 'English', category: 'Badminton',
    venue: 'K.D. Jadhav Indoor Hall, New Delhi', price: '₹799',
    description: "Super 750 tournament featuring world's best shuttlers including PV Sindhu and Viktor Axelsen.",
    performers: 'PV Sindhu, Viktor Axelsen, An Se-young', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 's6', event_name: 'Tata Open Maharashtra — ATP Tennis', slug: 'tata-open-maharashtra-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=600&fit=crop',
    date: '2025-01-30', time: '12:00', duration: '6 days', age_limit: 'U',
    event_type: 'sports', language: 'English', category: 'Tennis',
    venue: 'Balewadi Sports Complex, Pune', price: '₹999',
    description: "India's only ATP 250 tennis event. Top-ranked players battle it out on the hard court.",
    performers: 'Top ATP Ranked Players', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 's7', event_name: 'NBA India Games 2025', slug: 'nba-india-games-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=600&fit=crop',
    date: '2025-10-05', time: '19:00', duration: '2.5 hours', age_limit: 'U',
    event_type: 'sports', language: 'English', category: 'Basketball',
    venue: 'Dome @ NSCI, Mumbai', price: '₹2499',
    description: 'NBA comes to India! Pre-season exhibition games featuring top NBA stars live.',
    performers: 'Sacramento Kings vs Indiana Pacers', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },

  // ── MOVIES ────────────────────────────────────────────────────────────────
  {
    id: 'm1', event_name: 'GO GOA GONE 2', slug: 'go-goa-gone-2',
    landscape_poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
    date: '2025-11-20', time: '18:30', duration: '150 min', age_limit: 'U/A',
    event_type: 'movie', language: 'Hindi', category: 'Comedy',
    venue: 'PVR Cinemas, Select City Walk, Delhi', price: '₹199',
    description: 'The much-awaited sequel to the cult zombie comedy. More laughs, more zombies.',
    performers: 'Kunal Kemmu, Vir Das, Anand Tiwari', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'm2', event_name: 'Kantara: A Legend — Chapter 1', slug: 'kantara-a-legend-chapter-1',
    landscape_poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
    date: '2025-11-15', time: '20:00', duration: '150 min', age_limit: 'U/A',
    event_type: 'movie', language: 'Kannada', category: 'Drama',
    venue: 'INOX Megaplex, Saket, New Delhi', price: '₹149',
    description: 'Experience the epic mythological tale in Dolby Atmos for the full immersive experience.',
    performers: 'Rishab Shetty, Sapthami Gowda', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'm3', event_name: 'Stree 3', slug: 'stree-3-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
    date: '2025-08-15', time: '19:00', duration: '140 min', age_limit: 'U/A',
    event_type: 'movie', language: 'Hindi', category: 'Horror Comedy',
    venue: 'Cinepolis, DLF Promenade, Delhi', price: '₹249',
    description: "\"Woh aa gayi phir se.\" The third instalment of India's biggest horror comedy franchise.",
    performers: 'Rajkummar Rao, Shraddha Kapoor, Tamannaah Bhatia', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'm4', event_name: 'RRR 2 — Ranam Raaram Raaram', slug: 'rrr-2-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=600&fit=crop',
    date: '2025-12-25', time: '18:00', duration: '185 min', age_limit: 'U/A',
    event_type: 'movie', language: 'Telugu', category: 'Action',
    venue: 'IMAX, PVR Anupam, New Delhi', price: '₹350',
    description: 'SS Rajamouli returns with the most anticipated sequel in Indian cinema history.',
    performers: 'Ram Charan, Jr NTR', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'm5', event_name: 'Pushpa 3 — The Rulemaker', slug: 'pushpa-3-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
    date: '2025-04-10', time: '20:00', duration: '175 min', age_limit: 'U/A',
    event_type: 'movie', language: 'Telugu', category: 'Action',
    venue: 'Carnival Cinemas, Hyderabad', price: '₹299',
    description: 'Pushpa is back. And this time, he rules. The final chapter of the blockbuster trilogy.',
    performers: 'Allu Arjun, Rashmika Mandanna, Fahadh Faasil', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'm6', event_name: 'Dune: Part Three — Messiah', slug: 'dune-part-three-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=600&fit=crop',
    date: '2025-11-07', time: '21:00', duration: '165 min', age_limit: 'U/A',
    event_type: 'movie', language: 'English', category: 'Sci-Fi',
    venue: '4DX Theatre, PVR Juhu, Mumbai', price: '₹499',
    description: "The final chapter of Denis Villeneuve's Dune trilogy. The legend of Arrakis concludes.",
    performers: 'Timothée Chalamet, Zendaya, Austin Butler', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'm7', event_name: 'Jawan 2', slug: 'jawan-2-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=600&fit=crop',
    date: '2025-08-08', time: '19:30', duration: '160 min', age_limit: 'U/A',
    event_type: 'movie', language: 'Hindi', category: 'Action',
    venue: 'PVR ECX, New Delhi', price: '₹349',
    description: 'SRK reprises his dual role. Director Atlee is back with an even bigger canvas.',
    performers: 'Shah Rukh Khan, Nayanthara, Vijay Sethupathi', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },

  // ── GENERAL EVENTS ────────────────────────────────────────────────────────
  {
    id: 'e1', event_name: 'Travis Scott — Circus Maximus Tour Delhi', slug: 'travis-scott-circus-maximus-tour-delhi',
    landscape_poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop',
    date: '2025-12-15', time: '19:00', duration: '120 min', age_limit: 'PG13',
    event_type: 'event', language: 'English', category: 'Music',
    venue: 'Jawaharlal Nehru Stadium, New Delhi', price: '₹2999',
    description: 'Experience the electrifying performance of Travis Scott live in Delhi for the first time.',
    performers: 'Travis Scott', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'e2', event_name: 'Karan Aujla — Making Memories India Tour', slug: 'karan-aujla-india-tour',
    landscape_poster: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=600&fit=crop',
    date: '2025-12-10', time: '19:30', duration: '120 min', age_limit: 'PG13',
    event_type: 'event', language: 'Punjabi', category: 'Music',
    venue: 'Thyagaraj Stadium, New Delhi', price: '₹1999',
    description: "Don't miss Karan Aujla live in concert on the Making Memories Tour 2025.",
    performers: 'Karan Aujla', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'e3', event_name: 'Zero to One — Entrepreneurship Workshop', slug: 'zero-to-one-workshop',
    landscape_poster: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=600&fit=crop',
    date: '2025-10-25', time: '10:00', duration: '8 hours', age_limit: 'U',
    event_type: 'event', language: 'English', category: 'Workshop',
    venue: 'IIT Delhi, Hauz Khas, New Delhi', price: 'FREE',
    description: 'A comprehensive workshop on entrepreneurship. Learn from those who built billion-dollar companies.',
    performers: 'Top Startup Founders & VCs', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'e4', event_name: 'iHGF Delhi Fair — Autumn 2025', slug: 'ihgf-delhi-fair-autumn-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop',
    date: '2025-11-10', time: '10:00', duration: '5 days', age_limit: 'U',
    event_type: 'event', language: 'English', category: 'Exhibition',
    venue: 'India Expo Centre, Greater Noida', price: 'FREE',
    description: "The world's largest handicrafts fair. 3000+ exhibitors from 100+ countries.",
    performers: 'Global Artisans & Craft Masters', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'e5', event_name: 'Coldplay India 2025', slug: 'Coldplay-india-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=600&fit=crop',
    date: '2025-01-31', time: '14:00', duration: '2 days', age_limit: 'PG13',
    event_type: 'event', language: 'English', category: 'Music Festival',
    venue: 'Mahalaxmi Race Course, Mumbai', price: '₹4999',
    description: "India's premier multi-genre music festival returns. 40+ acts across 5 stages.",
    performers: 'Imagine Dragons, Anuv Jain, Prateek Kuhad', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'e6', event_name: 'Zakir Khan — Haq Se Single Tour', slug: 'zakir-khan-standup-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=600&fit=crop',
    date: '2025-11-30', time: '20:00', duration: '90 min', age_limit: 'U/A',
    event_type: 'event', language: 'Hindi', category: 'Stand-up Comedy',
    venue: 'Siri Fort Auditorium, New Delhi', price: '₹799',
    description: "The biggest stand-up comedian in India is back with brand new material.",
    performers: 'Zakir Khan', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
  {
    id: 'e7', event_name: 'AI & Future of Work Summit 2025', slug: 'ai-future-work-summit-2025',
    landscape_poster: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=450&fit=crop',
    portrait_poster: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=600&fit=crop',
    date: '2025-11-05', time: '09:00', duration: '8 hours', age_limit: 'U',
    event_type: 'event', language: 'English', category: 'Conference',
    venue: 'Hyatt Regency, Mumbai', price: '₹2499',
    description: "India's top AI conference. Keynotes, workshops and networking with 50+ AI leaders.",
    performers: 'Sundar Pichai (Virtual), Nat Friedman, AI Researchers', creator_email: 'admin@rkade.com', created_at: new Date().toISOString(),
  },
];




// Helper: check if error means Supabase is unreachable
function isNetworkError(error: unknown): boolean {
  if (!error) return false;
  if (typeof error === 'object' && Object.keys(error).length === 0) return true; // empty {}
  const msg = (error as { message?: string })?.message || '';
  return msg.includes('fetch') || msg.includes('network') || msg.includes('Failed');
}

// Client-side function to fetch events
export async function getEventsClient() {
  try {
    const { data, error } = await supabaseClient
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('Error fetching all events:', error);
      return FALLBACK_EVENTS;
    }

    if (!data || data.length === 0) {
      return FALLBACK_EVENTS;
    }

    return data;
  } catch (err) {
    console.error('Network error fetching all events:', err);
    return FALLBACK_EVENTS;
  }
}

// Client-side function to fetch events by category
export async function getEventsByCategoryClient(category: string) {
  try {
    const { data, error } = await supabaseClient
      .from('events')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching events by category:', error);
      // Fall back to matching fallback events
      return FALLBACK_EVENTS.filter(e => e.category === category);
    }

    if (!data || data.length === 0) {
      return FALLBACK_EVENTS.filter(e => e.category === category);
    }

    return data;
  } catch (err) {
    console.error('Network error fetching events by category:', err);
    return FALLBACK_EVENTS.filter(e => e.category === category);
  }
}

// Client-side function to fetch events by event type
export async function getEventsByTypeClient(eventType: string) {
  const { data, error } = await supabaseClient
    .from('events')
    .select('*')
    .eq('event_type', eventType)
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) {
    console.error('Error fetching events by type:', error);
    return FALLBACK_EVENTS.filter(e => e.event_type === eventType);
  }

  if (!data || data.length === 0) {
    // DB is reachable but no events of this type yet — show fallback for that type
    return FALLBACK_EVENTS.filter(e => e.event_type === eventType);
  }

  return data;
}

// Add type definition near the top of the file
type FeaturedEvent = {
  id: string;
  event_name: string;
  category?: string;
  event_type?: string;
  time?: string;
  date?: string;
  venue?: string;
  language?: string;
  age_limit?: string;
  portrait_poster?: string;
  landscape_poster?: string;
}

// Client-side function to fetch featured events
export async function getFeaturedEventsClient(limit: number = 3): Promise<FeaturedEvent[]> {
  try {
    const { data, error } = await supabaseClient
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured events:', error);
      return FALLBACK_EVENTS.slice(0, limit) as unknown as FeaturedEvent[];
    }

    if (!data || data.length === 0) {
      return FALLBACK_EVENTS.slice(0, limit) as unknown as FeaturedEvent[];
    }

    return data;
  } catch (err) {
    console.error('Network error fetching featured events:', err);
    return FALLBACK_EVENTS.slice(0, limit) as unknown as FeaturedEvent[];
  }
}

// Add database event type definition
type DatabaseEvent = {
  id: string;
  event_name: string;
  category?: string;
  event_type?: string;
  price?: string;
  portrait_poster?: string;
  landscape_poster?: string;
  slug?: string;
  date?: string | null;
  time?: string;
  duration?: string;
  language?: string;
  venue?: string;
  description?: string;
  performers?: string;
  age_limit?: string;
  created_at?: string;
}

// Helper function to validate image URLs
function validateImageUrl(url: string | null | undefined): string {
  if (!url) return '/placeholder.svg';

  // Check for invalid file system paths
  if (url.includes('/mnt/') || url.includes('C:\\') || url.includes('D:\\') || url.includes('file://')) {
    return '/placeholder.svg';
  }

  // Check if it's a valid web URL or relative path
  if (url.startsWith('http') || url.startsWith('/') || url.startsWith('./')) {
    return url;
  }

  // If it doesn't look like a valid URL, use fallback
  return '/placeholder.svg';
}

// Transform database event to frontend event format
export function transformEventToFrontend(dbEvent: DatabaseEvent) {
  const portraitImage = validateImageUrl(dbEvent.portrait_poster);
  const landscapeImage = validateImageUrl(dbEvent.landscape_poster);

  return {
    id: dbEvent.id,
    category: dbEvent.category || dbEvent.event_type || 'Event',
    name: dbEvent.event_name,
    price: dbEvent.price || 'FREE',
    img: portraitImage !== '/placeholder.svg' ? portraitImage : landscapeImage,
    href: `/events/${dbEvent.slug}`,
    slug: dbEvent.slug,
    date: dbEvent.date || undefined, // Convert null to undefined
    time: dbEvent.time,
    duration: dbEvent.duration,
    language: dbEvent.language || 'English', // Provide default value
    venue: dbEvent.venue,
    description: dbEvent.description,
    performers: dbEvent.performers,
    ageLimit: dbEvent.age_limit || 'All', // Provide default value
    eventType: dbEvent.event_type || 'events' // Provide default value
  };
}

// Example function with unknown parameter type
export function someFunction() {
  // Function implementation
}
