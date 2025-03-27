import React from "react";
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
  price: string;
  banner_image: string;
  category: {
    name: string;
    id: string;
  };
  isFree: boolean;
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
  
  // Sort events so featured ones come first
  const sortedEvents = [...events].sort((a, b) => 
    a.featured === b.featured ? 0 : a.featured ? -1 : 1
  );
  
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
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}
        >
          {displayEvents.map((event) => (
            <motion.div key={event.id} variants={item}>
              <EventCard
                title={event.title}
                date={new Date(event.start_date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
                time={event.start_time}
                location={event.location}
                price={event.price}
                image={event.banner_image}
                category={event.category.name}
                isFree={event.isFree}
                slug={event.slug}
                isHighlighted={event.featured}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 py-12 px-4 border border-dashed rounded-lg"
        >
          {isSearchResult && searchQuery ? (
            <>
              <p className="text-lg text-center text-muted-foreground">
                No events found matching "{searchQuery}"
              </p>
              <p className="text-sm text-center text-muted-foreground">
                Try adjusting your search terms or browse all events
              </p>
            </>
          ) : (
            <p className="text-lg text-center text-muted-foreground">{emptyText}</p>
          )}
          {emptyAction}
        </motion.div>
      )}
    </div>
  );
};

export default EventsList;
