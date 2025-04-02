
import { supabase } from "@/integrations/supabase/client";

// This utility is only run in development mode to help set up admin accounts
// It attempts to create a default admin user for demo purposes

const createAdminHelper = async () => {
  // Only run in development mode
  if (!import.meta.env.DEV) {
    return;
  }

  // Check if we've already attempted to create an admin
  const hasAttemptedAdminCreation = localStorage.getItem("findevent_admin_setup_attempted");
  if (hasAttemptedAdminCreation === "true") {
    return;
  }

  // Set flag to prevent multiple attempts
  localStorage.setItem("findevent_admin_setup_attempted", "true");

  try {
    console.log("🔧 Checking for admin account...");
    
    // Demo admin credentials
    const adminEmail = "admin@eventify.com";
    const adminPassword = "admin123";

    // Check if the admin user already exists
    const { data: existingUser } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (existingUser && existingUser.user) {
      console.log("✅ Admin account already exists!");
      // Sign out after checking
      await supabase.auth.signOut();
      return;
    }

    // Create admin user if it doesn't exist
    console.log("🔧 Creating demo admin account...");
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    });

    if (error) {
      console.error("❌ Error creating admin account:", error.message);
      return;
    }

    if (data && data.user) {
      console.log("✅ Admin account created successfully!");
      
      // We no longer directly modify the profiles table since it's created automatically via a trigger
      console.log("✅ Admin role will be set by a database trigger!");

      // Sign out after creation
      await supabase.auth.signOut();
    }
  } catch (error) {
    console.error("❌ Unexpected error in admin setup:", error);
  }
};

// Run the helper function
createAdminHelper();
