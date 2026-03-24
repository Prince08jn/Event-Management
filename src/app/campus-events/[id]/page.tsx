"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import Image from "next/image";
import { getCampusById } from "@/lib/campuses";
import { useSession } from "next-auth/react";
import { useDesktop } from "@/hooks/useDesktop";
import Navbar from "@/components/home/navbar";
import DesktopNavbar from "@/components/home/desktop-navbar";
const inter = Inter({ subsets: ["latin"] });

type Event = { id: string; category: string; name: string; price: string; img: string };
type Campus = { id: string; name: string; fullName: string; image: string; location: string };

const baseEvents: Event[] = [
	{ id: "e1", category: "Campus", name: "Tech Symposium", price: "₹1099", img: "/messi.jpg" },
	{ id: "e2", category: "Events", name: "Cultural Fest", price: "₹1099", img: "/messi.jpg" },
	{ id: "e3", category: "Campus", name: "Innovation Workshop", price: "₹899", img: "/messi.jpg" },
	{ id: "e4", category: "Events", name: "Sports Meet", price: "₹599", img: "/messi.jpg" }
];

interface PageProps {
	params: Promise<{ id: string }>;
}

export default function CampusEventPage({ params }: PageProps) {
	const router = useRouter();
	const resolvedParams = React.use(params);
	const slug = resolvedParams.id; // expected format: '{campusId}-{eventId}'
	const [campus, setCampus] = useState<Campus | null>(null);
	const [event, setEvent] = useState<Event | null>(null);
	const [qty, setQty] = useState(1);
	const [showModal, setShowModal] = useState(false);
	const [isBooking, setIsBooking] = useState(false);
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

	const handleConfirmBooking = async () => {
		if (isBooking) return;
		setIsBooking(true);
		try {
			// TODO: call booking API here. For now simulate a short delay.
			await new Promise((res) => setTimeout(res, 800));
			setShowModal(false);
			alert(`Booked ${qty} seat(s) for ₹${total}`);
		} catch (err) {
			console.error('Booking error:', err);
			alert('Booking failed. Please try again.');
		} finally {
			setIsBooking(false);
		}
	};

	useEffect(() => {
		if (!slug) return;
		const parts = slug.split("-");
		// last part is event id (e1,e2...), campus id is everything before last part
		const eventId = parts[parts.length - 1];
		const campusId = parts.slice(0, parts.length - 1).join("-");

	const c = getCampusById(campusId);
		if (!c) {
			if (campusId) {
				router.push(`/campuses/${campusId}`);
			} else {
				router.push(`/campuses`);
			}
			return;
		}
		setCampus(c);

		// find matching event from baseEvents
		const ev = baseEvents.find((e) => e.id === eventId) || null;
		if (!ev) {
			// fallback: show first event
			setEvent(baseEvents[0]);
			return;
		}

		// create a campus-specific title
		setEvent({ ...ev, name: `${c.name} ${ev.name}` });
	}, [slug, router]);

	if (!campus || !event) {
		return (
			<div className="min-h-dvh bg-white flex items-center justify-center">
				<p className="text-sm text-zinc-600">Loading event...</p>
			</div>
		);
	}

	// parse numeric price (simple)
	const numericPrice = Number(event.price.replace(/[^0-9]/g, "")) || 0;
	const total = numericPrice * qty;

	// Desktop Layout
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
								onClick={() => setShowModal(true)} 
								className="w-full mb-6 bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-lg font-semibold text-lg transition-colors"
							>
								Proceed to Book
							</button>

							<h1 className="text-3xl font-bold mb-6">{event.name}</h1>

							{/* Event Tags */}
							<div className="gap-2 mb-3 flex flex-col">
								<div className="flex items-center gap-2 font-bold">
									<svg className="w-4 h-4 text-zinc-900 " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
										<path d="M7 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										<path d="M12 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										<rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									<span className="text-xs text-zinc-700 px-3 py-1">Hackathon</span>
								</div>

								<div className="flex items-center gap-2 font-bold">
									<svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
										<path d="M7 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										<path d="M12 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										<rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									<span className="text-xs text-zinc-700 px-3 py-1">15 Oct, 9:00 AM</span>
								</div>

								<div className="flex items-center gap-2 font-bold">
									<svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
										<path d="M21 10c0 6-9 11-9 11s-9-5-9-11a9 9 0 1 1 18 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
										<circle cx="12" cy="10" r="2.5" fill="currentColor" />
									</svg>
									<span className="text-xs text-zinc-700 px-3 py-1">New Delhi</span>
								</div>

								<div className="flex items-center gap-2 font-bold">
									<svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
										<path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
										<path d="M2 12h20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									<span className="text-xs text-zinc-700 px-3 py-1">English</span>
								</div>
							</div>

							{/* Venue Section - Moved Here */}
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
											<p className="text-sm font-medium text-gray-900">Chandigarh University, Mohali</p>
											<p className="text-sm text-gray-600 mt-1">NH-05, Chandigarh-Ludhiana Highway, Gharuan, Mohali, Punjab, India, 140413</p>
										</div>
									</div>
									<div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
										<iframe
											src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109225.40916991737!2d76.53562979999999!3d30.769167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ffb140bd63e07%3A0x68591e334d17a988!2sChandigarh%20University!5e0!3m2!1sen-IN!2sin!4v1234567890123!5m2!1sen-IN!2sin"
											width="100%"
											height="100%"
											style={{ border: 0 }}
											allowFullScreen
											loading="lazy"
											referrerPolicy="no-referrer-when-downgrade"
										/>
									</div>
									<button className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1">
										Get Directions
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
									</button>
								</div>
							</section>
						</div>

						{/* Right Column - Booking Card */}
						<div className="lg:sticky lg:top-24 h-fit space-y-6">
							{/* About the Event Section */}
							<section className="bg-white rounded-lg p-6 shadow-sm">
								<h2 className="text-xl font-semibold mb-4">About the Event</h2>
								<div className="text-gray-700 leading-relaxed space-y-3">
									<p>
										Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. 
										Le Lorem Ipsum est le faux texte standard de l&apos;imprimerie depuis les années 1500, 
										quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. 
										Il n&apos;a pas fait que survivre cinq siècles, mais s&apos;est aussi adapté à la bureautique informatique, sans que son contenu n&apos;en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, 
										par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.
									</p>
									<p>
										Expect an evening filled with great music, good vibes, and pure Diljit-style magic.
									</p>
								</div>
								<button className="mt-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
									Show more
									<svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M6.27441 6.04628L10.8869 1.42098C11.038 1.26944 11.0377 1.02409 10.8861 0.872798C10.7346 0.721627 10.4891 0.722017 10.338 0.873579L5.99998 5.22357L1.66203 0.873421C1.51086 0.721879 1.26553 0.721488 1.11397 0.87264C1.03799 0.94848 1 1.04784 1 1.14719C1 1.24629 1.03773 1.34526 1.11318 1.42096L5.72557 6.04628C5.79819 6.11927 5.89701 6.16023 5.99998 6.16023C6.10295 6.16023 6.20166 6.11915 6.27441 6.04628Z" fill="currentColor" stroke="currentColor" />
									</svg>
								</button>
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
											<p className="text-sm text-gray-600">Punjabi, Hindi, English</p>
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
											<p className="text-sm text-gray-600">3 Hours and 59 Minutes</p>
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
											<p className="text-sm font-medium text-gray-900">Tickets Needed For</p>
											<p className="text-sm text-gray-600">18 yrs &amp; above</p>
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
											<circle cx="12" cy="12" r="3"/>
										</svg>
										<p>All tickets are non-refundable and non-transferable</p>
									</div>
									<div className="flex items-start gap-2">
										<svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
											<circle cx="12" cy="12" r="3"/>
										</svg>
										<p>Entry is restricted to ticket holders only. Valid ID proof is mandatory</p>
									</div>
									<div className="flex items-start gap-2">
										<svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
											<circle cx="12" cy="12" r="3"/>
										</svg>
										<p>Outside food and beverages are not allowed inside the venue</p>
									</div>
									<div className="flex items-start gap-2">
										<svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
											<circle cx="12" cy="12" r="3"/>
										</svg>
										<p>The organizers reserve the right to make changes to the event schedule</p>
									</div>
									<div className="flex items-start gap-2">
										<svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
											<circle cx="12" cy="12" r="3"/>
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

	// Mobile Layout (existing)
	return (
		<div className="min-h-dvh bg-gray-50">
			<div className="mx-auto w-full max-w-[420px] bg-white">
				<Navbar/>

				<main className="px-4 pb-8">
					<div className="mb-4">
						<div className="rounded-xl border-4 border-sky-300 overflow-hidden">
							<Image src={event.img || session?.user?.image || "/brand1.svg"} alt={event.name} width={400} height={160} className="w-full h-40 object-cover" />
						</div>
					</div>

					<h1 className="text-xl font-bold mb-2">{event.name}</h1>
                      
					{/* tag list with icons */}
					<div className="gap-2 mb-3 flex flex-col">
						{/* simple inline icon components */}
						<div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
								<path d="M7 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M12 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								<rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
							<span className="text-xs bg-zinc-100 px-3 py-1 rounded-full">Hackathon</span>
						</div>

						<div className="flex items-center gap-2">
							<svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
								<path d="M7 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M12 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								<rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
							<span className="text-xs bg-zinc-100 px-3 py-1 rounded-full">15 Oct, 9:00 AM</span>
						</div>

						<div className="flex items-center gap-2">
							<svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
								<path d="M21 10c0 6-9 11-9 11s-9-5-9-11a9 9 0 1 1 18 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
								<circle cx="12" cy="10" r="2.5" fill="currentColor" />
							</svg>
							<span className="text-xs bg-zinc-100 px-3 py-1 rounded-full">New Delhi</span>
						</div>

						<div className="flex items-center gap-2">
							<svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
								<path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M2 12h20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
							<span className="text-xs bg-zinc-100 px-3 py-1 rounded-full">English</span>
						</div>
					</div>

					<section className="text-md text-zinc-700 mb-4">
						<h2 className="font-semibold mb-2">Event Details</h2>
						<p className="leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a accumsan dui. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque varius tellus ut urna ullamcorper, at pulvinar lorem lobortis. In gravida ante sit amet, ac tempus massa ullamcorper eu.</p>
					</section>

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
						onClick={() => setShowModal(true)} 
						className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-lg font-semibold text-lg transition-colors"
					>
						Proceed to Book
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
				</main>
			</div>
		</div>
	);
}

