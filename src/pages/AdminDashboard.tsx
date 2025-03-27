import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, 
  Users, 
  Ticket, 
  BarChart3, 
  Activity, 
  Settings,
  ListFilter,
  Search,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminLayout } from "@/components/AdminLayout";
import { Checkbox } from "@/components/ui/checkbox";
import { FormLabel } from "@/components/ui/form";
import { analyticsData } from "@/data/mockData";

// Types for our dashboard
interface DashboardStats {
  totalEvents: number;
  totalUsers: number;
  totalTickets: number;
  pendingEvents: number;
  revenue: number;
}

interface EventItem {
  id: string;
  title: string;
  organizer_id: string;
  organizer: {
    name: string;
    email: string;
  };
  status: 'published' | 'draft' | 'pending' | 'canceled';
  start_date: string;
  location: string;
  tickets_sold: number;
  created_at: string;
}

// Mock data for demo purposes
const MOCK_STATS: DashboardStats = {
  totalEvents: analyticsData.totalEvents,
  totalUsers: analyticsData.totalUsers,
  totalTickets: analyticsData.totalTicketsSold,
  pendingEvents: 5,
  revenue: analyticsData.totalRevenue
};

const MOCK_EVENTS: EventItem[] = [
  {
    id: "1",
    title: "Tech Conference 2024",
    organizer_id: "user1",
    organizer: {
      name: "John Doe",
      email: "john@example.com"
    },
    status: "published",
    start_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    location: "San Francisco, CA",
    tickets_sold: 128,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
  },
  {
    id: "2",
    title: "Music Festival 2024",
    organizer_id: "user2",
    organizer: {
      name: "Jane Smith",
      email: "jane@example.com"
    },
    status: "pending",
    start_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
    location: "Los Angeles, CA",
    tickets_sold: 0,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
  {
    id: "3",
    title: "Business Workshop",
    organizer_id: "user3",
    organizer: {
      name: "Alice Johnson",
      email: "alice@example.com"
    },
    status: "draft",
    start_date: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(), // 22 days from now
    location: "New York, NY",
    tickets_sold: 0,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: "4",
    title: "Charity Gala",
    organizer_id: "user4",
    organizer: {
      name: "Robert Brown",
      email: "robert@example.com"
    },
    status: "published",
    start_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    location: "Chicago, IL",
    tickets_sold: 89,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
  },
  {
    id: "5",
    title: "Art Exhibition",
    organizer_id: "user5",
    organizer: {
      name: "Emma Wilson",
      email: "emma@example.com"
    },
    status: "pending",
    start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    location: "Boston, MA",
    tickets_sold: 0,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: "6",
    title: "Food Festival",
    organizer_id: "user6",
    organizer: {
      name: "David Lee",
      email: "david@example.com"
    },
    status: "canceled",
    start_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    location: "Austin, TX",
    tickets_sold: 12,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() // 8 days ago
  }
];

// Mock user data
const MOCK_USERS = [
  { id: "u1", name: "John Doe", email: "john@example.com", joined: "1 month ago", events: 3, tickets: 2 },
  { id: "u2", name: "Jane Smith", email: "jane@example.com", joined: "2 months ago", events: 1, tickets: 5 },
  { id: "u3", name: "Alice Johnson", email: "alice@example.com", joined: "2 weeks ago", events: 1, tickets: 0 },
  { id: "u4", name: "Robert Brown", email: "robert@example.com", joined: "3 months ago", events: 2, tickets: 7 },
  { id: "u5", name: "Emma Wilson", email: "emma@example.com", joined: "5 days ago", events: 1, tickets: 0 }
];

// Mock ticket data
const MOCK_TICKETS = [
  { id: "t1", event: "Tech Conference 2024", user: "John Smith", price: "$99.99", status: "Confirmed", purchased: "2 days ago" },
  { id: "t2", event: "Music Festival 2024", user: "Emily Jones", price: "$149.99", status: "Pending", purchased: "12 hours ago" },
  { id: "t3", event: "Tech Conference 2024", user: "David Wilson", price: "$99.99", status: "Confirmed", purchased: "1 week ago" },
  { id: "t4", event: "Charity Gala", user: "Sophie Brown", price: "$249.99", status: "Confirmed", purchased: "3 days ago" },
  { id: "t5", event: "Charity Gala", user: "Michael Davis", price: "$249.99", status: "Refunded", purchased: "5 days ago" }
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Update based on the current URL path
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/admin/events')) {
      setActiveTab('events');
    } else if (path.includes('/admin/users')) {
      setActiveTab('users');
    } else if (path.includes('/admin/tickets')) {
      setActiveTab('tickets');
    } else if (path.includes('/admin/analytics')) {
      setActiveTab('analytics');
    } else if (path.includes('/admin/settings')) {
      setActiveTab('settings');
    } else {
      setActiveTab('overview');
    }
  }, []);

  // Update URL when tab changes
  useEffect(() => {
    let path = '/admin';
    if (activeTab !== 'overview') {
      path = `/admin/${activeTab}`;
    }
    // Only navigate if we're not already on that path
    if (window.location.pathname !== path) {
      navigate(path);
    }
  }, [activeTab, navigate]);

  // Use mock data instead of querying Supabase
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_STATS;
    }
  });

  // Events data with mock
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["adminEvents", statusFilter],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (statusFilter === "all") {
        return MOCK_EVENTS;
      }
      
      return MOCK_EVENTS.filter(event => event.status === statusFilter);
    }
  });

  // Handle status change (approve/reject) - now just UI updates without backend
  const handleStatusChange = async (eventId: string, newStatus: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Just show a toast - no actual backend update
    toast({
      title: "Status updated",
      description: `Event status changed to ${newStatus}`,
    });
  };

  // Helper function to render status badges with appropriate colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Published</Badge>;
      case 'draft':
        return <Badge className="bg-gray-500"><Clock className="h-3 w-3 mr-1" /> Draft</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500"><AlertTriangle className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" /> Canceled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get filtered events based on search term
  const filteredEvents = events?.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Users tab rendering
  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Users</h2>
        <Input
          placeholder="Search users..."
          className="max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Tickets</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_USERS.filter(user => 
              user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              user.email.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.joined}</TableCell>
                <TableCell>{user.events}</TableCell>
                <TableCell>{user.tickets}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  // Tickets tab rendering
  const renderTicketsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Tickets</h2>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search tickets..."
            className="max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Purchased</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_TICKETS.filter(ticket => 
              ticket.event.toLowerCase().includes(searchTerm.toLowerCase()) || 
              ticket.user.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(ticket => (
              <TableRow key={ticket.id}>
                <TableCell className="font-mono">{ticket.id}</TableCell>
                <TableCell>{ticket.event}</TableCell>
                <TableCell>{ticket.user}</TableCell>
                <TableCell>{ticket.price}</TableCell>
                <TableCell>
                  <Badge className={
                    ticket.status === "Confirmed" ? "bg-green-500" : 
                    ticket.status === "Pending" ? "bg-yellow-500" : 
                    "bg-red-500"
                  }>
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell>{ticket.purchased}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  // In your return statement, update the tab content to render based on active tab
  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard Overview</h1>
            <p className="text-muted-foreground">Welcome to your admin dashboard</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Button onClick={() => navigate("/create-event")} className="bg-[#F97316] hover:bg-[#F97316]/90">
              <PlusCircle className="mr-2 h-4 w-4" /> 
              Create Event
            </Button>
          </div>
        </div>

        {/* Admin navigation tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full max-w-xl grid grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Overview tab content */}
        {activeTab === 'overview' && (
          <>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {statsLoading ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <Skeleton className="h-4 w-32" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-8 w-20 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-500">+12.5%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-500">+8.2%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalTickets || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-500">+23.1%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${stats?.revenue.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-500">+18.7%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-8">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {eventsLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {events?.slice(0, 5).map(event => (
                        <div key={event.id} className="flex items-center justify-between">
                          <span className="font-medium truncate max-w-[200px]">{event.title}</span>
                          {getStatusBadge(event.status)}
                        </div>
                      ))}
                      {events && events.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">No events found</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  {eventsLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {events?.filter(e => e.status === 'pending').slice(0, 5).map(event => (
                        <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="font-medium truncate max-w-[200px]">{event.title}</span>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleStatusChange(event.id, 'published')}
                              className="bg-green-500 hover:bg-green-600 h-8"
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleStatusChange(event.id, 'canceled')}
                              className="h-8"
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                      {events?.filter(e => e.status === 'pending').length === 0 && (
                        <p className="text-muted-foreground text-center py-4">No pending approvals</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Events tab content */}
        {activeTab === 'events' && (
          <Card>
            <CardHeader>
              <CardTitle>Events Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <ListFilter className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {eventsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Name</TableHead>
                        <TableHead className="hidden md:table-cell">Organizer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="hidden md:table-cell">Location</TableHead>
                        <TableHead className="hidden md:table-cell">Tickets</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell className="font-medium max-w-[150px] truncate">{event.title}</TableCell>
                            <TableCell className="hidden md:table-cell">{event.organizer?.name || 'Unknown'}</TableCell>
                            <TableCell>{getStatusBadge(event.status)}</TableCell>
                            <TableCell className="hidden md:table-cell">{new Date(event.start_date).toLocaleDateString()}</TableCell>
                            <TableCell className="hidden md:table-cell">{event.location}</TableCell>
                            <TableCell className="hidden md:table-cell">{event.tickets_sold || 0}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => navigate(`/event/${event.id}`)}
                                >
                                  View
                                </Button>
                                <Select
                                  onValueChange={(value) => handleStatusChange(event.id, value)}
                                  defaultValue={event.status}
                                >
                                  <SelectTrigger className="h-8 w-[100px]">
                                    <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="published">Publish</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="canceled">Cancel</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            {searchTerm ? "No events found matching your search" : "No events found"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Users tab content */}
        {activeTab === 'users' && renderUsersTab()}
        
        {/* Tickets tab content */}
        {activeTab === 'tickets' && renderTicketsTab()}
        
        {/* Analytics tab content */}
        {activeTab === 'analytics' && (
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Revenue Overview</h3>
                  <div className="h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Revenue chart will appear here</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Event Popularity</h3>
                  <div className="h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Event popularity chart will appear here</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">User Growth</h3>
                  <div className="h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">User growth chart will appear here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Settings tab content */}
        {activeTab === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Admin Profile</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <FormLabel>Name</FormLabel>
                      <Input defaultValue="Admin User" />
                    </div>
                    <div>
                      <FormLabel>Email</FormLabel>
                      <Input defaultValue="admin@findevent.com" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Security</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <FormLabel>Current Password</FormLabel>
                      <Input type="password" />
                    </div>
                    <div>
                      <FormLabel>New Password</FormLabel>
                      <Input type="password" />
                    </div>
                  </div>
                  <Button className="mt-4">Update Password</Button>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-events" />
                      <label htmlFor="notify-events">Notify on new events</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-users" defaultChecked />
                      <label htmlFor="notify-users">Notify on new users</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-reports" defaultChecked />
                      <label htmlFor="notify-reports">Notify on event reports</label>
                    </div>
                  </div>
                  <Button className="mt-4">Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
} 