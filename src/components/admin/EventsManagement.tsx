
import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Loader2, Search, Eye, Star, StarOff, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

export function EventsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [eventToFeature, setEventToFeature] = useState<{id: string, title: string, featured: boolean} | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFeatureDialog, setShowFeatureDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-events-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          category:categories (name),
          tickets (
            price,
            type,
            name,
            remaining
          ),
          orders (
            payment_status,
            total_amount,
            commission_amount
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return data.map((event) => {
        const isFree = event.tickets && event.tickets.length > 0 ? 
          (event.tickets[0].type === 'free' || parseFloat(String(event.tickets[0].price)) === 0) : false;
          
        const completedOrders = event.orders ? event.orders.filter((o: any) => o.payment_status === "completed") : [];
        const totalRevenue = completedOrders.reduce((sum: number, order: any) => sum + parseFloat(order.total_amount || 0), 0);
        const platformCommission = completedOrders.reduce((sum: number, order: any) => sum + parseFloat(order.commission_amount || 0), 0);
        
        return {
          ...event,
          isFree,
          totalRevenue,
          platformCommission,
          featured: event.status === "featured"
        };
      });
    },
    staleTime: 60 * 1000, // 1 minute
  });

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
  );

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
        title: "Event Deleted",
        description: "The event has been permanently removed",
      });
      
      // Refetch events list after successful deletion
      queryClient.invalidateQueries({ queryKey: ["admin-events-list"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["featured-events"] });
      queryClient.invalidateQueries({ queryKey: ["latestEvents"] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete event",
      });
    } finally {
      setIsProcessing(false);
      setShowDeleteDialog(false);
      setEventToDelete(null);
    }
  };

  const toggleEventFeatured = async () => {
    if (!eventToFeature) return;
    
    try {
      setIsProcessing(true);
      const newStatus = eventToFeature.featured ? "published" : "featured";
      
      const { error } = await supabase
        .from("events")
        .update({ status: newStatus })
        .eq("id", eventToFeature.id);

      if (error) throw error;
      
      toast({
        title: eventToFeature.featured ? "Event Unfeatured" : "Event Featured",
        description: eventToFeature.featured 
          ? "The event has been removed from featured events" 
          : "The event is now featured on the platform",
      });
      
      // Refetch events list after successful update
      queryClient.invalidateQueries({ queryKey: ["admin-events-list"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["featured-events"] });
      queryClient.invalidateQueries({ queryKey: ["latestEvents"] });
      queryClient.invalidateQueries({ queryKey: ["featuredEvents"] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update event",
      });
    } finally {
      setIsProcessing(false);
      setShowFeatureDialog(false);
      setEventToFeature(null);
    }
  };

  const handleDeleteClick = useCallback((eventId: string) => {
    setEventToDelete(eventId);
    setShowDeleteDialog(true);
  }, []);

  const handleFeatureClick = useCallback((event: {id: string, title: string, featured: boolean}) => {
    setEventToFeature(event);
    setShowFeatureDialog(true);
  }, []);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>Events Management</CardTitle>
            <CardDescription>Monitor and manage all events on the platform</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="w-[200px] md:w-[300px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => refetch()}>Refresh</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">{event.category?.name || "Uncategorized"}</div>
                    </TableCell>
                    <TableCell>{event.organizer_id}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          event.featured ? "default" : 
                          event.status === "published" ? "outline" :
                          event.status === "draft" ? "secondary" : "destructive"
                        }
                      >
                        {event.featured ? "Featured" : event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>{formatDate(event.start_date)}</div>
                      <div className="text-xs text-muted-foreground">{event.location}</div>
                    </TableCell>
                    <TableCell>{event.totalRevenue?.toFixed(2) || '0.00'} ETB</TableCell>
                    <TableCell>{event.platformCommission?.toFixed(2) || '0.00'} ETB</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                        >
                          <a href={`/event/${event.slug}`} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        
                        <Button
                          variant={event.featured ? "default" : "outline"}
                          size="icon"
                          onClick={() => handleFeatureClick({
                            id: event.id,
                            title: event.title,
                            featured: event.featured
                          })}
                        >
                          {event.featured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteClick(event.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No events match your search criteria
          </div>
        )}
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event and all associated 
              tickets and registrations from the platform.
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

      <Dialog open={showFeatureDialog} onOpenChange={setShowFeatureDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {eventToFeature?.featured ? "Remove from featured events?" : "Feature this event?"}
            </DialogTitle>
            <DialogDescription>
              {eventToFeature?.featured 
                ? "This event will no longer be highlighted on the platform." 
                : "Featured events are highlighted prominently on the platform."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{eventToFeature?.title}</p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowFeatureDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={toggleEventFeatured}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                eventToFeature?.featured ? "Remove Featured Status" : "Feature Event"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
