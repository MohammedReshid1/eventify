"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  venue: string;
  image_url: string;
  ticket_price: number;
  slug: string;
  category?: string;
}

export default function EventCard({ id, title, date, venue, image_url, ticket_price, slug, category }: EventCardProps) {
  // Format the date for display
  const eventDate = new Date(date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  
  // Calculate time from now
  const timeFromNow = formatDistanceToNow(eventDate, { addSuffix: true });
  
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md dark:bg-slate-800">
      {/* Badge for category if provided */}
      {category && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-800 shadow-sm backdrop-blur-sm dark:bg-slate-800/90 dark:text-slate-200">
          {category}
        </span>
      )}
      
      <div className="aspect-video overflow-hidden">
        <img 
          src={image_url || "https://placehold.co/600x400?text=Event"} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-xs text-slate-500 dark:text-slate-400">{timeFromNow}</span>
        </div>
        
        <h3 className="mb-2 text-lg font-medium leading-tight">{title}</h3>
        
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{venue}</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="font-medium text-orange-500">
            ${ticket_price.toFixed(2)}
          </span>
          <Button asChild variant="outline" size="sm" className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-700">
            <Link href={`/events/${slug}`}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 