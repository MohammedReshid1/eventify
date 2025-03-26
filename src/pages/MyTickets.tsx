import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ChevronDown, ChevronUp, Download, Ticket } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function MyTickets() {
  const [user, setUser] = useState<any>(null);
  const [expandedTickets, setExpandedTickets] = useState<string[]>([]);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const navigate = useNavigate();

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
  }, [navigate]);

  const { data: tickets, isLoading } = useQuery({
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
            description,
            slug,
            category:categories (
              name
            )
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
      return data;
    },
    enabled: !!user?.id && !isAuthChecking,
  });

  const toggleExpand = (ticketId: string) => {
    setExpandedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const downloadTicket = async (order: any) => {
    try {
      const ticketId = `${order.id}-${order.event.id}-${order.ticket.id}`;
      const qrCodeDataUrl = await generateQRCode(ticketId);
      
      // Generate PDF 
      const pdfDoc = await generatePDF(order, qrCodeDataUrl, ticketId);
      
      // Create a download link
      const blob = new Blob([pdfDoc], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${order.event.title.replace(/\s+/g, '-')}-ticket.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Ticket Downloaded",
        description: "Your ticket has been successfully downloaded",
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

  const generateQRCode = async (ticketId: string) => {
    // We'll use a dynamic import for QRCode to keep the bundle size small
    const QRCode = (await import("qrcode")).default;
    
    return await QRCode.toDataURL(ticketId, {
      width: 200,
      margin: 2,
      color: {
        dark: "#F97316",
        light: "#FFFFFF",
      },
    });
  };

  // This is a client-side function to generate a basic PDF using PDFLib
  const generatePDF = async (order: any, qrCodeDataUrl: string, ticketId: string) => {
    const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
    
    // Create a new PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    
    // Load fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Set title
    page.drawText('EVENTIFY', {
      x: 250,
      y: 800,
      size: 24,
      font: helveticaBold,
      color: rgb(0.976, 0.451, 0.086), // #F97316
    });
    
    page.drawText(`Event Ticket: ${order.event.title}`, {
      x: 150,
      y: 760,
      size: 20,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    
    // Draw a line
    page.drawLine({
      start: { x: 50, y: 740 },
      end: { x: 545, y: 740 },
      thickness: 2,
      color: rgb(0.976, 0.451, 0.086), // #F97316
    });
    
    // Event details
    page.drawText(`Date: ${format(new Date(order.event.start_date), "PPP")}`, {
      x: 50,
      y: 700,
      size: 12,
      font: helveticaFont,
    });
    
    page.drawText(`Location: ${order.event.location}`, {
      x: 50,
      y: 680,
      size: 12,
      font: helveticaFont,
    });
    
    page.drawText(`Ticket Type: ${order.ticket.name}`, {
      x: 50,
      y: 660,
      size: 12,
      font: helveticaFont,
    });
    
    page.drawText(`Quantity: ${order.quantity}`, {
      x: 50,
      y: 640,
      size: 12,
      font: helveticaFont,
    });
    
    page.drawText(`Ticket ID: ${ticketId}`, {
      x: 50,
      y: 620,
      size: 12,
      font: helveticaFont,
    });
    
    page.drawText(`Event ID: ${order.event.id}`, {
      x: 50,
      y: 600,
      size: 12,
      font: helveticaFont,
    });
    
    // Add QR code
    const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl);
    const qrCodeDims = qrCodeImage.scale(0.8);
    
    page.drawImage(qrCodeImage, {
      x: page.getWidth() / 2 - qrCodeDims.width / 2,
      y: 400,
      width: qrCodeDims.width,
      height: qrCodeDims.height,
    });
    
    page.drawText('Please present this QR code when attending the event.', {
      x: 150,
      y: 380,
      size: 10,
      font: helveticaFont,
    });
    
    // Footer
    page.drawText('Powered by Eventify', {
      x: 450,
      y: 50,
      size: 10,
      font: helveticaFont,
      color: rgb(0.4, 0.4, 0.4),
    });
    
    // Return the PDF as bytes
    return await pdfDoc.save();
  };

  if (isAuthChecking || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:px-8">
      <h1 className="mb-8 text-2xl md:text-3xl font-bold flex items-center gap-2">
        <Ticket className="h-6 w-6 text-[#F97316]" />
        My Tickets
      </h1>
      
      {tickets?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
          <div className="h-24 w-24 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <Ticket className="h-12 w-12 text-[#F97316]" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">You haven't purchased any tickets yet.</p>
          <Button 
            onClick={() => navigate("/events")}
            className="bg-[#F97316] hover:bg-[#FB923C]"
          >
            Browse Events
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets?.map((order: any) => {
            const ticketId = `${order.id}-${order.event.id}-${order.ticket.id}`;
            const isExpanded = expandedTickets.includes(ticketId);
            const isFreeTicket = order.ticket.type === "free" || parseFloat(order.ticket.price) === 0;
            const displayStatus = isFreeTicket ? "confirmed" : order.payment_status;
            const isPastEvent = new Date(order.event.end_date) < new Date();

            return (
              <div
                key={ticketId}
                className="overflow-hidden rounded-lg border bg-white shadow transition-all duration-200 dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold dark:text-white">{order.event.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(order.event.start_date), "PPP")} at {order.event.location}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {order.ticket.name} × {order.quantity}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {order.ticket.type === "free" ? "Free" : `${order.total_amount} ETB`}
                        </span>
                        <span className={`ml-2 rounded-full px-2 py-1 text-xs ${
                          displayStatus === "confirmed" || displayStatus === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : displayStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}>
                          {displayStatus}
                        </span>
                        {isPastEvent && (
                          <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            Past event
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#F97316] text-[#F97316] hover:bg-[#F97316]/10"
                        title="Download Ticket"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadTicket(order);
                        }}
                      >
                        <Download className="h-4 w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(ticketId)}
                        title={isExpanded ? "Collapse" : "Expand"}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-4 space-y-4 border-t pt-4 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <img
                            src={order.event.banner_image}
                            alt={order.event.title}
                            className="h-48 w-full rounded-lg object-cover"
                          />

                          <div className="mt-4">
                            <h4 className="font-medium dark:text-white">Event Description</h4>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{order.event.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <h4 className="text-lg font-medium mb-4 dark:text-white">Your Ticket</h4>
                          
                          <div className="bg-white p-4 rounded-lg shadow-md mb-4 dark:bg-gray-800">
                            <TicketQrCode 
                              ticketId={ticketId}
                              className="w-full max-w-[200px] h-auto mx-auto"
                            />
                          </div>
                          
                          <p className="text-sm text-gray-500 mb-4 text-center dark:text-gray-400">
                            Present this QR code when attending the event
                          </p>
                          
                          <Button
                            onClick={() => downloadTicket(order)}
                            className="bg-[#F97316] hover:bg-[#FB923C] w-full"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Ticket
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// QR Code component - renamed to avoid conflict with lucide-react QrCode
function TicketQrCode({ ticketId, className }: { ticketId: string, className?: string }) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  
  useEffect(() => {
    async function generateQR() {
      try {
        const QRCode = (await import("qrcode")).default;
        const code = await QRCode.toDataURL(ticketId, {
          width: 200,
          margin: 2,
          color: {
            dark: "#F97316",
            light: "#FFFFFF",
          },
        });
        setQrCode(code);
      } catch (err) {
        console.error("QR code generation error:", err);
      }
    }
    
    generateQR();
  }, [ticketId]);
  
  if (!qrCode) {
    return <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />;
  }
  
  return <img src={qrCode} alt="Ticket QR Code" className={className} />;
}
