
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "@/components/EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FeaturedEvents() {
  const navigate = useNavigate();
  
  // Get current date for filtering expired events
  const currentDate = new Date().toISOString();
  
  const { data: featuredEvents, isLoading } = useQuery({
    queryKey: ["featured-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          category:categories (
            id,
            name
          ),
          tickets (
            id,
            price,
            type,
            name,
            remaining
          )
        `)
        .eq("status", "featured")
        .gte("end_date", currentDate) // Only get events that haven't ended
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) {
        console.error("Error fetching featured events:", error);
        throw error;
      }
      
      // Process events to add isFree property
      return data.map(event => {
        const isFree = event.tickets && event.tickets.length > 0 ? 
          (event.tickets[0].type === 'free' || parseFloat(String(event.tickets[0].price)) === 0) : false;
        const price = event.tickets && event.tickets.length > 0 ? 
          String(event.tickets[0].price) : '0';
        return {
          ...event,
          isFree,
          price,
          featured: true
        };
      });
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Featured Events</h2>
          <p className="text-muted-foreground">Highlighted events you don't want to miss</p>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-64 w-full rounded-md" />
          <Skeleton className="h-64 w-full rounded-md" />
          <Skeleton className="h-64 w-full rounded-md" />
          <Skeleton className="h-64 w-full rounded-md" />
        </div>
      </div>
    );
  }

  if (!featuredEvents || featuredEvents.length === 0) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Featured Events</h2>
          <p className="text-muted-foreground">Highlighted events you don't want to miss</p>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => navigate("/events?tab=featured")}
          className="text-[#F97316] hover:text-[#FB923C] flex items-center gap-1 px-2"
        >
          View all <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {featuredEvents.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            date={new Date(event.start_date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
            time={formatTime(event.start_date)}
            location={event.location}
            price={event.price}
            image={event.banner_image || event.image_url}
            category={event.category?.name || "Event"}
            isFree={event.isFree}
            slug={event.slug}
            isHighlighted={true}
            expireDate={event.end_date}
          />
        ))}
      </div>
    </div>
  );
}

// Function to format the time from a date string
function formatTime(dateString: string) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}
