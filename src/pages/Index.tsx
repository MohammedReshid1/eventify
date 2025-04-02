
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPin, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import SearchHeader from "@/components/HomePage/SearchHeader";
import FeaturedEvents from "@/components/HomePage/FeaturedEvents";
import CategoryFilter from "@/components/HomePage/CategoryFilter";
import EventsList from "@/components/HomePage/EventsList";
import HomeContent from "@/components/HomePage/HomeContent";
import { useEvents } from "@/hooks/useEvents";
import HomeSkeleton from "@/components/skeletons/HomeSkeleton";

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const { 
    events, 
    latestEvents,
    featuredEvents,
    loading: eventsLoading, 
    handleSearch,
    hasSearched 
  } = useEvents(selectedCategory);

  // Set loading to true when events are loading or initially loading
  useEffect(() => {
    if (eventsLoading) {
      setIsLoading(true);
    } else {
      // Add a longer delay to prevent flickering and ensure skeleton is visible
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [eventsLoading]);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    // Reset search when category changes
    setSearchQuery("");
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const getCategoryName = () => {
    if (!selectedCategory) return "";
    
    // Get the category name from the events data if available
    const event = events.find(e => e.category && e.category.name);
    if (event && event.category) {
      return event.category.name;
    }
    
    return "Selected Category";
  };

  // Immediately render skeleton when loading
  if (isLoading || eventsLoading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="py-0">
      <SearchHeader onSearch={handleSearchSubmit} />

      <div className="container">
        {/* Display Featured Events section if we have any */}
        {featuredEvents && featuredEvents.length > 0 && !hasSearched && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Featured Events</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featuredEvents.slice(0, 4).map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <Link to={`/events/${event.id}`} className="block">
                    <div className="aspect-[16/9] w-full">
                      <img
                        src={event.banner_image || event.image_url || 'https://placehold.co/600x400/orange/white?text=Featured+Event'}
                        alt={event.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-orange-500" />
                          <span>{formatDate(event.start_date)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-orange-500" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
            {featuredEvents.length > 4 && (
              <div className="flex justify-end mt-2">
                <Button 
                  variant="link" 
                  onClick={() => navigate("/events?tab=featured")}
                  className="text-orange-500"
                >
                  View All Featured Events
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="mb-2">
          <h2 className="text-xl font-semibold mb-3">Explore Categories</h2>
        </div>
        
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onCategorySelect={handleCategorySelect} 
        />
        
        {hasSearched && (
          <EventsList
            title={`Search Results: ${searchQuery}`}
            events={events as any}
            emptyText="No events found matching your search"
            isSearchResult={true}
            searchQuery={searchQuery}
            limit={4}
            showViewAll={events.length > 4}
            navigateTo={`/events?search=${encodeURIComponent(searchQuery)}`}
          />
        )}
        
        {selectedCategory && !hasSearched && (
          <EventsList
            title={`${getCategoryName()}`}
            events={events as any}
            emptyText={`Currently there is no event in this Category`}
            limit={4}
            showViewAll={events.length > 4}
            navigateTo={`/events?category=${selectedCategory}`}
            emptyAction={
              <Button 
                onClick={() => navigate("/create-event")} 
                className="bg-[#F97316] hover:bg-[#FB923C]"
              >
                Create an Event
              </Button>
            }
          />
        )}

        {!hasSearched && !selectedCategory && (
          <>
            <EventsList
              title="Latest Events"
              events={latestEvents as any}
              limit={4}
              showViewAll={latestEvents.length > 4}
              navigateTo="/events?tab=latest"
            />

            <EventsList
              title="All Events"
              events={events as any}
              limit={4}
              showViewAll={true}
              navigateTo="/events"
              emptyText="No events found"
              emptyAction={
                <Button 
                  onClick={() => navigate("/create-event")} 
                  className="bg-[#F97316] hover:bg-[#FB923C]"
                >
                  Create an Event
                </Button>
              }
            />
          </>
        )}
        
        {/* Add Latest Events section below category events */}
        {selectedCategory && !hasSearched && (
          <EventsList
            title="Latest Events"
            events={latestEvents as any}
            limit={4}
            showViewAll={latestEvents.length > 4}
            navigateTo="/events?tab=latest"
          />
        )}
        
        {/* Add the HomeContent component */}
        <HomeContent />
      </div>
    </div>
  );
}
