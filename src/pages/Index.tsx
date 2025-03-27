import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchHeader from "@/components/HomePage/SearchHeader";
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
            events={events}
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
            events={events}
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
              events={latestEvents}
              limit={4}
              showViewAll={latestEvents.length > 4}
              navigateTo="/events?tab=latest"
            />

            <EventsList
              title="All Events"
              events={events}
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
            events={latestEvents}
            limit={4}
            showViewAll={latestEvents.length > 4}
            navigateTo="/events?tab=latest"
          />
        )}
        
        {/* Add the new HomeContent component */}
        <HomeContent />
      </div>
    </div>
  );
}
