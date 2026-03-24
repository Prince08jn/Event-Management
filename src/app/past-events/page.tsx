"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getEventsClient } from "@/lib/events-client";
import Navbar from "@/components/home/navbar";
import DesktopNavbar from "@/components/home/desktop-navbar";
import { useDesktop } from "@/hooks/useDesktop";

interface PastEvent {
    id: string;
    event_name: string;
    slug: string;
    portrait_poster?: string;
    landscape_poster?: string;
    date?: string;
    venue?: string;
    category?: string;
    event_type?: string;
    price?: string;
    description?: string;
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return "";
    try {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return dateStr;
    }
}

export default function PastEventsPage() {
    const [events, setEvents] = useState<PastEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const isDesktop = useDesktop();
    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        async function load() {
            try {
                const all = await getEventsClient();
                // Filter to events that have passed
                const past = all.filter((e: PastEvent) => e.date && e.date < today);
                setEvents(past);
            } catch {
                setEvents([]);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [today]);

    return (
        <div className="min-h-screen bg-zinc-50">
            {isDesktop ? <DesktopNavbar /> : <Navbar />}

            <main className="pt-20 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-zinc-900 mb-2">Past Events</h1>
                    <p className="text-zinc-500 text-sm">
                        Relive the moments from events that shaped the community.
                    </p>
                </div>

                {loading ? (
                    /* Loading skeleton */
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-xl bg-zinc-200 animate-pulse aspect-[3/4]" />
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <span className="text-5xl mb-4">🎭</span>
                        <h2 className="text-xl font-bold text-zinc-700 mb-2">No Past Events Yet</h2>
                        <p className="text-zinc-400 text-sm max-w-xs mb-6">
                            Events you attend will appear here once they've concluded.
                        </p>
                        <Link
                            href="/event"
                            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                            style={{ background: "linear-gradient(90deg,#7c3aed,#2563eb)" }}
                        >
                            Explore Upcoming Events →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {events.map((event) => {
                            const poster = event.portrait_poster || event.landscape_poster;
                            const href = `/events/${event.slug || event.id}`;
                            return (
                                <Link
                                    key={event.id}
                                    href={href}
                                    className="group relative rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow aspect-[3/4] bg-zinc-200 block"
                                >
                                    {poster && (
                                        <img
                                            src={poster}
                                            alt={event.event_name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    )}
                                    {/* Dark gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                    {/* Completed badge */}
                                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/90 text-white backdrop-blur-sm flex items-center gap-1">
                                        ✓ Completed
                                    </span>

                                    {/* Info */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <p className="text-white font-semibold text-sm line-clamp-2 leading-snug mb-1">
                                            {event.event_name}
                                        </p>
                                        {event.date && (
                                            <p className="text-zinc-300 text-[11px]">{formatDate(event.date)}</p>
                                        )}
                                        <span
                                            className="mt-2 inline-block text-[11px] font-semibold text-violet-300 group-hover:text-white transition-colors"
                                        >
                                            Relive →
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
