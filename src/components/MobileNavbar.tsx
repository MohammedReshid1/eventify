import { Link, useLocation } from "react-router-dom";
import { Home, Search, Ticket, User, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const MobileNavbar = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const isMobile = useMobile();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Don't render on non-mobile devices
  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-950 dark:border-gray-800">
      <div className="grid h-full grid-cols-5">
        <Link
          to="/"
          className={cn(
            "flex flex-col items-center justify-center font-medium",
            location.pathname === "/" 
              ? "text-[#F97316]" 
              : "text-gray-500 dark:text-gray-400"
          )}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link
          to="/events"
          className={cn(
            "flex flex-col items-center justify-center font-medium",
            location.pathname === "/events" 
              ? "text-[#F97316]" 
              : "text-gray-500 dark:text-gray-400"
          )}
        >
          <Search className="w-6 h-6" />
          <span className="text-xs mt-1">Explore</span>
        </Link>

        {user ? (
          <Link
            to="/create-event"
            className="flex flex-col items-center justify-center"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-[#F97316] rounded-full -mt-5 shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </Link>
        ) : (
          <Link
            to="/auth"
            className="flex flex-col items-center justify-center"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-[#F97316] rounded-full -mt-5 shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </Link>
        )}

        <Link
          to="/my-tickets"
          className={cn(
            "flex flex-col items-center justify-center font-medium",
            location.pathname === "/my-tickets" 
              ? "text-[#F97316]" 
              : "text-gray-500 dark:text-gray-400"
          )}
        >
          <Ticket className="w-6 h-6" />
          <span className="text-xs mt-1">Tickets</span>
        </Link>

        {user ? (
          <Link
            to="/dashboard"
            className={cn(
              "flex flex-col items-center justify-center font-medium",
              location.pathname === "/dashboard" 
                ? "text-[#F97316]" 
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Account</span>
          </Link>
        ) : (
          <Link
            to="/auth"
            className={cn(
              "flex flex-col items-center justify-center font-medium",
              location.pathname === "/auth" 
                ? "text-[#F97316]" 
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Login</span>
          </Link>
        )}
      </div>
    </div>
  );
}; 