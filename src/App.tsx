
import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/ui/sonner";
import { Navbar } from "./components/Navbar";
import { MobileNavbar } from "./components/MobileNavbar";
import { Footer } from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";
import HomeSkeleton from "./components/skeletons/HomeSkeleton";

// Immediate load critical components
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

// Lazy load less critical pages
const CreateEvent = lazy(() => import("./pages/CreateEvent"));
const EventPage = lazy(() => import("./pages/EventPage"));
const MyTickets = lazy(() => import("./pages/MyTickets"));
const Events = lazy(() => import("./pages/Events"));
const AllEvents = lazy(() => import("./pages/AllEvents"));
const PaymentCallback = lazy(() => import("./pages/PaymentCallback"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Admin = lazy(() => import("./pages/AdminLogin"));
const AdminLoginHelper = lazy(() => import("./pages/AdminLoginHelper"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Account = lazy(() => import("./pages/Account"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Preload components after initial render
const preloadComponents = () => {
  const componentsToPreload = [
    import("./pages/CreateEvent"),
    import("./pages/EventPage"),
    import("./pages/AdminDashboard")
  ];
  
  Promise.all(componentsToPreload).catch(err => 
    console.error("Error preloading components:", err)
  );
};

function App() {
  useEffect(() => {
    // Immediately preload essential components
    preloadComponents();
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="eventify-theme">
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Lazy loaded routes */}
          <Route path="/create-event" element={
            <Suspense fallback={<LoadingScreen />}>
              <CreateEvent />
            </Suspense>
          } />
          <Route path="/event/:slug" element={
            <Suspense fallback={<LoadingScreen />}>
              <EventPage />
            </Suspense>
          } />
          <Route path="/my-tickets" element={
            <Suspense fallback={<LoadingScreen />}>
              <MyTickets />
            </Suspense>
          } />
          <Route path="/events" element={
            <Suspense fallback={<LoadingScreen />}>
              <Events />
            </Suspense>
          } />
          <Route path="/all-events" element={
            <Suspense fallback={<LoadingScreen />}>
              <AllEvents />
            </Suspense>
          } />
          <Route path="/payment-callback" element={
            <Suspense fallback={<LoadingScreen />}>
              <PaymentCallback />
            </Suspense>
          } />
          <Route path="/contact" element={
            <Suspense fallback={<LoadingScreen />}>
              <Contact />
            </Suspense>
          } />
          <Route path="/terms" element={
            <Suspense fallback={<LoadingScreen />}>
              <Terms />
            </Suspense>
          } />
          <Route path="/privacy" element={
            <Suspense fallback={<LoadingScreen />}>
              <Privacy />
            </Suspense>
          } />
          <Route path="/account" element={
            <Suspense fallback={<LoadingScreen />}>
              <Account />
            </Suspense>
          } />
          <Route path="/admin" element={
            <Suspense fallback={<LoadingScreen />}>
              <Admin />
            </Suspense>
          } />
          <Route path="/admin-login" element={
            <Suspense fallback={<LoadingScreen />}>
              <AdminLoginHelper />
            </Suspense>
          } />
          <Route path="/admin/dashboard" element={
            <Suspense fallback={<LoadingScreen />}>
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            </Suspense>
          } />
          <Route path="*" element={
            <Suspense fallback={<LoadingScreen />}>
              <NotFound />
            </Suspense>
          } />
        </Routes>
      </main>
      <MobileNavbar />
      <Footer />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
