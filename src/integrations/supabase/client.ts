import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zrmjzuebsupnwuekzfio.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybWp6dWVic3Vwbnd1ZWt6ZmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NTE0MjMsImV4cCI6MjA1MDUyNzQyM30.dVW_035b8VhtKaXubqsxHdzc6qGYdLcjF-fQnJfdbnY";

export { createClient };

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});