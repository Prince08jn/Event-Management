'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event, Booking } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) router.push('/auth/signin'); // Not signed in

    const fetchUserData = async () => {
      try {
        // Fetch user's created events
        const eventsRes = await fetch('/api/events/user');
        const eventsData = await eventsRes.json();
        setUserEvents(eventsData);

        // Fetch user's booked events
        const bookingsRes = await fetch('/api/bookings/user');
        const bookingsData = await bookingsRes.json();
        setUserBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session, status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {session.user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Name:</strong> {session.user?.name}</p>
                <p><strong>Email:</strong> {session.user?.email}</p>
                {session.user?.image && (
                  <div>
                    <strong>Profile Picture:</strong>
                    <Image 
                      src={session.user.image}
                      alt="Profile"
                      width={64}
                      height={64}
                      className="rounded-full mt-2"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Privacy Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href="/events/create">
                  <Button className="w-full">
                    Create New Event
                  </Button>
                </Link>
                <Link href="/events">
                  <Button variant="outline" className="w-full">
                    View Events
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Events</CardTitle>
              <CardDescription>Events you have created</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userEvents.length === 0 ? (
                  <p className="text-gray-500">You haven&apos;t created any events yet.</p>
                ) : (
                  userEvents.map((event: Event) => (
                    <Link href={`/events/${event.slug}`} key={event.id}>
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <h3 className="font-semibold">{event.event_name}</h3>
                        <div className="text-sm text-gray-500">
                          <p>Date: {event.date || 'TBA'}</p>
                          <p>Venue: {event.venue}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
                <Link href="/events/create">
                  <Button variant="outline" className="w-full mt-4">
                    Create New Event
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events you have booked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userBookings.length === 0 ? (
                  <p className="text-gray-500">You haven&apos;t booked any events yet.</p>
                ) : (
                  userBookings.map((booking: Booking) => (
                    <Link href={`/events/${booking.event.slug}`} key={booking.id}>
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <h3 className="font-semibold">{booking.event.event_name}</h3>
                        <div className="text-sm text-gray-500">
                          <p>Date: {booking.event.date || 'TBA'}</p>
                          <p>Venue: {booking.event.venue}</p>
                          <p>Booking ID: {booking.id}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
                <Link href="/events">
                  <Button variant="outline" className="w-full mt-4">
                    Browse Events
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}