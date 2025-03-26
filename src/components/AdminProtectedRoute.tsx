import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // First check localStorage for demo auth
        const isLocalAdmin = localStorage.getItem("findevent_admin_auth") === "true";
        
        if (isLocalAdmin) {
          setIsAdmin(true);
          setLoading(false);
          return;
        }
        
        // If not in localStorage, check Supabase
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        // In development, consider all authenticated users as admins for testing
        if (import.meta.env.DEV) {
          setIsAdmin(true);
          setLoading(false);
          return;
        }
        
        // In production, would check for admin role in your database
        // This part would need to be implemented based on your database schema
        /*
        const { data: profile, error } = await supabase
          .from('your_profiles_table')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error || !profile) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        setIsAdmin(profile.role === 'admin');
        */
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
        <span className="ml-2 text-lg">Verifying access...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}; 