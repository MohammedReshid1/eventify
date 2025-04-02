
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WithdrawButton } from "@/components/dashboard/WithdrawButton";

export default function PaymentTransfer() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        setLoading(true);
        const { data: user } = await supabase.auth.getUser();
        
        if (!user.user) {
          return;
        }
        
        // Get all transfers for this organizer
        const { data: transfersData, error: transferError } = await supabase
          .from('transfers')
          .select('*')
          .eq('organizer_id', user.user.id)
          .order('created_at', { ascending: false });
        
        if (transferError) {
          throw transferError;
        }
        
        setTransfers(transfersData || []);
        
        // Calculate totals from orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            organizer_amount,
            organizer_transfer_status
          `)
          .eq('organizer_transfer_status', 'pending')
          .eq('payment_status', 'completed');
        
        if (ordersError) {
          throw ordersError;
        }
        
        if (ordersData && ordersData.length > 0) {
          // Sum up all completed orders with pending transfers
          const total = ordersData.reduce((sum, order) => sum + parseFloat(order.organizer_amount || 0), 0);
          setAvailableBalance(total);
        }
        
        // Get total revenue (including already transferred)
        const { data: allOrdersData, error: allOrdersError } = await supabase
          .from('orders')
          .select('organizer_amount')
          .eq('payment_status', 'completed');
        
        if (allOrdersError) {
          throw allOrdersError;
        }
        
        if (allOrdersData && allOrdersData.length > 0) {
          const total = allOrdersData.reduce((sum, order) => sum + parseFloat(order.organizer_amount || 0), 0);
          setTotalRevenue(total);
        }
      } catch (error) {
        console.error('Error fetching transfers:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load your transfer history"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransfers();
  }, [toast]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Payment Transfers</CardTitle>
        <CardDescription>Manage your revenue withdrawals</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalRevenue.toFixed(2)} ETB
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {availableBalance.toFixed(2)} ETB
              </div>
              {availableBalance > 0 && (
                <div className="mt-2">
                  <WithdrawButton amount={availableBalance} onSuccess={() => window.location.reload()} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <h3 className="text-lg font-medium mb-4">Transfer History</h3>
        
        {loading ? (
          <div className="text-center py-8">Loading transfer history...</div>
        ) : transfers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>
                    {new Date(transfer.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {parseFloat(transfer.amount).toFixed(2)} ETB
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        transfer.status === 'completed' ? 'default' :
                        transfer.status === 'processing' ? 'secondary' : 'destructive'
                      }
                    >
                      {transfer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {transfer.reference || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 border rounded-md bg-gray-50">
            <p className="text-gray-500">No transfer history found</p>
            {availableBalance > 0 && (
              <div className="mt-4">
                <WithdrawButton amount={availableBalance} onSuccess={() => window.location.reload()} />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
