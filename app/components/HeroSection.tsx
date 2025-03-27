"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
    // Redirect to search results page
    window.location.href = `/events/search?q=${encodeURIComponent(searchQuery)}`;
  };
  
  return (
    <section className="relative pt-32 pb-20">
      {/* Background with overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Discover <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Exceptional</span> Events<br />
            Connect & Experience
          </h1>
          
          <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
            Find and book tickets for the best events happening near you. Experience concerts, workshops, conferences, and more.
          </p>
          
          {/* Search box */}
          <form onSubmit={handleSearch} className="relative mx-auto mb-8 max-w-2xl">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for events, venues, or categories..."
              className="h-12 rounded-full bg-white pr-32 pl-6 shadow-sm dark:bg-slate-800"
            />
            <Button 
              type="submit"
              className="absolute right-1 top-1 h-10 rounded-full bg-orange-500 px-6 text-white hover:bg-orange-600"
            >
              Search
            </Button>
          </form>
          
          {/* Featured tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-slate-500 dark:text-slate-400">Trending:</span>
            <Link href="/events/category/music" className="rounded-full bg-orange-100 px-3 py-1 text-orange-800 transition-colors hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50">
              Music
            </Link>
            <Link href="/events/category/tech" className="rounded-full bg-orange-100 px-3 py-1 text-orange-800 transition-colors hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50">
              Technology
            </Link>
            <Link href="/events/category/business" className="rounded-full bg-orange-100 px-3 py-1 text-orange-800 transition-colors hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50">
              Business
            </Link>
            <Link href="/events/category/food" className="rounded-full bg-orange-100 px-3 py-1 text-orange-800 transition-colors hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50">
              Food & Drinks
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 