import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { events as mockEvents, categories as mockCategories, latestEvents as mockLatestEvents } from "@/data/mockData";

interface Event {
  id: string;
  title: string;
  description?: string;
  date?: string;
  start_date?: string;
  end_date?: string;
  location: string;
  banner_image?: string;
  image_url?: string;
  category: {
    id: string;
    name: string;
  };
  tickets?: Array<{
    price: string | number;
    type: string;
  }>;
  isFree?: boolean;
  price?: string | number;
  slug: string;
  featured?: boolean;
}

export const useEvents = (selectedCategory: string | null = null) => {
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Simulate API loading delay for better UX testing
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Return mock categories with React Query
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCategories;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Return filtered mock events based on selected category
  const { data: events = [] } = useQuery({
    queryKey: ["events", selectedCategory],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (selectedCategory) {
        return mockEvents.filter(event => 
          event.category && event.category.id === selectedCategory
        );
      }
      
      return mockEvents;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Return mock latest events
  const { data: latestEvents = [] } = useQuery({
    queryKey: ["latestEvents"],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockLatestEvents;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const handleSearch = async (searchQuery: string) => {
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Handle location-based search
      if (searchQuery.startsWith('location:')) {
        const locationQuery = searchQuery.replace('location:', '').trim();
        if (!locationQuery) {
          setSearchResults([]);
          setLoading(false);
          return;
        }
        
        const filteredByLocation = mockEvents.filter(event => 
          event.location && event.location.toLowerCase().includes(locationQuery.toLowerCase())
        );
        
        const results = selectedCategory 
          ? filteredByLocation.filter(event => event.category && event.category.id === selectedCategory)
          : filteredByLocation;
        
        setSearchResults(results);
        setLoading(false);
        return;
      }
      
      // Regular search by title or description
      const filtered = mockEvents.filter(event => 
        (event.title && event.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      const results = selectedCategory 
        ? filtered.filter(event => event.category && event.category.id === selectedCategory)
        : filtered;
      
      setSearchResults(results);
    } catch (error) {
      console.error("Error in handleSearch:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    events: hasSearched ? searchResults : events,
    categories,
    latestEvents,
    loading,
    handleSearch,
    hasSearched
  };
};
