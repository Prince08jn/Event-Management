import React from 'react';
import Link from 'next/link';
import Image from "next/image";

type Event = {
  id: string;
  category: string;
  name: string;
  price?: string;
  img?: string;
  href?: string;
};

type Props = {
  events: Event[];
  title?: string;
  seeAllHref?: string;
  gridClass?: string; // optional tailwind classes to customize grid columns
};

export default function EventGrid({ events, title = 'All Events', seeAllHref = '/events/${events.id}', gridClass = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' }: Props) {
  return (
    <section aria-labelledby="all-events" className="mb-6 md:mb-8">
      <div className="mb-3 md:mb-4 flex items-center gap-3">
        <h2 id="all-events" className="text-base md:text-lg font-bold">{title}</h2>
        
      </div>

      <div className={`grid ${gridClass} gap-3 md:gap-4`}>
        {events.map((event) => {
          const content = (
            <article key={event.id} className="">
              <div className="h-[265px] md:h-32 lg:h-36 w-full overflow-hidden rounded-xl border bg-white border-gray-100 ">
                <Image src={event.img || "/placeholder.svg"} alt={event.name} width={208} height={190} className="h-full w-full object-cover rounded" />
              </div>
              
              <div className="px-[16px] py-[8px] md:p-4 ">
                <p className="text-[11px] md:text-xs text-zinc-500">{event.category}</p>
                <h3 className="mt-0.5 line-clamp-2 text-sm md:text-base font-bold">{event.name}</h3>
                <p className="mt-1 text-[13px] md:text-sm font-semibold text-emerald-600">{event.price}</p>
              </div>
               </article>
           
          );

          // If event has an href, wrap in Link; otherwise render plain
          return event.href ? (
            <Link key={event.id} href={event.href} className="block">
              {content}
            </Link>
          ) : (
            <div key={event.id}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}