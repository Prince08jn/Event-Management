"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Inter } from "next/font/google"
import EventGrid from "../../components/home/events"
import Categories from "../../components/home/categories"
import Carousel from "../../components/home/carousel"
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

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // State for database events
  const [dbEvents, setDbEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [hasLoadedFromDb, setHasLoadedFromDb] = useState(false)

  // Toggle filter function
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  // Fetch all events from database (campus, sports, movies)
  useEffect(() => {
    const fetchAllEvents = async () => {
      if (hasLoadedFromDb) return

      try {
        setLoading(true)

        const [campusEvents, sportsEvents, movieEvents] = await Promise.all([
          getEventsByTypeClient('campus_event').catch(err => { console.error('Error fetching campus events:', err); return [] }),
          getEventsByTypeClient('sports').catch(err => { console.error('Error fetching sports events:', err); return [] }),
          getEventsByTypeClient('movie').catch(err => { console.error('Error fetching movie events:', err); return [] })
        ])

        // Combine all events
        const allEvents = [...campusEvents, ...sportsEvents, ...movieEvents]

        if (allEvents.length > 0) {
          const transformedEvents = allEvents.map(transformEventToFrontend)
          setDbEvents(transformedEvents)
        }
        setHasLoadedFromDb(true)
      } catch (error) {
        console.error('Error fetching events from database:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchAllEvents()
    }
  }, [session, hasLoadedFromDb, isDesktop])

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

  if (!session) return null

  const eventCategories: EventCategory[] = [
    { id: "c1", title: "IIT-D", img: "/Indian_Institute_of_Technology_Delhi_Logo.svg" },
    { id: "c2", title: "DU", img: "/Delhi_University.svg" },
    { id: "c3", title: "CU", img: "/Chandigarh_University_Seal.png" },
    { id: "c4", title: "DTU", img: "/DTU,_Delhi_official_logo.png" },
  ]

  const fallbackEvents: Event[] = [
    { id: "e1", category: "Campus", name: "Campus Event", price: "₹1099", img: "/brand1.svg", language: "English", ageLimit: "All", eventType: "campus" },
    { id: "e2", category: "Events", name: "General Event", price: "₹999", img: "/brand2.svg", language: "English", ageLimit: "All", eventType: "campus" },
    { id: "e3", category: "Movies", name: "Movie Screening", price: "₹299", img: "/brand3.svg", language: "Hindi", ageLimit: "13+", eventType: "movie" },
    { id: "e4", category: "Sports", name: "Sports Tournament", price: "₹199", img: "/brand3.svg", language: "English", ageLimit: "All", eventType: "sports" },
  ]

  const events: Event[] = dbEvents.length > 0 ? dbEvents : fallbackEvents

  if (isDesktop) {
    const eventsWithHref = events.map(event => ({
      ...event,
      href: `/events/${event.id}`
    }))

    return (
      <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
        <DesktopNavbar logoText="rkade" />
        <DesktopMainLayout events={eventsWithHref} />
      </div>
    )
  }

  return (
    <div className={`min-h-dvh bg-gray-50 ${inter.className}`}>
      <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl bg-white">
        <Navbar />

        <main className="px-4 sm:px-6 md:px-8 pb-[96px] md:pb-24 pt-0 md:pt-36">
          {/* Categories */}
          <Categories
            categories={eventCategories.map((c) => ({
              id: c.id,
              title: c.title,
              img: c.img,
              href: `/all-campus/`,
            }))}
            title="Campuses"
            categoryType="campus_event"
          />

          {/* Filter Buttons */}
          <div className="flex flex-row gap-3 md:gap-4 justify-center mb-6 md:mb-8">
            {["category", "date", "price", "language"].map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-3 md:px-4 py-1 md:py-2 text-sm md:text-base font-bold rounded-full transition ${activeFilters.includes(filter)
                  ? "bg-gray-800 text-gray-200"
                  : "text-black bg-white border border-gray-200 hover:bg-gray-100 hover:text-gray-800"
                  }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Events */}
          {loading ? (
            <div className="mb-6 md:mb-8">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 md:text-xl">All Events</h2>
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600"></div>
                <span className="ml-2 text-sm text-zinc-600">Loading events...</span>
              </div>
            </div>
          ) : (
            <EventGrid
              events={events.map((e) => ({ ...e, href: `/events/${e.id}` }))}
              title="All Events"
              seeAllHref="/all-campus"
              gridClass="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            />
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
