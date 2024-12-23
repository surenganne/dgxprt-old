import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateSecurePassword } from "@/utils/passwordUtils";

export interface UserFormData {
  email: string;
  full_name: string;
  is_admin: boolean;
  status: 'active' | 'inactive';
}

export interface UseUserFormProps {
  user?: {
    id: string;
    email: string;
    full_name: string | null;
    is_admin: boolean | null;
    status: 'active' | 'inactive';
  };
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useUserForm = ({ user, onSuccess, onOpenChange }: UseUserFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    full_name: "",
    is_admin: false,
    status: 'active',
  });

  useEffect(() => {
    if (user) {
      console.log('Initializing form with existing user:', user);
      setFormData({
        email: user.email || "",
        full_name: user.full_name || "",
        is_admin: user.is_admin || false,
        status: user.status as 'active' | 'inactive',
      });
    } else {
      console.log('Initializing form for new user');
      setFormData({
        email: "",
        full_name: "",
        is_admin: false,
        status: 'active',
      });
    }
  }, [user]);

  const sendWelcomeEmail = async (email: string, password: string) => {
    console.log('Attempting to send welcome email to:', email);
    const loginLink = `${window.location.origin}/auth`;

    try {
      const { error } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          to: email,
          password,
          loginLink,
        },
      });

      if (error) {
        console.error('Error sending welcome email:', error);
        throw error;
      }
      console.log('Welcome email sent successfully');
    } catch (error) {
      console.error('Error in sendWelcomeEmail:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started with data:', formData);
    setLoading(true);

    try {
      if (user) {
        console.log('Updating existing user:', user.id);
        const { error } = await supabase
          .from("profiles")
          .update({
            email: formData.email,
            full_name: formData.full_name,
            is_admin: formData.is_admin,
            status: formData.status,
          })
          .eq("id", user.id);

        if (error) {
          console.error('Error updating user profile:', error);
          throw error;
        }

        console.log('User updated successfully');
        toast({
          title: "User updated successfully",
          description: "The user's information has been updated.",
        });
      } else {
        console.log('Checking for existing profile with email:', formData.email);
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", formData.email)
          .maybeSingle();

        if (profileError) {
          console.error('Error checking existing profile:', profileError);
          throw profileError;
        }

        if (existingProfile) {
          console.log('Updating existing profile:', existingProfile.id);
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              full_name: formData.full_name,
              is_admin: formData.is_admin,
              status: formData.status,
            })
            .eq("id", existingProfile.id);

          if (updateError) {
            console.error('Error updating existing profile:', updateError);
            throw updateError;
          }

          console.log('Existing user updated successfully');
          toast({
            title: "User updated successfully",
            description: "The existing user's information has been updated.",
          });
        } else {
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
            console.log('Sending welcome email');
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
            toast({
              title: "User created successfully",
              description: "Login credentials have been sent to the user's email.",
            });
          }
        }
      }

      console.log('Form submission completed successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error in form submission:", error);
      toast({
        title: user ? "Error updating user" : "Error creating user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    handleSubmit,
  };
};