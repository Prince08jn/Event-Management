"use client"

import React from "react"
import AllCampuses, { Event } from "@/components/home/allevents"

export default function Page() {
  const events: Event[] = [
    { id: "e1", category: "New Delhi", name: "Punjabi", img: "/brand1.svg", slug: "punjabi" },
    { id: "e2", category: "New Delhi", name: "Hindi", img: "/brand2.svg", slug: "hindi" },
    { id: "e3", category: "New Delhi", name: "English", img: "/brand3.svg", slug: "english" },
    { id: "e4", category: "New Delhi", name: "Tamil", img: "/brand3.svg", slug: "tamil" },
    { id: "e5", category: "New Delhi", name: "Telegu", img: "/brand1.svg", slug: "telegu" },
    { id: "e6", category: "New Delhi", name: "Kannad", img: "/brand2.svg", slug: "kannad" },
  ]

  return <AllCampuses events={events} title="All Movies" />
}
