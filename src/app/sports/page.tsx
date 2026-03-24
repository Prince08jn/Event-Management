"use client"

import React from "react"
import { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Inter } from "next/font/google"
import EventGrid from "../../components/home/events"
import Categories from "../../components/home/categories"
import { FilterButtons, useFilters } from "../../components/home/carousel"
import Navbar from "../../components/home/navbar"
import DesktopMainLayout from "../../components/home/desktop-main-layout"
import { useDesktop } from "../../hooks/useDesktop"
import DesktopNavbar from "../../components/home/desktop-navbar"
import { getEventsByTypeClient, transformEventToFrontend } from '@/lib/events-client';
import BottomNav from '../../components/home/bottom-nav';

const inter = Inter({ subsets: ["latin"] })

type EventCategory = { id: string; title: string; img: string }
type Event = {
  id: string;
  category: string;
  name: string;
  price: string;
  img: string;
  href?: string;
  date?: string;
  language: string;
  ageLimit: string;
  eventType: string;
}
export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isDesktop = useDesktop()
  const [sportsEvents, setSportsEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const { activeFilters, toggleFilter } = useFilters()



  // Navigation functions


  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/auth/signin")
      return
    }
  }, [session, status, router])

  // Auto-advance every 5 seconds
  // Fetch sports events once on mount
  useEffect(() => {
    const fetchSportsEvents = async () => {
      setEventsLoading(true);
      try {
        const dbEvents = await getEventsByTypeClient('sports');
        const transformed = dbEvents.map(transformEventToFrontend);
        setSportsEvents(transformed);
      } catch (error) {
        console.error("Failed to fetch sports events:", error);
        setSportsEvents([]); // Fallback to empty if error
      } finally {
        setEventsLoading(false);
      }
    };
    fetchSportsEvents();
  }, []); // Empty dependency array means this runs once on mount


  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className={`min-h-dvh bg-white flex items-center justify-center ${inter.className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-2 text-sm text-zinc-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render the page if not authenticated
  if (!session) {
    return null
  }



  const eventCategories: EventCategory[] = [
    { id: "c1", title: "Cricket", img: "/cricket.svg" },
    { id: "c2", title: "Football", img: "/football.svg" },
    { id: "c3", title: "Hockey", img: "/hockey.svg" },
    { id: "c4", title: "Boxing", img: "/boxing.svg" },
  ]


  // If desktop, use DesktopMainLayout
  if (isDesktop) {

    return (
      <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
        <DesktopNavbar logoText="rkade" />
        <DesktopMainLayout events={sportsEvents} />
      </div>
    )
  }

  return (
    <div className={`min-h-dvh bg-gray-50 ${inter.className}`}>
      {/* Responsive container */}
      <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl bg-white">
        <Navbar />


        <main className="px-4 sm:px-6 md:px-8 pb-[96px] pt-0 md:pt-36">

          {/* Categories */}
          <Categories
            categories={eventCategories.map((c) => ({ id: c.id, title: c.title, img: c.img, href: c.title === 'Cricket' ? '/sports/cricket' : '#' }))}
            title="Sports"
            categoryType="sports"
            gridClass="grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10"
          />
          <FilterButtons
            filters={['Category', 'Date', 'Price', 'Language']}
            activeFilters={activeFilters}
            onToggleFilter={toggleFilter}
            className="justify-center"
          />

          {/* All Sports Events */}
          {eventsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600"></div>
              <span className="ml-2 text-sm text-zinc-600">Loading sports events...</span>
            </div>
          ) : sportsEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold text-zinc-800 mb-2">No sports events available</h3>
              <p className="text-sm text-zinc-500 max-w-xs">We're working on bringing exciting sports events to you. Check back soon!</p>
            </div>
          ) : (
            <EventGrid
              events={sportsEvents}
              title="All Sports"
              seeAllHref="/sports/allevents"
              gridClass="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            />
          )}
        </main>
      </div>

      {/* Bottom Tab Bar */}
      <BottomNav />
    </div>
  )
}

/* Components */






