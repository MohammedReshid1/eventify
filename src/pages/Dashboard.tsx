import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Calendar, Ticket, CreditCard, MoreVertical, Pencil, Trash, ClipboardCopy } from "lucide-react";
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
import { PaymentTransfer } from "@/components/dashboard/PaymentTransfer";
import { DashboardEvents } from "@/components/dashboard/DashboardEvents";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [showPaymentTab, setShowPaymentTab] = useState(false);
  const [selectedEventForPayment, setSelectedEventForPayment] = useState<string | null>(null);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [ticketToUpdate, setTicketToUpdate] = useState<any>(null);
  const [newTicketQuantity, setNewTicketQuantity] = useState<number>(0);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
            ticket_id,
            organizer_amount,
            commission_amount,
            organizer_transfer_status
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

  const openPaymentTab = (eventId: string) => {
    setSelectedEventForPayment(eventId);
    setShowPaymentTab(true);
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

  const openEditDialog = (eventId: string, currentDescription: string) => {
    setSelectedEventId(eventId);
    setDescription(currentDescription || "");
    setShowEditDialog(true);
  };

  const openDeleteDialog = (eventId: string) => {
    setSelectedEventId(eventId);
    setShowDeleteDialog(true);
  };

  const updateEventDescription = async () => {
    if (!selectedEventId) return;
    
    try {
      const { error } = await supabase
        .from("events")
        .update({ description })
        .eq("id", selectedEventId);
      
      if (error) throw error;
      
      toast({
        title: "Description updated",
        description: "Your event description has been updated successfully.",
      });
      
      setShowEditDialog(false);
      refetchEvents();
    } catch (error: any) {
      console.error("Error updating description:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update event description",
        variant: "destructive",
      });
    }
  };

  const deleteEvent = async () => {
    if (!selectedEventId) return;
    
    try {
      // Delete all related orders
      const { error: ordersError } = await supabase
        .from("orders")
        .delete()
        .eq("event_id", selectedEventId);
      
      if (ordersError) throw ordersError;
      
      // Delete all related tickets
      const { error: ticketsError } = await supabase
        .from("tickets")
        .delete()
        .eq("event_id", selectedEventId);
      
      if (ticketsError) throw ticketsError;
      
      // Delete the event
      const { error: eventError } = await supabase
        .from("events")
        .delete()
        .eq("id", selectedEventId);
      
      if (eventError) throw eventError;
      
      toast({
        title: "Event deleted",
        description: "Your event has been deleted successfully.",
      });
      
      setShowDeleteDialog(false);
      refetchEvents();
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const updateTicketQuantity = async () => {
    if (!ticketToUpdate || newTicketQuantity <= ticketToUpdate.quantity) return;
    
    try {
      const addedQuantity = newTicketQuantity - ticketToUpdate.quantity;
      
      const { error } = await supabase
        .from("tickets")
        .update({ 
          quantity: newTicketQuantity,
          remaining: ticketToUpdate.remaining + addedQuantity
        })
        .eq("id", ticketToUpdate.id);
      
      if (error) throw error;
      
      toast({
        title: "Tickets added",
        description: `Successfully added ${addedQuantity} more tickets.`,
      });
      
      setShowTicketDialog(false);
      refetchEvents();
    } catch (error: any) {
      console.error("Error updating ticket quantity:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update ticket quantity",
        variant: "destructive",
      });
    }
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

      <Tabs defaultValue={showPaymentTab ? "payments" : "events"} className="w-full">
        <TabsList>
          <TabsTrigger value="events" className="flex items-center gap-2" onClick={() => setShowPaymentTab(false)}>
            <Calendar className="h-4 w-4" /> My Events
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2" onClick={() => setShowPaymentTab(false)}>
            <Ticket className="h-4 w-4" /> My Tickets
          </TabsTrigger>
          {showPaymentTab && (
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Payments
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="events">
          <DashboardEvents 
            events={events} 
            isLoading={isLoadingEvents} 
            refetchEvents={refetchEvents} 
            openPaymentTab={openPaymentTab}
            openTicketDialog={openTicketDialog}
          />
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

        <TabsContent value="payments">
          {selectedEventForPayment && (
            <PaymentTransfer eventId={selectedEventForPayment} />
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
              <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 p-4 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">Current Ticket Information</p>
                <p className="font-semibold">{ticketToUpdate.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-300">Total: {ticketToUpdate.quantity} | Remaining: {ticketToUpdate.remaining}</p>
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
