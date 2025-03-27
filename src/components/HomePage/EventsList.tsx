import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/EventCard";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  start_date: string;
  start_time?: string;
  location: string;
  price: string | number;
  banner_image?: string;
  image_url?: string;
  category: {
    name: string;
    id: string;
  };
  isFree?: boolean;
  slug: string;
  featured?: boolean;
}

interface EventsListProps {
  title: string;
  events: Event[];
  showViewAll?: boolean;
  navigateTo?: string;
  emptyText?: string;
  emptyAction?: React.ReactNode;
  limit?: number;
  isSearchResult?: boolean;
  searchQuery?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

const EventsList: React.FC<EventsListProps> = ({
  title,
  events,
  showViewAll = false,
  navigateTo = "/events",
  emptyText = "No events found",
  emptyAction,
  limit,
  isSearchResult = false,
  searchQuery = ""
}) => {
  const navigate = useNavigate();
  const isMobile = useMobile();
  
  // Debug logging
  useEffect(() => {
    console.log(`EventsList "${title}" rendered with ${events?.length || 0} events`);
  }, [title, events]);
  
  // Safety check for events array
  if (!events || !Array.isArray(events)) {
    console.error(`EventsList "${title}" received invalid events:`, events);
    return (
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <div className="text-center py-16 border border-dashed rounded-lg">
          <p className="text-lg text-muted-foreground mb-4">Unable to load events</p>
        </div>
      </div>
    );
  }
  
  // Sort events so featured ones come first, with null checks
  const sortedEvents = [...events].sort((a, b) => {
    if (!a || !b) return 0;
    return (a.featured === b.featured) ? 0 : (a.featured ? -1 : 1);
  });
  
  const displayEvents = limit ? sortedEvents.slice(0, limit) : sortedEvents;
  
  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {title === "Latest Events" && (
            <p className="text-sm text-muted-foreground mt-1">Recently added events you might be interested in</p>
          )}
        </div>
        {showViewAll && events.length > 0 && (
          <Button 
            variant="ghost" 
            onClick={() => navigate(navigateTo)}
            className="text-[#F97316] hover:text-[#FB923C] flex items-center gap-1 px-2"
          >
            View all <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {displayEvents.length > 0 ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className={cn(
            "grid gap-6",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            "shadow-fix"
          )}
        >
          {displayEvents.map((event) => {
            // Skip rendering if event is invalid
            if (!event || !event.id) {
              console.error("Invalid event in EventsList:", event);
              return null;
            }
            
            return (
              <motion.div key={event.id} variants={item} className="shadow-md hover:shadow-lg transition-shadow">
                <EventCard
                  title={event.title}
                  date={event.start_date ? new Date(event.start_date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  }) : 'Date TBA'}
                  time={event.start_time}
                  location={event.location || 'Location TBA'}
                  price={event.price || 0}
                  image={event.banner_image || event.image_url || ''}
                  category={event.category?.name || 'Uncategorized'}
                  isFree={event.isFree}
                  slug={event.slug}
                  isHighlighted={event.featured}
                />
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="text-center py-16 border border-dashed rounded-lg">
          {isSearchResult ? (
            <p className="text-lg text-muted-foreground mb-4">
              {searchQuery 
                ? `No events found matching "${searchQuery}"`
                : "No events found matching your search criteria"}
            </p>
          ) : (
            <p className="text-lg text-muted-foreground mb-4">{emptyText}</p>
          )}
          {emptyAction}
        </div>
      )}
    </div>
  );
};

export default EventsList;
