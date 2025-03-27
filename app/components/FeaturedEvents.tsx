"use client";

import { useState } from "react";
import Link from "next/link";
import EventCard from "./EventCard";

// Static event data
const eventData = [
  {
    id: "1",
    title: "Summer Music Festival",
    date: "2023-07-15",
    venue: "City Park",
    image_url: "https://placehold.co/600x400?text=Music+Festival",
    ticket_price: 49.99,
    slug: "summer-music-festival",
    category: "Music"
  },
  {
    id: "2",
    title: "Tech Conference 2023",
    date: "2023-08-21",
    venue: "Convention Center",
    image_url: "https://placehold.co/600x400?text=Tech+Conference",
    ticket_price: 199.99,
    slug: "tech-conference-2023",
    category: "Technology"
  },
  {
    id: "3",
    title: "Food & Wine Expo",
    date: "2023-09-10",
    venue: "Exhibition Hall",
    image_url: "https://placehold.co/600x400?text=Food+Expo",
    ticket_price: 75.00,
    slug: "food-wine-expo",
    category: "Food"
  },
  {
    id: "4",
    title: "Business Leadership Summit",
    date: "2023-10-05",
    venue: "Grand Hotel",
    image_url: "https://placehold.co/600x400?text=Business+Summit",
    ticket_price: 299.99,
    slug: "business-leadership-summit",
    category: "Business"
  }
];

export default function FeaturedEvents() {
  const [featuredEvents] = useState(eventData);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col sm:flex-row items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Events</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Don't miss out on these popular upcoming events
            </p>
          </div>
          <Link 
            href="/events" 
            className="mt-4 sm:mt-0 inline-flex items-center text-sm font-medium text-orange-500 hover:text-orange-600"
          >
            View All Events
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </Link>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              date={event.date}
              venue={event.venue}
              image_url={event.image_url}
              ticket_price={event.ticket_price}
              slug={event.slug}
              category={event.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 