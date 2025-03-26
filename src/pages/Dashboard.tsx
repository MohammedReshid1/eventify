import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Calendar, Ticket, MoreVertical, Pencil, Trash, ClipboardCopy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QrCodeScanner } from "@/components/QrCodeScanner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [ticketToUpdate, setTicketToUpdate] = useState<any>(null);
  const [newTicketQuantity, setNewTicketQuantity] = useState<number>(0);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          navigate("/auth");
        } else {
          setUser(data.session.user);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "Authentication Error",
          description: "Please try logging in again",
          variant: "destructive",
        });
        navigate("/auth");
      } finally {
        setIsAuthChecking(false);
      }
    }
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate("/auth");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const { data: events = [], isLoading: isLoadingEvents, refetch: refetchEvents } = useQuery({
    queryKey: ["organizer-events", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          tickets (
            id,
            name,
            price,
            quantity,
            remaining,
            type
          ),
          orders (
            id,
            quantity,
            total_amount,
            payment_status,
            ticket_id
          )
        `)
        .eq("organizer_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching events:", error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user?.id && !isAuthChecking,
  });

  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ["user-orders", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          event:events (
            title,
            start_date,
            location
          ),
          ticket:tickets (
            name,
            price,
            type
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user?.id && !isAuthChecking,
  });

  const updateEventStatus = async (eventId: string, status: string) => {
    const { error } = await supabase
      .from("events")
      .update({ status })
      .eq("id", eventId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update event status. Please try again.",
      });
    } else {
      toast({
        title: "Success",
        description: `Event ${status === "published" ? "published" : "unpublished"} successfully.`,
      });
      refetchEvents();
    }
  };

  const deleteEvent = async () => {
    if (!eventToDelete) return;
    
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventToDelete);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete event. Please try again.",
      });
    } else {
      toast({
        title: "Success",
        description: "Event deleted successfully.",
      });
      setShowDeleteDialog(false);
      setEventToDelete(null);
      refetchEvents();
    }
  };

  const updateEventDescription = async () => {
    if (!editEventId) return;
    
    const { error } = await supabase
      .from("events")
      .update({ description })
      .eq("id", editEventId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update event description. Please try again.",
      });
    } else {
      toast({
        title: "Success",
        description: "Event description updated successfully.",
      });
      setShowEditDialog(false);
      setEditEventId(null);
      refetchEvents();
    }
  };

  const openEditDialog = (eventId: string, currentDescription: string) => {
    setEditEventId(eventId);
    setDescription(currentDescription || "");
    setShowEditDialog(true);
  };

  const openDeleteDialog = (eventId: string) => {
    setEventToDelete(eventId);
    setShowDeleteDialog(true);
  };

  const openTicketDialog = (ticketId: string, currentQuantity: number) => {
    const ticket = events.flatMap((event: any) => event.tickets || [])
      .find((t: any) => t.id === ticketId);
    
    if (ticket) {
      setTicketToUpdate(ticket);
      setNewTicketQuantity(currentQuantity);
      setShowTicketDialog(true);
    }
  };

  const updateTicketQuantity = async () => {
    if (!ticketToUpdate) return;
    
    try {
      const additionalTickets = newTicketQuantity - ticketToUpdate.quantity;
      
      const { error } = await supabase
        .from("tickets")
        .update({ 
          quantity: newTicketQuantity,
          remaining: ticketToUpdate.remaining + additionalTickets
        })
        .eq("id", ticketToUpdate.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ticket quantity updated successfully",
      });
      
      setShowTicketDialog(false);
      setTicketToUpdate(null);
      refetchEvents();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update ticket quantity",
      });
    }
  };

  const copyEventId = (eventId: string) => {
    navigator.clipboard.writeText(eventId);
    toast({
      title: "Success",
      description: "Event ID copied to clipboard",
    });
  };

  const getEventStatus = (event: any) => {
    if (event.status === 'finished') return 'Finished';
    if (new Date(event.end_date) < new Date()) return 'Ended';
    if (event.status === 'published') return 'Active';
    return 'Draft';
  };

  const calculateEventStats = (event: any) => {
    const eventOrders = event.orders || [];
    
    const completedOrders = eventOrders.filter((order: any) => {
      const ticket = event.tickets?.find((t: any) => t.id === order.ticket_id);
      return (ticket?.price === 0 || ticket?.type === 'free' || order.payment_status === 'completed');
    });
    
    const totalRegistrations = completedOrders.reduce((sum: number, order: any) => 
      sum + (parseInt(order.quantity) || 0), 0);
    
    const totalRevenue = completedOrders.reduce((sum: number, order: any) => 
      sum + (parseFloat(order.total_amount) || 0), 0);
    
    const ticketsSold = event.tickets?.reduce((sum: number, ticket: any) => 
      sum + ((ticket.quantity - ticket.remaining) || 0), 0) || 0;

    return {
      totalRegistrations,
      totalRevenue,
      ticketsSold,
    };
  };

  const isLoading = isAuthChecking || isLoadingEvents || isLoadingOrders;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => navigate("/create-event")} className="bg-[#F97316] hover:bg-[#FB923C]">
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> My Events
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <Ticket className="h-4 w-4" /> My Tickets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          {isLoadingEvents ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Calendar className="h-16 w-16 text-gray-400" />
              <p className="text-lg text-gray-600">You haven't created any events yet.</p>
              <Button onClick={() => navigate("/create-event")} variant="outline">
                Create Your First Event
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {events.map((event: any) => {
                const stats = calculateEventStats(event);
                const status = getEventStatus(event);
                
                return (
                  <div
                    key={event.id}
                    className="relative rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            status === 'Active' && "bg-green-100 text-green-700",
                            status === 'Draft' && "bg-gray-100 text-gray-700",
                            status === 'Ended' && "bg-yellow-100 text-yellow-700",
                            status === 'Finished' && "bg-red-100 text-red-700"
                          )}>
                            {status}
                          </span>
                          <Badge 
                            variant="outline" 
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => copyEventId(event.id)}
                          >
                            ID: {event.id.substring(0, 8)}...
                            <ClipboardCopy className="h-3 w-3" />
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(event.start_date).toLocaleDateString()} at {event.location}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {status === 'Active' && (
                          <QrCodeScanner eventId={event.id} />
                        )}
                        
                        {status === 'Draft' ? (
                          <Button
                            onClick={() => updateEventStatus(event.id, "published")}
                            variant="outline"
                            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                          >
                            Publish
                          </Button>
                        ) : status === 'Active' ? (
                          <Button
                            onClick={() => updateEventStatus(event.id, "draft")}
                            variant="outline"
                            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                          >
                            Unpublish
                          </Button>
                        ) : null}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(event.id, event.description)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit Description
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyEventId(event.id)}>
                              <ClipboardCopy className="mr-2 h-4 w-4" />
                              Copy Event ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => openDeleteDialog(event.id)}
                              className="text-red-500 focus:text-red-500"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete Event
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-lg bg-orange-50 p-4">
                        <p className="text-sm text-gray-600">Registrations</p>
                        <p className="text-2xl font-semibold text-[#F97316]">
                          {stats.totalRegistrations}
                        </p>
                      </div>
                      <div className="rounded-lg bg-orange-50 p-4">
                        <p className="text-sm text-gray-600">Tickets Sold</p>
                        <p className="text-2xl font-semibold text-[#F97316]">
                          {stats.ticketsSold}
                        </p>
                      </div>
                      <div className="rounded-lg bg-orange-50 p-4">
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-2xl font-semibold text-[#F97316]">
                          {stats.totalRevenue.toFixed(2)} ETB
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="mb-2 font-medium">Tickets</h4>
                      <div className="grid gap-2">
                        {event.tickets?.map((ticket: any) => (
                          <div
                            key={ticket.id}
                            className="flex items-center justify-between rounded-md border p-3"
                          >
                            <div>
                              <p className="font-medium">{ticket.name}</p>
                              <p className="text-sm text-gray-500">
                                {ticket.price === 0 || ticket.type === 'free' ? 'Free' : `${ticket.price} ETB`} · {ticket.remaining}/{ticket.quantity} available
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openTicketDialog(ticket.id, ticket.quantity)}
                            >
                              Add Tickets
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tickets">
          {isLoadingOrders ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Ticket className="h-16 w-16 text-gray-400" />
              <p className="text-lg text-gray-600">You haven't purchased any tickets yet.</p>
              <Button onClick={() => navigate("/")} variant="outline">
                Browse Events
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {orders.map((order: any) => {
                const isFreeTicket = order.ticket.type === "free" || parseFloat(order.ticket.price) === 0;
                const displayStatus = isFreeTicket ? "confirmed" : order.payment_status;
                
                return (
                  <div
                    key={order.id}
                    className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{order.event.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.event.start_date).toLocaleDateString()} at{" "}
                          {order.event.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {order.ticket.name} × {order.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          Total: {isFreeTicket ? "Free" : `${(order.ticket.price * order.quantity).toFixed(2)} ETB`}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            displayStatus === "confirmed" || displayStatus === "completed"
                              ? "bg-green-500"
                              : displayStatus === "pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        />
                        <p className="text-sm capitalize text-gray-600">{displayStatus}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event Description</DialogTitle>
            <DialogDescription>
              Update the description for your event. This information will be visible to attendees.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter event description"
            className="min-h-[200px]"
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={updateEventDescription} className="bg-[#F97316] hover:bg-[#FB923C]">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event and all associated tickets and registrations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteEvent} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Ticket Quantity</DialogTitle>
            <DialogDescription>
              Increase the total number of tickets available for this event. This will add to your existing capacity.
            </DialogDescription>
          </DialogHeader>
          
          {ticketToUpdate && (
            <div className="space-y-4">
              <div className="rounded-lg bg-orange-50 p-4 mb-4">
                <p className="text-sm text-gray-600">Current Ticket Information</p>
                <p className="font-semibold">{ticketToUpdate.name}</p>
                <p className="text-sm text-gray-500">Total: {ticketToUpdate.quantity} | Remaining: {ticketToUpdate.remaining}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">New Total Quantity</label>
                <Input
                  type="number"
                  value={newTicketQuantity}
                  onChange={(e) => setNewTicketQuantity(parseInt(e.target.value))}
                  min={ticketToUpdate.quantity}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  You can only increase the ticket quantity, not decrease it.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTicketDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={updateTicketQuantity} 
              className="bg-[#F97316] hover:bg-[#FB923C]"
              disabled={!ticketToUpdate || newTicketQuantity <= ticketToUpdate.quantity}
            >
              Update Tickets
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
