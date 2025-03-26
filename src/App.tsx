import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { MobileNavbar } from "@/components/MobileNavbar";
import { Footer } from "@/components/Footer";
import { AdminProtectedRoute } from "@/components/AdminProtectedRoute";
import LoadingScreen from "@/components/LoadingScreen";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import CreateEvent from "./pages/CreateEvent";
import Dashboard from "./pages/Dashboard";
import EventPage from "./pages/EventPage";
import Contact from "./pages/Contact";
import MyTickets from "./pages/MyTickets";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Events from "./pages/Events";
import AdminLogin from "./pages/AdminLogin";
import AdminLoginHelper from "./pages/AdminLoginHelper";
import AdminDashboard from "./pages/AdminDashboard";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Create a QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);
  
  // Check if current route is an admin route
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      setIsAdminRoute(path.startsWith('/admin'));
    };
    
    checkRoute();
    
    // Listen for route changes
    window.addEventListener('popstate', checkRoute);
    
    return () => {
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  // Check if admin is logged in
  useEffect(() => {
    const isAdmin = localStorage.getItem("findevent_admin_auth") === "true";
    setIsAdminLoggedIn(isAdmin);
    
    // Add listener for storage changes
    const handleStorageChange = () => {
      const isAdmin = localStorage.getItem("findevent_admin_auth") === "true";
      setIsAdminLoggedIn(isAdmin);
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Custom event for when localStorage changes within the same window
    window.addEventListener('admin-auth-changed', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('admin-auth-changed', handleStorageChange);
    };
  }, []);

  // Simulate application loading and ensure resources are loaded
  useEffect(() => {
    // Pre-load critical resources
    const preloadResources = async () => {
      // Minimum loading time to show loading animation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set app as ready after resources are loaded
      setAppReady(true);
      
      // Keep loading screen for a moment after resources are loaded for smooth transition
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
    
    preloadResources();
    
    // Listen for window load event as a fallback
    window.addEventListener('load', () => setAppReady(true));
    
    return () => {
      window.removeEventListener('load', () => setAppReady(true));
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="eventify-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {isLoading || !appReady ? (
            <LoadingScreen />
          ) : (
            <div className="flex min-h-screen flex-col">
              {!isAdminRoute && <Navbar isAdminLoggedIn={isAdminLoggedIn} />}
              <main className={`flex-1 ${!isAdminRoute ? 'pb-20 md:pb-0' : ''}`}>
                <Routes>
                  {/* Main Website Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/create-event" element={<CreateEvent />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/event/:slug" element={<EventPage />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/my-tickets" element={<MyTickets />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/faq" element={<Contact />} />
                  <Route path="/help" element={<Contact />} />
                  <Route path="/cookies" element={<Privacy />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/login-helper" element={<AdminLoginHelper />} />
                  
                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/events" element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/tickets" element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/analytics" element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  } />
                  
                  {/* Other admin routes preserved but commented out for now */}
                  {/* 
                  <Route path="/admin/*" element={
                    <Routes>
                      <Route path="dashboard" element={
                        <AdminProtectedRoute>
                          <AdminDashboard />
                        </AdminProtectedRoute>
                      } />
                      // ... other admin routes ...
                    </Routes>
                  } />
                  */}
                  
                  {/* Fallback route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              {!isAdminRoute && <Footer />}
              {!isAdminRoute && <MobileNavbar />}
            </div>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
