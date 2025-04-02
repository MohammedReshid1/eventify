
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, LayoutGrid, Search, Star } from "lucide-react";
import EventsList from "@/components/HomePage/EventsList";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AllEvents() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || null;
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [events, setEvents] = useState([]);
  const [endingSoonEvents, setEndingSoonEvents] = useState([]);
  const [latestEvents, setLatestEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(!!initialSearch);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch all events when component mounts
    fetchEvents();
    
    // Fetch events ending soon and latest events
    fetchEndingSoonEvents();
    fetchLatestEvents();
    fetchFeaturedEvents();
    
    // If there's an initial search query, perform the search
    if (initialSearch) {
      handleSearch();
    }
    
    // If there's a category filter, apply it
    if (initialCategory) {
      fetchEventsByCategory(initialCategory);
    }
  }, [initialSearch, initialCategory]);

  useEffect(() => {
    // Update search params when tab changes
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("tab", activeTab);
      return newParams;
    });
  }, [activeTab, setSearchParams]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const currentDate = new Date().toISOString();
      
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          category:categories (
            name
          ),
          tickets (
            price,
            type
          )
        `)
        .or(`status.eq.published,status.eq.featured`)
        .gte("end_date", currentDate) // Only get events that haven't ended
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching events:", error);
        toast({
          variant: "destructive",
          title: "Error fetching events",
          description: error.message
        });
      } else {
        const processedEvents = data.map(event => {
          const isFree = event.tickets && event.tickets.length > 0 ? 
            (event.tickets[0].type === 'free' || parseFloat(String(event.tickets[0].price)) === 0) : false;
          const price = event.tickets && event.tickets.length > 0 ? 
            String(event.tickets[0].price) : '0';
          return {
            ...event,
            isFree,
            price,
            featured: event.status === 'featured'
          };
        });
        setEvents(processedEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        variant: "destructive",
        title: "Error fetching events",
        description: "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEventsByCategory = async (categoryId) => {
    setLoading(true);
    try {
      const currentDate = new Date().toISOString();
      
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          category:categories (
            name
          ),
          tickets (
            price,
            type
          )
        `)
        .or(`status.eq.published,status.eq.featured`)
        .eq("category_id", categoryId)
        .gte("end_date", currentDate) // Only get events that haven't ended
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching events by category:", error);
        toast({
          variant: "destructive",
          title: "Error fetching events",
          description: error.message
        });
      } else {
        const processedEvents = data.map(event => {
          const isFree = event.tickets && event.tickets.length > 0 ? 
            (event.tickets[0].type === 'free' || parseFloat(String(event.tickets[0].price)) === 0) : false;
          const price = event.tickets && event.tickets.length > 0 ? 
            String(event.tickets[0].price) : '0';
          return {
            ...event,
            isFree,
            price,
            featured: event.status === 'featured'
          };
        });
        setEvents(processedEvents);
      }
    } catch (error) {
      console.error("Error fetching events by category:", error);
      toast({
        variant: "destructive",
        title: "Error fetching events",
        description: "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEndingSoonEvents = async () => {
    try {
      const currentDate = new Date().toISOString();
      
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          category:categories (
            name
          ),
          tickets (
            price,
            type
          )
        `)
        .or(`status.eq.published,status.eq.featured`)
        .gte("end_date", currentDate) // Only get events that haven't ended
        .order("end_date", { ascending: true })
        .limit(12);

      if (error) {
        console.error("Error fetching ending soon events:", error);
        toast({
          variant: "destructive",
          title: "Error fetching events",
          description: error.message
        });
      } else {
        const processedEvents = data.map(event => {
          const isFree = event.tickets && event.tickets.length > 0 ? 
            (event.tickets[0].type === 'free' || parseFloat(String(event.tickets[0].price)) === 0) : false;
          const price = event.tickets && event.tickets.length > 0 ? 
            String(event.tickets[0].price) : '0';
          return {
            ...event,
            isFree,
            price,
            featured: event.status === 'featured'
          };
        });
        setEndingSoonEvents(processedEvents);
      }
    } catch (error) {
      console.error("Error fetching ending soon events:", error);
    }
  };

  const fetchLatestEvents = async () => {
    try {
      const currentDate = new Date().toISOString();
      
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          category:categories (
            name
          ),
          tickets (
            price,
            type
          )
        `)
        .or(`status.eq.published,status.eq.featured`)
        .gte("end_date", currentDate) // Only get events that haven't ended
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) {
        console.error("Error fetching latest events:", error);
        toast({
          variant: "destructive",
          title: "Error fetching events",
          description: error.message
        });
      } else {
        const processedEvents = data.map(event => {
          const isFree = event.tickets && event.tickets.length > 0 ? 
            (event.tickets[0].type === 'free' || parseFloat(String(event.tickets[0].price)) === 0) : false;
          const price = event.tickets && event.tickets.length > 0 ? 
            String(event.tickets[0].price) : '0';
          return {
            ...event,
            isFree,
            price,
            featured: event.status === 'featured'
          };
        });
        setLatestEvents(processedEvents);
      }
    } catch (error) {
      console.error("Error fetching latest events:", error);
    }
  };

  const fetchFeaturedEvents = async () => {
    try {
      const currentDate = new Date().toISOString();
      
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          category:categories (
            name
          ),
          tickets (
            price,
            type
          )
        `)
        .eq("status", "featured")
        .gte("end_date", currentDate) // Only get events that haven't ended
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) {
        console.error("Error fetching featured events:", error);
        toast({
          variant: "destructive",
          title: "Error fetching events",
          description: error.message
        });
      } else {
        const processedEvents = data.map(event => {
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
        setFeaturedEvents(processedEvents);
      }
    } catch (error) {
      console.error("Error fetching featured events:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchEvents();
      setHasSearched(false);
      setSearchResults([]);
      
      // Update URL
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.delete("search");
        return newParams;
      });
      
      return;
    }
    
    setLoading(true);
    setHasSearched(true);
    
    // Update URL
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("search", searchQuery);
      return newParams;
    });
    
    try {
      const currentDate = new Date().toISOString();
      
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          category:categories (
            name
          ),
          tickets (
            price,
            type
          )
        `)
        .or(`title.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .or(`status.eq.published,status.eq.featured`)
        .gte("end_date", currentDate) // Only get events that haven't ended
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error searching events:", error);
        toast({
          variant: "destructive",
          title: "Error searching events",
          description: error.message
        });
      } else {
        const processedEvents = data.map(event => {
          const isFree = event.tickets && event.tickets.length > 0 ? 
            (event.tickets[0].type === 'free' || parseFloat(String(event.tickets[0].price)) === 0) : false;
          const price = event.tickets && event.tickets.length > 0 ? 
            String(event.tickets[0].price) : '0';
          return {
            ...event,
            isFree,
            price,
            featured: event.status === 'featured'
          };
        });
        setSearchResults(processedEvents);
        setEvents(processedEvents);
      }
    } catch (error) {
      console.error("Error in handleSearch:", error);
      toast({
        variant: "destructive",
        title: "Error searching events",
        description: "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      handleSearch();
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRefresh = () => {
    fetchEvents();
    fetchEndingSoonEvents();
    fetchLatestEvents();
    fetchFeaturedEvents();
    toast({
      title: "Refreshed",
      description: "Event listings have been refreshed"
    });
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Explore Events</h1>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline"
          >
            Refresh
          </Button>
          <Button 
            onClick={() => navigate("/create-event")} 
            className="bg-[#F97316] hover:bg-[#FB923C]"
          >
            Create Event
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative w-full max-w-lg mx-auto">
          <div className="flex">
            <Input
              type="text"
              placeholder="Search for events..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              className="w-full rounded-l-lg border px-4 py-3"
            />
            <Button
              onClick={handleSearch}
              className="bg-[#F97316] text-white rounded-r-lg px-4 py-3 hover:bg-[#FB923C] transition-colors"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {hasSearched ? (
        <EventsList
          title={`Search Results: ${searchQuery}`}
          events={events}
          emptyText={`No events found matching "${searchQuery}"`}
          isSearchResult={true}
          searchQuery={searchQuery}
        />
      ) : (
        <Tabs defaultValue={activeTab} className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" /> All Events
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center gap-2">
              <Star className="h-4 w-4" /> Featured Events
            </TabsTrigger>
            <TabsTrigger value="ending-soon" className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Ending Soon
            </TabsTrigger>
            <TabsTrigger value="latest" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Latest
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <EventsList
              title="All Events"
              events={events}
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
          </TabsContent>

          <TabsContent value="featured">
            <EventsList
              title="Featured Events"
              events={featuredEvents}
              emptyText="No featured events found"
            />
          </TabsContent>

          <TabsContent value="ending-soon">
            <EventsList
              title="Events Ending Soon"
              events={endingSoonEvents}
              emptyText="No events ending soon"
            />
          </TabsContent>
          
          <TabsContent value="latest">
            <EventsList
              title="Latest Events"
              events={latestEvents}
              emptyText="No latest events"
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
