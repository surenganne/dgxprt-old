import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  // Update form data when user prop changes
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
          // Update existing profile
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
          // Create new user
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: Math.random().toString(36).slice(-8),
            options: {
              data: {
                full_name: formData.full_name,
              },
            },
          });

          if (authError) {
            if (authError.message === "User already registered") {
              const { error: signInError } = await supabase.auth.signInWithOtp({
                email: formData.email,
              });

              if (signInError) throw signInError;

              toast({
                title: "Magic link sent",
                description: "A login link has been sent to the user's email.",
              });
            } else {
              throw authError;
            }
          } else if (authData?.user) {
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
              description: "An email has been sent to the user with login instructions.",
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