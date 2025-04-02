import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Check, AlertTriangle, Loader2 } from "lucide-react";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState<"success" | "pending" | "failed">("pending");
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const orderId = searchParams.get("order_id");
  const txRef = searchParams.get("tx_ref");
  const transactionId = searchParams.get("transaction_id");

  useEffect(() => {
    async function verifyPayment() {
      try {
        if (!orderId && !txRef) {
          setStatus("failed");
          toast({
            title: "Error",
            description: "Invalid payment reference",
            variant: "destructive",
          });
          return;
        }

        // Verify payment with our backend
        const response = await fetch(`${window.location.origin}/functions/payment-verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            tx_ref: txRef,
            transaction_id: transactionId,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setStatus("success");
          setOrderDetails(result.order);
          
          toast({
            title: "Payment Successful",
            description: "Your payment has been completed successfully",
          });
        } else if (result.status === "pending") {
          setStatus("pending");
          
          toast({
            title: "Payment Pending",
            description: "Your payment is being processed",
            variant: "default",
          });
        } else {
          setStatus("failed");
          
          toast({
            title: "Payment Failed",
            description: result.message || "There was an issue processing your payment",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        
        toast({
          title: "Verification Error",
          description: "Failed to verify payment status",
          variant: "destructive",
        });
      } finally {
        setVerifying(false);
      }
    }

    verifyPayment();
  }, [orderId, txRef, transactionId, toast]);

  // Get ticket and event details if we have order details
  useEffect(() => {
    async function getEventDetails() {
      if (orderDetails?.ticket_id) {
        try {
          const { data } = await supabase
            .from("tickets")
            .select(`
              name,
              events (
                title,
                start_date,
                location
              )
            `)
            .eq("id", orderDetails.ticket_id)
            .single();

          if (data) {
            setOrderDetails((prev: any) => ({
              ...prev,
              ticketName: data.name,
              eventTitle: data.events.title,
              eventDate: data.events.start_date,
              eventLocation: data.events.location,
            }));
          }
        } catch (error) {
          console.error("Error fetching event details:", error);
        }
      }
    }

    getEventDetails();
  }, [orderDetails]);

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {verifying ? "Verifying Payment" : status === "success" ? "Payment Successful" : status === "pending" ? "Payment Processing" : "Payment Failed"}
            </CardTitle>
            <CardDescription className="text-center">
              {verifying ? "Please wait while we verify your payment..." : status === "success" ? "Your ticket purchase is complete!" : status === "pending" ? "Your payment is being processed" : "There was an issue with your payment"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            {verifying ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-16 w-16 animate-spin text-[#F97316]" />
              </div>
            ) : status === "success" ? (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                
                {orderDetails && (
                  <div className="rounded-lg border bg-gray-50 p-4 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold">{orderDetails.eventTitle}</h3>
                      <p className="text-sm text-gray-500">
                        {orderDetails.eventDate && new Date(orderDetails.eventDate).toLocaleDateString()} at {orderDetails.eventLocation || "TBD"}
                      </p>
                    </div>
                    
                    <div className="border-t pt-3">
                      <p className="font-medium">{orderDetails.ticketName} × {orderDetails.quantity}</p>
                      <p className="text-sm text-gray-600">Order ID: {orderDetails.id}</p>
                      <p className="font-medium mt-2">
                        Total: {parseFloat(orderDetails.total_amount).toFixed(2)} ETB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : status === "pending" ? (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="rounded-full bg-yellow-100 p-3">
                    <Loader2 className="h-10 w-10 text-yellow-600 animate-spin" />
                  </div>
                </div>
                
                <div className="text-center">
                  <p>Your payment is still being processed. This may take a few minutes.</p>
                  <p className="mt-2 text-sm text-gray-500">
                    You will receive a confirmation once the payment is complete.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="rounded-full bg-red-100 p-3">
                    <AlertTriangle className="h-10 w-10 text-red-600" />
                  </div>
                </div>
                
                <div className="text-center">
                  <p>We couldn't process your payment at this time.</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Please check your payment details and try again, or contact support for assistance.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3">
            {status === "success" ? (
              <>
                <Button 
                  onClick={() => navigate("/my-tickets")} 
                  className="w-full bg-[#F97316] hover:bg-[#FB923C]"
                >
                  View My Tickets
                </Button>
                <Button 
                  onClick={() => navigate("/")} 
                  variant="outline" 
                  className="w-full"
                >
                  Browse More Events
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => navigate("/")} 
                  className="w-full bg-[#F97316] hover:bg-[#FB923C]"
                >
                  Browse Events
                </Button>
                {status === "failed" && (
                  <Button 
                    onClick={() => navigate("/my-tickets")} 
                    variant="outline" 
                    className="w-full"
                  >
                    Check My Orders
                  </Button>
                )}
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
