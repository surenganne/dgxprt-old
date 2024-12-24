import { supabase } from "@/integrations/supabase/client";
import { UserFormData } from "@/types/user";
import { generateSecurePassword } from "@/utils/passwordUtils";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zrmjzuebsupnwuekzfio.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybWp6dWVic3Vpbmd1ZWt6ZmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NTE0MjMsImV4cCI6MjA1MDUyNzQyM30.dVW_035b8VhtKaXubqsxHdzc6qGYdLcjF-fQnJfdbnY";

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

  // Generate temporary password
  const tempPassword = generateSecurePassword();
  console.log('Generated temporary password:', tempPassword);

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
      // Disable all automatic emails from Supabase
      emailRedirectTo: null,
      emailConfirmation: false,
      shouldCreateUser: true,
      // Set user as confirmed to bypass email verification
      authOptions: {
        skipConfirmation: true
      }
    }
  });

  if (authError) throw authError;

  if (!authData.user) {
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
      email_confirmed_at: new Date().toISOString(), // Mark email as confirmed
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

  // Ensure the user is confirmed in auth.users
  const { error: confirmError } = await anonClient.auth.admin.updateUserById(
    authData.user.id,
    { email_confirmed: true }
  );

  if (confirmError) {
    console.error("Error confirming user:", confirmError);
    // Don't throw here as the user is still created successfully
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