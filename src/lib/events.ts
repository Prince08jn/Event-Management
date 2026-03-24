export type EventRecord = { id: string; category: string; name: string; price?: string; img?: string };

export const baseEvents: EventRecord[] = [
  // Campus
  { id: 'c1', category: 'Campus', name: 'Campus Hackathon 2025', price: 'FREE', img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=600&fit=crop' },
  { id: 'c2', category: 'Campus', name: 'Mood Indigo 2025', price: '₹399', img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=600&fit=crop' },
  { id: 'c3', category: 'Campus', name: 'Entrepreneurship Summit 2025', price: 'FREE', img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=600&fit=crop' },
  { id: 'c7', category: 'Campus', name: 'Techfest — IIT Bombay', price: '₹199', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop' },
  // Sports
  { id: 's1', category: 'Sports', name: 'East Bengal FC vs Real Kashmir FC', price: '₹599', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=600&fit=crop' },
  { id: 's2', category: 'Sports', name: 'IPL 2025 — MI vs CSK', price: '₹1499', img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=600&fit=crop' },
  { id: 's5', category: 'Sports', name: 'BWF India Open Badminton 2025', price: '₹799', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=600&fit=crop' },
  { id: 's7', category: 'Sports', name: 'NBA India Games 2025', price: '₹2499', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=600&fit=crop' },
  // Movies
  { id: 'm1', category: 'Movies', name: 'GO GOA GONE 2', price: '₹199', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop' },
  { id: 'm2', category: 'Movies', name: 'Kantara: A Legend — Chapter 1', price: '₹149', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop' },
  { id: 'm4', category: 'Movies', name: 'RRR 2 — Ranam Raaram Raaram', price: '₹350', img: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=600&fit=crop' },
  { id: 'm7', category: 'Movies', name: 'Jawan 2', price: '₹349', img: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=600&fit=crop' },
  // General Events
  { id: 'e1', category: 'Events', name: 'Travis Scott — Circus Maximus Tour Delhi', price: '₹2999', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop' },
  { id: 'e2', category: 'Events', name: 'Karan Aujla — Making Memories India Tour', price: '₹1999', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=600&fit=crop' },
  { id: 'e5', category: 'Events', name: 'Coldplay India 2025', price: '₹4999', img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=600&fit=crop' },
  { id: 'e6', category: 'Events', name: 'Zakir Khan — Haq Se Single Tour', price: '₹799', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=600&fit=crop' },
];

export function getEventById(id?: string) {
  if (!id) return undefined;
  return baseEvents.find((e) => e.id === id);
}
