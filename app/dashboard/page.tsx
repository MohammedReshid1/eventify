"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Button } from "@/app/components/ui/button";

export default function DashboardPage() {
  const { user, isAuthenticated, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Manage your events and tickets here
                </p>
              </div>
              <Button 
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800"
                onClick={signOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-medium">Your Tickets</h2>
              <div className="rounded-md bg-slate-100 p-8 text-center dark:bg-slate-800">
                <p className="mb-2 text-slate-500 dark:text-slate-400">No tickets yet</p>
                <Button
                  variant="link"
                  className="text-orange-500 hover:text-orange-600"
                  onClick={() => router.push("/events")}
                >
                  Browse Events
                </Button>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-medium">Your Events</h2>
              <div className="rounded-md bg-slate-100 p-8 text-center dark:bg-slate-800">
                <p className="mb-2 text-slate-500 dark:text-slate-400">No events created yet</p>
                <Button
                  variant="link"
                  className="text-orange-500 hover:text-orange-600"
                  onClick={() => router.push("/create")}
                >
                  Create an Event
                </Button>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-medium">Account Summary</h2>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Email:</span>
                  <span>{user?.email}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Member since:</span>
                  <span>Today</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Tickets purchased:</span>
                  <span>0</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Events created:</span>
                  <span>0</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 