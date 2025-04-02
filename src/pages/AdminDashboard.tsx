import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { EventsManagement } from "@/components/admin/EventsManagement";
import { Loader2, LayoutDashboard, LineChart, Calendar } from "lucide-react";

export default function AdminDashboard() {
  const { isLoading, isAdmin } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#F97316]" />
          <p className="mt-4 text-lg text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // The hook redirects automatically, this is just a fallback
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Platform Administration</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" /> Analytics
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Events Management
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <DashboardStats />
          <RevenueChart />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <RevenueChart />
          {/* We can add more detailed analytics components here in the future */}
        </TabsContent>
        
        <TabsContent value="events" className="space-y-6">
          <EventsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
