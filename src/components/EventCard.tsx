import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Tag, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventCardProps {
  title: string;
  date: string;
  time?: string;
  location: string;
  price: string;
  image: string;
  category: string;
  isFree?: boolean;
  slug: string;
  isHighlighted?: boolean;
}

// Array of placeholder images for different event types
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Event hall
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Concert
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Tech conference
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Food event
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Business meeting
  'https://images.unsplash.com/photo-1526976668912-1a811878dd37?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Art exhibition
  'https://images.unsplash.com/photo-1508997449629-303059a039c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Sports event
  'https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Workshop
];

// Simple hash function to get a consistent image for the same event title
const getHashedImage = (title: string) => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = ((hash << 5) - hash) + title.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  // Get positive value and mod with array length
  const index = Math.abs(hash) % PLACEHOLDER_IMAGES.length;
  return PLACEHOLDER_IMAGES[index];
};

export const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  time,
  location,
  price,
  image,
  category,
  isFree = false,
  slug,
  isHighlighted = false
}) => {
  // If no image is provided, use a placeholder based on the event title
  const imageUrl = image || getHashedImage(title);

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 event-card w-full h-full flex flex-col min-h-[400px]",
      isHighlighted && "ring-2 ring-[#F97316] shadow-md"
    )}>
      <Link to={`/event/${slug}`} className="group">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
            <span className="text-white font-medium bg-[#F97316] px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
              View Details
            </span>
          </div>
          <img
            src={imageUrl}
            alt={title}
            className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <Badge className="absolute right-2 top-2 bg-[#F97316] text-white hover:bg-[#F97316] z-20">
            {category}
          </Badge>
          {isHighlighted && (
            <Badge className="absolute left-2 top-2 bg-[#0ea5e9] text-white hover:bg-[#0ea5e9] z-20">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-5 flex-grow">
          <h3 className="mb-3 text-xl font-semibold line-clamp-2 group-hover:text-[#F97316] transition-colors">{title}</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-[#F97316]" />
              <span>{date}</span>
            </p>
            {time && (
              <p className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-[#F97316]" />
                <span>{time}</span>
              </p>
            )}
            <p className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-[#F97316]" />
              <span className="line-clamp-1">{location}</span>
            </p>
            <div className="pt-2 flex items-center">
              <Tag className="mr-2 h-4 w-4 text-[#F97316]" />
              <span className="font-medium text-foreground">
                {isFree ? "Free Event" : `${price} ETB`}
              </span>
            </div>
          </div>
        </CardContent>
      </Link>
      <div className="px-5 pb-5 mt-auto">
        <Link to={`/event/${slug}`}>
          <Button 
            className="w-full bg-[#F97316] hover:bg-[#FB923C] text-sm py-5 h-auto font-medium rounded-md"
          >
            {isFree ? "Register Now" : "Get Ticket"}
          </Button>
        </Link>
      </div>
    </Card>
  );
};
