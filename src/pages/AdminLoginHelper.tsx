import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginHelper() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const adminAuth = localStorage.getItem("findevent_admin_auth");
    setIsLoggedIn(adminAuth === "true");
  }, []);

  const handleLogin = () => {
    localStorage.setItem("findevent_admin_auth", "true");
    window.dispatchEvent(new Event("admin-auth-changed"));
    setIsLoggedIn(true);
    setTimeout(() => {
      navigate("/admin");
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("findevent_admin_auth");
    window.dispatchEvent(new Event("admin-auth-changed"));
    setIsLoggedIn(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login Helper</CardTitle>
          <CardDescription>
            Use this page to easily set or remove admin authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm font-medium">
                Current status: {isLoggedIn ? (
                  <span className="text-green-500 font-bold">Logged in as Admin</span>
                ) : (
                  <span className="text-red-500 font-bold">Not logged in</span>
                )}
              </p>
            </div>
            
            {isLoggedIn ? (
              <div className="space-y-4">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => navigate("/admin")}
                >
                  Go to Admin Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full bg-[#F97316] hover:bg-[#F97316]/90"
                onClick={handleLogin}
              >
                Login as Admin
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-2 text-center text-sm text-muted-foreground">
            This is a helper page to debug admin authentication issues
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 