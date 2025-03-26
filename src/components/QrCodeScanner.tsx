
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { ScanLine, XCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QrCodeScannerProps {
  eventId: string;
}

export function QrCodeScanner({ eventId }: QrCodeScannerProps) {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
    ticket?: any;
    event?: any;
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scannerActive = useRef<boolean>(false);

  const startScanner = async () => {
    setValidationResult(null);
    setIsScanning(true);
    scannerActive.current = true;
    
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      streamRef.current = stream;
      
      // Set up video stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Start scanning for QR codes
        scanQRCode();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Could not access the camera. Please ensure camera permissions are granted.",
      });
      setIsScanning(false);
      scannerActive.current = false;
    }
  };

  const stopScanner = () => {
    // Stop all video streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    scannerActive.current = false;
    setIsScanning(false);
  };

  const closeDialog = () => {
    stopScanner();
    setValidationResult(null);
  };

  const scanQRCode = async () => {
    if (!videoRef.current || !streamRef.current) return;
    
    try {
      // Import QR code scanner library dynamically to reduce initial bundle size
      const jsQR = (await import("jsqr")).default;
      
      // Create canvas to analyze video frames
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) return;
      
      const checkFrame = () => {
        // If scanner is no longer active, stop checking frames
        if (!scannerActive.current) return;
        if (!videoRef.current || !streamRef.current) return;
        
        const { videoWidth, videoHeight } = videoRef.current;
        
        if (videoWidth && videoHeight) {
          // Set canvas size to match video
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          
          // Draw current video frame to canvas for analysis
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          
          // Get image data for QR code detection
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // Detect QR code in the image
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          
          // If QR code is detected
          if (code) {
            console.log("QR code detected:", code.data);
            // Stop scanning and validate the ticket
            validateTicket(code.data);
            return;
          }
        }
        
        // Continue scanning
        requestAnimationFrame(checkFrame);
      };
      
      requestAnimationFrame(checkFrame);
      
    } catch (error) {
      console.error("QR scanning error:", error);
      toast({
        variant: "destructive",
        title: "Scanning Error",
        description: "An error occurred while scanning. Please try again.",
      });
      stopScanner();
    }
  };

  const validateTicket = async (qrData: string) => {
    try {
      console.log("Validating ticket:", qrData);
      // Assuming QR data format is "orderId-eventId-ticketId"
      const [orderId, scannedEventId, ticketId] = qrData.split("-");
      
      // Stop scanner while validating
      stopScanner();
      
      // Check if the scanned ticket is for this event
      if (scannedEventId !== eventId) {
        setValidationResult({
          valid: false,
          message: "This ticket is for a different event"
        });
        return;
      }
      
      // Get ticket details from the database
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          event:events (
            title,
            start_date,
            end_date,
            location,
            status
          ),
          ticket:tickets (
            name,
            price,
            type
          )
        `)
        .eq("id", orderId)
        .eq("event_id", eventId)
        .eq("ticket_id", ticketId)
        .single();
      
      if (orderError || !orderData) {
        console.error("Order error:", orderError);
        setValidationResult({
          valid: false,
          message: "Invalid ticket or ticket not found"
        });
        return;
      }
      
      console.log("Order data:", orderData);
      
      // Check if event has already ended
      const eventEnded = new Date(orderData.event.end_date) < new Date();
      if (eventEnded) {
        setValidationResult({
          valid: false,
          message: "Event has already ended",
          ticket: orderData.ticket,
          event: orderData.event
        });
        return;
      }
      
      // Check if event is published/active
      if (orderData.event.status !== "published") {
        setValidationResult({
          valid: false,
          message: `Event is not active (status: ${orderData.event.status})`,
          ticket: orderData.ticket,
          event: orderData.event
        });
        return;
      }
      
      // Check payment status for paid tickets
      const isFreeTicket = orderData.ticket.type === "free" || parseFloat(orderData.ticket.price) === 0;
      
      if (!isFreeTicket && orderData.payment_status !== "completed") {
        setValidationResult({
          valid: false,
          message: `Payment not complete (status: ${orderData.payment_status})`,
          ticket: orderData.ticket,
          event: orderData.event
        });
        return;
      }
      
      // Ticket is valid
      setValidationResult({
        valid: true,
        message: "Ticket is valid",
        ticket: orderData.ticket,
        event: orderData.event
      });
      
      toast({
        title: "Scan Successful",
        description: "Ticket has been successfully validated.",
        variant: "default",
      });
      
    } catch (error) {
      console.error("Ticket validation error:", error);
      setValidationResult({
        valid: false,
        message: "Error validating ticket"
      });
      
      toast({
        title: "Validation Failed",
        description: "There was an error validating the ticket.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button 
        onClick={startScanner} 
        variant="default"
        className="bg-[#F97316] hover:bg-[#FB923C] text-white flex items-center gap-2"
        size="sm"
      >
        <ScanLine className="h-4 w-4" />
        Scan
      </Button>
      
      <Dialog open={isScanning} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Ticket QR Code</DialogTitle>
            <DialogDescription>
              Position the QR code within the camera view to validate the ticket.
            </DialogDescription>
          </DialogHeader>
          
          {!validationResult ? (
            <div className="relative overflow-hidden rounded-lg">
              <video 
                ref={videoRef} 
                className="w-full aspect-square object-cover"
                playsInline
                muted
              />
              <div className="absolute inset-0 border-2 border-[#F97316] opacity-70 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 w-3/4 h-[1px] bg-[#F97316] opacity-50 transform -translate-x-1/2" />
              <div className="absolute top-1/2 left-1/2 w-[1px] h-3/4 bg-[#F97316] opacity-50 transform -translate-y-1/2" />
            </div>
          ) : (
            <div className="py-6">
              <div className="flex justify-center mb-4">
                {validationResult.valid ? (
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              
              <h3 className={`text-xl font-semibold text-center ${
                validationResult.valid ? "text-green-700" : "text-red-700"
              }`}>
                {validationResult.valid ? "Valid Ticket" : "Invalid Ticket"}
              </h3>
              
              <p className="text-center text-gray-600 mt-2">
                {validationResult.message}
              </p>
              
              {validationResult.ticket && validationResult.event && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p><span className="font-medium">Event:</span> {validationResult.event.title}</p>
                  <p><span className="font-medium">Ticket:</span> {validationResult.ticket.name}</p>
                  <p><span className="font-medium">Date:</span> {new Date(validationResult.event.start_date).toLocaleDateString()}</p>
                  <p><span className="font-medium">Location:</span> {validationResult.event.location}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Close
            </Button>
            {!validationResult && (
              <Button onClick={stopScanner} variant="destructive">
                Stop Scanning
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
