
import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventType, CategoryType } from "@/types";

export const useEvents = (selectedCategory: string | null = null) => {
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Set initial loading state
    const timer = setTimeout(() => {
      // Only set loading to false if it hasn't been done by one of the queries
      setLoading(false);
    }, 2000); // Safety timeout
    
    return () => clearTimeout(timer);
  }, []);

  // Fetch categories from Supabase
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");
      
      if (error) {
        throw error;
      }
      
      setLoading(false);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get current date for filtering expired events
  const currentDate = new Date().toISOString();

  // Process events to add isFree property
  const processEvents = useCallback((eventData: any[]): EventType[] => {
    return eventData.map(event => {
      // Check if any ticket is free or has zero price
      const hasFreeTicket = event.tickets && Array.isArray(event.tickets) && event.tickets.some(
        (ticket: any) => ticket.type === "free" || ticket.price === 0 || ticket.price === '0'
      );
      
      return {
        ...event,
        isFree: hasFreeTicket
      };
    });
  }, []);

  // Fetch events from Supabase
  const { data: events = [] } = useQuery({
    queryKey: ["events", selectedCategory],
    queryFn: async () => {
      setLoading(true);
      
      let query = supabase
        .from("events")
        .select(`
          id,
          title,
          description,
          start_date,
          end_date,
          location,
          banner_image,
          image_url,
          category:categories (id, name),
          tickets (id, price, type, name, remaining),
          slug,
          featured
        `)
        .eq("status", "published")
        .gte("end_date", currentDate); // Only return non-expired events
      
      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Process events to add the isFree property
      const processedEvents = processEvents(data || []);
      
      setLoading(false);
      return processedEvents;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch latest events from Supabase
  const { data: latestEvents = [] } = useQuery({
    queryKey: ["latestEvents"],
    queryFn: async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("events")
        .select(`
          id,
          title,
          description,
          start_date,
          end_date,
          location,
          banner_image,
          image_url,
          category:categories (id, name),
          tickets (id, price, type, name, remaining),
          slug,
          featured
        `)
        .eq("status", "published")
        .gte("end_date", currentDate) // Only return non-expired events
        .order("created_at", { ascending: false })
        .limit(8);
      
      if (error) {
        throw error;
      }
      
      // Process events to add the isFree property
      const processedEvents = processEvents(data || []);
      
      setLoading(false);
      return processedEvents;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Handle search function with proper type handling
  const handleSearch = useCallback(async (searchQuery: string) => {
    setLoading(true);
    
    if (!searchQuery.trim()) {
      setHasSearched(false);
      setSearchResults([]);
      // Refresh the events query
      queryClient.invalidateQueries({ queryKey: ["events", selectedCategory] });
      setLoading(false);
      return;
    }
    
    setHasSearched(true);
    
    try {
      // Handle location-based search
      if (searchQuery.startsWith('location:')) {
        const locationQuery = searchQuery.replace('location:', '').trim();
        if (!locationQuery) {
          setSearchResults([]);
          setLoading(false);
          return;
        }
        
        let query = supabase
          .from("events")
          .select(`
            id,
            title,
            description,
            start_date,
            end_date,
            location,
            banner_image,
            image_url,
            category:categories (id, name),
            tickets (id, price, type, name, remaining),
            slug,
            featured
          `)
          .eq("status", "published")
          .gte("end_date", currentDate) // Only return non-expired events
          .ilike("location", `%${locationQuery}%`);
        
        if (selectedCategory) {
          query = query.eq("category_id", selectedCategory);
        }
        
        const { data, error } = await query.order("created_at", { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Process events
        const processedEvents = processEvents(data || []);
        
        setSearchResults(processedEvents);
        setLoading(false);
        return;
      }
      
      // Regular search by title or description
      let query = supabase
        .from("events")
        .select(`
          id,
          title,
          description,
          start_date,
          end_date,
          location,
          banner_image,
          image_url,
          category:categories (id, name),
          tickets (id, price, type, name, remaining),
          slug,
          featured
        `)
        .eq("status", "published")
        .gte("end_date", currentDate) // Only return non-expired events
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      
      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Process events
      const processedEvents = processEvents(data || []);
      
      setSearchResults(processedEvents);
    } catch (error) {
      console.error("Error in handleSearch:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [queryClient, selectedCategory, processEvents, currentDate]);

  return {
    events: hasSearched ? searchResults : events,
    categories,
    latestEvents,
    loading,
    handleSearch,
    hasSearched
  };
};
