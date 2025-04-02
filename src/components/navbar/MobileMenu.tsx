
import { LogOut, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

interface MobileMenuProps {
  isMenuOpen: boolean;
  user: any;
  isAdmin: boolean;
  onCloseMenu: () => void;
  onSignOut: () => Promise<void>;
}

export function MobileMenu({
  isMenuOpen,
  user,
  isAdmin,
  onCloseMenu,
  onSignOut
}: MobileMenuProps) {
  if (!isMenuOpen) return null;

  return (
    <div className="absolute left-0 top-16 w-full bg-background p-4 shadow-lg md:hidden border-b z-50">
      <div className="flex flex-col space-y-4">
        <NavLinks user={user} onCloseMenu={onCloseMenu} />
        
        <ThemeToggle isButtonVariant={true} onThemeChange={() => onCloseMenu()} />
        
        {user ? (
          <>
            <Link to="/create-event" onClick={onCloseMenu}>
              <Button
                variant="outline"
                className="w-full border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white"
              >
                Create Event
              </Button>
            </Link>
            <Link to="/dashboard" onClick={onCloseMenu}>
              <Button
                variant="outline"
                className="w-full border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white"
              >
                Dashboard
              </Button>
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={onCloseMenu}>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Button>
              </Link>
            )}
            <Button
              variant="default"
              className="w-full bg-red-500 hover:bg-red-600"
              onClick={() => {
                onSignOut();
                onCloseMenu();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </>
        ) : (
          <Link to="/auth" onClick={onCloseMenu}>
            <Button
              className="w-full bg-[#F97316] hover:bg-[#FB923C] text-white"
            >
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
