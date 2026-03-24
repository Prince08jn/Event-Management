"use client";

import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: Record<string, string>;
  notes: Record<string, string>;
  handler: () => void;
}

interface WindowWithRazorpay extends Window {
  Razorpay?: {
    new (options: RazorpayOptions): {
      open: () => void;
    };
  };
}

type EventRow = {
  id: string;
  slug: string;
  event_name: string;
  landscape_poster: string | null;
  date: string | null;
  time: string | null;
  venue: string | null;
  price: string | null;
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default function BookEventPage({ params }: Props) {
  const [event, setEvent] = useState<EventRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState<number>(1);
  
  // Unwrap the params Promise
  const resolvedParams = React.use(params);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: qErr } = await supabase.from('events').select('*').eq('slug', resolvedParams.slug).single();
        if (qErr) throw qErr;
        if (!cancelled) setEvent(data as EventRow);
      } catch (error: unknown) {
        if (!cancelled) setError(error instanceof Error ? error.message : 'Failed to load event');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [resolvedParams.slug]);

  const unitPrice = useMemo(() => {
    const p = event?.price ? parseFloat(event.price) : 0;
    return Number.isFinite(p) ? p : 0;
  }, [event?.price]);

  const totalPrice = useMemo(() => {
    return qty * unitPrice;
  }, [qty, unitPrice]);

  function proceedToCheckout() {
    if (!event) return;
    // Validate amount > 0 (Razorpay requirement)
    const amountPaise = Math.round(totalPrice * 100);
    if (amountPaise <= 0) {
      // Free event: create booking directly
      fetch('/api/bookings/free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id, quantity: qty }),
      })
        .then(res => res.json())
        .then(({ booking, message }) => {
          if (!booking) {
            alert(message || 'Failed to create free booking');
            return;
          }
          alert('Free booking confirmed!');
        })
        .catch(() => alert('Failed to create free booking'));
      return;
    }
    fetch('/api/payments/razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amountPaise, currency: 'INR', receipt: `evt_${event.id}_${Date.now()}`, notes: { slug: event.slug } }),
    })
      .then(res => res.json())
      .then(({ order, message }) => {
        if (!order) {
          alert(message || 'Failed to create order');
          return;
        }
        const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string | undefined;
        if (!key) {
          alert('Razorpay key not configured');
          return;
        }

        function loadRazorScript(): Promise<void> {
          return new Promise((resolve, reject) => {
            if ((window as WindowWithRazorpay).Razorpay) return resolve();
            const s = document.createElement('script');
            s.src = 'https://checkout.razorpay.com/v1/checkout.js';
            s.onload = () => resolve();
            s.onerror = () => reject(new Error('Failed to load Razorpay'));
            document.body.appendChild(s);
          });
        }

        loadRazorScript().then(() => {
          const options: RazorpayOptions = {
            key,
            amount: order.amount,
            currency: order.currency,
            name: event.event_name,
            description: `Tickets x${qty}`,
            order_id: order.id,
            prefill: {},
            notes: { slug: event.slug },
            handler: function () {
              alert('Payment successful!');
            },
          };
          const Razorpay = (window as WindowWithRazorpay).Razorpay;
          if (!Razorpay) throw new Error('Razorpay not loaded');
          const rzp = new Razorpay(options);
          rzp.open();
        }).catch(() => {
          alert('Unable to initiate Razorpay');
        });
      })
      .catch(() => alert('Failed to start checkout'));
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto py-12">Loading…</div>;
  }
  if (error || !event) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <p className="text-red-600">{error || 'Event not found'}</p>
        <Link href="/events" className="text-blue-600 underline inline-block mt-4">Back to events</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Book: {event.event_name}</h1>
        <p className="text-gray-700">{event.date}{event.time ? ` • ${event.time}` : ''}</p>
        {event.venue && <p className="text-gray-700">{event.venue}</p>}

        {event.landscape_poster ? (
          <Image src={event.landscape_poster} alt={event.event_name} width={800} height={400} className="w-full rounded" />
        ) : null}

        <div className="p-4 border rounded shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="qty" className="font-medium">Quantity</label>
            <input
              id="qty"
              type="number"
              min={1}
              max={10}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
              className="w-24 p-2 border rounded text-right"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>Price per ticket</span>
            <span>₹ {unitPrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹ {totalPrice.toFixed(2)}</span>
          </div>

          <Button type="button" className="w-full" onClick={proceedToCheckout}>{unitPrice <= 0 ? 'Book Free Ticket' : 'Proceed to checkout'}</Button>
          <Link href={`/events/${event.slug}`} className="block text-center border border-gray-300 py-2 rounded">Back to event</Link>
        </div>
      </div>
    </div>
  );
}


