import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zrmjzuebsupnwuekzfio.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybWp6dWVic3Vwbnd1ZWt6ZmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NTE0MjMsImV4cCI6MjA1MDUyNzQyM30.dVW_035b8VhtKaXubqsxHdzc6qGYdLcjF-fQnJfdbnY";

export const createClient = (options?: any) => {
  console.log('[Supabase Client] Creating new client with options:', options);
  
  const client = createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    ...options,
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
      debug: true, // Enable debug mode
      onAuthStateChange: (event, session) => {
        console.log('[Supabase Auth] Auth state changed:', { event, session });
      }
    }
  });

  console.log('[Supabase Client] Client created successfully');
  return client;
};

export const supabase = createClient();