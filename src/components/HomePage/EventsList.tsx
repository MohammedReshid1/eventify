import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types";
import { motion } from "framer-motion";

interface EventsListProps {
  title: string;
  events: Event[];
  limit?: number;
  showViewAll?: boolean;
  navigateTo?: string;
  isSearchResult?: boolean;
  searchQuery?: string;
  emptyText?: string;
  emptyAction?: React.ReactNode;
}

const EventsList: React.FC<EventsListProps> = ({
  title,
  events,
  limit = 4,
  showViewAll = true,
  navigateTo = "/events",
  isSearchResult = false,
  searchQuery = "",
  emptyText = "No events found",
  emptyAction,
}) => {
  const navigate = useNavigate();
  
  const displayEvents = limit ? events.slice(0, limit) : events;
  
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
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (events.length === 0) {
    return (
      <div className="w-full mb-12">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">{emptyText}</p>
          {emptyAction}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {showViewAll && events.length > 0 && (
          <Button 
            variant="ghost" 
            onClick={() => navigate(navigateTo)}
            className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-gray-800"
          >
            <span>View All</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {displayEvents.map((event) => (
          <motion.div key={event.id} variants={item}>
            <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
              <Link to={`/events/${event.id}`} className="block h-full">
                <div className="aspect-[16/9] w-full relative">
                  <img
                    src={event.image_url || 'https://placehold.co/600x400/orange/white?text=Event+Image'}
                    alt={event.title}
                    className="object-cover w-full h-full"
                  />
                  {event.category && (
                    <Badge 
                      className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600"
                    >
                      {event.category.name}
                    </Badge>
                  )}
                </div>
                
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="py-2 px-4">
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-orange-500" />
                      <span>{formatDate(event.start_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-orange-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-orange-500" />
                      <span>{event.available_tickets} spots left</span>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default EventsList;
