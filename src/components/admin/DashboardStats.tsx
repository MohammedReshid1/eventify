
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, DollarSign, Users, Calendar, Percent } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [eventsCount, usersCount, totalRevenue, completedOrders] = await Promise.all([
        supabase.from("events").select("*", { count: "exact" }),
        supabase.auth.admin.listUsers({ page: 1, perPage: 1 })
          .then(response => response.data?.users?.length || 0)
          .catch(() => 0),
        supabase.from("orders").select("total_amount, commission_amount")
          .eq("payment_status", "completed"),
        supabase.from("orders").select("*", { count: "exact" })
          .eq("payment_status", "completed"),
      ]);

      const totalRevenueSum = totalRevenue.data?.reduce((sum: number, order: any) => 
        sum + parseFloat(order.total_amount || 0), 0) || 0;
      
      const platformCommission = totalRevenue.data?.reduce((sum: number, order: any) => 
        sum + parseFloat(order.commission_amount || 0), 0) || 0;
      
      const commissionRate = totalRevenueSum > 0 
        ? ((platformCommission / totalRevenueSum) * 100).toFixed(1) 
        : "0";

      return {
        eventsCount: eventsCount.count || 0,
        usersCount: usersCount || 0,
        totalRevenue: totalRevenueSum,
        platformCommission: platformCommission,
        completedOrders: completedOrders.count || 0,
        commissionRate: commissionRate
      };
    },
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Loading...</CardTitle>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)} ETB</div>
          <p className="text-xs text-muted-foreground">
            From {stats?.completedOrders || 0} completed orders
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Platform Commission</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats?.platformCommission || 0)} ETB</div>
          <p className="text-xs text-muted-foreground">
            Average {stats?.commissionRate || 0}% commission rate
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.eventsCount || 0}</div>
          <p className="text-xs text-muted-foreground">
            Events published on the platform
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.usersCount || 0}</div>
          <p className="text-xs text-muted-foreground">
            Active accounts on the platform
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
