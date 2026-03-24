"use client"

import React from "react"
import AllCampuses, { Event } from "@/components/home/allevents"

export default function Page() {
  const events: Event[] = [
    { id: "e1", category: "New Delhi", name: "Cricket", img: "/brand1.svg", slug: "Cricket" },
    { id: "e2", category: "New Delhi", name: "Football", img: "/brand2.svg", slug: "Football" },
    { id: "e3", category: "New Delhi", name: "Hockey", img: "/brand3.svg", slug: "Hockey" },
    { id: "e4", category: "New Delhi", name: "Boxing", img: "/brand3.svg", slug: "Boxing" },
    { id: "e5", category: "New Delhi", name: "Tennis", img: "/brand1.svg", slug: "tennis" },
    { id: "e6", category: "New Delhi", name: "Kabbadi", img: "/brand2.svg", slug: "kabbadi" },
  ]

  return <AllCampuses events={events} title="All Sports" />
}
