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
import DesktopMainLayout from "../../components/home/desktop-main-layout"
import { useDesktop } from "../../hooks/useDesktop"
import DesktopNavbar from "../../components/home/desktop-navbar"
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


  const { activeFilters, toggleFilter } = useFilters()

  // State for database events
  const [dbEvents, setDbEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [hasLoadedFromDb, setHasLoadedFromDb] = useState(false)



  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/auth/signin")
      return
    }
  }, [session, status, router])

  // Fetch events from database
  useEffect(() => {
    const fetchEvents = async () => {
      if (hasLoadedFromDb) return

      try {
        setLoading(true)
        const allEvents = await getEventsByTypeClient('event')
        const transformedEvents = allEvents.map(transformEventToFrontend)
        setDbEvents(transformedEvents)
        setHasLoadedFromDb(true)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchEvents()
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
    { id: "c1", title: "Karan aujla", img: "/aujla.svg" },
    { id: "c2", title: "Diljit Dosanjh", img: "/diljit.svg" },
    { id: "c3", title: "YO YO prateek", img: "/prateek.svg" },
    { id: "c4", title: "Samay Raina", img: "/samay.svg" },
  ]

  if (isDesktop) {
    const eventsWithHref = dbEvents.map(event => ({
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
      {/* Responsive container */}
      <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl bg-white">
        <Navbar />

        <main className="px-4 sm:px-6 md:px-8 pb-[96px] md:pb-24 pt-0 md:pt-36">

          {/* Categories */}
          <Categories
            categories={eventCategories}
            title="Events"
            categoryType="events"
            gridClass="grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10"
          />

          <FilterButtons
            filters={['Category', 'Date', 'Price', 'Language']}
            activeFilters={activeFilters}
            onToggleFilter={toggleFilter}
            className="justify-center"
          />

          {/* All Events */}
          {loading ? (
            <div className="mb-6 md:mb-8">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 md:text-xl">All Events</h2>
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600"></div>
                <span className="ml-2 text-sm text-zinc-600">Loading events...</span>
              </div>
            </div>
          ) : dbEvents.length > 0 ? (
            <EventGrid
              events={dbEvents}
              title="All Events"
              seeAllHref="/Eventspage/allevents"
              gridClass="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            />
          ) : (
            <div className="mb-6 md:mb-8">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 md:text-xl">All Events</h2>
              <div className="text-center py-8">
                <p className="text-zinc-600 mb-2">No events available</p>
                <p className="text-sm text-zinc-500">Check back later for new events!</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bottom Tab Bar */}
      <BottomNav />
    </div>
  )
}


