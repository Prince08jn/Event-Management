"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import EventGrid from "@/components/home/events";
import CampusEventComponent from "@/components/home/slugfiles";
import { getCampusById } from "@/lib/campuses";

const inter = Inter({ subsets: ["latin"] });

type Event = { id: string; category: string; name: string; price: string; img: string };
type Campus = { id: string; name: string; fullName: string; image: string; location: string };

interface CampusPageProps {
  params: Promise<{ id: string }>;
}

// Campus database is centralized in src/lib/campuses

export default function CampusPage({ params }: CampusPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [campus, setCampus] = useState<Campus | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Unwrap the params Promise
  const resolvedParams = React.use(params);
  const searchParams = useSearchParams();

  const selectedEventId = searchParams?.get("event");

  // Load campus data based on ID
  useEffect(() => {
  const campusInfo = getCampusById(resolvedParams.id);
    if (campusInfo) {
      setCampus(campusInfo);
    } else {
      const id = resolvedParams?.id;
      if (id) {
        router.push(`/campuses/${id}`);
      } else {
        router.push(`/campuses`);
      }
    }
    setLoading(false);
  }, [resolvedParams.id, router]);

  // Dynamic events data based on campus
  const getEventsForCampus = (campusId: string): Event[] => {
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
  };

  const events = campus ? getEventsForCampus(campus.id) : [];

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
        <header className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LocationIcon />
              <div>
                <p className="text-sm font-medium text-zinc-900">{campus.location}</p>
                <p className="text-xs text-zinc-500">Hello {session?.user?.name || "User"}</p>
              </div>
            </div>
            <div className="flex items-center gap-36">
              <span className="text-lg font-bold">Logo</span>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-300 flex items-center justify-center overflow-hidden">
                {session?.user?.image ? (
                  <Image 
                    src={session.user.image} 
                    alt={session.user.name || "User profile"} 
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon />
                )}
              </div>
            </div>
          </div>
          <form role="search" className="relative mb-4">
            <input
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-3 py-2 text-[15px] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
            <svg
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20L17 17" />
            </svg>
          </form>
        </header>
        <main className="px-4 pb-[96px]">
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
            <button className="px-3 py-1 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-200 hover:text-gray-800">Category</button>
            <button className="px-3 py-1 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-100 hover:text-gray-800">Date</button>
            <button className="px-3 py-1 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-100 hover:text-gray-800">Price</button>
            <button className="px-3 py-1 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-100 hover:text-gray-800">Language</button>
          </div>
          <EventGrid
            events={events
              .filter((event) =>
                searchQuery.trim() === "" ||
                event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.category.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((event) => ({
                ...event,
                href: `/Eventspage/Eventname/${campus.id}-${event.id}`,
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

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-zinc-600">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}