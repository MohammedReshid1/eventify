
import { Shield, LogOut, Settings, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types";

interface UserMenuProps {
  user: any;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isAdminLoggedIn?: boolean;
  onSignOut: () => Promise<void>;
}

export function UserMenu({ 
  user, 
  userProfile, 
  isAdmin, 
  isAdminLoggedIn = false,
  onSignOut 
}: UserMenuProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Get user display text for avatar and dropdown
  const getUserInitials = () => {
    if (isAdminLoggedIn) return 'AD';
    if (!user?.email) return 'U';
    
    const email = user.email;
    return email.substring(0, 2).toUpperCase();
  };
  
  const getUserEmail = () => {
    if (isAdminLoggedIn) return 'admin@eventify.com';
    return user?.email || 'user@example.com';
  };

  const isMailAdmin = user?.email === 'eventify.dablietech@gmail.com';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="Profile" />
            <AvatarFallback className="bg-primary text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {isAdminLoggedIn ? 'Admin User' : (user?.email?.split('@')[0] || 'User')}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {getUserEmail()}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdminLoggedIn && (
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => navigate('/admin/dashboard')}
          >
            <Shield className="mr-2 h-4 w-4" />
            Admin Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </DropdownMenuItem>
        {(isAdmin || isMailAdmin) && (
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => navigate("/admin/dashboard")}
          >
            <Shield className="mr-2 h-4 w-4" />
            Admin Dashboard
          </DropdownMenuItem>
        )}
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
          <Settings className="mr-2 h-4 w-4" />
          Account Settings
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <Sun className="mr-2 h-4 w-4" />
          ) : (
            <Moon className="mr-2 h-4 w-4" />
          )}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-500 focus:text-red-500"
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
