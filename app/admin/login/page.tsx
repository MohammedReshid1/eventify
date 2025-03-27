"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

// Admin credentials - in a real app these would be verified server-side
const ADMIN_EMAIL = "admin@eventify.com";
const ADMIN_PASSWORD = "admin123";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    
    // Simulating API authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // In a real app, this would be a secure token from an authentication service
      localStorage.setItem("findevent_admin_auth", "true");
      localStorage.setItem("findevent_admin_user", JSON.stringify({
        id: "admin-1",
        name: "Admin User",
        email: ADMIN_EMAIL,
        role: "admin"
      }));
      
      // Dispatch event for admin layout to detect the change
      window.dispatchEvent(new Event('admin-auth-changed'));
      
      router.push("/admin/dashboard");
    } else {
      setError("Invalid admin credentials");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Eventify
            </h1>
          </Link>
          <p className="mt-2 text-slate-400">Admin Portal</p>
        </div>
        
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-xl">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-white">Admin Login</h2>
            <p className="text-sm text-slate-400">
              Access the administration dashboard
            </p>
          </div>
          
          {error && (
            <div className="mb-4 rounded-md bg-red-900/50 p-3 text-sm text-red-300 border border-red-800">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="admin-email" className="text-sm font-medium text-slate-300">
                Email
              </label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@eventify.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-sm font-medium text-slate-300">
                Password
              </label>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Login to Dashboard"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-slate-400">
            <Link 
              href="/"
              className="text-orange-400 hover:text-orange-300"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-slate-500">
          <p>Demo Admin Credentials:</p>
          <p>Email: admin@eventify.com | Password: admin123</p>
        </div>
      </div>
    </div>
  );
} 