"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    signOut();
    router.push("/");
    setMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/95 shadow-md backdrop-blur-sm dark:bg-slate-900/95" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Eventify
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/events" className="text-sm font-medium transition-colors hover:text-orange-500">
              Explore Events
            </Link>
            <Link href="/create" className="text-sm font-medium transition-colors hover:text-orange-500">
              Host an Event
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-orange-500">
              About Us
            </Link>
          </nav>
          
          {/* Auth and Theme Controls */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost"
                  className="hidden md:inline-flex text-sm font-medium transition-colors hover:text-orange-500"
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="outline"
                  className="hidden md:inline-flex border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin" 
                  className="hidden md:inline-flex text-sm font-medium transition-colors hover:text-orange-500"
                >
                  Sign In
                </Link>
                <Button 
                  asChild 
                  className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
                >
                  <Link href="/auth/signup">
                    Get Started
                  </Link>
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800 shadow-lg">
          <div className="container mx-auto px-4 py-3 space-y-1">
            <Link 
              href="/events"
              className="block py-2 text-base font-medium hover:text-orange-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore Events
            </Link>
            <Link 
              href="/create"
              className="block py-2 text-base font-medium hover:text-orange-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Host an Event
            </Link>
            <Link 
              href="/about"
              className="block py-2 text-base font-medium hover:text-orange-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <div className="pt-2 border-t">
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/dashboard"
                    className="block py-2 text-base font-medium hover:text-orange-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    className="block w-full text-left py-2 text-base font-medium text-orange-500 hover:text-orange-600"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/signin"
                    className="block py-2 text-base font-medium hover:text-orange-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/signup"
                    className="block py-2 text-base font-medium text-orange-500 hover:text-orange-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 