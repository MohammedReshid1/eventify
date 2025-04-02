
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WithdrawButtonProps {
  eventId: string;
  pendingAmount: number;
  onWithdrawComplete: () => void;
}

export function WithdrawButton({ 
  eventId, 
  pendingAmount, 
  onWithdrawComplete 
}: WithdrawButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleWithdraw = async () => {
    if (pendingAmount <= 0) {
      toast({
        title: "No funds available",
        description: "You don't have any funds available for withdrawal",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Get auth token for the request
      const { data: authData } = await supabase.auth.getSession();
      const authToken = authData.session?.access_token;

      if (!authToken) {
        throw new Error("Authentication failed. Please sign in again.");
      }

      // Redirect to payment transfer panel
      onWithdrawComplete();
      
      toast({
        title: "Ready to withdraw",
        description: "Please complete your bank details to withdraw your funds",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process withdrawal",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleWithdraw}
      disabled={loading || pendingAmount <= 0}
      className="bg-green-600 hover:bg-green-700 text-white"
      size="sm"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" /> 
          Withdraw {pendingAmount.toFixed(2)} ETB
        </>
      )}
    </Button>
  );
}
