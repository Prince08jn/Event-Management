"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HomeButton() {
    const pathname = usePathname();
    // Hide on the home page itself and on the landing page
    if (pathname === "/home" || pathname === "/") return null;

    return (
        <Link
            href="/"
            aria-label="Go to home"
            className="fixed bottom-24 right-4 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-black text-white shadow-lg hover:bg-gray-800 active:scale-95 transition-all duration-150 md:bottom-8 md:right-8"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        </Link>
    );
}
