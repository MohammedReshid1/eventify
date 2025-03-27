"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

// Mock event data
const MOCK_EVENTS = [
  {
    id: "evt-001",
    title: "Summer Music Festival",
    date: "2023-07-15",
    time: "16:00",
    venue: "Central Park",
    location: "New York, NY",
    price: 49.99,
    category: "music",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800"
  },
  {
    id: "evt-002",
    title: "Tech Conference 2023",
    date: "2023-08-21",
    time: "09:00",
    venue: "Convention Center",
    location: "San Francisco, CA",
    price: 299.99,
    category: "business",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800"
  },
  {
    id: "evt-003",
    title: "Food & Wine Expo",
    date: "2023-09-10",
    time: "12:00",
    venue: "Grand Hall",
    location: "Chicago, IL",
    price: 75.00,
    category: "food",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800"
  },
  {
    id: "evt-004",
    title: "Business Leadership Summit",
    date: "2023-10-05",
    time: "10:00",
    venue: "Executive Center",
    location: "Boston, MA",
    price: 199.99,
    category: "business",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800"
  },
  {
    id: "evt-005",
    title: "Art Exhibition",
    date: "2023-11-12",
    time: "11:00",
    venue: "Modern Gallery",
    location: "Miami, FL",
    price: 25.00,
    category: "arts",
    image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800"
  },
  {
    id: "evt-006",
    title: "Fitness Bootcamp Weekend",
    date: "2023-12-03",
    time: "08:00",
    venue: "City Park",
    location: "Austin, TX",
    price: 85.00,
    category: "sports",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800"
  }
];

export default function EventsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Filter events based on search term and category
  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Format date string to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Explore Events</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Discover amazing events happening near you
            </p>
          </div>
          
          {/* Search and filters */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <label htmlFor="search" className="text-sm font-medium">
                Search Events
              </label>
              <div className="relative">
                <svg 
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by event name or location"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-full md:w-64 space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Filter by Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm shadow-sm dark:border-slate-600 dark:bg-slate-700"
              >
                <option value="">All Categories</option>
                <option value="music">Music & Concerts</option>
                <option value="business">Business & Tech</option>
                <option value="food">Food & Drinks</option>
                <option value="arts">Arts & Culture</option>
                <option value="sports">Sports & Fitness</option>
                <option value="education">Education & Learning</option>
              </select>
            </div>
          </div>
          
          {/* Events grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div 
                  key={event.id}
                  className="group rounded-lg border bg-card overflow-hidden shadow-sm transition-all hover:shadow-md"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </span>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        ${event.price.toFixed(2)}
                      </span>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{event.title}</h3>
                    <div className="mb-3 space-y-1">
                      <p className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <svg 
                          className="mr-2 h-4 w-4" 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                          <line x1="16" x2="16" y1="2" y2="6"/>
                          <line x1="8" x2="8" y1="2" y2="6"/>
                          <line x1="3" x2="21" y1="10" y2="10"/>
                        </svg>
                        {formatDate(event.date)} at {event.time}
                      </p>
                      <p className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <svg 
                          className="mr-2 h-4 w-4" 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {event.venue}, {event.location}
                      </p>
                    </div>
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      onClick={() => router.push(`/events/${event.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-lg border border-dashed p-8 text-center">
                <p className="text-slate-500 dark:text-slate-400">No events found matching your criteria</p>
                <Button 
                  variant="link" 
                  className="mt-2 text-orange-500"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 