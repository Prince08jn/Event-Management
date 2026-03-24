"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Inter } from "next/font/google";
import { Calendar, Trophy, Film, Users, ArrowRight, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

/* ── Static slides for the public carousel (no auth needed) ────────────── */
const SLIDES = [
  {
    id: "s1",
    title: "Travis Scott — Circus Maximus Tour",
    subtitle: "Music • Events",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&h=500&fit=crop",
    price: "₹2,999",
    date: "15 Dec 2025",
    href: "/event",
  },
  {
    id: "s2",
    title: "IPL 2025 — MI vs CSK",
    subtitle: "Sports",
    img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=900&h=500&fit=crop",
    price: "₹1,499",
    date: "28 Mar 2025",
    href: "/sports",
  },
  {
    id: "s3",
    title: "Mood Indigo 2025 — IIT Bombay",
    subtitle: "Campus Events",
    img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=900&h=500&fit=crop",
    price: "₹399",
    date: "20 Dec 2025",
    href: "/campus_event",
  },
  {
    id: "s4",
    title: "Kantara: A Legend — Chapter 1",
    subtitle: "Movies",
    img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&h=500&fit=crop",
    price: "₹149",
    date: "15 Nov 2025",
    href: "/movie",
  },
  {
    id: "s5",
    title: "Coldplay India 2025",
    subtitle: "Music • Events",
    img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&h=500&fit=crop",
    price: "₹4,999",
    date: "8 Feb 2025",
    href: "/event",
  },
];

const SLIDE_DURATION = 4500;

/* ── Mini event cards for dashboard preview ─────────────────────────────── */
const PREVIEW_EVENTS = [
  { emoji: "🎤", title: "Travis Scott Live", cat: "Music", price: "₹2,999", color: "from-violet-600 to-purple-800", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop" },
  { emoji: "🏏", title: "IPL 2025 — MI vs CSK", cat: "Sports", price: "₹1,499", color: "from-blue-500 to-cyan-700", img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=300&h=200&fit=crop" },
  { emoji: "🎭", title: "Mood Indigo 2025", cat: "Campus", price: "₹399", color: "from-pink-500 to-rose-700", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=200&fit=crop" },
  { emoji: "🎬", title: "Kantara Chapter 1", cat: "Movie", price: "₹149", color: "from-orange-500 to-amber-700", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=200&fit=crop" },
  { emoji: "🎸", title: "Coldplay India", cat: "Music", price: "₹4,999", color: "from-emerald-500 to-teal-700", img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=200&fit=crop" },
  { emoji: "🏆", title: "Campus Hackathon 2025", cat: "Campus", price: "FREE", color: "from-indigo-500 to-blue-700", img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&h=200&fit=crop" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(Date.now());


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* carousel progress bar */
  const startProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    startRef.current = Date.now();
    setProgress(0);
    timerRef.current = setInterval(() => {
      const pct = Math.min(((Date.now() - startRef.current) / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        setCurrent((prev) => (prev + 1) % SLIDES.length);
      }
    }, 30);
  };

  useEffect(() => {
    startProgress();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const goTo = (idx: number) => { if (timerRef.current) clearInterval(timerRef.current); setCurrent(idx); };
  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((current + 1) % SLIDES.length);

  const slide = SLIDES[current];

  return (
    <div className={`min-h-screen bg-white ${inter.className} overflow-x-hidden`}>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-xl ${
        scrolled
          ? "border-b border-white/10 shadow-lg shadow-black/10 py-3"
          : "py-4"
        }`}
        style={{
          background: 'linear-gradient(90deg, rgba(9,9,11,0.97) 0%, rgba(24,24,27,0.97) 50%, rgba(9,9,11,0.97) 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
            >
              <span className="text-white font-bold text-lg">r</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-blue-400"
            >rkade</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Campus', href: '/campus_event' },
              { label: 'Sports', href: '/sports' },
              { label: 'Movies', href: '/movie' },
              { label: 'Events', href: '/event' },
              { label: 'Past Events', href: '/past-events', accent: true },
            ].map(({ label, href, accent }) => (
              <Link
                key={label}
                href={href}
                className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 group/link ${
                  accent
                    ? 'text-violet-400 hover:text-violet-300 hover:bg-violet-500/10'
                    : 'text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
                <span className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full scale-x-0 group-hover/link:scale-x-100 origin-left transition-transform duration-250 ${
                  accent ? 'bg-violet-400' : 'bg-gradient-to-r from-violet-400 to-blue-400'
                }`} />
              </Link>
            ))}
          </div>

          {/* Right side: sign in + CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="hidden sm:block text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup" className="hidden sm:block">
              <button
                className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 animate-pulse-glow"
                style={{
                  background: 'linear-gradient(90deg,#7c3aed,#2563eb)',
                  boxShadow: '0 2px 20px rgba(124,58,237,0.4), 0 0 40px rgba(124,58,237,0.15)',
                }}
              >
                Get Started
              </button>
            </Link>

            {/* Hamburger (mobile) */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-violet-500/20 transition-colors text-white"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className="px-4 pb-4 pt-2 space-y-1 bg-zinc-900/95 backdrop-blur-xl border-t border-white/10">
            {[
              { label: 'Campus', href: '/campus_event' },
              { label: 'Sports', href: '/sports' },
              { label: 'Movies', href: '/movie' },
              { label: 'Events', href: '/event' },
              { label: 'Past Events', href: '/past-events', accent: true },
              { label: 'Sign In', href: '/auth/signin' },
              { label: 'Get Started', href: '/auth/signup', cta: true },
            ].map(({ label, href, accent, cta }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  cta
                    ? 'text-white justify-center'
                    : accent
                      ? 'text-violet-400 hover:bg-violet-500/10'
                      : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                }`}
                style={cta ? { background: 'linear-gradient(90deg,#7c3aed,#2563eb)' } : {}}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-32 pb-12 lg:pt-48 lg:pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-30 translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/3 translate-y-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-zinc-600">Live events happening now</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 mb-8 leading-tight">
            Your Campus.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Your Arena.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-zinc-600 mb-10 leading-relaxed">
            The ultimate platform for university events, sports tournaments, and entertainment.
            Join teams, book tickets, and experience the hype.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/event">
              <Button className="h-14 px-8 rounded-full text-lg bg-black hover:bg-zinc-800 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                Explore Events
              </Button>
            </Link>
            <Link href="/events/create">
              <Button variant="outline" className="h-14 px-8 rounded-full text-lg border-2 hover:bg-zinc-50 transition-all">
                Host an Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Events Carousel (Full-width) ─────────────────────────── */}
      <section className="pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">Featured Events</h2>
              <p className="text-sm text-zinc-500 mt-1">Handpicked for you — no account needed</p>
            </div>
            <Link href="/event" className="text-sm font-medium text-violet-600 hover:text-violet-800 flex items-center gap-1">
              See all <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="w-full px-0 sm:px-2 lg:px-4">

          {/* Carousel Card */}
          <div className="relative overflow-hidden shadow-2xl bg-zinc-900 min-h-[300px] md:min-h-[360px] flex flex-col md:flex-row sm:rounded-2xl sm:mx-auto sm:max-w-[98%] lg:max-w-[96%]">

            {/* Left — Image */}
            <Link href={slide.href} className="relative w-full md:w-1/2 min-h-[240px] md:min-h-full overflow-hidden group block">
              <img
                src={slide.img}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            {/* Right — Info */}
            <div className="w-full md:w-1/2 flex flex-col justify-center gap-4 px-7 py-8 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
              <span className="self-start px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">
                🎭 {slide.subtitle}
              </span>
              <h3 className="text-white font-bold text-2xl md:text-3xl leading-snug">{slide.title}</h3>
              <p className="text-zinc-400 text-sm flex items-center gap-2">📅 {slide.date}</p>
              <span className="self-start px-3 py-1 rounded-lg text-sm font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                {slide.price}
              </span>
              <Link
                href={slide.href}
                className="mt-1 self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                style={{ background: "linear-gradient(90deg,#7c3aed,#2563eb)" }}
              >
                Book Now
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
              <div
                className="h-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg,#7c3aed,#2563eb)",
                  transition: progress === 0 ? "none" : "width 0.03s linear",
                }}
              />
            </div>

            {/* Prev / Next buttons */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="transition-all duration-300"
                style={{
                  width: i === current ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === current
                    ? "linear-gradient(90deg,#7c3aed,#2563eb)"
                    : "#d4d4d8",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive Dashboard Preview ─────────────────────────── */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">Your events hub, at a glance</h2>
            <p className="text-lg text-zinc-500">Browse, book, and team up — all from one dashboard.</p>
          </div>

          {/* Dashboard frame */}
          <div className="relative mx-auto max-w-5xl">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 bg-white">
              {/* Fake browser bar */}
              <div className="bg-zinc-100 border-b border-zinc-200 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-4 flex-1 bg-white rounded-md px-3 py-1 text-xs text-zinc-400 border border-zinc-200">
                  rkade.in/home
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-5 bg-zinc-50 grid grid-cols-3 gap-3 min-h-[320px]">
                {/* Left column */}
                <div className="space-y-3 pt-6">
                  {PREVIEW_EVENTS.slice(0, 2).map((e, i) => (
                    <div key={i} className={`relative rounded-xl overflow-hidden shadow-sm bg-gradient-to-br ${e.color} p-3 min-h-[100px]`}>
                      <img src={e.img} alt={e.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                      <div className="relative">
                        <p className="text-[10px] text-white/70 font-medium uppercase tracking-wide">{e.cat}</p>
                        <p className="text-white font-bold text-xs mt-0.5 line-clamp-2">{e.title}</p>
                        <span className="mt-1.5 inline-block px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-full">{e.price}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Middle column */}
                <div className="space-y-3">
                  {PREVIEW_EVENTS.slice(2, 5).map((e, i) => (
                    <div key={i} className={`relative rounded-xl overflow-hidden shadow-sm bg-gradient-to-br ${e.color} p-3 min-h-[90px]`}>
                      <img src={e.img} alt={e.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                      <div className="relative">
                        <p className="text-[10px] text-white/70 font-medium uppercase tracking-wide">{e.cat}</p>
                        <p className="text-white font-bold text-xs mt-0.5 line-clamp-2">{e.title}</p>
                        <span className="mt-1.5 inline-block px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-full">{e.price}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right column */}
                <div className="space-y-3 pt-4">
                  {PREVIEW_EVENTS.slice(3, 6).map((e, i) => (
                    <div key={i} className={`relative rounded-xl overflow-hidden shadow-sm bg-gradient-to-br ${e.color} p-3 min-h-[95px]`}>
                      <img src={e.img} alt={e.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                      <div className="relative">
                        <p className="text-[10px] text-white/70 font-medium uppercase tracking-wide">{e.cat}</p>
                        <p className="text-white font-bold text-xs mt-0.5 line-clamp-2">{e.title}</p>
                        <span className="mt-1.5 inline-block px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-full">{e.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating pill — Tournament */}
            <div className="absolute -left-12 top-1/3 p-4 bg-white rounded-xl shadow-xl border border-zinc-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: "3s" }}>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Trophy size={20} />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Tournament</p>
                <p className="text-sm font-bold">Inter-IIT Sports</p>
              </div>
            </div>

            {/* Floating pill — Team Created */}
            <div className="absolute -right-8 bottom-1/4 p-4 bg-white rounded-xl shadow-xl border border-zinc-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: "4s" }}>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Team Created</p>
                <p className="text-sm font-bold">Code Warriors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid (Bento Box Style) ──────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Everything you need</h2>
            <p className="text-lg text-zinc-600">One platform, endless possibilities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Campus Events - Large */}
            <div className="md:col-span-2 row-span-1 md:row-span-2 relative group overflow-hidden rounded-3xl bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-all">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
              <Image src="/iit.svg" alt="Campus Events" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 p-8 z-20">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 text-white">
                  <Calendar size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Campus Events</h3>
                <p className="text-zinc-200 mb-4 max-w-md">Discover fests, workshops, and cultural events across universities.</p>
                <Link href="/campus_event" className="inline-flex items-center text-white font-medium hover:underline">
                  Explore Campus <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>

            {/* Sports */}
            <div className="relative group overflow-hidden rounded-3xl bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-all">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
              <Image src="/football.svg" alt="Sports" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 p-8 z-20">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 text-white">
                  <Trophy size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Sports</h3>
                <p className="text-zinc-200 mb-4">Join tournaments, form teams, and compete.</p>
                <Link href="/sports" className="inline-flex items-center text-white font-medium hover:underline">
                  View Sports <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>

            {/* Movies */}
            <div className="relative group overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 shadow-sm hover:shadow-md transition-all">
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <Film size={120} className="text-white" />
              </div>
              <div className="absolute bottom-0 left-0 p-8 z-20">
                <h3 className="text-2xl font-bold text-white mb-2">Movies</h3>
                <p className="text-zinc-400 mb-4">Catch the latest screenings and film festivals.</p>
                <Link href="/movie" className="inline-flex items-center text-white font-medium hover:underline">
                  Watch Now <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>

            {/* Team Up */}
            <div className="relative group overflow-hidden rounded-3xl bg-blue-600 border border-blue-500 shadow-sm hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                <Users size={120} className="text-white" />
              </div>
              <div className="absolute bottom-0 left-0 p-8 z-20">
                <h3 className="text-2xl font-bold text-white mb-2">Team Up</h3>
                <p className="text-blue-100 mb-4">Create teams, invite friends, and register together.</p>
                <Link href="/auth/signup" className="inline-flex items-center text-white font-medium hover:underline">
                  Create Team <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50+", label: "Universities" },
              { value: "10k+", label: "Active Students" },
              { value: "500+", label: "Events Hosted" },
              { value: "100%", label: "Secure Booking" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-extrabold text-zinc-900 mb-2">{s.value}</p>
                <p className="text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
}
