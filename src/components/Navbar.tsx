import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, Ticket, User, LogOut, Moon, Sun, Settings, Search, LogIn, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { useMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  isAdminLoggedIn?: boolean;
}

export function Navbar({ isAdminLoggedIn = false }: NavbarProps) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#F97316] flex items-center justify-center">
            <Ticket className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#F97316]">Eventify</span>
        </Link>

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
          <Link to="/events" className="text-muted-foreground hover:text-foreground">
            Explore Events
          </Link>
          {user && (
            <Link to="/my-tickets" className="text-muted-foreground hover:text-foreground">
              My Tickets
            </Link>
          )}
          <Link to="/contact" className="text-muted-foreground hover:text-foreground">
            Contact Us
          </Link>
          {user ? (
            <>
              <Link to="/create-event">
                <Button variant="outline" className="border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white">
                  Create Event
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt="Profile" />
                      <AvatarFallback className="bg-primary text-white">
                        {isAdminLoggedIn ? 'AD' : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {isAdminLoggedIn ? 'Admin User' : 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {isAdminLoggedIn ? 'admin@findevent.com' : 'user@example.com'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdminLoggedIn && (
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => navigate('/admin/dashboard')}
                    >
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => navigate('/my-tickets')}
                  >
                    My Tickets
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => navigate('/account')}
                  >
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-500 focus:text-red-500"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5" />
                    ) : theme === "system" ? (
                      <Monitor className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                    <DropdownMenuRadioItem value="light">
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <Monitor className="mr-2 h-4 w-4" />
                      <span>System</span>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/auth">
                <Button className="bg-[#F97316] hover:bg-[#FB923C] text-white">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>

        {isMenuOpen && (
          <div className="absolute left-0 top-16 w-full bg-background p-4 shadow-lg md:hidden border-b z-50">
            <div className="flex flex-col space-y-4">
              <Link
                to="/events"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore Events
              </Link>
              {user && (
                <Link
                  to="/my-tickets"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Tickets
                </Link>
              )}
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start p-2 w-full"
                  >
                    {theme === "dark" ? (
                      <Moon className="mr-2 h-4 w-4" />
                    ) : theme === "system" ? (
                      <Monitor className="mr-2 h-4 w-4" />
                    ) : (
                      <Sun className="mr-2 h-4 w-4" />
                    )}
                    {theme === "dark" ? "Dark Mode" : theme === "system" ? "System Theme" : "Light Mode"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={theme} onValueChange={(value) => {
                    setTheme(value as Theme);
                    setIsMenuOpen(false);
                  }}>
                    <DropdownMenuRadioItem value="light">
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <Monitor className="mr-2 h-4 w-4" />
                      <span>System</span>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              {user ? (
                <>
                  <Link to="/create-event" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white"
                    >
                      Create Event
                    </Button>
                  </Link>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="default"
                    className="w-full bg-red-500 hover:bg-red-600"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    className="w-full bg-[#F97316] hover:bg-[#FB923C] text-white"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
