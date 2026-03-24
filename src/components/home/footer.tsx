"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

          {/* Brand + tagline */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">r</span>
              </div>
              <span className="text-lg font-bold tracking-tight">rkade</span>
              <span className="text-[9px] font-semibold bg-white/20 text-white px-1.5 py-0.5 rounded-full uppercase tracking-widest">Beta</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              Discover and book the best events, movies, sports &amp; campus shows near you.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-zinc-300 hover:text-white transition">About</a></li>
              <li><a href="#" className="text-zinc-300 hover:text-white transition">Terms</a></li>
              <li><a href="#" className="text-zinc-300 hover:text-white transition">Privacy</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Support</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-zinc-300 hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="text-zinc-300 hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="text-zinc-300 hover:text-white transition">Media Kit</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">© {new Date().getFullYear()} rkade &amp; Co. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {/* Instagram */}
            <a href="#" aria-label="Instagram" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            {/* X / Twitter */}
            <a href="#" aria-label="Twitter" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" aria-label="YouTube" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
