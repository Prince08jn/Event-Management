"use client"

import React from "react"
import AllCampuses, { Event } from "@/components/home/allevents"

export default function Page() {
  const events: Event[] = [
    { id: "e1", category: "New Delhi", name: "Karan Aujla", img: "/brand1.svg", slug: "karan-aujla" },
    { id: "e2", category: "New Delhi", name: "Diljit Dosanjh", img: "/brand2.svg", slug: "diljit-dosanjh" },
    { id: "e3", category: "New Delhi", name: "Yo YO prateek", img: "/brand3.svg", slug: "yo-yo-prateek" },
    { id: "e4", category: "New Delhi", name: "Samay Raina", img: "/brand3.svg", slug: "samay-raina" },
    { id: "e5", category: "New Delhi", name: "Arijit Singh", img: "/brand1.svg", slug: "arijit-singh" },
    { id: "e6", category: "New Delhi", name: "AP Dhillon", img: "/brand2.svg", slug: "ap-dhillon" },
  ]

  return <AllCampuses events={events} title="All Campus Events" includeLocalEvents={false} />
}
