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
      setFormData({
        email: user.email || "",
        full_name: user.full_name || "",
        is_admin: user.is_admin || false,
        status: user.status as 'active' | 'inactive',
      });
    } else {
      setFormData({
        email: "",
        full_name: "",
        is_admin: false,
        status: 'active',
      });
    }
  }, [user]);

  const sendWelcomeEmail = async (email: string, password: string) => {
    const loginLink = `${window.location.origin}/auth`;

    const { error } = await supabase.functions.invoke('send-welcome-email', {
      body: {
        to: email,
        password,
        loginLink,
      },
    });

    if (error) throw error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        // Update existing user
        const { error } = await supabase
          .from("profiles")
          .update({
            email: formData.email,
            full_name: formData.full_name,
            is_admin: formData.is_admin,
            status: formData.status,
          })
          .eq("id", user.id);

        if (error) throw error;

        toast({
          title: "User updated successfully",
          description: "The user's information has been updated.",
        });
      } else {
        // First check if user exists in profiles table
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", formData.email)
          .maybeSingle();

        if (profileError) throw profileError;

        if (existingProfile) {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              full_name: formData.full_name,
              is_admin: formData.is_admin,
              status: formData.status,
            })
            .eq("id", existingProfile.id);

          if (updateError) throw updateError;

          toast({
            title: "User updated successfully",
            description: "The existing user's information has been updated.",
          });
        } else {
          // Create new user with secure password
          const tempPassword = generateSecurePassword();
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: formData.email,
            password: tempPassword,
            email_confirm: true,
            user_metadata: {
              full_name: formData.full_name,
            },
          });

          if (authError) throw authError;

          if (authData?.user) {
            // Send welcome email with password
            await sendWelcomeEmail(formData.email, tempPassword);

            const { error: profileError } = await supabase
              .from("profiles")
              .update({
                is_admin: formData.is_admin,
                status: formData.status,
              })
              .eq("id", authData.user.id);

            if (profileError) throw profileError;

            toast({
              title: "User created successfully",
              description: "Login credentials have been sent to the user's email.",
            });
          }
        }
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error:", error);
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