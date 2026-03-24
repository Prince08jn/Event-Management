"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from "next/image";
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import Navbar from '@/components/home/navbar';
import DesktopNavbar from '@/components/home/desktop-navbar';
import BottomNav from '@/components/home/bottom-nav';
import { useDesktop } from '@/hooks/useDesktop';

const inter = Inter({ subsets: ['latin'] });

type EventRow = {
  id: string;
  slug: string;
  event_name: string;
  landscape_poster: string | null;
  portrait_poster: string | null;
  date: string | null;
  date_from: string | null;
  date_to: string | null;
  time: string | null;
  duration: string | null;
  age_limit: string | null;
  language: string | null;
  category: string | null;
  event_type?: string | null;
  venue: string | null;
  price: string | null;
  description: string | null;
  performers: string | null;
  created_at?: string;
};

type Option = { id: string; name?: string; slug: string; code?: string };

export default function EventsIndexPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isDesktop = useDesktop();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [eventType, setEventType] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [age, setAge] = useState('');
  const [dateOnly, setDateOnly] = useState('');
  const [sort, setSort] = useState<'soonest' | 'latest' | 'newest' | 'price_low_high' | 'price_high_low'>('soonest');

  // Master data
  const [eventTypes, setEventTypes] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [languages, setLanguages] = useState<Option[]>([]);
  const [ageRatings, setAgeRatings] = useState<Option[]>([]);

  // Auth guard
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/auth/signin');
  }, [session, status, router]);

  // Load master data once
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    async function loadMaster() {
      try {
        const [et, cat, lang, ageR] = await Promise.all([
          supabase.from('event_types').select('id,name,slug').eq('is_active', true).order('position', { ascending: true }),
          supabase.from('categories').select('id,name,slug').eq('is_active', true).order('position', { ascending: true }),
          supabase.from('languages').select('id,name,slug').eq('is_active', true).order('position', { ascending: true }),
          supabase.from('age_ratings').select('id,code,name,slug').eq('is_active', true).order('position', { ascending: true }),
        ]);
        if (!cancelled) {
          if (et.error) throw et.error; if (cat.error) throw cat.error; if (lang.error) throw lang.error; if (ageR.error) throw ageR.error;
          setEventTypes(et.data || []);
          setCategories(cat.data || []);
          setLanguages(lang.data || []);
          setAgeRatings(ageR.data || []);
        }
      } catch (error: unknown) {
        if (!cancelled) setError(error instanceof Error ? error.message : 'Failed to load filters');
      }
    }
    loadMaster();
    return () => { cancelled = true; };
  }, [session]);

  // Build and run query whenever filters/sort change
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    async function loadEvents() {
      setLoading(true);
      setError(null);
      try {
        let query = supabase.from('events').select('*').limit(1000);
        if (search.trim()) query = query.ilike('event_name', `%${search.trim()}%`);
        if (eventType) query = query.eq('event_type', eventType);
        if (category) query = query.eq('category', category);
        if (language) query = query.eq('language', language);
        if (age) query = query.eq('age_limit', age);
        if (dateOnly) {
          query = query.eq('date', dateOnly);
        }

        // Sorting
        switch (sort) {
          case 'latest':
            query = query.order('date', { ascending: false, nullsFirst: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'price_low_high':
            query = query.order('price', { ascending: true, nullsFirst: true });
            break;
          case 'price_high_low':
            query = query.order('price', { ascending: false, nullsFirst: true });
            break;
          case 'soonest':
          default:
            query = query.order('date', { ascending: true, nullsFirst: false });
            break;
        }

        const { data, error: qErr } = await query;
        if (qErr) throw qErr;
        if (!cancelled) setEvents((data as EventRow[]) || []);
      } catch (error: unknown) {
        if (!cancelled) setError(error instanceof Error ? error.message : 'Failed to load events');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadEvents();
    return () => { cancelled = true; };
  }, [session, search, eventType, category, language, age, dateOnly, sort]);

  const hasFilters = useMemo(() => !!(search || eventType || category || language || age || dateOnly), [search, eventType, category, language, age, dateOnly]);

  // --- Render states ---
  if (status === 'loading') {
    return (
      <div className={`min-h-dvh bg-white flex items-center justify-center ${inter.className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-2 text-sm text-zinc-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className={`min-h-dvh bg-gray-50 ${inter.className}`}>
      {isDesktop ? <DesktopNavbar logoText="rkade" /> : <Navbar />}

      <main className={`max-w-6xl mx-auto py-8 px-4 ${isDesktop ? 'pt-28' : 'pb-24'}`}>
        <h1 className="text-2xl font-bold mb-6">Browse Events</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <div className="p-4 border rounded shadow-sm space-y-3">
              <h2 className="font-semibold">Filter &amp; Sort</h2>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name" className="w-full p-2 border rounded" />

              <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full p-2 border rounded">
                <option value="">All Event Types</option>
                {eventTypes.map(t => (
                  <option key={t.id} value={t.slug}>{t.name}</option>
                ))}
              </select>

              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded">
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>

              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 border rounded">
                <option value="">All Languages</option>
                {languages.map(l => (
                  <option key={l.id} value={l.slug}>{l.name}</option>
                ))}
              </select>

              <select value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-2 border rounded">
                <option value="">All Age Ratings</option>
                {ageRatings.map(a => (
                  <option key={a.id} value={a.code}>{a.code}{a.name ? ` - ${a.name}` : ''}</option>
                ))}
              </select>

              <input type="date" value={dateOnly} onChange={(e) => setDateOnly(e.target.value)} className="w-full p-2 border rounded" />

              <select value={sort} onChange={(e) => setSort(e.target.value as 'soonest' | 'latest' | 'newest' | 'price_low_high' | 'price_high_low')} className="w-full p-2 border rounded">
                <option value="soonest">Soonest to Latest</option>
                <option value="latest">Latest to Soonest</option>
                <option value="newest">Newest Added</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
              </select>

              <div className="flex gap-2 pt-2">
                <Button type="button" className="flex-1" onClick={() => { setSearch(''); setEventType(''); setCategory(''); setLanguage(''); setAge(''); setDateOnly(''); }}>Clear</Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => { /* triggers useEffect via state already bound */ }}>Apply</Button>
              </div>
            </div>
          </aside>

          <div className="md:col-span-3">
            {loading && <p className="text-gray-600">Loading events…</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && events.length === 0 && (
              <p className="text-gray-700">{hasFilters ? 'No events match your filters.' : 'No events available.'}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map(ev => {
                const dateLabel = ev.date || ev.date_from || '';
                const timeLabel = ev.time || '';
                const venueLabel = ev.venue || 'Venue TBA';
                const priceLabel = ev.price || 'Price TBA';
                const posterImage = ev.portrait_poster || ev.landscape_poster || '/placeholder.svg';
                
                return (
                  <div key={ev.id} className="border rounded shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-40 bg-gray-100">
                      <Image 
                        src={posterImage} 
                        alt={ev.event_name} 
                        width={400}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                      {ev.category && (
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {ev.category}
                        </div>
                      )}
                      {ev.language && (
                        <div className="absolute top-2 right-2 bg-blue-600/80 text-white text-xs px-2 py-1 rounded">
                          {ev.language}
                        </div>
                      )}
                    </div>
                    <div className="p-3 space-y-2">
                      <h3 className="font-semibold text-lg line-clamp-2">{ev.event_name}</h3>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        {dateLabel ? (
                          <p className="flex items-center gap-1">
                            <span>📅</span>
                            {dateLabel}{timeLabel ? ` at ${timeLabel}` : ''}
                          </p>
                        ) : (
                          <p className="flex items-center gap-1 text-gray-400">
                            <span>📅</span>
                            Date TBA
                          </p>
                        )}
                        
                        <p className="flex items-center gap-1">
                          <span>📍</span>
                          {venueLabel}
                        </p>
                        
                        {ev.duration && (
                          <p className="flex items-center gap-1">
                            <span>⏱️</span>
                            {ev.duration}
                          </p>
                        )}
                        
                        {ev.age_limit && (
                          <p className="flex items-center gap-1">
                            <span>🎭</span>
                            {ev.age_limit}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-lg font-bold text-green-600">
                          {priceLabel === 'Price TBA' ? priceLabel : `₹${priceLabel}`}
                        </p>
                        <Link href={`/events/${ev.slug}`} className="block">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
