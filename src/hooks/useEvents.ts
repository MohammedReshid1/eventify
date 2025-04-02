
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useEvents(categoryId: string | null = null) {
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get current date for filtering expired events
  const currentDate = new Date().toISOString();

  // Fetch all events
  const {
    data: events = [],
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ['events', categoryId, searchQuery],
    queryFn: async () => {
      let eventsQuery = supabase
        .from('events')
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .or(`status.eq.published,status.eq.featured`)
        .gte('end_date', currentDate) // Only get events that haven't ended
        .order('created_at', { ascending: false });

      // Apply category filter if provided
      if (categoryId) {
        eventsQuery = eventsQuery.eq('category_id', categoryId);
      }

      // Apply search query if provided
      if (searchQuery && searchQuery.startsWith('location:')) {
        // Handle location search
        const location = searchQuery.replace('location:', '').trim().toLowerCase();
        eventsQuery = eventsQuery.ilike('location', `%${location}%`);
      } else if (searchQuery) {
        // Handle regular search
        eventsQuery = eventsQuery.or(`title.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await eventsQuery;

      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }

      // Process events data
      const processedEvents = data.map(event => ({
        ...event,
        available_tickets: calculateAvailableTickets(event)
      }));

      return processedEvents;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate available tickets
  const calculateAvailableTickets = (event: any) => {
    const total = event.total_tickets || 0;
    const sold = event.tickets_sold || 0;
    return Math.max(0, total - sold);
  };

  // Fetch latest events (separate query to avoid interference with filters)
  const { data: latestEvents = [] } = useQuery({
    queryKey: ['latestEvents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .or(`status.eq.published,status.eq.featured`)
        .gte('end_date', currentDate) // Only get events that haven't ended
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) {
        console.error('Error fetching latest events:', error);
        return [];
      }

      // Process events data
      return data.map(event => ({
        ...event,
        available_tickets: calculateAvailableTickets(event)
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch featured events
  const { data: featuredEvents = [] } = useQuery({
    queryKey: ['featuredEvents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .eq('status', 'featured')
        .gte('end_date', currentDate) // Only get events that haven't ended
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) {
        console.error('Error fetching featured events:', error);
        return [];
      }

      // Process events data
      return data.map(event => ({
        ...event,
        available_tickets: calculateAvailableTickets(event)
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setHasSearched(!!query);
  };

  // Reset search when categoryId changes
  useEffect(() => {
    setSearchQuery('');
    setHasSearched(false);
  }, [categoryId]);

  return {
    events,
    latestEvents,
    featuredEvents,
    loading,
    refetch,
    handleSearch,
    hasSearched
  };
}
