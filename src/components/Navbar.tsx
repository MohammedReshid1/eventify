import { Menu, X, Search } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useMobile } from "@/hooks/use-mobile";
import { UserProfile } from "@/types";
import { NavbarLogo } from "./navbar/NavbarLogo";
import { NavLinks } from "./navbar/NavLinks";
import { AuthButtons } from "./navbar/AuthButtons";
import { UserActionButtons } from "./navbar/UserActionButtons";
import { MobileMenu } from "./navbar/MobileMenu";

const ADMIN_EMAIL = "eventify.dablietech@gmail.com";

interface NavbarProps {
  isAdminLoggedIn?: boolean;
}
export function Navbar({ isAdminLoggedIn = false }: NavbarProps) {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useMobile();

  useEffect(() => {
    // Load user data from session
    const loadUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    
    loadUserSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile when user changes - optimized with useMemo
  useEffect(() => {
    if (user?.id) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (!error && data) {
          setUserProfile(data);
        }
      };
      
      fetchProfile();
    } else {
      setUserProfile(null);
    }
  }, [user]);

  const { data: hasEvents } = useQuery({
    queryKey: ["user-has-events", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { count, error } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("organizer_id", user.id);
      
      if (error) throw error;
      return count > 0;
    },
    enabled: !!user?.id,
  });

  // Calculate isAdmin once when user changes
  const isAdmin = useMemo(() => user?.email === ADMIN_EMAIL, [user?.email]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      if (isAdminLoggedIn) {
        localStorage.removeItem("findevent_admin_auth");
        window.dispatchEvent(new Event('admin-auth-changed'));
      }
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <NavbarLogo />

        {/* Search button for mobile that redirects to /events */}
        {isMobile && (
          <Link to="/events" className="md:hidden">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
        )}

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        
        <div className="hidden items-center gap-4 md:flex">
          <NavLinks user={user} />
          
          {user ? (
            <UserActionButtons 
              user={user} 
              userProfile={userProfile} 
              isAdmin={isAdmin} 
              isAdminLoggedIn={isAdminLoggedIn} 
              onSignOut={handleSignOut} 
            />
          ) : (
            <AuthButtons />
          )}
        </div>

        <MobileMenu 
          isMenuOpen={isMenuOpen} 
          user={user} 
          isAdmin={isAdmin} 
          onCloseMenu={() => setIsMenuOpen(false)} 
          onSignOut={handleSignOut}
        />
      </div>
    </nav>
  );
}
