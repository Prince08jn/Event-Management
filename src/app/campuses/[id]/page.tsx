"use client";

import React from "react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import EventGrid from "@/components/home/events";
import CampusEventComponent from "@/components/home/slugfiles";
import { campusData, getCampusById, Campus as CampusType } from "@/lib/campuses";
import { getLocalEventsForPage, listenLocalEvents } from "@/lib/localEvents";
import Navbar from "@/components/home/navbar";

const inter = Inter({ subsets: ["latin"] });

type Event = { id: string; category: string; name: string; price: string; img: string; slug?: string };
type Campus = CampusType;

interface CampusPageProps {
  params: Promise<{ id: string }>;
}

// using shared campusData imported from src/lib/campuses

export default function CampusPage({ params }: CampusPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [campus, setCampus] = useState<Campus | null>(null);
  const [loading, setLoading] = useState(true);

  // Unwrap the params Promise
  const resolvedParams = React.use(params);
  const searchParams = useSearchParams();

  // Check if we should show event detail component
  const selectedEventId = searchParams?.get("event");

  // Load campus data based on ID
  useEffect(() => {
    const id = resolvedParams?.id;
    // resolve campus via shared helper (handles exact and normalized matches)
    const campusInfo = getCampusById(id);

    if (campusInfo) {
      setCampus(campusInfo);
    } else {
      // Campus not found, try to navigate to specific campus URL if ID present, otherwise fallback
      if (id) {
        router.push(`/campuses/${id}`);
      } else {
        router.push(`/campuses`);
      }
    }
    setLoading(false);
  }, [resolvedParams.id, router]);

  // Dynamic events data based on campus - memoized to prevent recreation
  const getEventsForCampus = useCallback((campusId: string): Event[] => {
    const baseEvents = [
      { id: "e1", category: "Campus", name: "Tech Symposium", price: "₹1099", img: "/brand1.svg" },
      { id: "e2", category: "Events", name: "Cultural Fest", price: "₹1099", img: "/brand2.svg" },
      { id: "e3", category: "Campus", name: "Innovation Workshop", price: "₹899", img: "/brand3.svg" },
      { id: "e4", category: "Events", name: "Sports Meet", price: "₹599", img: "/brand1.svg" },
    ];

    // Customize events based on campus
    switch (campusId) {
      case "iit-delhi":
        return baseEvents.map(event => ({ ...event, name: `IIT-D ${event.name}` }));
      case "delhi-university":
        return baseEvents.map(event => ({ ...event, name: `DU ${event.name}` }));
      case "dtu-delhi":
        return baseEvents.map(event => ({ ...event, name: `DTU ${event.name}` }));
      case "maharaja-agarsen":
        return baseEvents.map(event => ({ ...event, name: `MA ${event.name}` }));
      case "aiims-delhi":
        return baseEvents.map(event => ({ ...event, name: `AIIMS ${event.name}` }));
      case "nit-delhi":
        return baseEvents.map(event => ({ ...event, name: `NIT-D ${event.name}` }));
      default:
        return baseEvents;
    }
  }, []);

  const events = useMemo(() => campus ? getEventsForCampus(campus.id) : [], [campus, getEventsForCampus]);

  // Merge local events (from localStorage) that target this campus
  const [mergedEvents, setMergedEvents] = useState<Event[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Toggle filter function
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  // helper to normalize incoming path/id to a slug we compare against stored campus_slug
  const normalizeToSlug = (v: string | undefined) =>
    v ? v.toString().toLowerCase().replace(/[^a-z0-9\-]+/g, '-').replace(/^-+|-+$/g, '') : '';

  useEffect(() => {
    const pageKey = resolvedParams?.id || '';
    try {
      const local = getLocalEventsForPage(pageKey);
      const mappedLocal = local.map((le) => ({
        id: le.id,
        category: le.category || 'Local',
        name: le.name || 'Untitled',
        price: (le.price as string) || '',
        img: le.img || '/placeholder.svg',
        slug: le.slug || undefined,
      }));
      const mappedEvents = events.map(ev => ({ ...ev, slug: (ev as Event & { slug?: string }).slug ?? undefined }));
      setMergedEvents(mappedLocal.concat(mappedEvents));
    } catch (err) {
      console.error('Error merging events:', err);
      setMergedEvents(events);
    }

    const off = listenLocalEvents(() => {
      try {
        const local = getLocalEventsForPage(pageKey);
        const mappedLocal = local.map((le) => ({
          id: le.id,
          category: le.category || 'Local',
          name: le.name || 'Untitled',
          price: (le.price as string) || '',
          img: le.img || '/placeholder.svg',
          slug: le.slug || undefined,
        }));
        const mappedEvents = events.map(ev => ({ ...ev, slug: (ev as Event & { slug?: string }).slug ?? undefined }));
        setMergedEvents(mappedLocal.concat(mappedEvents));
      } catch (err) {
        setMergedEvents(events);
      }
    });
    return off;
  }, [events, resolvedParams.id]);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
  }, [session, status, router]);

  // Show loading while checking authentication or loading campus data
  if (status === "loading" || loading) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-2 text-sm text-zinc-600">
            {status === "loading" ? "Loading..." : "Loading campus..."}
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Handle event detail view after all hooks have been called
  if (selectedEventId) {
    const slug = `${resolvedParams.id}-${selectedEventId}`;
    return <CampusEventComponent slug={slug} />;
  }

  if (!campus) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-zinc-600">Campus not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gray-50">
      <div className="mx-auto w-full max-w-[420px] bg-white">
        <Navbar />
        <main className="px-4 pb-[96px] pt-0 md:pt-36">
          <section aria-label="Campus Info" className="mb-6">
            <div className="relative w-full h-128 overflow-hidden rounded-xl">
              <Image
                src={campus.image}
                alt={campus.name}
                width={800}
                height={512}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-opacity-40 flex items-center mb-48 justify-center">
                <div className={`text-center text-black ${inter.className}`}>
                  <h1 className="text-3xl font-bold mb-2">{campus.name}</h1>
                  <p className="text-md opacity-90">{campus.fullName}</p>
                </div>
              </div>
            </div>
          </section>
          <div className="flex flex-row gap-3 justify-center mb-6">
            <button
              onClick={() => toggleFilter('category')}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${activeFilters.includes('category')
                  ? 'bg-gray-800 text-gray-200'
                  : 'text-black bg-white border border-gray-200 hover:bg-gray-100 hover:text-gray-800'
                }`}
            >
              Category
            </button>
            <button
              onClick={() => toggleFilter('date')}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${activeFilters.includes('date')
                  ? 'bg-gray-800 text-gray-200'
                  : 'text-black bg-white border border-gray-200 hover:bg-gray-100 hover:text-gray-800'
                }`}
            >
              Date
            </button>
            <button
              onClick={() => toggleFilter('price')}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${activeFilters.includes('price')
                  ? 'bg-gray-800 text-gray-200'
                  : 'text-black bg-white border border-gray-200 hover:bg-gray-100 hover:text-gray-800'
                }`}
            >
              Price
            </button>
            <button
              onClick={() => toggleFilter('language')}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${activeFilters.includes('language')
                  ? 'bg-gray-800 text-gray-200'
                  : 'text-black bg-white border border-gray-200 hover:bg-gray-100 hover:text-gray-800'
                }`}
            >
              Language
            </button>
          </div>
          <EventGrid
            events={mergedEvents
              .filter((event) =>
                searchQuery.trim() === "" ||
                event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.category.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((event) => ({
                ...event,
                // Route local events (category: 'Local') to canonical event page, others to campus-events
                href: event.category === 'Local' && event.slug
                  ? `/events/${event.slug}`
                  : `/campus-events/${campus.id}-${event.id}`,
              }))}
            title={`All ${campus.name} Events`}
            seeAllHref="#"
            gridClass="grid-cols-2"
          />
        </main>
      </div>
    </div>
  );
}
