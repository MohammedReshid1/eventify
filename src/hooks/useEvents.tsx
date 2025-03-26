import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Event {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  location: string;
  banner_image: string;
  category: {
    id: string;
    name: string;
  };
  tickets: Array<{
    price: string | number;
    type: string;
  }>;
  isFree: boolean;
  price: string;
  slug: string;
  featured?: boolean;
}

export const useEvents = (selectedCategory: string | null = null) => {
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const queryClient = useQueryClient();

  // Fetch categories with React Query
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch events with React Query based on category
  const { data: events = [], isLoading: loading } = useQuery({
    queryKey: ["events", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select(`
          *,
          category:categories (
            id,
            name
          ),
          tickets (
            price,
            type
          )
        `)
        .eq("status", "published")
        .gte("end_date", new Date().toISOString());

      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching events:", error);
        return [];
      }

      return data.map(event => {
        const isFree = event.tickets && event.tickets.length > 0 ? 
          (event.tickets[0].type === 'free' || parseFloat(String(event.tickets[0].price)) === 0) : false;
        const price = event.tickets && event.tickets.length > 0 ? 
          String(event.tickets[0].price) : '0';
        
        // Add featured property based on some criteria (e.g., first 2 events or random)
        const featured = Math.random() < 0.2; // 20% chance of being featured

        return {
          ...event,
          isFree,
          price,
          featured
        };
      });
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch latest events with React Query
  const { data: latestEvents = [] } = useQuery({
    queryKey: ["latestEvents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          category:categories (
            id,
            name
          ),
          tickets (
            price,
            type
          )
        `)
        .eq("status", "published")
        .gte("end_date", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching latest events:", error);
        return [];
      }

      return data.map(event => {
        const isFree = event.tickets && event.tickets.length > 0 ? 
          (event.tickets[0].type === 'free' || parseFloat(String(event.tickets[0].price)) === 0) : false;
        const price = event.tickets && event.tickets.length > 0 ? 
          String(event.tickets[0].price) : '0';
        
        // Add featured property to latest events
        const featured = Math.random() < 0.3; // 30% chance of being featured for latest events

        return {
          ...event,
          isFree,
          price,
          featured
        };
      });
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setHasSearched(false);
      setSearchResults([]);
      // Refresh the events query
      queryClient.invalidateQueries({ queryKey: ["events", selectedCategory] });
      return;
    }
    
    setHasSearched(true);
    
    try {
      // Handle location-based search
      if (searchQuery.startsWith('location:')) {
        const locationQuery = searchQuery.replace('location:', '').trim();
        if (!locationQuery) {
          setSearchResults([]);
          return;
        }
        
        let query = supabase
          .from("events")
          .select(`
            *,
            category:categories (
              id,
              name
            ),
            tickets (
              price,
              type
            )
          `)
          .ilike("location", `%${locationQuery}%`)
          .eq("status", "published")
          .gte("end_date", new Date().toISOString());
          
        if (selectedCategory) {
          query = query.eq("category_id", selectedCategory);
        }
  
        const { data, error } = await query;
  
        if (error) {
          console.error("Error searching events by location:", error);
          setSearchResults([]);
        } else {
          processSearchResults(data);
        }
        return;
      }
      
      // Regular search by title or description
      let query = supabase
        .from("events")
        .select(`
          *,
          category:categories (
            id,
            name
          ),
          tickets (
            price,
            type
          )
        `)
        .or(`title.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%`)
        .eq("status", "published")
        .gte("end_date", new Date().toISOString());
        
      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error searching events:", error);
        setSearchResults([]);
      } else {
        processSearchResults(data);
      }
    } catch (error) {
      console.error("Error in handleSearch:", error);
      setSearchResults([]);
    }
  };

  const processSearchResults = (data: any[]) => {
    const processedEvents = data.map(event => {
      const isFree = event.tickets && event.tickets.length > 0 ? 
        (event.tickets[0].type === 'free' || parseFloat(String(event.tickets[0].price)) === 0) : false;
      const price = event.tickets && event.tickets.length > 0 ? 
        String(event.tickets[0].price) : '0';
      return {
        ...event,
        isFree,
        price,
        featured: false // Search results are not featured by default
      };
    });
    setSearchResults(processedEvents);
  };

  return {
    events: hasSearched ? searchResults : events,
    latestEvents,
    loading,
    categories,
    handleSearch,
    hasSearched,
    searchResults
  };
};
