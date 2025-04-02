import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MoreVertical, 
  Pencil, 
  Trash, 
  ClipboardCopy,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { QrCodeScanner } from "@/components/QrCodeScanner";
import { WithdrawButton } from "./WithdrawButton";
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
import { CreditCard } from "lucide-react";

interface EventsProps {
  events: any[];
  isLoading: boolean;
  refetchEvents: () => void;
  openPaymentTab: (eventId: string) => void;
  openTicketDialog: (ticketId: string, currentQuantity: number) => void;
}

export function DashboardEvents({ 
  events, 
  isLoading, 
  refetchEvents, 
  openPaymentTab,
  openTicketDialog
}: EventsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [ticketToUpdate, setTicketToUpdate] = useState<any>(null);
  const [newTicketQuantity, setNewTicketQuantity] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

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
    
    try {
      setIsProcessing(true);
      
      // First, delete all associated tickets
      const { error: ticketsError } = await supabase
        .from("tickets")
        .delete()
        .eq("event_id", eventToDelete);

      if (ticketsError) throw ticketsError;
      
      // Next, delete all associated orders
      const { error: ordersError } = await supabase
        .from("orders")
        .delete()
        .eq("event_id", eventToDelete);

      if (ordersError) throw ordersError;
      
      // Finally, delete the event
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventToDelete);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Event deleted successfully.",
      });
      setShowDeleteDialog(false);
      setEventToDelete(null);
      refetchEvents();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete event. Please try again.",
      });
    } finally {
      setIsProcessing(false);
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
    
    const totalCommission = completedOrders.reduce((sum: number, order: any) => 
      sum + (parseFloat(order.commission_amount) || 0), 0);
    
    const totalOrganizer = completedOrders.reduce((sum: number, order: any) => 
      sum + (parseFloat(order.organizer_amount) || 0), 0);
      
    const pendingTransfer = completedOrders
      .filter((order: any) => order.organizer_transfer_status === 'pending')
      .reduce((sum: number, order: any) => 
        sum + (parseFloat(order.organizer_amount) || 0), 0);
    
    const ticketsSold = event.tickets?.reduce((sum: number, ticket: any) => 
      sum + ((ticket.quantity - ticket.remaining) || 0), 0) || 0;

    return {
      totalRegistrations,
      totalRevenue,
      totalCommission,
      totalOrganizer,
      ticketsSold,
      pendingTransfer,
    };
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <Calendar className="h-16 w-16 text-gray-400" />
        <p className="text-lg text-gray-600">You haven't created any events yet.</p>
        <Button onClick={() => navigate("/create-event")} variant="outline">
          Create Your First Event
        </Button>
      </div>
    );
  }

  return (
    <>
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
                  
                  {stats.pendingTransfer > 0 && (
                    <Button
                      onClick={() => openPaymentTab(event.id)}
                      variant="outline"
                      className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Manage Payments
                    </Button>
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

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Registrations</p>
                  <p className="text-2xl font-semibold text-[#F97316] dark:text-orange-400">
                    {stats.totalRegistrations}
                  </p>
                </div>
                <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Tickets Sold</p>
                  <p className="text-2xl font-semibold text-[#F97316] dark:text-orange-400">
                    {stats.ticketsSold}
                  </p>
                </div>
                <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Revenue</p>
                  <p className="text-2xl font-semibold text-[#F97316] dark:text-orange-400">
                    {stats.totalRevenue.toFixed(2)} ETB
                  </p>
                </div>
                <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Your Share</p>
                  <p className="text-2xl font-semibold text-[#F97316] dark:text-orange-400">
                    {stats.totalOrganizer.toFixed(2)} ETB
                  </p>
                </div>
                <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Platform Fee</p>
                  <p className="text-2xl font-semibold text-[#F97316] dark:text-orange-400">
                    {stats.totalCommission.toFixed(2)} ETB
                  </p>
                </div>
              </div>

              {stats.pendingTransfer > 0 && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-green-800">
                        {stats.pendingTransfer.toFixed(2)} ETB Available for Transfer
                      </h4>
                      <p className="text-sm text-green-700">
                        You have funds available to transfer to your bank account
                      </p>
                    </div>
                    <WithdrawButton 
                      eventId={event.id}
                      pendingAmount={stats.pendingTransfer}
                      onWithdrawComplete={() => openPaymentTab(event.id)}
                    />
                  </div>
                </div>
              )}

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
                        onClick={() => {
                          setTicketToUpdate(ticket);
                          setNewTicketQuantity(ticket.quantity);
                          setShowTicketDialog(true);
                        }}
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
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteEvent} 
              className="bg-red-500 hover:bg-red-600"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                'Delete'
              )}
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
    </>
  );
}
