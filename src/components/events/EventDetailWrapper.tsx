"use client";

import React, { useEffect, useState } from 'react';
import CampusEventComponent from '@/components/home/slugfiles';
import { getCampusById } from '@/lib/campuses';
import { SessionProvider } from 'next-auth/react';
import { getEventsClient } from '@/lib/events-client';

type FrontEvent = { id: string; category: string; name: string; price?: string; img?: string; slug?: string };
type ServerEvent = {
  id?: string;
  slug?: string;
  event_type?: string;
  category?: string;
  event_name?: string;
  name?: string;
  price?: string;
  landscape_poster?: string;
  portrait_poster?: string;
  campus_slug?: string;
  campus?: string;
  venue?: string;
};

function EventDetailWrapper({ slug, serverEvent }: { slug: string; serverEvent?: ServerEvent }): React.ReactElement | null {
  const [localEvent, setLocalEvent] = useState<FrontEvent | null>(null);
  const [clientEvent, setClientEvent] = useState<ServerEvent | null>(null);
  const [loading, setLoading] = useState(!serverEvent);

  // Try localStorage first
  useEffect(() => {
    if (serverEvent) return;
    try {
      const stored = localStorage.getItem('localEvents');
      if (!stored) return;
      const list = JSON.parse(stored) as FrontEvent[];
      const found = list.find((e) => e.slug === slug || e.id === slug);
      if (found) setLocalEvent(found);
    } catch {
      // ignore
    }
  }, [serverEvent, slug]);

  // If no serverEvent, fetch client-side from Supabase (with fallback events)
  useEffect(() => {
    if (serverEvent || localEvent) return;

    const fetchClientEvent = async () => {
      try {
        setLoading(true);
        const allEvents = await getEventsClient();
        const found = allEvents.find(
          (e: { slug?: string; id?: string }) => e.slug === slug || e.id === slug
        );
        if (found) setClientEvent(found as ServerEvent);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    fetchClientEvent();
  }, [serverEvent, localEvent, slug]);

  // Show loading spinner while fetching
  if (loading && !serverEvent && !localEvent && !clientEvent) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  // Use whichever event source we have
  const resolvedEvent: ServerEvent | null = serverEvent || clientEvent;

  if (resolvedEvent) {
    const ev = {
      id: resolvedEvent.id?.toString() || resolvedEvent.slug || slug,
      category: resolvedEvent.event_type || resolvedEvent.category || 'Event',
      name: resolvedEvent.event_name || resolvedEvent.name || resolvedEvent.slug || 'Event',
      price: resolvedEvent.price || '',
      img: resolvedEvent.portrait_poster || resolvedEvent.landscape_poster || '/placeholder.svg',
      slug: resolvedEvent.slug || slug,
    };

    const explicitCampusSlug = resolvedEvent.campus_slug || resolvedEvent.campus || null;
    let resolvedCampus = null;
    if (explicitCampusSlug) resolvedCampus = getCampusById(explicitCampusSlug);
    if (!resolvedCampus && resolvedEvent.category) {
      const maybe = getCampusById(resolvedEvent.category);
      if (maybe) resolvedCampus = maybe;
    }

    const campus = resolvedCampus || {
      id: 'events',
      name: ev.category || 'Events',
      fullName: ev.category || 'Events',
      image: resolvedEvent.landscape_poster || '/brand1.svg',
      location: resolvedEvent.venue || 'Unknown',
    };

    return (
      <SessionProvider>
        <CampusEventComponent campus={campus} event={ev} serverEvent={resolvedEvent} />
      </SessionProvider>
    );
  }

  if (localEvent) {
    const campus = { id: 'local', name: 'Local', fullName: 'Local Events', image: localEvent.img || '/brand1.svg', location: 'Unknown' };
    const event = {
      id: localEvent.id,
      category: localEvent.category,
      name: localEvent.name,
      img: localEvent.img || '/placeholder.svg',
      price: localEvent.price || '',
      slug: localEvent.slug || localEvent.id
    };
    return (
      <SessionProvider>
        <CampusEventComponent campus={campus} event={event} />
      </SessionProvider>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6 text-center">
      <svg className="w-16 h-16 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="15" x2="16" y2="15" />
      </svg>
      <h2 className="text-xl font-semibold text-zinc-800">Event not found</h2>
      <p className="text-sm text-zinc-500 max-w-xs">
        The event you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <button
        onClick={() => window.history.back()}
        className="mt-2 px-6 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors"
      >
        ← Go back
      </button>
    </div>
  );
}

export default EventDetailWrapper;

