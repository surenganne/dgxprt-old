import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { UserFormData, UseUserFormProps } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";

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
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('[UserFormLogic] Starting form submission');

    try {
      if (user) {
        // Update existing user
        console.log('[UserFormLogic] Updating existing user:', user.id);
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            full_name: formData.full_name,
            is_admin: formData.is_admin,
            status: formData.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (updateError) throw updateError;

        toast({
          title: "User updated successfully",
          description: "The user's information has been updated.",
        });
      } else {
        console.log('[UserFormLogic] Creating new user:', formData.email);
        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", formData.email)
          .maybeSingle();

        if (checkError) throw checkError;

        if (existingUser) {
          console.log('[UserFormLogic] User already exists:', formData.email);
          throw new Error("A user with this email already exists");
        }

        // Create new user and send magic link
        const { error: createError } = await supabase.functions.invoke('create-user-with-magic-link', {
          body: { 
            email: formData.email,
            fullName: formData.full_name,
            isAdmin: formData.is_admin,
            status: formData.status
          }
        });

        if (createError) {
          console.error('[UserFormLogic] Error creating user:', createError);
          // Check if the error is about existing user
          if (createError.message.includes("already exists")) {
            throw new Error("A user with this email already exists. Please use a different email address.");
          }
          throw createError;
        }

        toast({
          title: "User created successfully",
          description: "A login link has been sent to the user's email.",
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('[UserFormLogic] Error in handleSubmit:', error);
      toast({
        title: user ? "Error updating user" : "Error creating user",
        description: error.message || "An unexpected error occurred",
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