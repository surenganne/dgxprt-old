import { supabase } from "@/integrations/supabase/client";
import { UserFormData } from "@/types/user";
import { generateSecurePassword } from "@/utils/passwordUtils";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zrmjzuebsupnwuekzfio.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybWp6dWVic3Vwbnd1ZWt6ZmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NTE0MjMsImV4cCI6MjA1MDUyNzQyM30.dVW_035b8VhtKaXubqsxHdzc6qGYdLcjF-fQnJfdbnY";

export const createNewUser = async (formData: UserFormData) => {
  // First check if user already exists in profiles
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", formData.email)
    .maybeSingle();

  if (existingProfile) {
    throw new Error("A user with this email already exists");
  }

  // Generate a temporary password
  const tempPassword = generateSecurePassword();

  // Create a new anonymous Supabase client for user creation
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      flowType: 'pkce'
    }
  });

  try {
    // Create user directly using admin API
    const { data: authData, error: createUserError } = await anonClient.auth.admin.createUser({
      email: formData.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: formData.full_name
      }
    });

    if (createUserError) throw createUserError;

    if (!authData?.user) {
      throw new Error("Failed to create user");
    }

    // Update the profile with additional data
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        is_admin: formData.is_admin,
        status: "active",
        has_reset_password: false,
        updated_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString()
      })
      .eq("id", authData.user.id);

    if (profileUpdateError) throw profileUpdateError;

    // Send welcome email using our custom email service
    const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
      body: {
        to: formData.email,
        password: tempPassword,
        loginLink: `${window.location.origin}/auth?email=${encodeURIComponent(formData.email)}&temp=true`
      }
    });

    if (emailError) {
      console.error("Error sending welcome email:", emailError);
      throw new Error("Failed to send welcome email");
    }

    return authData;
  } catch (error) {
    // If any step fails, attempt to clean up the user if they were created
    if (error instanceof Error) {
      console.error("Error creating user:", error.message);
      throw error;
    }
    throw new Error("An unknown error occurred while creating the user");
  }
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