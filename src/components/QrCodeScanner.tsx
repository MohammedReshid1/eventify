
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, QrCode, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QrScanner from "qr-scanner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface QrCodeScannerProps {
  eventId: string;
}

export function QrCodeScanner({ eventId }: QrCodeScannerProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [orderData, setOrderData] = useState<any | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  // Clean up scanner when component unmounts or dialog closes
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, []);

  const startScanner = () => {
    setIsScanning(true);
    setScanResult(null);
    setIsValid(null);
    setOrderData(null);

    if (videoRef.current) {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          handleScanResult(result.data);
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      try {
        // Start returns a promise, but we don't need to await it
        scannerRef.current.start();
      } catch (err) {
        console.error("Failed to start scanner:", err);
        toast({
          variant: "destructive",
          title: "Camera Error",
          description: "Failed to access camera. Please check permissions.",
        });
        setIsScanning(false);
      }
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScanResult = async (result: string) => {
    try {
      setScanResult(result);
      stopScanner();
      setIsVerifying(true);

      // Try to parse the QR code result as a JSON object
      let ticketData;
      try {
        ticketData = JSON.parse(result);
      } catch (e) {
        // If it's not valid JSON, use it as-is (it might be just an order ID)
        ticketData = { orderId: result };
      }

      const orderId = ticketData.orderId || result;

      // Verify the ticket against our database
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          quantity,
          user_id,
          event_id,
          payment_status,
          created_at,
          ticket:tickets (name, price, type),
          user:user_id (email)
        `)
        .eq("id", orderId)
        .eq("event_id", eventId)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        setIsValid(false);
        toast({
          variant: "destructive",
          title: "Invalid Ticket",
          description: "This ticket does not exist or is not for this event.",
        });
      } else {
        const isValidPayment = 
          data.payment_status === "completed" || 
          (data.ticket && (data.ticket.type === "free" || parseFloat(String(data.ticket.price)) === 0));

        setIsValid(isValidPayment);
        setOrderData(data);

        if (isValidPayment) {
          toast({
            title: "Valid Ticket",
            description: "This ticket is valid.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Invalid Ticket",
            description: "Payment for this ticket is not completed.",
          });
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      setIsValid(false);
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "An error occurred while verifying the ticket.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setIsValid(null);
    setOrderData(null);
    startScanner();
  };

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
        onClick={() => setIsOpen(true)}
      >
        <QrCode className="h-4 w-4" />
        Scan Tickets
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Ticket QR Code</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4">
            {!scanResult && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                />
                {!isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Button onClick={startScanner}>Start Scanner</Button>
                  </div>
                )}
              </div>
            )}

            {isVerifying && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Verifying ticket...</span>
              </div>
            )}

            {isValid !== null && (
              <div className={cn(
                "mt-2 flex w-full flex-col gap-2 rounded-lg p-4",
                isValid ? "bg-green-50" : "bg-red-50"
              )}>
                <div className="flex items-center gap-2">
                  {isValid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={isValid ? "text-green-700" : "text-red-700"}>
                    {isValid ? "Valid Ticket" : "Invalid Ticket"}
                  </span>
                </div>
                
                {orderData && (
                  <div className="mt-2 text-sm">
                    <p><strong>Order ID:</strong> {orderData.id.substring(0, 8)}...</p>
                    <p><strong>Ticket:</strong> {orderData.ticket?.name}</p>
                    <p><strong>Quantity:</strong> {orderData.quantity}</p>
                    <p><strong>Status:</strong> {orderData.payment_status}</p>
                    <p><strong>Purchased:</strong> {new Date(orderData.created_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex w-full justify-between gap-2">
              {scanResult ? (
                <Button onClick={resetScanner} variant="outline">
                  Scan Another
                </Button>
              ) : (
                <Button onClick={() => setIsOpen(false)} variant="outline">
                  Cancel
                </Button>
              )}
              <Button onClick={() => setIsOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
