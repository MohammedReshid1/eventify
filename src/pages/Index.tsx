import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Calendar,
  Search as SearchIcon,
  MapPin
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import EventsList from "@/components/HomePage/EventsList";
import { useEvents } from "@/hooks/useEvents";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function Index() {
  const { events, categories, latestEvents, isLoading, handleSearch } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const isMobile = useMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Debug logging
  useEffect(() => {
    console.log("Index component rendered");
    console.log("Events data:", events);
    console.log("Latest events:", latestEvents);
    console.log("Categories:", categories);
    console.log("Loading state:", isLoading);
  }, [events, latestEvents, categories, isLoading]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm && !selectedCategory && !selectedLocation) {
      toast({
        title: "Please enter search criteria",
        description: "Enter a keyword, select a category, or choose a location to search for events.",
        variant: "destructive",
      });
      return;
    }
    
    // Redirect to events page with search params
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedLocation) params.set("location", selectedLocation);
    
    navigate(`/events?${params.toString()}`);
  };
  
  const uniqueLocations = Array.from(new Set(events?.map(event => event.location) || [])).sort();
  
  // Filter featured events
  const featuredEvents = events?.filter(event => event.featured)?.slice(0, 3) || [];
  
  return (
    <div>
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-20 md:py-28 lg:py-32 flex flex-col items-center text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-3xl"
            >
              Discover and Attend Amazing Events Near You
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-lg text-gray-200 max-w-2xl"
            >
              Find events that match your interests, from tech conferences to music festivals and everything in between.
            </motion.p>
            
            {/* Search form */}
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="mt-8 w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 flex flex-col md:flex-row gap-3"
            >
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 bg-transparent border-none shadow-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px] border-none bg-transparent shadow-none">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full md:w-[180px] border-none bg-transparent shadow-none">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                type="submit" 
                className="bg-[#F97316] hover:bg-[#FB923C] text-white w-full md:w-auto"
              >
                Search
              </Button>
            </motion.form>
          </div>
        </div>
      </div>
      
      {/* Featured events section */}
      {featuredEvents.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Featured Events</h2>
                <p className="text-muted-foreground mt-2">Don't miss out on these amazing events</p>
              </div>
              <Link to="/events" className="text-[#F97316] hover:text-[#FB923C] flex items-center">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.map((event) => (
                <Link 
                  key={event.id} 
                  to={`/event/${event.slug}`}
                  className="group relative block overflow-hidden rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 z-10"></div>
                  <img 
                    src={event.banner_image || event.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'} 
                    alt={event.title}
                    className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className="bg-[#F97316]">{event.category.name}</Badge>
                      {event.isFree && <Badge variant="outline" className="bg-green-500 text-white">Free</Badge>}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <div className="flex items-center text-white/80 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(event.start_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                      <span className="mx-2">•</span>
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Main content */}
      <div className="container py-12">
        <EventsList 
          title="Latest Events" 
          events={latestEvents || []} 
          showViewAll={true}
          navigateTo="/events"
          limit={8}
        />
        
        {categories?.slice(0, 3).map((category) => {
          const categoryEvents = events?.filter(event => event.category.id === category.id) || [];
          if (categoryEvents.length === 0) return null;
          
          return (
            <EventsList 
              key={category.id}
              title={category.name} 
              events={categoryEvents} 
              showViewAll={true}
              navigateTo={`/events?category=${category.id}`}
              limit={4}
            />
          );
        })}
      </div>
      
      {/* App promotion */}
      <section className="bg-gradient-to-r from-[#F97316] to-[#FB923C] py-16 text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Download Our App</h2>
              <p className="mb-6">Get the best event experience with our mobile app. Discover events, buy tickets, and get real-time updates.</p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-black hover:bg-gray-900 text-white">
                  App Store
                </Button>
                <Button className="bg-black hover:bg-gray-900 text-white">
                  Google Play
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="/app-mockup.png" 
                alt="Mobile app mockup" 
                className="max-w-full h-auto max-h-80 shadow-2xl rounded-lg transform rotate-3"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/300x600/F97316/FFFFFF?text=Event+App";
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
