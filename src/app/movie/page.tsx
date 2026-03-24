"use client"

import React from "react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Inter } from "next/font/google"
import EventGrid from "../../components/home/events"
import Categories from "../../components/home/categories"
import { FilterButtons, useFilters } from "../../components/home/carousel"
import Navbar from "../../components/home/navbar"
import DesktopNavbar from "../../components/home/desktop-navbar"
import DesktopMainLayout from "../../components/home/desktop-main-layout"
import { useDesktop } from "../../hooks/useDesktop"
import { getEventsByTypeClient, transformEventToFrontend } from '@/lib/events-client'
import BottomNav from '../../components/home/bottom-nav'

const inter = Inter({ subsets: ["latin"] })

type EventCategory = { id: string; title: string; img: string }
type Event = {
  id: string;
  category: string;
  name: string;
  price: string;
  img: string;
  description?: string;
  date?: string;
  time?: string;
  duration?: string;
  language: string;
  venue?: string;
  href?: string;
  ageLimit: string;
  eventType: string;
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isDesktop = useDesktop()

  const { activeFilters, toggleFilter } = useFilters()

  // State for database events
  const [dbEvents, setDbEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [hasLoadedFromDb, setHasLoadedFromDb] = useState(false)



  // Navigation functions

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/auth/signin")
      return
    }
  }, [session, status, router])

  // Fetch movie events from database
  useEffect(() => {
    const fetchMovieEvents = async () => {
      if (hasLoadedFromDb) return

      try {
        setLoading(true)

        // First try to get events by type 'movies'
        let movieEvents = await getEventsByTypeClient('movies')

        // If no movies found, try fetching all events and filter for movies
        if (movieEvents.length === 0) {
          const { getEventsClient } = await import('@/lib/events-client')
          const allEvents = await getEventsClient()

          // Filter for movie events (check both event_type and category)
          movieEvents = allEvents.filter(event =>
            event.event_type?.toLowerCase() === 'movies' ||
            event.event_type?.toLowerCase() === 'movie' ||
            event.category?.toLowerCase() === 'movies' ||
            event.category?.toLowerCase() === 'movie'
          )
        }

        const transformedEvents = movieEvents.map(transformEventToFrontend)
        setDbEvents(transformedEvents)
        setHasLoadedFromDb(true)
      } catch (error) {
        console.error('Error fetching movie events:', error)
        // Keep using hardcoded events as fallback
      } finally {
        setLoading(false)
      }
    }

    // Only fetch if user is authenticated
    if (session) {
      fetchMovieEvents()
    }
  }, [session, hasLoadedFromDb])

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
    { id: "c1", title: "English", img: "/aujla.svg" },
    { id: "c2", title: "Hindi", img: "/diljit.svg" },
    { id: "c3", title: "Punjabi", img: "/prateek.svg" },
    { id: "c4", title: "Telegu", img: "/samay.svg" },
  ]

  // Fallback events for when database is not available
  const fallbackEvents: Event[] = [
    {
      id: "e1",
      category: "Action",
      name: "Avengers: Endgame",
      price: "₹199",
      img: "/avengers.jpeg",
      description: "The Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
      date: "2025-10-15",
      time: "18:30",
      duration: "181 min",
      language: "English",
      venue: "PVR Cinemas",
      ageLimit: "13+",
      eventType: "movies"
    },
    {
      id: "e2",
      category: "Drama",
      name: "The Pursuit of Happyness",
      price: "₹149",
      img: "/pursuitofhappyness.jpeg",
      description: "A struggling salesman takes custody of his son as he's poised to begin a life-changing professional career.",
      date: "2025-10-16",
      time: "15:00",
      duration: "117 min",
      language: "English",
      venue: "INOX Megaplex",
      ageLimit: "All",
      eventType: "movies"
    },
    {
      id: "e3",
      category: "Comedy",
      name: "3 Idiots",
      price: "₹99",
      img: "/3idiots.jpeg",
      description: "Two friends search for their long lost companion. They have a clue that he is in Goa.",
      date: "2025-10-17",
      time: "12:00",
      duration: "170 min",
      language: "Hindi",
      venue: "Cinepolis",
      ageLimit: "All",
      eventType: "movies"
    },
    {
      id: "e4",
      category: "Thriller",
      name: "Inception",
      price: "₹179",
      img: "/inception.jpeg",
      description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task.",
      date: "2025-10-18",
      time: "21:00",
      duration: "148 min",
      language: "English",
      venue: "Carnival Cinemas",
      ageLimit: "13+",
      eventType: "movies"
    },
  ]

  // Use database events if available, otherwise fallback to hardcoded events
  const events: Event[] = dbEvents.length > 0 ? dbEvents : fallbackEvents

  // Add href to events for navigation
  const eventsWithHref = events.map(event => ({
    ...event,
    href: `/events/${event.id}`
  }))

  // Desktop Layout
  if (isDesktop) {
    return (
      <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
        <DesktopNavbar logoText="rkade" />
        <DesktopMainLayout events={eventsWithHref} />
      </div>
    )
  }

  // Mobile Layout (existing)
  return (
    <div className={`min-h-dvh bg-gray-50 ${inter.className}`}>
      {/* Responsive container */}
      <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl bg-white">
        <Navbar />

        <main className="px-4 sm:px-6 md:px-8 pb-[96px] md:pb-24 pt-0 md:pt-36">

          {/* Categories */}
          <Categories
            categories={eventCategories.map((c) => ({ id: c.id, title: c.title, img: c.img, href: c.title === 'Movies' ? '/movies' : '#' }))}
            title="Movies"
            categoryType="movies"
            gridClass="grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10"
          />
          <FilterButtons
            filters={['Category', 'Date', 'Price', 'Language']}
            activeFilters={activeFilters}
            onToggleFilter={toggleFilter}
            className="justify-center"
          />

          {/* All Movies */}
          {loading ? (
            <div className="mb-6 md:mb-8">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 md:text-xl">All Movies</h2>
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600"></div>
                <span className="ml-2 text-sm text-zinc-600">Loading movies...</span>
              </div>
            </div>
          ) : (
            <EventGrid
              events={events}
              title="All Movies"
              seeAllHref="/movies/allevents"
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



