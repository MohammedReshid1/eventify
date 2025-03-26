// This script creates an admin user for testing purposes
// Run with: node createAdminUser.js

import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase URL and anon key
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

const createAdminUser = async () => {
  console.log('Checking if admin user exists...');
  
  // Check if the admin user already exists
  const { data: existingUser, error: checkError } = await supabase
    .from('auth.users')
    .select('*')
    .eq('email', 'admin@findevent.com')
    .single();
  
  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error checking for existing admin:', checkError);
    return;
  }
  
  if (existingUser) {
    console.log('Admin user already exists.');
    return;
  }
  
  console.log('Creating admin user...');
  
  // Create the admin user
  const { data: userData, error: signUpError } = await supabase.auth.signUp({
    email: 'admin@findevent.com',
    password: 'admin123',
  });
  
  if (signUpError) {
    console.error('Error creating admin user:', signUpError);
    return;
  }
  
  console.log('Admin user created with ID:', userData.user.id);
  
  // Update the user's role to 'admin' in the profiles table
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', userData.user.id);
  
  if (updateError) {
    console.error('Error updating admin role:', updateError);
    return;
  }
  
  console.log('Admin role assigned successfully.');
};

createAdminUser()
  .then(() => {
    console.log('Admin user setup completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 