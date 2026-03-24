"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  onSearch?: (query: string) => void;
  logoText?: string;
  className?: string;
}

export default function Navbar({ onSearch, logoText = "rkade", className = "" }: NavbarProps) {
  const { data: session } = useSession();
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState(session?.user?.current_city || "");
  const [searchFocused, setSearchFocused] = useState(false);

  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Chandigarh",
    "Lucknow", "Kochi", "Indore", "Nagpur", "Bhopal"
  ];

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (onSearch && query.trim()) onSearch(query.trim());
  };

  return (
    <header 
      className={`px-4 pt-4 pb-3 ${className}`}
      style={{
        background: 'linear-gradient(180deg, rgba(9,9,11,1) 0%, rgba(24,24,27,1) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      {/* Top row: location + logo + profile */}
      <div className="flex items-center justify-between mb-3">

        {/* City selector */}
        <div className="relative z-50">
          <button
            onClick={() => setShowCityDropdown(s => !s)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-[12px] font-semibold text-zinc-200">{selectedCity || "Select city"}</span>
            <svg className="w-3 h-3 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showCityDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowCityDropdown(false)} />
              <div className="absolute top-full left-0 mt-2 w-52 bg-zinc-900 rounded-2xl shadow-2xl border border-white/10 z-50 max-h-72 overflow-y-auto backdrop-blur-xl">
                <div className="p-2 border-b border-white/5">
                  <input type="text" placeholder="Search city…"
                    className="w-full px-3 py-2 text-xs bg-black/40 text-white placeholder:text-zinc-500 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="pb-2 pt-1">
                  {cities.map(city => (
                    <button key={city} onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-4 py-2 text-[13px] hover:bg-white/5 transition-colors ${selectedCity === city ? 'text-white font-semibold' : 'text-zinc-400'}`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Logo - centered */}
        <Link href="/" className="flex items-center gap-1.5 group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shadow group-hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)' }}
          >
            <Image src="/logo.svg" alt={logoText} width={16} height={16} className="brightness-[10]" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
            style={{ backgroundImage: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text' }}
          >rkade</span>
        </Link>

        <div
          onClick={() => window.location.href = "/profile"}
          role="button"
          tabIndex={0}
          aria-label="Go to profile"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') window.location.href = "/profile"; }}
          className="w-8 h-8 rounded-full overflow-hidden cursor-pointer ring-2 ring-offset-1 ring-offset-zinc-950 ring-zinc-800 hover:ring-zinc-600 transition-all flex items-center justify-center bg-zinc-800"
        >
          {session?.user?.image ? (
            <Image src={session.user.image} alt={session.user.name || "Profile"} width={32} height={32} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          )}
        </div>
      </div>

      {/* Greeting */}
      <p className="text-[13px] text-zinc-400 mb-2.5">
        👋 Hello, <span className="font-semibold text-white">{session?.user?.name?.split(' ')[0] || "there"}</span>
      </p>

      {/* Search bar */}
      <form role="search" className="relative" onSubmit={handleSearchSubmit}>
        <input
          type="search"
          name="search"
          placeholder="Search events, movies, sports…"
          aria-label="Search"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="w-full rounded-2xl border pl-10 pr-4 py-2.5 text-[14px] text-white placeholder:text-zinc-500 focus:outline-none transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.06)',
            borderColor: searchFocused ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
            boxShadow: searchFocused ? '0 0 0 3px rgba(255,255,255,0.05)' : 'none',
          }}
        />
        <svg
          aria-hidden
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" /><path d="M20 20L17 17" />
        </svg>

        {/* Mic hint */}
        <button type="button" aria-label="Voice search" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="9" y="2" width="6" height="11" rx="3" />
            <path d="M5 10v1a7 7 0 0 0 14 0v-1" /><line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        </button>
      </form>
    </header>
  );
}