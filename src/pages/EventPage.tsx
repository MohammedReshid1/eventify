import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Loader2, MapPin, Calendar, PartyPopper, Clock, Tag, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const EventPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [user, setUser] = useState<any>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Check for user authentication from Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  // Get event from Supabase
  const { data: event, isLoading } = useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          categories:categories (id, name),
          tickets (*)
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) throw error;
      
      // Calculate tickets available and sold
      const totalTickets = data.tickets.reduce((sum: number, ticket: any) => sum + ticket.quantity, 0);
      const ticketsSold = data.tickets.reduce((sum: number, ticket: any) => 
        sum + (ticket.quantity - ticket.remaining), 0);
        
      return {
        ...data,
        category: data.categories, // Normalize the category data for compatibility
        tickets_available: totalTickets,
        tickets_sold: ticketsSold
      };
    },
  });

  const handleOpenRegistration = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to register for events.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setShowConfirmDialog(true);
  };

  const purchaseTicket = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to purchase tickets.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const ticket = event?.tickets.find((t: any) => t.id === selectedTicket);
    if (!ticket) return;

    setIsRegistering(true);

    try {
      // Check if ticket is free
      if (ticket.type === "free" || ticket.price === 0) {
        // Handle free ticket registration directly
        const { data, error } = await supabase.from("orders").insert({
          user_id: user.id,
          event_id: event.id,
          ticket_id: selectedTicket,
          quantity: parseInt(quantity),
          total_amount: 0,
          payment_status: "completed",
        }).select().single();

        if (error) throw error;

        // Update ticket remaining count
        const { error: updateError } = await supabase
          .from("tickets")
          .update({ 
            remaining: ticket.remaining - parseInt(quantity) 
          })
          .eq("id", selectedTicket);
        
        if (updateError) {
          console.error("Error updating ticket remaining count:", updateError);
        }

        // Update event stats
        const { error: eventUpdateError } = await supabase
          .from("events")
          .update({ 
            total_registrations: (event.total_registrations || 0) + parseInt(quantity),
            total_revenue: (event.total_revenue || 0)
          })
          .eq("id", event.id);
        
        if (eventUpdateError) {
          console.error("Error updating event stats:", eventUpdateError);
        }

        setShowConfirmDialog(false);
        setShowSuccessDialog(true);

        // Send registration email
        try {
          await supabase.functions.invoke(
            "send-registration-email",
            {
              body: {
                userEmail: user.email,
                eventTitle: event.title,
                eventDate: new Date(event.start_date).toLocaleDateString(),
                eventLocation: event.location,
                eventImageUrl: event.image_url || event.banner_image,
                eventDescription: event.description || "No description available",
                meetingUrl: event.is_virtual ? event.virtual_meeting_link : undefined,
                ticketType: ticket.name,
                quantity: parseInt(quantity),
                ticketId: `${data.id}-${event.id}-${selectedTicket}`,
              },
            }
          );
        } catch (emailErr) {
          console.error("Failed to send email, but order was created:", emailErr);
        }

        setTimeout(() => {
          setShowSuccessDialog(false);
          navigate("/my-tickets");
        }, 3000);
      } else {
        // Handle paid ticket via Chapa payment
        const token = await supabase.auth.getSession();
        const authToken = token.data.session?.access_token;

        // Call our payment process edge function
        const response = await fetch(`${window.location.origin}/functions/payment-process`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            ticketId: selectedTicket,
            quantity: parseInt(quantity),
            eventId: event.id
          })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Payment initialization failed');
        }

        // Redirect user to Chapa payment page
        setShowConfirmDialog(false);
        window.location.href = result.payment_url;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsRegistering(false);
    }
  };

  const getMaxTicketsAllowed = (ticketType: string, ticketPrice: number) => {
    return (ticketType === "free" || ticketPrice === 0) ? 1 : 15;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Event not found</h1>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          {event.banner_image || event.image_url ? (
            <img
              src={event.banner_image || event.image_url}
              alt={event.title}
              className="aspect-video w-full rounded-lg object-cover"
            />
          ) : (
            <div className="aspect-video w-full rounded-lg bg-gray-100" />
          )}
          <h1 className="mt-4 text-3xl font-bold">{event.title}</h1>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-5 w-5" />
              <span>
                {new Date(event.start_date).toLocaleDateString()} at {' '}
                {new Date(event.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{event.location}</span>
            </div>
            {event.category && (
              <div className="flex items-center gap-2 text-gray-600">
                <Tag className="h-5 w-5" />
                <span>{event.category.name}</span>
              </div>
            )}
            {event.tickets_available && (
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-5 w-5" />
                <span>{event.tickets_sold || 0} / {event.tickets_available} tickets sold</span>
              </div>
            )}
          </div>
          <p className="mt-4 text-gray-600">{event.description}</p>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold">Get Tickets</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Select Ticket Type</label>
                <Select value={selectedTicket} onValueChange={setSelectedTicket}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a ticket type" />
                  </SelectTrigger>
                  <SelectContent>
                    {event.tickets.map((ticket: any) => (
                      <SelectItem
                        key={ticket.id}
                        value={ticket.id}
                        disabled={ticket.remaining === 0}
                      >
                        {ticket.name} - {ticket.price === 0 || ticket.type === "free" ? "Free" : `${ticket.price} ETB`} ({ticket.remaining} remaining)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Quantity</label>
                <Select value={quantity} onValueChange={setQuantity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quantity" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTicket &&
                      Array.from(
                        { 
                          length: Math.min(
                            getMaxTicketsAllowed(
                              event.tickets.find((t: any) => t.id === selectedTicket).type,
                              event.tickets.find((t: any) => t.id === selectedTicket).price
                            ),
                            event.tickets.find((t: any) => t.id === selectedTicket).remaining
                          ) 
                        },
                        (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        )
                      )}
                  </SelectContent>
                </Select>
              </div>

              {selectedTicket && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total</span>
                    <span className="text-lg font-semibold">
                      {event.tickets.find((t: any) => t.id === selectedTicket).price === 0 || 
                       event.tickets.find((t: any) => t.id === selectedTicket).type === "free" 
                        ? "Free" 
                        : `${(
                            event.tickets.find((t: any) => t.id === selectedTicket).price *
                            parseInt(quantity)
                          ).toFixed(2)} ETB`}
                    </span>
                  </div>
                </div>
              )}

              <Button
                className="w-full bg-[#F97316] hover:bg-[#FB923C]"
                disabled={!selectedTicket}
                onClick={handleOpenRegistration}
              >
                {event.tickets.find((t: any) => t.id === selectedTicket)?.price === 0 || 
                 event.tickets.find((t: any) => t.id === selectedTicket)?.type === "free" 
                  ? "Register Now" 
                  : "Get Ticket"}
              </Button>
              
              {!user && (
                <p className="text-xs text-center text-muted-foreground">
                  Sign in first to register for this event
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[500px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event Registration</DialogTitle>
            <DialogDescription>
              Please review the event details before confirming your registration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">{event?.title}</h3>
            {event?.banner_image || event?.image_url ? (
              <img
                src={event?.banner_image || event?.image_url}
                alt={event?.title}
                className="aspect-video w-full rounded-lg object-cover"
              />
            ) : (
              <div className="aspect-video w-full rounded-lg bg-gray-100" />
            )}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(event?.start_date).toLocaleDateString()} at {' '}
                  {new Date(event?.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{event?.location}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <p className="font-medium">Ticket Details:</p>
                <p>{event.tickets.find((t: any) => t.id === selectedTicket)?.name} x {quantity}</p>
                <p className="font-bold mt-2 text-foreground">
                  Total: {event.tickets.find((t: any) => t.id === selectedTicket)?.price === 0 ? 
                    "Free" : 
                    `${(event.tickets.find((t: any) => t.id === selectedTicket)?.price * parseInt(quantity)).toFixed(2)} ETB`
                  }
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#F97316] hover:bg-[#FB923C]"
              disabled={isRegistering}
              onClick={purchaseTicket}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Purchase"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px] w-[90vw]">
          <div className="text-center">
            <div className="mx-auto my-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <PartyPopper className="h-8 w-8 text-green-600 animate-bounce" />
            </div>
            <DialogTitle className="text-xl font-semibold text-green-600">
              Congratulations!
            </DialogTitle>
            <DialogDescription className="mt-2">
              You have successfully registered for {event?.title}. Your tickets are now available in your account.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventPage;
