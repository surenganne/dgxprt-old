import { supabase } from "@/integrations/supabase/client";
import { UserFormData } from "@/types/user";
import { generateSecurePassword } from "@/utils/passwordUtils";
import { sendWelcomeEmail } from "./emailService";

export const createNewUser = async (formData: UserFormData) => {
  console.log('Creating new user - start');
  
  // First check if user already exists in profiles
  const { data: existingProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", formData.email)
    .maybeSingle();

  if (profileError) {
    console.error('Error checking existing profile:', profileError);
    throw profileError;
  }

  if (existingProfile) {
    console.log('User already exists in system');
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

    if (updateError) {
      console.error('Error updating existing profile:', updateError);
      throw updateError;
    }
    console.log('Profile updated successfully');
    return;
  }

  // If user doesn't exist, create new
  const tempPassword = generateSecurePassword();
  console.log('Generated temporary password');
  
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: formData.email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: {
      full_name: formData.full_name,
    },
  });

  if (authError) {
    console.error('Error in auth creation:', authError);
    throw authError;
  }

  if (authData?.user) {
    console.log('User created successfully:', authData.user.id);
    await sendWelcomeEmail(formData.email, tempPassword);

    // Profile will be created automatically via trigger
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        is_admin: formData.is_admin,
        status: formData.status,
      })
      .eq("id", authData.user.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      throw profileError;
    }
    console.log('Profile updated successfully');
  }

  return authData;
};

export const updateExistingUser = async (userId: string, formData: UserFormData) => {
  console.log('Updating existing user:', userId);
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
    console.error('Error updating user profile:', error);
    throw error;
  }
  console.log('User updated successfully');
};

export const checkExistingProfile = async (email: string) => {
  console.log('Checking for existing profile with email:', email);
  const { data: existingProfile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (profileError) {
    console.error('Error checking existing profile:', profileError);
    throw profileError;
  }

  return existingProfile;
};