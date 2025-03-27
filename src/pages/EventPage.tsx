import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import { events as mockEvents } from "@/data/mockData";

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

  // Check for user authentication from localStorage instead of Supabase
  useEffect(() => {
    const userEmail = localStorage.getItem('user_email');
    if (userEmail) {
      setUser({ email: userEmail });
    }
  }, []);

  // Get event from mock data instead of Supabase
  const { data: event, isLoading } = useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the event by slug
      const foundEvent = mockEvents.find(e => e.slug === slug);
      
      if (!foundEvent) {
        throw new Error("Event not found");
      }
      
      // Add ticket types to the mock event
      return {
        ...foundEvent,
        start_date: foundEvent.date,
        end_date: new Date(new Date(foundEvent.date).getTime() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours after start date
        tickets: [
          {
            id: "standard-ticket",
            name: "Standard Ticket",
            price: foundEvent.price || 0,
            type: foundEvent.price > 0 ? "paid" : "free",
            remaining: Math.floor(Math.random() * 50) + 10,
          },
          {
            id: "vip-ticket",
            name: "VIP Ticket",
            price: (foundEvent.price || 50) * 2,
            type: "paid",
            remaining: Math.floor(Math.random() * 20) + 5,
          }
        ]
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
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store ticket in localStorage for frontend demo
      const myTickets = JSON.parse(localStorage.getItem('my_tickets') || '[]');
      const ticketId = `ticket-${Date.now()}`;
      
      const newTicket = {
        id: ticketId,
        event_id: event.id,
        event_title: event.title,
        event_date: event.start_date,
        event_location: event.location,
        event_image: event.image_url || event.banner_image,
        ticket_type: ticket.name,
        price: ticket.price,
        quantity: parseInt(quantity),
        total_amount: ticket.price * parseInt(quantity),
        purchase_date: new Date().toISOString(),
        status: "confirmed"
      };
      
      myTickets.push(newTicket);
      localStorage.setItem('my_tickets', JSON.stringify(myTickets));

      setShowConfirmDialog(false);
      setShowSuccessDialog(true);

      setTimeout(() => {
        setShowSuccessDialog(false);
        navigate("/my-tickets");
      }, 3000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
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
                <p className="font-bold mt-2">
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
