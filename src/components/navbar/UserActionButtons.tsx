
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { UserMenu } from "./UserMenu";

interface UserActionButtonsProps {
  user: any;
  userProfile: any;
  isAdmin: boolean;
  isAdminLoggedIn?: boolean;
  onSignOut: () => Promise<void>;
}

export function UserActionButtons({
  user,
  userProfile,
  isAdmin,
  isAdminLoggedIn = false,
  onSignOut
}: UserActionButtonsProps) {
  const isMailAdmin = user?.email === 'eventify.dablietech@gmail.com';

  return (
    <>
      <Link to="/create-event">
        <Button variant="outline" className="border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white">
          Create Event
        </Button>
      </Link>
      <Link to="/dashboard">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
          Dashboard
        </Button>
      </Link>
      {(isAdmin || isMailAdmin) && (
        <Link to="/admin/dashboard">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            <Shield className="mr-1 h-4 w-4" />
            Admin
          </Button>
        </Link>
      )}
      <UserMenu 
        user={user} 
        userProfile={userProfile} 
        isAdmin={isAdmin} 
        isAdminLoggedIn={isAdminLoggedIn} 
        onSignOut={onSignOut} 
      />
    </>
  );
}
