"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Exclude paths that don't need authentication
  const isLoginPage = pathname === "/admin/login";
  
  useEffect(() => {
    // Check if admin is authenticated
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const isAdmin = localStorage.getItem("findevent_admin_auth") === "true";
        setIsAuthenticated(isAdmin);
        
        // If not authenticated and not on login page, redirect to login
        if (!isAdmin && !isLoginPage) {
          router.push("/admin/login");
        }
        
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Listen for auth changes
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('admin-auth-changed', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('admin-auth-changed', handleStorageChange);
    };
  }, [isLoginPage, router, pathname]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  // If it's the login page or user is authenticated, show content
  if (isLoginPage || isAuthenticated) {
    return children;
  }
  
  // This should not be reached as we redirect in the useEffect
  return null;
} 