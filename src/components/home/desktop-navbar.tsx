"use client";

import React, { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  onSearch?: (query: string) => void;
  logoText?: string;
  className?: string;
}

const NAV_LINKS = [
  { label: 'All Events', href: '/home' },
  { label: 'Campus Events', href: '/campus_event' },
  { label: 'Events', href: '/event' },
  { label: 'Movies', href: '/movie' },
  { label: 'Sports', href: '/sports' },
  { label: 'Past Events', href: '/past-events' },
] as const;

export default function DesktopNavbar({ onSearch, logoText = "rkade", className = "" }: NavbarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [showSearchBar, setShowSearchBar] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // For the animated sliding pill
  const navRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = React.useState({ left: 0, width: 0, opacity: 0 });
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => { setMounted(true); }, []);

  // Update the pill position whenever pathname changes
  useEffect(() => {
    const idx = NAV_LINKS.findIndex(
      ({ href }) => pathname === href || pathname.startsWith(href + '/')
    );
    if (idx === -1 || !navRef.current) {
      setPillStyle(p => ({ ...p, opacity: 0 }));
      return;
    }
    const el = linkRefs.current[idx];
    const nav = navRef.current;
    if (el && nav) {
      const navRect = nav.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setPillStyle({
        left: elRect.left - navRect.left,
        width: elRect.width,
        opacity: 1,
      });
    }
  }, [pathname, mounted]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (onSearch && query.trim()) onSearch(query.trim());
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${className} ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}
      style={{
        background: 'linear-gradient(90deg, rgba(24,24,27,0.95) 0%, rgba(39,39,42,0.95) 50%, rgba(24,24,27,0.95) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
      }}
    >
      <div className="px-6 md:px-10 h-[73px] flex items-center gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group mr-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)' }}
          >
            <Image src="/logo.svg" alt={logoText} width={18} height={18} className="brightness-[10]" />
          </div>
          <span
            className="text-[15px] font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
            style={{ backgroundImage: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text' }}
          >
            rkade
          </span>
        </Link>

        {/* Nav Pills with animated sliding background */}
        <nav ref={navRef} className="hidden lg:flex items-center gap-0.5 ml-1 relative">
          {/* Animated pill background */}
          <span
            className="absolute top-0 h-full rounded-full transition-all duration-300 ease-out pointer-events-none"
            style={{
              left: pillStyle.left,
              width: pillStyle.width,
              opacity: pillStyle.opacity,
              background: 'linear-gradient(90deg,rgba(124,58,237,0.25),rgba(37,99,235,0.25))',
              boxShadow: '0 0 0 1px rgba(124,58,237,0.3)',
            }}
          />
          {NAV_LINKS.map(({ label, href }, i) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            const isPastEvents = href === '/past-events';
            return (
              <Link
                key={label}
                href={href}
                ref={el => { linkRefs.current[i] = el; }}
                className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 z-10 group/link ${isActive
                  ? isPastEvents ? 'text-violet-400' : 'text-white'
                  : isPastEvents
                    ? 'text-violet-400/70 hover:text-violet-300'
                    : 'text-zinc-400 hover:text-white'
                  }`}
              >
                {label}
                {/* Hover underline animation */}
                <span className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full transition-all duration-200 scale-x-0 group-hover/link:scale-x-100 origin-left ${isPastEvents ? 'bg-violet-400' : 'bg-gradient-to-r from-violet-400 to-blue-400'}`} />
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Location chip */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-full cursor-pointer transition-all duration-200 hover:shadow-sm">
          <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-[12px] font-medium text-zinc-300">{session?.user?.current_city || "Select city"}</span>
          <svg className="w-3 h-3 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* Search (expandable) */}
        <div className="relative flex items-center">
          <form
            role="search"
            onSubmit={handleSearchSubmit}
            className={`overflow-hidden transition-all duration-300 ease-in-out ${showSearchBar ? 'w-72 opacity-100' : 'w-0 opacity-0'}`}
          >
            <div
              className="relative"
              style={{
                boxShadow: searchFocused ? '0 0 0 3px rgba(124,58,237,0.18)' : undefined,
                borderRadius: '12px',
                transition: 'box-shadow 0.2s',
              }}
            >
              <input
                type="search"
                name="search"
                placeholder="Search events, movies, sports…"
                aria-label="Search"
                autoFocus={showSearchBar}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 pl-9 pr-3 py-2 text-[13px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
              />
              <svg aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" /><path d="M20 20L17 17" />
              </svg>
            </div>
          </form>

          <button
            onClick={() => setShowSearchBar(s => !s)}
            aria-label="Toggle search"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group/search ${showSearchBar
              ? 'ml-2 bg-violet-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
              }`}
          >
            {showSearchBar ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            ) : (
              <svg className="w-4 h-4 transition-transform duration-200 group-hover/search:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M20 20L17 17" /></svg>
            )}
          </button>
        </div>

        {/* Create event */}
        <button
          onClick={() => window.location.href = "/events/create"}
          className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)', boxShadow: '0 2px 12px rgba(124,58,237,0.3)' }}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Create Event
        </button>

        {/* Profile */}
        <div
          onClick={() => window.location.href = "/profile"}
          role="button"
          tabIndex={0}
          aria-label="Go to profile"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') window.location.href = "/profile"; }}
          className="w-9 h-9 rounded-full overflow-hidden cursor-pointer ring-2 ring-offset-1 ring-zinc-600 ring-offset-zinc-900 hover:ring-violet-400 transition-all duration-200 flex items-center justify-center bg-zinc-800 hover:scale-105"
        >
          {session?.user?.image ? (
            <Image src={session.user.image} alt={session.user.name || "Profile"} width={36} height={36} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-5 h-5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          )}
        </div>
      </div>
    </header>
  );
}
