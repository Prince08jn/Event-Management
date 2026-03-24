"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCampusById } from "@/lib/campuses";
import { baseEvents as sharedBaseEvents, getEventById } from "@/lib/events";
import { useSession } from "next-auth/react";
import { useDesktop } from "@/hooks/useDesktop";
import { Inter } from "next/font/google";
import Navbar from "./navbar";
import DesktopNavbar from "./desktop-navbar";
import { TeamManagement } from "@/components/events/TeamManagement";

const inter = Inter({ subsets: ["latin"] });

// Add type definitions
type Event = {
    id: string;
    category: string;
    name: string;
    price: string;
    img: string;
};

type Campus = {
    id: string;
    name: string;
    fullName: string;
    image: string;
    location: string;
};

// use shared events list from src/lib/events
const baseEvents = sharedBaseEvents as Event[];

interface Props {
    /** slug in the form of '{campusId}-{eventId}' */
    slug?: string;
    /** alternatively pass campus and event directly */
    campus?: Campus;
    event?: Event;
    /** optional server event data with team-related fields */
    serverEvent?: {
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
        description?: string;
        date?: string;
        time?: string;
        language?: string;
        duration?: string;
        age_limit?: string;
        performers?: string;
        is_team_event?: boolean;
        min_team_size?: number;
        max_team_size?: number;
    };
    /** callback when campus is missing instead of redirecting */
    onCampusMissing?: () => void;
}

export default function CampusEventComponent({ slug, campus: propCampus, event: propEvent, serverEvent, onCampusMissing }: Props) {
    const router = useRouter();
    const [campus, setCampus] = useState<Campus | null>(propCampus || null);
    const [event, setEvent] = useState<Event | null>(propEvent || null);
    const [qty, setQty] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    const [bookingResult, setBookingResult] = useState<{ id: string; status: string } | null>(null);

    const { data: session } = useSession();
    const isDesktop = useDesktop();

    // lock background scroll when modal is open
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showModal]);

    // Razorpay script loader
    function loadRazorpayScript(): Promise<void> {
        return new Promise((resolve, reject) => {
            if ((window as unknown as Record<string, unknown>).Razorpay) return resolve();
            const s = document.createElement('script');
            s.src = 'https://checkout.razorpay.com/v1/checkout.js';
            s.onload = () => resolve();
            s.onerror = () => reject(new Error('Failed to load Razorpay'));
            document.body.appendChild(s);
        });
    }

    const handleConfirmBooking = async () => {
        if (isBooking) return;
        setIsBooking(true);
        try {
            const eventId = serverEvent?.id || event?.id || '';
            const amountPaise = Math.round((numericPrice || 0) * qty * 100);

            if (amountPaise <= 0) {
                // Free event — book directly
                const res = await fetch('/api/bookings/free', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ eventId, quantity: qty }),
                });
                const data = await res.json();
                if (data.booking) {
                    setBookingResult({ id: data.booking.id, status: 'confirmed' });
                    setShowModal(false);
                } else {
                    alert(data.message || 'Booking failed. Please try again.');
                }
            } else {
                // Paid event — create Razorpay order
                const orderRes = await fetch('/api/payments/razorpay/order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: amountPaise,
                        currency: 'INR',
                        receipt: `evt_${eventId}_${Date.now()}`,
                        notes: { eventId },
                    }),
                });
                const orderData = await orderRes.json();
                if (!orderData.order) {
                    alert(orderData.message || 'Failed to create payment order');
                    return;
                }

                const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
                if (!key) {
                    alert('Payment gateway not configured. Please contact support.');
                    return;
                }

                await loadRazorpayScript();
                const RazorpayConstructor = (window as unknown as Record<string, unknown>).Razorpay as new (opts: Record<string, unknown>) => { open: () => void };
                if (!RazorpayConstructor) throw new Error('Razorpay not loaded');

                const rzp = new RazorpayConstructor({
                    key,
                    amount: orderData.order.amount,
                    currency: orderData.order.currency,
                    name: event?.name || 'rkade',
                    description: `${qty} ticket(s)`,
                    order_id: orderData.order.id,
                    prefill: {
                        email: session?.user?.email || '',
                        name: session?.user?.name || '',
                    },
                    handler: async function (response: Record<string, string>) {
                        // Verify payment
                        const verifyRes = await fetch('/api/payments/razorpay/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                eventId,
                                quantity: qty,
                                amountPaise,
                            }),
                        });
                        const verifyData = await verifyRes.json();
                        if (verifyData.booking) {
                            setBookingResult({ id: verifyData.booking.id, status: 'confirmed' });
                            setShowModal(false);
                        } else {
                            alert('Payment received but booking failed. Contact support.');
                        }
                    },
                });
                rzp.open();
            }
        } catch (err) {
            console.error('Booking error:', err);
            alert('Booking failed. Please try again.');
        } finally {
            setIsBooking(false);
        }
    };

    useEffect(() => {
        // If props supplied directly, prefer them
        if (propCampus) setCampus(propCampus);
        if (propEvent) setEvent(propEvent);

        // If slug provided, parse it
        const s = slug;
        if (!s) return;
        const parts = s.split("-");
        const eventId = parts[parts.length - 1];
        const campusId = parts.slice(0, parts.length - 1).join("-");

        // resolve campus via shared helper (handles exact and normalized matches)
        const c = getCampusById(campusId);
        if (!c) {
            if (onCampusMissing) {
                onCampusMissing();
            } else {
                // default fallback — navigate to the parsed campus page if possible
                if (campusId) {
                    router.push(`/campuses/${campusId}`);
                } else {
                    router.push(`/campuses`);
                }
            }
            return;
        }
        setCampus(c);

        const ev = getEventById(eventId) || baseEvents[0];
        if (ev) {
            // avoid using `any` — treat unknown optional fields via Record<string, unknown>
            const evRecord = ev as Record<string, unknown>;
            const fallbackEventType = typeof evRecord['event_type'] === 'string' ? String(evRecord['event_type']) : undefined;
            const portrait = typeof evRecord['portrait_poster'] === 'string' ? String(evRecord['portrait_poster']) : undefined;
            const landscape = typeof evRecord['landscape_poster'] === 'string' ? String(evRecord['landscape_poster']) : undefined;

            setEvent({
                id: String(ev.id ?? ''),
                category: String(ev.category ?? fallbackEventType ?? 'Event'),
                price: String(ev.price ?? '0'),
                img: String(ev.img ?? portrait ?? landscape ?? '/brand1.svg'),
                name: `${c.name} ${String(ev.name ?? '')}`,
            });
        }
    }, [slug, propCampus, propEvent, onCampusMissing, router]);

    if (!campus || !event) {
        return (
            <div className="min-h-dvh bg-white flex items-center justify-center">
                <p className="text-sm text-zinc-600">Loading event...</p>
            </div>
        );
    }

    // parse numeric price (simple) - handle possibly undefined price
    const numericPrice = Number((event.price || "").replace(/[^0-9]/g, "")) || 0;
    const total = numericPrice * qty;

    if (isDesktop) {
        return (
            <div className={`min-h-screen relative ${inter.className}`}>
                {/* Blurred Background Image */}
                <div className="fixed inset-0 w-full h-full z-0">
                    <Image
                        src={event.img || session?.user?.image || "/brand1.svg"}
                        alt="Background"
                        fill
                        className="object-cover blur-sm opacity-80"
                        priority
                    />
                    <div className="absolute inset-0 bg-white/60" />
                </div>

                {/* Desktop Header */}
                <DesktopNavbar logoText="rkade" />

                {/* Desktop Main Content */}
                <div className="max-w-7xl mx-auto px-8 py-24 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column - Event Image & Details */}
                        <div>
                            <div className="rounded-2xl overflow-hidden mb-6 ">
                                <Image
                                    src={event.img || session?.user?.image || "/brand1.svg"}
                                    alt={event.name}
                                    width={600}
                                    height={400}
                                    className="w-full h-[400px] object-cover"
                                />
                            </div>

                            <button
                                onClick={() => {
                                    // For team events, scroll to team management section instead of showing booking modal
                                    if (serverEvent?.is_team_event && (serverEvent.event_type === 'campus_event' || serverEvent.event_type === 'campus-event' || serverEvent.event_type === 'Campus Event')) {
                                        const teamSection = document.querySelector('[data-team-management]');
                                        if (teamSection) {
                                            teamSection.scrollIntoView({ behavior: 'smooth' });
                                            return;
                                        }
                                    }
                                    setShowModal(true);
                                }}
                                className="w-full mb-6 bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-lg font-semibold text-lg transition-colors"
                            >
                                {serverEvent?.is_team_event && (serverEvent.event_type === 'campus_event' || serverEvent.event_type === 'campus-event' || serverEvent.event_type === 'Campus Event')
                                    ? 'Join or Create Team'
                                    : 'Proceed to Book'
                                }
                            </button>

                            <h1 className="text-3xl font-bold mb-6">{event.name}</h1>

                            {/* Event Tags */}
                            <div className="gap-2 mb-3 flex flex-col">
                                <div className="flex items-center gap-2 font-bold">
                                    <svg className="w-4 h-4 text-zinc-900" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path d="M7 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="text-xs text-zinc-700 px-3 py-1">{serverEvent?.event_type || event.category}</span>
                                </div>

                                {(serverEvent?.date || serverEvent?.time) && (
                                    <div className="flex items-center gap-2 font-bold">
                                        <svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="text-xs text-zinc-700 px-3 py-1">
                                            {serverEvent?.date ? new Date(serverEvent.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                            {serverEvent?.time ? `, ${serverEvent.time}` : ''}
                                        </span>
                                    </div>
                                )}

                                {serverEvent?.venue && (
                                    <div className="flex items-center gap-2 font-bold">
                                        <svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                            <path d="M21 10c0 6-9 11-9 11s-9-5-9-11a9 9 0 1 1 18 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="10" r="2.5" fill="currentColor" />
                                        </svg>
                                        <span className="text-xs text-zinc-700 px-3 py-1">{serverEvent.venue}</span>
                                    </div>
                                )}

                                {serverEvent?.language && (
                                    <div className="flex items-center gap-2 font-bold">
                                        <svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                            <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2 12h20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="text-xs text-zinc-700 px-3 py-1">{serverEvent.language}</span>
                                    </div>
                                )}
                            </div>

                            {/* Venue Section */}
                            <section className="bg-white rounded-lg p-6 shadow-sm mt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold">Venue</h2>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0">
                                            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21 10c0 6-9 11-9 11s-9-5-9-11a9 9 0 1 1 18 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                <circle cx="12" cy="10" r="2.5" fill="currentColor" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{serverEvent?.venue || campus.location || 'Venue TBA'}</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                                        <iframe
                                            src={`https://www.google.com/maps/embed/v1/search?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(serverEvent?.venue || campus.location || 'India')}`}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(serverEvent?.venue || campus.location || 'India')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
                                    >
                                        Get Directions
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </a>
                                </div>
                            </section>

                            {/* Team Management Section */}
                            {serverEvent?.is_team_event && (serverEvent.event_type === 'campus_event' || serverEvent.event_type === 'campus-event' || serverEvent.event_type === 'Campus Event') && (
                                <section className="bg-white rounded-lg p-6 shadow-sm mt-6" data-team-management>
                                    <TeamManagement
                                        eventId={serverEvent.id || event.id}
                                        isTeamEvent={serverEvent.is_team_event}
                                        minTeamSize={serverEvent.min_team_size}
                                        maxTeamSize={serverEvent.max_team_size}
                                    />
                                </section>
                            )}
                        </div>

                        {/* Right Column - Booking Card */}
                        <div className="lg:sticky lg:top-24 h-fit space-y-6">
                            {/* About the Event Section */}
                            <section className="bg-white rounded-lg p-6 shadow-sm">
                                <h2 className="text-xl font-semibold mb-4">About the Event</h2>
                                <div className="text-gray-700 leading-relaxed space-y-3">
                                    <p>{serverEvent?.description || `Join us for ${event.name} — an unforgettable experience you won't want to miss!`}</p>
                                    {serverEvent?.performers && (
                                        <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Featuring: </span>{serverEvent.performers}</p>
                                    )}
                                </div>
                            </section>

                            {/* Event Guide Section */}
                            <section className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold">Event Guide</h2>
                                    <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                                        See all
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M10.1464 5.64645C10.3417 5.45118 10.6583 5.45118 10.8536 5.64645L16.1464 10.9393C16.7322 11.5251 16.7322 12.4749 16.1464 13.0607L10.8536 18.3536C10.6583 18.5488 10.3417 18.5488 10.1464 18.3536C9.95118 18.1583 9.95118 17.8417 10.1464 17.6464L15.4393 12.3536C15.6346 12.1583 15.6346 11.8417 15.4393 11.6464L10.1464 6.35355C9.95118 6.15829 9.95118 5.84171 10.1464 5.64645Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex gap-6">
                                    {/* Language */}
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0">
                                            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2 12h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Language</p>
                                            <p className="text-sm text-gray-600">{serverEvent?.language || 'English'}</p>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0">
                                            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                                                <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Duration</p>
                                            <p className="text-sm text-gray-600">{serverEvent?.duration || 'TBA'}</p>
                                        </div>
                                    </div>

                                    {/* Age Limit */}
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0">
                                            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                                <path d="M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Age Limit</p>
                                            <p className="text-sm text-gray-600">{serverEvent?.age_limit || 'All ages'}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Terms & Conditions Section */}
                            <section className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold">Terms & Conditions</h2>
                                </div>
                                <div className="space-y-3 text-sm text-gray-700">
                                    <div className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                        <p>All tickets are non-refundable and non-transferable</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                        <p>Entry is restricted to ticket holders only. Valid ID proof is mandatory</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                        <p>Outside food and beverages are not allowed inside the venue</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                        <p>The organizers reserve the right to make changes to the event schedule</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                        <p>Photography and videography may be restricted in certain areas</p>
                                    </div>
                                </div>
                                <button className="mt-4 text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1">
                                    View all terms
                                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.27441 6.04628L10.8869 1.42098C11.038 1.26944 11.0377 1.02409 10.8861 0.872798C10.7346 0.721627 10.4891 0.722017 10.338 0.873579L5.99998 5.22357L1.66203 0.873421C1.51086 0.721879 1.26553 0.721488 1.11397 0.87264C1.03799 0.94848 1 1.04784 1 1.14719C1 1.24629 1.03773 1.34526 1.11318 1.42096L5.72557 6.04628C5.79819 6.11927 5.89701 6.16023 5.99998 6.16023C6.10295 6.16023 6.20166 6.11915 6.27441 6.04628Z" fill="currentColor" stroke="currentColor" />
                                    </svg>
                                </button>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Desktop Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowModal(false)} />
                        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
                            <div className="p-6 border-b">
                                <h3 className="text-2xl font-bold">Confirm Booking</h3>
                                <p className="text-gray-600 mt-1">Review your seats and total before confirming</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">₹{numericPrice}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-gray-600">Quantity</span>
                                    <span className="font-semibold">{qty}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-gray-600">Taxes</span>
                                    <span className="font-semibold text-green-600">FREE</span>
                                </div>
                                <div className="border-t pt-4 flex items-center justify-between">
                                    <span className="text-lg font-semibold">Total</span>
                                    <span className="text-2xl font-bold text-sky-600">₹{total}</span>
                                </div>
                            </div>
                            <div className="p-6 border-t flex gap-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmBooking}
                                    disabled={isBooking}
                                    className="flex-1 py-3 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-semibold transition-colors disabled:opacity-50"
                                >
                                    {isBooking ? 'Processing...' : 'Confirm Booking'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-gray-50">
            <div className="mx-auto w-full max-w-[420px] bg-white">
                <Navbar />

                <main className="px-4 pb-8 pt-0 md:pt-36">
                    <div className="mb-4">
                        <div className="rounded-xl border-4 border-sky-300 overflow-hidden">
                            <Image src={event.img || session?.user?.image || "/brand1.svg"} alt={event.name} width={400} height={160} className="w-full h-40 object-cover" />
                        </div>
                    </div>



                    <h1 className="text-xl font-bold mb-2">{event.name}</h1>
                    <div className="gap-2 mb-3 flex flex-col">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                <path d="M7 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-xs bg-zinc-100 px-3 py-1 rounded-full">{serverEvent?.event_type || event.category}</span>
                        </div>

                        {(serverEvent?.date || serverEvent?.time) && (
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="text-xs bg-zinc-100 px-3 py-1 rounded-full">
                                    {serverEvent?.date ? new Date(serverEvent.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                    {serverEvent?.time ? `, ${serverEvent.time}` : ''}
                                </span>
                            </div>
                        )}

                        {serverEvent?.venue && (
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                    <path d="M21 10c0 6-9 11-9 11s-9-5-9-11a9 9 0 1 1 18 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="10" r="2.5" fill="currentColor" />
                                </svg>
                                <span className="text-xs bg-zinc-100 px-3 py-1 rounded-full">{serverEvent.venue}</span>
                            </div>
                        )}

                        {serverEvent?.language && (
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                    <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 12h20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="text-xs bg-zinc-100 px-3 py-1 rounded-full">{serverEvent.language}</span>
                            </div>
                        )}
                    </div>
                    <section className="text-md text-zinc-700 mb-4">
                        <h2 className="font-semibold mb-2">About</h2>
                        <p className="leading-relaxed">{serverEvent?.description || `Join us for ${event.name} — an unforgettable experience!`}</p>
                        {serverEvent?.performers && (
                            <p className="text-sm text-gray-500 mt-2"><span className="font-medium text-gray-700">Featuring: </span>{serverEvent.performers}</p>
                        )}
                        {serverEvent?.duration && (
                            <p className="text-sm text-gray-500 mt-1"><span className="font-medium text-gray-700">Duration: </span>{serverEvent.duration}</p>
                        )}
                        {serverEvent?.age_limit && (
                            <p className="text-sm text-gray-500 mt-1"><span className="font-medium text-gray-700">Age: </span>{serverEvent.age_limit}</p>
                        )}
                    </section>

                    {/* Team Management Section - Mobile */}
                    {serverEvent?.is_team_event && (serverEvent.event_type === 'campus-event' || serverEvent.event_type === 'Campus Event') && (
                        <section className="mb-6">
                            <TeamManagement
                                eventId={serverEvent.id || event.id}
                                isTeamEvent={serverEvent.is_team_event}
                                minTeamSize={serverEvent.min_team_size}
                                maxTeamSize={serverEvent.max_team_size}
                            />
                        </section>
                    )}

                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-zinc-700">Quantity</div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1 bg-zinc-100 rounded">-</button>
                                <div className="px-3 py-1 border rounded">{qty}</div>
                                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-1 bg-zinc-100 rounded">+</button>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 flex items-center justify-between">
                        <div className="text-sm text-zinc-700">Total Price</div>
                        <div className="text-lg font-semibold">₹{total}</div>
                    </div>

                    <button
                        onClick={() => {
                            // For team events, scroll to team management section instead of showing booking modal
                            if (serverEvent?.is_team_event && (serverEvent.event_type === 'campus_event' || serverEvent.event_type === 'campus-event' || serverEvent.event_type === 'Campus Event')) {
                                const teamSection = document.querySelector('[data-team-management]');
                                if (teamSection) {
                                    teamSection.scrollIntoView({ behavior: 'smooth' });
                                    return;
                                }
                            }
                            setShowModal(true);
                        }}
                        className="w-full bg-black text-white py-3 rounded-lg font-semibold"
                    >
                        {serverEvent?.is_team_event && (serverEvent.event_type === 'campus_event' || serverEvent.event_type === 'campus-event' || serverEvent.event_type === 'Campus Event')
                            ? 'Join or Create Team'
                            : 'Book Seats'
                        }
                    </button>

                    {/* Modal overlay */}
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
                            {/* translucent backdrop */}
                            <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowModal(false)} />

                            <div className="relative w-full max-w-md md:mb-0 bg-white rounded-xl shadow-lg overflow-hidden z-10">
                                <div className="p-2 border-b">
                                    <h3 className="text-lg font-semibold">Confirm Booking</h3>
                                    <p className="text-sm text-zinc-600">Review your seats and total before booking</p>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-zinc-700">Subtotal</div>
                                        <div className="font-medium">₹{numericPrice}</div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-zinc-700">Quantity</div>
                                        <div className="font-medium">{qty}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-zinc-700">taxes</div>
                                        <div className="font-medium">free</div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-zinc-700">Total</div>
                                        <div className="text-lg font-semibold">₹{total}</div>
                                    </div>
                                </div>

                                <div className="p-4 border-t flex gap-3">
                                    <button onClick={() => setShowModal(false)} className="flex-1 py-2 rounded border">Cancel</button>
                                    <button onClick={() => handleConfirmBooking()} className="flex-1 py-2 rounded bg-black text-white">Book Seats</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile Team Management Section */}
                    {serverEvent?.is_team_event && (serverEvent.event_type === 'campus_event' || serverEvent.event_type === 'campus-event' || serverEvent.event_type === 'Campus Event') && (
                        <section className="bg-white rounded-lg p-4 shadow-sm mt-6" data-team-management>
                            <TeamManagement
                                eventId={serverEvent.id || event.id}
                                isTeamEvent={serverEvent.is_team_event}
                                minTeamSize={serverEvent.min_team_size}
                                maxTeamSize={serverEvent.max_team_size}
                            />
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}

