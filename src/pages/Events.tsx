
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { CategoryType, EventType } from "@/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const EventCard = ({ event }: { event: EventType }) => {
  const isMobile = useMobile();
  
  return (
    <Card className="h-full">
      {event.banner_image || event.image_url ? (
        <img
          src={event.banner_image || event.image_url}
          alt={event.title}
          className="aspect-video w-full rounded-md object-cover"
        />
      ) : (
        <Skeleton className="aspect-video w-full rounded-md" />
      )}
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>
          {event.description?.substring(0, isMobile ? 50 : 100)}...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {event.location}
        </p>
        <p className="text-sm text-muted-foreground">
          {new Date(event.start_date).toLocaleDateString()}
        </p>
        {event.isFree && (
          <Badge variant="secondary">Free</Badge>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link to={`/event/${event.slug}`}>
          <Button size="sm">View Event</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { events, categories, latestEvents, loading, handleSearch } = useEvents(selectedCategory);
  const isMobile = useMobile();

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    // Initial load - clear any search query to show all events
    setSearchQuery("");
    handleSearch("");
  }, []);

  return (
    <div className="container relative py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Explore Events</h1>
        <Link to="/create-event">
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="mb-4">
            <Input
              type="search"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <div className="p-4">
                  <div
                    className="cursor-pointer rounded-md p-2 hover:bg-secondary"
                    onClick={() => handleCategoryChange(null)}
                  >
                    All Categories
                  </div>
                  <Separator />
                  {categories?.map((category: CategoryType) => (
                    <div
                      key={category.id}
                      className="cursor-pointer rounded-md p-2 hover:bg-secondary"
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {loading ? (
              <>
                <Skeleton className="h-48 w-full rounded-md" />
                <Skeleton className="h-48 w-full rounded-md" />
                <Skeleton className="h-48 w-full rounded-md" />
              </>
            ) : events?.length > 0 ? (
              events.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="col-span-full text-center">
                <p>No events found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {latestEvents?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">Latest Events</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {latestEvents.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
