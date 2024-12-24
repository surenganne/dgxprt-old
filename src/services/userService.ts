import { supabase } from "@/integrations/supabase/client";
import { UserFormData } from "@/types/user";
import { generateSecurePassword } from "@/utils/passwordUtils";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zrmjzuebsupnwuekzfio.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybWp6dWVic3Vwbnd1ZWt6ZmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NTE0MjMsImV4cCI6MjA1MDUyNzQyM30.dVW_035b8VhtKaXubqsxHdzc6qGYdLcjF-fQnJfdbnY";

export const createNewUser = async (formData: UserFormData) => {
  console.log('[UserService] Starting user creation process for:', formData.email);
  
  // First check if user already exists in profiles
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", formData.email)
    .maybeSingle();

  if (existingProfile) {
    console.error('[UserService] User already exists:', formData.email);
    throw new Error("A user with this email already exists");
  }

  // Generate a temporary password
  const tempPassword = generateSecurePassword();
  console.log('[UserService] Generated temporary password');

  // Create a new anonymous Supabase client for user creation
  console.log('[UserService] Creating anonymous client for user creation');
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      flowType: 'pkce'
    }
  });

  try {
    console.log('[UserService] Attempting to create user via admin API');
    // Create user directly using admin API
    const { data: authData, error: createUserError } = await anonClient.auth.admin.createUser({
      email: formData.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: formData.full_name
      }
    });

    if (createUserError) {
      console.error('[UserService] Error creating user:', createUserError);
      throw createUserError;
    }

    if (!authData?.user) {
      console.error('[UserService] Failed to create user - no user data returned');
      throw new Error("Failed to create user");
    }

    console.log('[UserService] User created successfully, updating profile');
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

    if (profileUpdateError) {
      console.error('[UserService] Error updating profile:', profileUpdateError);
      throw profileUpdateError;
    }

    console.log('[UserService] Sending welcome email');
    // Send welcome email using our custom email service
    const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
      body: {
        to: formData.email,
        password: tempPassword,
        loginLink: `${window.location.origin}/auth?email=${encodeURIComponent(formData.email)}&temp=true`
      }
    });

    if (emailError) {
      console.error('[UserService] Error sending welcome email:', emailError);
      throw new Error("Failed to send welcome email");
    }

    console.log('[UserService] User creation process completed successfully');
    return authData;
  } catch (error) {
    console.error('[UserService] Error in user creation process:', error);
    // If any step fails, attempt to clean up the user if they were created
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred while creating the user");
  }
};

export const updateExistingUser = async (userId: string, formData: UserFormData) => {
  console.log('[UserService] Updating existing user:', userId);
  const { error } = await supabase
    .from("profiles")
    .update({
      email: formData.email,
      full_name: formData.full_name,
      is_admin: formData.is_admin,
      status: formData.status,
    })
    .eq("id", userId);

  if (error) {
    console.error('[UserService] Error updating user:', error);
    throw error;
  }
  console.log('[UserService] User updated successfully');
};

export const checkExistingProfile = async (email: string) => {
  console.log('[UserService] Checking for existing profile:', email);
  const { data: existingProfile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (profileError) {
    console.error('[UserService] Error checking profile:', profileError);
    throw profileError;
  }

  console.log('[UserService] Profile check complete:', existingProfile ? 'Found' : 'Not found');
  return existingProfile;
};