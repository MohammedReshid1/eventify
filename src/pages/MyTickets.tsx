import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  Download,
  Search,
  Ticket,
  Filter,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

// Animation variants
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
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

interface Ticket {
  id: string;
  quantity: number;
  total_amount: number;
  payment_status: string;
  created_at: string;
  event: {
    id: string;
    title: string;
    start_date: string;
    location: string;
    banner_image?: string;
    image_url?: string;
    slug: string;
  };
  ticket: {
    id: string;
    name: string;
    price: number;
    type: string;
  };
}

const MyTickets = () => {
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check user authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/auth");
      } else {
        setUser(data.session.user);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Fetch tickets from Supabase
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["my-tickets", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          quantity,
          total_amount,
          payment_status,
          created_at,
          event:events (
            id,
            title,
            start_date,
            end_date,
            location,
            banner_image,
            image_url,
            slug
          ),
          ticket:tickets (
            id,
            price,
            type,
            name
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const downloadTicket = async (ticket: Ticket) => {
    try {
      // TODO: Implement actual ticket download or QR code generation
      // For now, just show a success message
      toast({
        title: "Ticket Downloaded",
        description: "Your e-ticket has been downloaded successfully."
      });
    } catch (error) {
      console.error("Error downloading ticket:", error);
      toast({
        title: "Download Failed",
        description: "There was a problem downloading your ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter tickets based on search term and filter type
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = 
      ticket.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    return matchesSearch && ticket.ticket.name.toLowerCase().includes(filterType.toLowerCase());
  });

  // Split tickets into upcoming and past
  const now = new Date();
  const upcomingTickets = filteredTickets.filter(
    ticket => new Date(ticket.event.start_date) >= now
  );
  const pastTickets = filteredTickets.filter(
    ticket => new Date(ticket.event.start_date) < now
  );

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Tickets</h1>
        <p className="text-muted-foreground">Manage your event tickets</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tickets</SelectItem>
              <SelectItem value="standard">Standard tickets</SelectItem>
              <SelectItem value="vip">VIP tickets</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Upcoming
            {upcomingTickets.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-2">
                {upcomingTickets.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Past
            {pastTickets.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-2">
                {pastTickets.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {isLoading ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-t-lg" />
                  <CardHeader>
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : upcomingTickets.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
              {upcomingTickets.map((ticket) => (
                <motion.div key={ticket.id} variants={item}>
                  <Card className="overflow-hidden h-full flex flex-col">
                    <div className="relative">
                      <img
                        src={ticket.event.banner_image || ticket.event.image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"}
                        alt={ticket.event.title}
                        className="h-48 w-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-[#F97316]">
                        {ticket.ticket.name}
                      </Badge>
                      {ticket.payment_status !== "completed" && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500">
                          {ticket.payment_status}
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{ticket.event.title}</CardTitle>
                      <CardDescription>
                        {format(new Date(ticket.event.start_date), "EEEE, MMMM d, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <span>{format(new Date(ticket.event.start_date), "h:mm a")}</span>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <span className="line-clamp-1">{ticket.event.location}</span>
                        </div>
                        <div className="flex items-start">
                          <Ticket className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <span>{ticket.quantity} {ticket.quantity > 1 ? 'tickets' : 'ticket'}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => downloadTicket(ticket)}
                      >
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                      <Button 
                        className="flex-1 bg-[#F97316] hover:bg-[#FB923C]"
                        onClick={() => navigate(`/event/${ticket.event.slug}`)}
                      >
                        <QrCode className="mr-2 h-4 w-4" /> View
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="rounded-full h-20 w-20 bg-muted flex items-center justify-center mx-auto mb-4">
                <Ticket className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No upcoming tickets</h3>
              <p className="text-muted-foreground mb-6">
                You don't have any upcoming events. Explore events and get tickets.
              </p>
              <Button 
                className="bg-[#F97316] hover:bg-[#FB923C]"
                onClick={() => navigate("/events")}
              >
                Explore Events
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {isLoading ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-t-lg" />
                  <CardHeader>
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : pastTickets.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
              {pastTickets.map((ticket) => (
                <motion.div key={ticket.id} variants={item}>
                  <Card className="overflow-hidden h-full flex flex-col opacity-80">
                    <div className="relative">
                      <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                        <Badge className="bg-gray-700">Past Event</Badge>
                      </div>
                      <img
                        src={ticket.event.banner_image || ticket.event.image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"}
                        alt={ticket.event.title}
                        className="h-48 w-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{ticket.event.title}</CardTitle>
                      <CardDescription>
                        {format(new Date(ticket.event.start_date), "EEEE, MMMM d, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <span>{format(new Date(ticket.event.start_date), "h:mm a")}</span>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <span className="line-clamp-1">{ticket.event.location}</span>
                        </div>
                        <div className="flex items-start">
                          <Ticket className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <span>{ticket.quantity} {ticket.quantity > 1 ? 'tickets' : 'ticket'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="rounded-full h-20 w-20 bg-muted flex items-center justify-center mx-auto mb-4">
                <Clock className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No past tickets</h3>
              <p className="text-muted-foreground mb-6">
                You haven't attended any events yet. Check out upcoming events!
              </p>
              <Button 
                className="bg-[#F97316] hover:bg-[#FB923C]"
                onClick={() => navigate("/events")}
              >
                Explore Events
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTickets;
