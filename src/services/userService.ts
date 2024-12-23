import { supabase } from "@/integrations/supabase/client";
import { UserFormData } from "@/types/user";
import { generateSecurePassword } from "@/utils/passwordUtils";
import { sendWelcomeEmail } from "./emailService";

export const createNewUser = async (formData: UserFormData) => {
  console.log('Creating new user');
  const tempPassword = generateSecurePassword();
  console.log('Generated temporary password');
  
  console.log('Attempting to sign up new user');
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: tempPassword,
    options: {
      data: {
        full_name: formData.full_name,
      },
      emailRedirectTo: `${window.location.origin}/auth`,
    },
  });

  if (authError) {
    console.error('Error in auth signup:', authError);
    throw authError;
  }

  if (authData?.user) {
    console.log('User created successfully:', authData.user.id);
    await sendWelcomeEmail(formData.email, tempPassword);

    console.log('Updating profile with admin status');
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