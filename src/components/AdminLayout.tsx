import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar, 
  Users, 
  Ticket, 
  BarChart3, 
  Activity, 
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated and has admin privileges
  useEffect(() => {
    const checkAdmin = async () => {
      // For demo purposes, check localStorage first
      const isLocalAdmin = localStorage.getItem("findevent_admin_auth") === "true";
      
      if (isLocalAdmin) {
        // Already authenticated via localStorage
        return;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/admin/login");
        return;
      }
      
      try {
        // Note: In development, consider all users as admins
        if (import.meta.env.DEV) {
          return;
        }
        
        // In production, would check for admin role
        // This part would need to be implemented based on your database schema
        // Example with proper error handling:
        /*
        const { data: profile, error } = await supabase
          .from('your_profiles_table')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (error || !profile || profile.role !== 'admin') {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin area.",
            variant: "destructive"
          });
          navigate("/");
        }
        */
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };
    
    checkAdmin();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("findevent_admin_auth");
    window.dispatchEvent(new Event('admin-auth-changed'));
    toast({
      title: "Signed out",
      description: "You have been signed out successfully."
    });
    navigate("/admin/login");
  };

  const navigation = [
    { name: "Overview", href: "/admin", icon: Activity, current: location.pathname === "/admin" },
    { name: "Events", href: "/admin/events", icon: Calendar, current: location.pathname.includes("/admin/events") },
    { name: "Users", href: "/admin/users", icon: Users, current: location.pathname.includes("/admin/users") },
    { name: "Tickets", href: "/admin/tickets", icon: Ticket, current: location.pathname.includes("/admin/tickets") },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3, current: location.pathname.includes("/admin/analytics") },
    { name: "Settings", href: "/admin/settings", icon: Settings, current: location.pathname.includes("/admin/settings") },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-border bg-card pt-5">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-[#F97316]">Eventify Admin</h1>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'bg-muted text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-primary'
                  } group flex items-center px-4 py-3 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      item.current ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="px-3 pb-5">
            <Button variant="outline" className="w-full flex items-center justify-center" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile header and menu */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-[#F97316]">Eventify Admin</h1>
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <div className="py-6">
                  <h2 className="text-xl font-bold px-4 text-[#F97316]">Eventify Admin</h2>
                </div>
                <nav className="flex-1 space-y-1 px-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        item.current
                          ? 'bg-muted text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-primary'
                      } group flex items-center px-4 py-3 text-sm font-medium rounded-md`}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <item.icon
                        className={`${
                          item.current ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                        } mr-3 flex-shrink-0 h-5 w-5`}
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="px-3 py-5">
                  <Button variant="outline" className="w-full flex items-center justify-center" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
} 