
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export function RevenueChart() {
  const [timeframe, setTimeframe] = useState<"7days" | "30days" | "year">("30days");
  
  const { data: revenueData, isLoading } = useQuery({
    queryKey: ["admin-revenue", timeframe],
    queryFn: async () => {
      // In a real application, this would fetch from the database with proper filters
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("payment_status", "completed");

      if (error) throw error;
      
      // Process the data based on timeframe
      return processRevenueData(data || [], timeframe);
    },
  });

  const processRevenueData = (data: any[], timeframe: string) => {
    const today = new Date();
    let startDate;
    let dateFormat;
    
    if (timeframe === "7days") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      dateFormat = "MMM dd";
    } else if (timeframe === "30days") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
      dateFormat = "MMM dd";
    } else {
      // Year view - show last 12 months
      startDate = startOfMonth(subMonths(today, 11));
      dateFormat = "MMM";
    }
    
    // Create date buckets
    const dateBuckets: Record<string, { 
      date: string; 
      revenue: number; 
      commission: number;
      count: number;
    }> = {};
    
    if (timeframe === "year") {
      // For year view, create one bucket per month
      for (let i = 0; i < 12; i++) {
        const date = subMonths(today, i);
        const monthKey = format(date, "yyyy-MM");
        const displayDate = format(date, dateFormat);
        
        dateBuckets[monthKey] = { 
          date: displayDate, 
          revenue: 0, 
          commission: 0,
          count: 0
        };
      }
    } else {
      // For day views, create one bucket per day
      const days = timeframe === "7days" ? 7 : 30;
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayKey = format(date, "yyyy-MM-dd");
        const displayDate = format(date, dateFormat);
        
        dateBuckets[dayKey] = { 
          date: displayDate, 
          revenue: 0, 
          commission: 0,
          count: 0
        };
      }
    }
    
    // Aggregate data into buckets
    data.forEach(order => {
      const orderDate = new Date(order.created_at);
      let bucketKey;
      
      if (timeframe === "year") {
        bucketKey = format(orderDate, "yyyy-MM");
      } else {
        bucketKey = format(orderDate, "yyyy-MM-dd");
      }
      
      if (dateBuckets[bucketKey]) {
        dateBuckets[bucketKey].revenue += parseFloat(order.total_amount) || 0;
        dateBuckets[bucketKey].commission += parseFloat(order.commission_amount) || 0;
        dateBuckets[bucketKey].count += 1;
      }
    });
    
    // Convert to array and sort by date
    return Object.values(dateBuckets).reverse();
  };
  
  const formatYAxis = (value: string | number) => {
    // Check if the value is a number
    if (typeof value === 'number') {
      // For large numbers, abbreviate with K or M suffix
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toString();
    }
    // If value is an array or any other type, convert to string
    return String(value);
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Track your platform's revenue performance</CardDescription>
        </div>
        <Tabs defaultValue="30days" onValueChange={(value) => setTimeframe(value as any)}>
          <TabsList>
            <TabsTrigger value="7days">7 days</TabsTrigger>
            <TabsTrigger value="30days">30 days</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="date" stroke="#888888" />
                <YAxis 
                  stroke="#888888" 
                  tickFormatter={formatYAxis}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #ccc" }}
                  formatter={(value: number) => [`${value.toFixed(2)} ETB`, ""]}
                />
                <Bar
                  dataKey="revenue"
                  name="Total Revenue"
                  fill="#F97316"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="commission"
                  name="Platform Commission"
                  fill="#FDBA74"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
