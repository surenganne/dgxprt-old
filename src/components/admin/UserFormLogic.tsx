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
    is_owner: false,
    status: 'active',
    assigned_locations: [],
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      // Fetch user's assigned locations
      const { data: locationAssignments, error: locationError } = await supabase
        .from("location_assignments")
        .select("location_id")
        .eq("user_id", user.id);

      if (locationError) {
        console.error('[UserFormLogic] Error fetching location assignments:', locationError);
        return;
      }

      setFormData({
        id: user.id,
        email: user.email || "",
        full_name: user.full_name || "",
        is_admin: user.is_admin || false,
        is_owner: user.is_owner || false,
        status: user.status as 'active' | 'inactive',
        assigned_locations: locationAssignments.map(assignment => assignment.location_id),
      });
    };

    loadUserData();
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

        // Update location assignments
        // First, remove all existing assignments
        const { error: deleteError } = await supabase
          .from("location_assignments")
          .delete()
          .eq("user_id", user.id);

        if (deleteError) throw deleteError;

        // Then, add new assignments
        if (formData.assigned_locations && formData.assigned_locations.length > 0) {
          const { error: insertError } = await supabase
            .from("location_assignments")
            .insert(
              formData.assigned_locations.map(locationId => ({
                user_id: user.id,
                location_id: locationId,
              }))
            );

          if (insertError) throw insertError;
        }

        toast({
          title: "User updated successfully",
          description: "The user's information has been updated.",
        });
      } else {
        console.log('[UserFormLogic] Creating new user:', formData.email);
        
        // Create new user and send magic link
        const { data, error: createError } = await supabase.functions.invoke('create-user-with-magic-link', {
          body: { 
            email: formData.email,
            fullName: formData.full_name,
            isAdmin: formData.is_admin,
            status: formData.status,
            assignedLocations: formData.assigned_locations
          }
        });

        if (createError) {
          console.error('[UserFormLogic] Error from edge function:', createError);
          let errorMessage;
          try {
            if (typeof createError.body === 'string') {
              const errorBody = JSON.parse(createError.body);
              errorMessage = errorBody.error || "Failed to create user";
            } else {
              errorMessage = createError.message || "Failed to create user";
            }
          } catch (parseError) {
            console.error('[UserFormLogic] Error parsing error response:', parseError);
            errorMessage = createError.message || "Failed to create user";
          }
          throw new Error(errorMessage);
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