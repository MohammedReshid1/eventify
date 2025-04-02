
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Tag, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { EventType } from "@/types";

interface EventCardProps {
  title: string;
  date: string;
  time?: string;
  location: string;
  price?: string | number;
  image?: string;
  category: string;
  isFree?: boolean;
  slug: string;
  isHighlighted?: boolean;
  expireDate?: string;
}

export function EventCard({
  title,
  date,
  time,
  location,
  price,
  image,
  category,
  isFree = false,
  slug,
  isHighlighted = false,
  expireDate,
}: EventCardProps) {
  // Check if event is expired
  const isExpired = expireDate ? new Date(expireDate) < new Date() : false;
  
  // Don't render the card if the event is expired
  if (isExpired) {
    return null;
  }
  
  // Format price display
  const formatPrice = () => {
    if (isFree) return "Free";
    if (price === undefined || price === null) return "TBD";
    return typeof price === 'number' ? `${price.toFixed(2)} ETB` : `${parseFloat(price).toFixed(2)} ETB`;
  };

  return (
    <Link to={`/event/${slug}`}>
      <Card className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col",
        isHighlighted && "border-orange-300 ring-1 ring-orange-200"
      )}>
        <div
          className={cn(
            "h-40 bg-cover bg-center bg-gray-100",
            isHighlighted && "relative"
          )}
          style={{
            backgroundImage: image ? `url(${image})` : "url('/placeholder.svg')",
          }}
        >
          {isHighlighted && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
        <CardContent className="flex-grow p-4">
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {category}
            </span>
          </div>
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{title}</h3>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span>{date}</span>
            </div>
            {time && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <span>{time}</span>
              </div>
            )}
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span className="line-clamp-1">{location}</span>
            </div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2 text-gray-400" />
              <span className="font-medium text-black">
                {formatPrice()}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button variant="outline" className="w-full border-[#F97316] text-[#F97316]">
            {isFree ? "Register" : "Get Ticket"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
