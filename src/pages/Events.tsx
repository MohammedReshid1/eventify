import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Tag, Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/useEvents";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { motion } from "framer-motion";

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "all");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  
  const { events, latestEvents, loading, handleSearch } = useEvents(selectedCategory);
  
  // Apply filters
  const filteredEvents = () => {
    let result = activeTab === 'latest' ? latestEvents : events;
    
    // Apply search filter if search query exists
    if (searchQuery) {
      result = result.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply price filter
    if (priceRange !== 'all') {
      result = result.filter(event => {
        if (priceRange === 'free') return event.price === 0;
        if (priceRange === 'paid') return event.price > 0;
        if (priceRange === 'under50') return event.price > 0 && event.price < 50;
        if (priceRange === 'over50') return event.price >= 50;
        return true;
      });
    }
    
    // Apply date filter
    if (dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      result = result.filter(event => {
        const eventDate = new Date(event.date);
        if (dateRange === 'today') return eventDate >= today && eventDate < tomorrow;
        if (dateRange === 'thisWeek') return eventDate >= today && eventDate < nextWeek;
        if (dateRange === 'thisMonth') return eventDate >= today && eventDate < nextMonth;
        return true;
      });
    }
    
    return result;
  };
  
  const onSearch = (e) => {
    e.preventDefault();
    setActiveTab('all');
    handleSearch(searchQuery);
    setSearchParams({ search: searchQuery });
  };
  
  useEffect(() => {
    // Update search params when filters change
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (activeTab !== 'all') params.set('tab', activeTab);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, activeTab]);
  
  // Card animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Discover Events</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-card rounded-lg border p-4 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Filters</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
              </Button>
            </div>
            
            <Collapsible 
              open={showFilters || window.innerWidth >= 768} 
              className="space-y-4"
            >
              <CollapsibleContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Price</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="price-all" 
                        checked={priceRange === 'all'} 
                        onCheckedChange={() => setPriceRange('all')}
                      />
                      <label htmlFor="price-all" className="text-sm">All</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="price-free" 
                        checked={priceRange === 'free'} 
                        onCheckedChange={() => setPriceRange('free')}
                      />
                      <label htmlFor="price-free" className="text-sm">Free</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="price-paid" 
                        checked={priceRange === 'paid'} 
                        onCheckedChange={() => setPriceRange('paid')}
                      />
                      <label htmlFor="price-paid" className="text-sm">Paid</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="price-under50" 
                        checked={priceRange === 'under50'} 
                        onCheckedChange={() => setPriceRange('under50')}
                      />
                      <label htmlFor="price-under50" className="text-sm">Under $50</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="price-over50" 
                        checked={priceRange === 'over50'} 
                        onCheckedChange={() => setPriceRange('over50')}
                      />
                      <label htmlFor="price-over50" className="text-sm">$50 and above</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Date</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="date-all" 
                        checked={dateRange === 'all'} 
                        onCheckedChange={() => setDateRange('all')}
                      />
                      <label htmlFor="date-all" className="text-sm">All dates</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="date-today" 
                        checked={dateRange === 'today'} 
                        onCheckedChange={() => setDateRange('today')}
                      />
                      <label htmlFor="date-today" className="text-sm">Today</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="date-week" 
                        checked={dateRange === 'thisWeek'} 
                        onCheckedChange={() => setDateRange('thisWeek')}
                      />
                      <label htmlFor="date-week" className="text-sm">This week</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="date-month" 
                        checked={dateRange === 'thisMonth'} 
                        onCheckedChange={() => setDateRange('thisMonth')}
                      />
                      <label htmlFor="date-month" className="text-sm">This month</label>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {/* Search and tabs */}
          <div className="mb-6 space-y-4">
            <form onSubmit={onSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
            
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="latest">Latest</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Results count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredEvents().length} {filteredEvents().length === 1 ? 'event' : 'events'}
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory && ` in selected category`}
            </p>
          </div>
          
          {/* Events grid */}
          {loading ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredEvents().length > 0 ? (
            <motion.div 
              className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredEvents().map(event => (
                <motion.div key={event.id} variants={item}>
                  <Link to={`/event/${event.slug}`} className="block h-full">
                    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                      {event.image_url && (
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={event.image_url} 
                            alt={event.title} 
                            className="w-full h-full object-cover object-center"
                          />
                          {event.price === 0 && (
                            <Badge className="absolute top-2 right-2 bg-green-500">Free</Badge>
                          )}
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                        <CardDescription className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(event.date)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col space-y-2 text-sm">
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-muted-foreground" />
                            <span className="line-clamp-1">{event.location || 'Location TBD'}</span>
                          </div>
                          {event.category && (
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                              <span>{event.category.name}</span>
                            </div>
                          )}
                          {event.price > 0 && (
                            <div className="flex items-center">
                              <span className="font-medium">${event.price.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" className="w-full justify-between">
                          View Details
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                          </svg>
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setPriceRange('all');
                setDateRange('all');
                setActiveTab('all');
              }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events; 