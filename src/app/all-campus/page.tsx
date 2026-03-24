"use client"

import React from "react"
import AllCampuses, { Event } from "@/components/home/allevents"

// If you want server-side data, fetch it in the page and pass as props to AllCampuses
export default function Page() {
  const events: Event[] = [
    { id: "e1", category: "New Delhi", name: "IIT-D", img: "/Indian_Institute_of_Technology_Delhi_Logo.svg", slug: "iit-delhi" },
    { id: "e2", category: "New Delhi", name: "DU", img: "/Delhi_University.svg", slug: "delhi-university" },
    { id: "e3", category: "New Delhi", name: "DTU", img: "/DTU,_Delhi_official_logo.png", slug: "dtu-delhi" },
    { id: "e4", category: "New Delhi", name: "Chandigarh University", img: "/Chandigarh_University_Seal.png", slug: "chandigarh-university" },
    { id: "e5", category: "New Delhi", name: "AIIMS", img: "/All_India_Institute_of_Medical_Sciences,_Delhi.svg", slug: "aiims-delhi" },
    { id: "e6", category: "New Delhi", name: "NIT-D", img: "/National_Institute_of_Technology,_Kurukshetra_Logo.png", slug: "nit-delhi" },
  ]

  return <AllCampuses events={events} title="All Campuses" />
}
