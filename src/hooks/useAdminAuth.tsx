
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Change this to your email address
const ADMIN_EMAIL = "eventify.dablietech@gmail.com";

export const useAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!data.session) {
          console.log("No session found, redirecting to auth");
          toast({
            title: "Authentication required",
            description: "Please login to access this page",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }
        
        const userEmail = data.session?.user?.email;
        console.log("Current user email:", userEmail);
        console.log("Admin email:", ADMIN_EMAIL);
        
        // The admin is determined by this specific email
        const userIsAdmin = userEmail === ADMIN_EMAIL;
        
        if (!userIsAdmin) {
          console.log("User is not admin, redirecting to home");
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
        
        console.log("Admin access granted");
        setIsAdmin(true);
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Error",
          description: "Could not verify admin access",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate, toast]);

  return { isLoading, isAdmin };
};
