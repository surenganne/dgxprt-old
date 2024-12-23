import { supabase } from "@/integrations/supabase/client";
import { UserFormData } from "@/types/user";
import { generateSecurePassword } from "@/utils/passwordUtils";
import { sendWelcomeEmail } from "./emailService";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zrmjzuebsupnwuekzfio.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybWp6dWVic3Vwbnd1ZWt6ZmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NTE0MjMsImV4cCI6MjA1MDUyNzQyM30.dVW_035b8VhtKaXubqsxHdzc6qGYdLcjF-fQnJfdbnY";

export const createNewUser = async (formData: UserFormData) => {
  // First check if user already exists in profiles
  const { data: existingProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", formData.email)
    .maybeSingle();

  if (profileError) throw profileError;

  if (existingProfile) {
    // Just update their profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        email: formData.email,
        full_name: formData.full_name,
        is_admin: formData.is_admin,
        status: formData.status,
      })
      .eq("email", formData.email);

    if (updateError) throw updateError;
    return;
  }

  // If user doesn't exist, create new
  const tempPassword = generateSecurePassword();

  // Create a separate client for user creation to avoid session changes
  const anonClient = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  );
  
  // Create new user with the anonymous client
  const { data: authData, error: authError } = await anonClient.auth.signUp({
    email: formData.email,
    password: tempPassword,
    options: {
      data: {
        full_name: formData.full_name,
      },
      emailRedirectTo: `${window.location.origin}/auth`,
    }
  });

  if (authError) throw authError;

  if (authData?.user) {
    await sendWelcomeEmail(formData.email, tempPassword);

    // Profile will be created automatically via trigger
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        is_admin: formData.is_admin,
        status: formData.status,
      })
      .eq("id", authData.user.id);

    if (profileError) throw profileError;
  }

  return authData;
};

export const updateExistingUser = async (userId: string, formData: UserFormData) => {
  const { error } = await supabase
    .from("profiles")
    .update({
      email: formData.email,
      full_name: formData.full_name,
      is_admin: formData.is_admin,
      status: formData.status,
    })
    .eq("id", userId);

  if (error) throw error;
};

export const checkExistingProfile = async (email: string) => {
  const { data: existingProfile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (profileError) throw profileError;

  return existingProfile;
};