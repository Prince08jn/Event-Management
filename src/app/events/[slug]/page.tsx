import React from 'react';
import { getEventBySlug } from '@/lib/event';
import EventDetailWrapper from '@/components/events/EventDetailWrapper';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  // try to fetch server-side; if not found, client wrapper will check localStorage
  const event = await getEventBySlug(slug).catch(() => null);
  return (
    <EventDetailWrapper slug={slug} serverEvent={event || undefined} />
  );
}


