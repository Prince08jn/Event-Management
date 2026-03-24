"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useDesktop } from "@/hooks/useDesktop";
import DesktopNavbar from "@/components/home/desktop-navbar";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isDesktop = useDesktop();
  const user = session?.user;
  const [registeredEvents, setRegisteredEvents] = useState<Array<{ id: number; name: string; category: string; price: string; image: string }>>([]);
  const [publishedEvents, setPublishedEvents] = useState<Array<{ id: string; name: string; category?: string; price?: string; img?: string }>>([]);

  // Mock data for demonstration - replace with actual data fetching
  useEffect(() => {
    // Simulate registered events
    setRegisteredEvents([
      {
        id: 1,
        name: "Event name",
        category: "Campus",
        price: "₹1099",
        image: "/brand1.svg"
      },
      {
        id: 2,
        name: "Event name",
        category: "Events",
        price: "₹1099",
        image: "/brand2.svg"
      }
    ]);

    // Simulate published events (user-created events)
    try {
      const stored = localStorage.getItem('localEvents');
      if (stored) {
        const localEvents = JSON.parse(stored);
        setPublishedEvents(localEvents.slice(0, 4)); // Show max 4 events
      }
    } catch (e) {
      console.error('Error loading published events:', e);
    }
  }, []);

  // Handle authentication redirect
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Show loading state while session is loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  // Desktop Layout
  if (isDesktop) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DesktopNavbar logoText="Profile" />

        <div className="pt-[76px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Profile Info Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      {user?.image ? (
                        <AvatarImage src={user.image} alt={user.name || "User"} />
                      ) : (
                        <AvatarFallback className="text-xl bg-gray-100">
                          {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <h1 className="text-xl font-semibold text-gray-900 mb-1">
                      {user?.name || "User"}
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">{user?.email}</p>

                    <div className="space-y-3">
                      <Button
                        onClick={() => router.push('/events/create')}
                        className="w-full bg-black text-white hover:bg-gray-800"
                      >
                        Create Event
                      </Button>

                      <Button
                        onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                        variant="outline"
                        className="w-full border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Events Registered</span>
                      <span className="text-lg font-semibold text-gray-900">{registeredEvents.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Events Published</span>
                      <span className="text-lg font-semibold text-gray-900">{publishedEvents.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">

                {/* Registered Events Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Registered Events</h2>
                    <Button variant="outline" size="sm" onClick={() => router.push('/events')}>
                      Browse Events
                    </Button>
                  </div>

                  {registeredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {registeredEvents.map((event) => (
                        <div key={event.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                          <div className="aspect-video bg-gray-100 relative">
                            <Image
                              src={event.image}
                              alt={event.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-gray-500 mb-1">{event.category}</p>
                            <h4 className="font-medium text-gray-900 mb-2">{event.name}</h4>
                            <p className="text-lg font-semibold text-gray-900">{event.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 mb-4">No registered events yet</p>
                      <Button onClick={() => router.push('/events')}>
                        Discover Events
                      </Button>
                    </div>
                  )}
                </div>

                {/* Published Events Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Published Events</h2>
                    <Button variant="outline" size="sm" onClick={() => router.push('/events/create')}>
                      Create Event
                    </Button>
                  </div>

                  {publishedEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {publishedEvents.map((event) => (
                        <div key={event.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                          <div className="aspect-video bg-gray-100 relative">
                            <Image
                              src={event.img || '/placeholder.svg'}
                              alt={event.name || 'Event'}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-gray-500 mb-1">{event.category || 'Local'}</p>
                            <h4 className="font-medium text-gray-900 mb-2">{event.name || 'Event name'}</h4>
                            <p className="text-lg font-semibold text-gray-900">{event.price || '₹1099'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <p className="text-gray-500 mb-4">No published events yet</p>
                      <Button onClick={() => router.push('/events/create')}>
                        Create Your First Event
                      </Button>
                    </div>
                  )}
                </div>

                {/* Support & Legal Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Support</p>
                        <p className="text-sm text-gray-500">Chat with us</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Terms</p>
                        <p className="text-sm text-gray-500">Read more</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Privacy</p>
                        <p className="text-sm text-gray-500">Read more</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile Layout (existing code)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Logo</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white">
        {/* Profile Section */}
        <div className="px-4 py-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              {user?.image ? (
                <AvatarImage src={user.image} alt={user.name || "User"} />
              ) : (
                <AvatarFallback className="bg-gray-300 text-gray-600 text-lg">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{user?.name || "User"}</h2>
              <p className="text-sm text-gray-500">{user?.email || "No email provided"}</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Registered Events */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Registered Events</h3>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {registeredEvents.map((event) => (
              <div key={event.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-100">
                  <Image
                    src={event.image}
                    alt={event.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 mb-1">{event.category}</p>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{event.name}</h4>
                  <p className="text-sm font-semibold text-gray-900">{event.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Published Events */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Published Events</h3>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          {publishedEvents.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {publishedEvents.map((event) => (
                <div key={event.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-100">
                    <Image
                      src={event.img || '/placeholder.svg'}
                      alt={event.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-500 mb-1">{event.category || 'Local'}</p>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{event.name || 'Event name'}</h4>
                    <p className="text-sm font-semibold text-gray-900">{event.price || '₹1099'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No published events yet</p>
              <Button
                onClick={() => router.push('/events/create')}
                className="mt-2 text-sm"
              >
                Create Your First Event
              </Button>
            </div>
          )}
        </div>

        {/* Support Section */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">SUPPORT</span>
              <span className="text-sm text-gray-500">Chat with us</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-900">TERMS & CONDITIONS</span>
              <p className="text-sm text-gray-500">Read more</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-900">PRIVACY POLICY</span>
              <p className="text-sm text-gray-500">Read more</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4">
          <Button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-lg font-medium"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}