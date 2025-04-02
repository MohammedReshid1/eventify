import { supabase } from "@/integrations/supabase/client";

// Simple direct function to create and login as admin
export const setupAndLoginAsAdmin = async () => {
  try {
    console.log("Starting admin setup process...");
    
    // Try signing in first
    let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: "admin@findevent.com",
      password: "admin123"
    });
    
    // If sign in works, return (the trigger will handle the profile)
    if (!signInError && signInData.user) {
      console.log("Signed in successfully...");
      console.log("Admin role should be set by database trigger, redirecting...");
      window.location.href = "/admin/dashboard";
      return true;
    }
    
    // Otherwise create a new user
    console.log("Sign in failed, creating new admin user...");
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: "admin@findevent.com",
      password: "admin123"
    });
    
    if (signUpError) {
      console.error("Signup error:", signUpError.message);
      return false;
    }
    
    if (!signUpData.user) {
      console.error("No user data returned from signup");
      return false;
    }
    
    // The trigger will automatically create a profile entry
    console.log("Admin setup triggered, waiting for confirmation...");
    
    // Sign in again to confirm
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "admin@findevent.com",
      password: "admin123"
    });
    
    if (error) {
      console.error("Final sign in error:", error.message);
      return false;
    }
    
    console.log("Admin setup complete, redirecting...");
    window.location.href = "/admin/dashboard";
    return true;
  } catch (error) {
    console.error("Unexpected error:", error);
    return false;
  }
};
