"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDesktop } from "@/hooks/useDesktop";

const tabs = [
  {
    label: "Home",
    href: "/home",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Campus",
    href: "/campus_event",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9l9-7 9 7" />
        <path d="M9 22V12h6v10" />
        <rect x="2" y="9" width="20" height="13" rx="1" />
      </svg>
    ),
  },
  {
    label: "Sports",
    href: "/sports",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="9" />
        <path d="M4.5 4.5c2 3 2 7.5 0 11" />
        <path d="M19.5 4.5c-2 3-2 7.5 0 11" />
        <path d="M3 12h18" />
      </svg>
    ),
  },
  {
    label: "Movies",
    href: "/movie",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
        <line x1="7" y1="2" x2="7" y2="22" />
        <line x1="17" y1="2" x2="17" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="2" y1="7" x2="7" y2="7" />
        <line x1="2" y1="17" x2="7" y2="17" />
        <line x1="17" y1="17" x2="22" y2="17" />
        <line x1="17" y1="7" x2="22" y2="7" />
      </svg>
    ),
  },
  {
    label: "Events",
    href: "/event",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isDesktop = useDesktop();

  // Only show on mobile
  if (isDesktop) return null;

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200 safe-area-inset-bottom"
      style={{ boxShadow: "0 -2px 16px rgba(0,0,0,0.07)" }}
    >
      <div className="flex items-stretch justify-around h-16">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/home" && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              className={`flex flex-col items-center justify-center flex-1 gap-1 text-[10px] font-medium transition-colors duration-150 ${
                isActive
                  ? "text-violet-600"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <span
                className={`transition-all duration-150 ${
                  isActive ? "scale-110" : "scale-100"
                }`}
                style={
                  isActive
                    ? {
                        filter:
                          "drop-shadow(0 0 6px rgba(124,58,237,0.5))",
                      }
                    : {}
                }
              >
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {isActive && (
                <span
                  className="absolute bottom-0 h-0.5 w-8 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #7c3aed, #3b82f6)",
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
