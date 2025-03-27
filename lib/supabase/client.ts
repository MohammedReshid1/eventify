import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createClientClient = () => {
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true
    },
    global: {
      fetch: (url, options) => fetch(url, options)
    }
  });
  
  return supabase;
}; 