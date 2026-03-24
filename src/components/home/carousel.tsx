"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import type { Swiper as SwiperType } from "swiper";

interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  img?: string;
  alt?: string;
  link?: string;
  price?: string;
  date?: string;
}

interface Event {
  id: string;
  category: string;
  name: string;
  price: string;
  img: string;
  href?: string;
  date?: string;
  language: string;
  ageLimit: string;
  eventType: string;
}

interface BannerCarouselProps {
  banners?: Banner[];
  events?: Event[];
}

const SLIDE_DURATION = 4000; // ms

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

export default function BannerCarousel({ banners, events }: BannerCarouselProps) {
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const swiperRef = useRef<SwiperType | null>(null);

  // Transform events to banner format
  const displayBanners: Banner[] =
    events && events.length > 0
      ? events.slice(0, 6).map((event) => ({
        id: event.id,
        title: event.name,
        subtitle: event.category,
        img: event.img,
        alt: event.name,
        link: event.href || `/events/${event.id}`,
        price:
          event.price === "0" || event.price?.toLowerCase() === "free"
            ? "FREE"
            : event.price,
        date: event.date,
      }))
      : banners || [];

  if (displayBanners.length === 0) return null;

  const startProgress = () => {
    if (progressRef.current) clearInterval(progressRef.current);
    startTimeRef.current = Date.now();
    setProgress(0);
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100 && progressRef.current) clearInterval(progressRef.current);
    }, 30);
  };

  useEffect(() => {
    startProgress();
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <div className="w-full relative px-4 md:px-8 py-4">
      {/* Gradient pagination style override */}
      <style>{`
        .carousel-swiper .swiper-pagination-bullet {
          background: #a78bfa;
          opacity: 0.4;
          width: 8px;
          height: 8px;
          transition: all 0.3s;
        }
        .carousel-swiper .swiper-pagination-bullet-active {
          background: linear-gradient(90deg, #7c3aed, #2563eb);
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>

      <Swiper
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        grabCursor
        centeredSlides
        slidesPerView={1}
        loop={displayBanners.length > 1}
        speed={600}
        autoplay={{ delay: SLIDE_DURATION, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onAutoplayTimeLeft={() => { }}
        modules={[Autoplay, Pagination]}
        className="carousel-swiper pb-10"
        breakpoints={{
          768: { slidesPerView: 1 },
        }}
      >
        {displayBanners.map((banner, index) => (
          <SwiperSlide key={banner.id ?? index}>
            <div className="relative flex flex-col md:flex-row items-stretch rounded-2xl overflow-hidden shadow-xl bg-zinc-900 min-h-[280px] md:min-h-[340px]">

              {/* ── Left: Image ───────────────────────────────────── */}
              <Link
                href={banner.link ?? "#"}
                className="relative w-full md:w-1/2 min-h-[200px] md:min-h-0 block overflow-hidden group"
                tabIndex={-1}
              >
                {banner.img ? (
                  <img
                    src={banner.img}
                    alt={banner.alt ?? banner.title ?? "event"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ minHeight: "200px" }}
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <span className="text-zinc-600 text-4xl">🎟️</span>
                  </div>
                )}
                {/* subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              {/* ── Right: Info ───────────────────────────────────── */}
              <div className="w-full md:w-1/2 flex flex-col justify-center gap-3 px-6 py-7 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">

                {/* Category chip */}
                {banner.subtitle && (
                  <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    🎭 {banner.subtitle}
                  </span>
                )}

                {/* Title */}
                <h3 className="text-white font-bold text-xl md:text-2xl leading-snug line-clamp-2">
                  {banner.title ?? "Event"}
                </h3>

                {/* Date */}
                {banner.date && (
                  <p className="text-zinc-400 text-sm flex items-center gap-1.5">
                    <span>📅</span>
                    {formatDate(banner.date)}
                  </p>
                )}

                {/* Price badge */}
                {banner.price && (
                  <span
                    className={`self-start px-3 py-1 rounded-lg text-sm font-bold ${banner.price === "FREE"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                      }`}
                  >
                    {banner.price}
                  </span>
                )}

                {/* CTA */}
                <Link
                  href={banner.link ?? "#"}
                  className="mt-2 self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(90deg,#7c3aed,#2563eb)" }}
                >
                  Book Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>

              {/* ── Progress bar ──────────────────────────────────── */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
                <div
                  className="h-full transition-none"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg,#7c3aed,#2563eb)",
                    transition: progress === 0 ? "none" : "width 0.03s linear",
                  }}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

// Export as both default and named export to match import patterns
export { BannerCarousel as Carousel };

// Filter functionality
export function useFilters() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  return { activeFilters, toggleFilter };
}

// FilterButtons component
interface FilterButtonsProps {
  filters: string[];
  activeFilters: string[];
  onToggleFilter: (filter: string) => void;
  className?: string;
}

export function FilterButtons({
  filters,
  activeFilters,
  onToggleFilter,
  className = "",
}: FilterButtonsProps) {
  return (
    <div className={`flex flex-wrap gap-2 mb-6 ${className}`}>
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onToggleFilter(filter)}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${activeFilters.includes(filter)
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-700 hover:bg-gray-300 border-gray-300"
            }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}