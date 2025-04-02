import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface SearchHeaderProps {
  onSearch: (query: string) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [activeTab, setActiveTab] = useState("events");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleLocationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      onSearch(`location:${searchLocation}`);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  // Background image pattern using inline SVG instead of external image
  const backgroundPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div className="relative mb-16 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-amber-600 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: backgroundPattern,
            backgroundSize: "30px 30px"
          }}
        />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Text content */}
          <motion.div 
            className="max-w-xl"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="mb-4 text-left text-4xl font-extrabold leading-tight text-white md:text-5xl">
              Discover <span className="text-amber-300">Unforgettable</span> Events Near You
            </h1>
            <p className="mb-6 text-left text-lg text-white/90">
              Find and book tickets to concerts, workshops, conferences, and more events that match your interests
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button
                onClick={() => navigate('/create-event')}
                className="bg-white text-orange-600 hover:bg-orange-50"
                size="lg"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Create Event
              </Button>
              <Button
                onClick={() => navigate('/events')}
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                size="lg"
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Browse All Events
              </Button>
            </div>
          </motion.div>
          
          {/* Search box */}
          <motion.div 
            className="w-full max-w-lg"
            initial="hidden"
            animate="visible"
            variants={{
              ...fadeIn,
              visible: { ...fadeIn.visible, transition: { delay: 0.2, duration: 0.6 } }
            }}
          >
            <div className={cn(
              "backdrop-blur-md rounded-xl p-5",
              "bg-white/90 dark:bg-gray-900/90 shadow-xl border border-white/30 dark:border-gray-700/30"
            )}>
              <Tabs defaultValue="events" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="w-full mb-4 bg-orange-100 dark:bg-gray-800 grid grid-cols-2">
                  <TabsTrigger value="events" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    Find Events
                  </TabsTrigger>
                  <TabsTrigger value="location" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    Search by Location
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="events" className="mt-0">
                  <form onSubmit={handleSubmit} className="relative w-full">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-500 dark:text-orange-400" />
                      <input
                        type="text"
                        placeholder="Concerts, workshops, conferences..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cn(
                          "w-full rounded-lg bg-white dark:bg-gray-800 px-10 py-3",
                          "border border-orange-200 dark:border-gray-700",
                          "focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500",
                          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                          "transition-colors"
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full mt-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                    >
                      Search Events
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="location" className="mt-0">
                  <form onSubmit={handleLocationSearch} className="relative w-full">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-500 dark:text-orange-400" />
                      <input
                        type="text"
                        placeholder="Enter city or location..."
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className={cn(
                          "w-full rounded-lg bg-white dark:bg-gray-800 px-10 py-3",
                          "border border-orange-200 dark:border-gray-700",
                          "focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500",
                          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                          "transition-colors"
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full mt-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                    >
                      Find Nearby Events
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
