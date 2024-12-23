import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { UserFormData, UseUserFormProps } from "@/types/user";
import { createNewUser, updateExistingUser } from "@/services/userService";

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
      console.log('Setting form data for existing user:', user);
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
    console.log('Form submission started with data:', formData);
    setLoading(true);

    try {
      // Prevent any navigation during the operation
      const unblock = window.history.pushState(null, '', window.location.href);
      
      if (user) {
        await updateExistingUser(user.id, formData);
        toast({
          title: "User updated successfully",
          description: "The user's information has been updated.",
        });
      } else {
        await createNewUser(formData);
        toast({
          title: "User created successfully",
          description: "Login credentials have been sent to the user's email.",
        });
      }

      console.log('Form submission completed successfully');
      onSuccess();
      onOpenChange(false);
      
      // Restore navigation
      window.history.go(0);
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