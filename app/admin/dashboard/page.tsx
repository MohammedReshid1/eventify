"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";

// Types for admin interface
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  status: "published" | "draft" | "cancelled";
  attendees: number;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  eventsAttended: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load admin user data
  useEffect(() => {
    const adminData = localStorage.getItem("findevent_admin_user");
    if (adminData) {
      setUser(JSON.parse(adminData));
    }
    
    // Simulate API loading delay
    const timer = setTimeout(() => {
      // Mock event data
      setEvents([
        {
          id: "evt-001",
          title: "Summer Music Festival",
          date: "2023-07-15",
          status: "published",
          attendees: 523
        },
        {
          id: "evt-002",
          title: "Tech Conference 2023",
          date: "2023-08-21",
          status: "published",
          attendees: 210
        },
        {
          id: "evt-003",
          title: "Food & Wine Expo",
          date: "2023-09-10",
          status: "draft",
          attendees: 0
        },
        {
          id: "evt-004",
          title: "Business Leadership Summit",
          date: "2023-10-05",
          status: "published",
          attendees: 156
        },
        {
          id: "evt-005",
          title: "Art Exhibition",
          date: "2023-11-12",
          status: "cancelled",
          attendees: 0
        }
      ]);
      
      // Mock user data
      setUsers([
        {
          id: "usr-001",
          name: "John Doe",
          email: "john.doe@example.com",
          joinDate: "2023-03-15",
          eventsAttended: 4
        },
        {
          id: "usr-002",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          joinDate: "2023-04-22",
          eventsAttended: 2
        },
        {
          id: "usr-003",
          name: "Bob Johnson",
          email: "bob.johnson@example.com",
          joinDate: "2023-05-10",
          eventsAttended: 1
        },
        {
          id: "usr-004",
          name: "Alice Williams",
          email: "alice.williams@example.com",
          joinDate: "2023-06-05",
          eventsAttended: 3
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem("findevent_admin_auth");
    localStorage.removeItem("findevent_admin_user");
    window.dispatchEvent(new Event('admin-auth-changed'));
    router.push("/admin/login");
  }, [router]);
  
  // Handle event status change
  const handleStatusChange = (eventId: string, newStatus: "published" | "draft" | "cancelled") => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId ? { ...event, status: newStatus } : event
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Eventify
                </span>
                <span className="rounded-md bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                  Admin
                </span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Welcome, {user.name}
                </span>
              )}
              <Button
                variant="outline"
                className="text-sm border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-700"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage events, users, and platform settings
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link href="/create">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Create New Event
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Dashboard Metrics */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Events</p>
            <p className="text-2xl font-bold">{events.length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Tickets Sold</p>
            <p className="text-2xl font-bold">
              {events.reduce((total, event) => total + event.attendees, 0)}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Revenue</p>
            <p className="text-2xl font-bold">$12,450</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex -mb-px space-x-6">
            <button
              className={`py-2 px-1 text-sm font-medium border-b-2 ${
                activeTab === "events"
                  ? "border-orange-500 text-orange-600 dark:text-orange-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
              onClick={() => setActiveTab("events")}
            >
              Events
            </button>
            <button
              className={`py-2 px-1 text-sm font-medium border-b-2 ${
                activeTab === "users"
                  ? "border-orange-500 text-orange-600 dark:text-orange-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button
              className={`py-2 px-1 text-sm font-medium border-b-2 ${
                activeTab === "settings"
                  ? "border-orange-500 text-orange-600 dark:text-orange-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Events Tab */}
              {activeTab === "events" && (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Event</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Date</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Status</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Attendees</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((event) => (
                          <tr key={event.id} className="border-b border-slate-200 dark:border-slate-700">
                            <td className="py-3 px-4 text-sm">{event.title}</td>
                            <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                              {new Date(event.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                event.status === "published" 
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                                  : event.status === "draft" 
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              }`}>
                                {event.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                              {event.attendees}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <select 
                                  className="rounded-md border border-slate-300 text-xs dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
                                  value={event.status}
                                  onChange={(e) => handleStatusChange(
                                    event.id, 
                                    e.target.value as "published" | "draft" | "cancelled"
                                  )}
                                >
                                  <option value="published">Published</option>
                                  <option value="draft">Draft</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                                <Button 
                                  variant="outline" 
                                  className="h-7 px-2 text-xs border-slate-300 dark:border-slate-600"
                                >
                                  Edit
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Users Tab */}
              {activeTab === "users" && (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Name</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Email</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Join Date</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Events</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-slate-200 dark:border-slate-700">
                            <td className="py-3 px-4 text-sm font-medium">{user.name}</td>
                            <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                            <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                              {new Date(user.joinDate).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                              {user.eventsAttended}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  className="h-7 px-2 text-xs border-slate-300 dark:border-slate-600"
                                >
                                  View Profile
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6 px-2">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Platform Settings</h3>
                    <div className="space-y-4 max-w-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Allow New Registrations</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Enable user registration on the platform</p>
                        </div>
                        <div className="h-6 w-11 rounded-full bg-orange-500 relative cursor-pointer">
                          <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Event Approval Required</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Require admin approval for new events</p>
                        </div>
                        <div className="h-6 w-11 rounded-full bg-slate-300 dark:bg-slate-700 relative cursor-pointer">
                          <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white"></span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Maintenance Mode</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Put the site in maintenance mode</p>
                        </div>
                        <div className="h-6 w-11 rounded-full bg-slate-300 dark:bg-slate-700 relative cursor-pointer">
                          <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                    <div className="space-y-4 max-w-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New User Notifications</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Receive email when a new user registers</p>
                        </div>
                        <div className="h-6 w-11 rounded-full bg-orange-500 relative cursor-pointer">
                          <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Event Notifications</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Receive email when a new event is created</p>
                        </div>
                        <div className="h-6 w-11 rounded-full bg-orange-500 relative cursor-pointer">
                          <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      Save Settings
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      {/* Admin Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-4 mt-auto">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Eventify Admin Dashboard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 