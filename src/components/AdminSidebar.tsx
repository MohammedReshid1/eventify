import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  Users,
  Ticket,
  Settings,
  LogOut,
  Home,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export function AdminSidebar() {
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const sidebarItems: SidebarItem[] = [
    {
      title: "Overview",
      href: "/admin/dashboard",
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      title: "Events",
      href: "/admin/events",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Tickets",
      href: "/admin/tickets",
      icon: <Ticket className="h-5 w-5" />
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  const handleSignOut = async () => {
    // First attempt to sign out from Supabase
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out from Supabase:", error);
    }
    
    // Then clear the localStorage flag
    localStorage.removeItem("findevent_admin_auth");
    
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of the admin panel"
    });
    
    navigate("/admin");
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">FindEvent</span>
          <span className="ml-1 rounded bg-primary px-1.5 py-0.5 text-xs font-medium text-white">
            Admin
          </span>
        </Link>
      </div>
      
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
} 