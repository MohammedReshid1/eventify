
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Loader2, Mail, Lock, User, UserCircle } from "lucide-react";
import { UserProfile } from "@/types";

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/auth");
          return;
        }
        
        setUser(session.user);
        setEmail(session.user.email || "");
        
        // Get profile data
        if (session.user.id) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
            
          if (!error && data) {
            setProfile(data);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    
    getUserProfile();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate("/auth");
        } else {
          setUser(session.user);
          setEmail(session.user.email || "");
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  const updatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please enter your new password and confirmation");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      setUpdating(true);
      setError("");
      setSuccess("");
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      setSuccess("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      
      toast({
        title: "Success",
        description: "Your password has been updated",
      });
    } catch (error: any) {
      setError(error.message || "Failed to update password");
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update password",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full max-w-3xl mx-auto">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex gap-2 items-center">
            <UserCircle className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex gap-2 items-center">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                View and update your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="text-muted-foreground" />
                  <p className="text-sm font-medium">User ID</p>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {user?.id || "Not available"}
                </p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="text-muted-foreground" />
                  <p className="text-sm font-medium">Email Address</p>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {user?.email || "Not available"}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Account Created</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.created_at 
                    ? new Date(profile.created_at).toLocaleDateString() 
                    : "Not available"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-md flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <p className="text-sm">{success}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-sm font-medium">New Password</p>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Confirm New Password</p>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={updatePassword} 
                disabled={updating}
                className="bg-[#F97316] hover:bg-[#FB923C]"
              >
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {updating ? "Updating..." : "Update Password"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
