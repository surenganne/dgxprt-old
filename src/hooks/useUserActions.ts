import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUserActions = (refetchUsers: () => void) => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    if (userToDelete.email === "owner@dgxprt.ai") {
      toast({
        title: "Cannot delete owner account",
        description: "The main administrator account cannot be deleted.",
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      return;
    }

    try {
      console.log("[UserActions] Attempting to delete user:", userToDelete.id);
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId: userToDelete.id }
      });

      if (error) {
        console.error("[UserActions] Error from delete-user function:", error);
        let errorMessage = error.message;
        try {
          if (error.message.includes('{')) {
            const parsedError = JSON.parse(error.message);
            errorMessage = parsedError.error || error.message;
          }
        } catch (e) {
          console.error("[UserActions] Error parsing error message:", e);
        }
        throw new Error(errorMessage);
      }

      toast({
        title: "User deleted successfully",
        description: "The user has been completely removed from the system.",
      });
      refetchUsers();
    } catch (error: any) {
      console.error("[UserActions] Error deleting user:", error);
      toast({
        title: "Error deleting user",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleSendPassword = async (email: string) => {
    console.log("[UserActions] Starting password reset for email:", email);
    
    if (email === "owner@dgxprt.ai") {
      console.log("[UserActions] Attempted to reset owner password - blocked");
      toast({
        title: "Cannot reset owner password",
        description: "The main administrator password cannot be reset.",
        variant: "destructive",
      });
      return;
    }

    console.log("[UserActions] Calling custom password reset function for email:", email);
    
    try {
      const { error } = await supabase.functions.invoke('send-password-reset', {
        body: { email }
      });

      if (error) {
        console.error("[UserActions] Error sending password reset:", error);
        throw error;
      }

      console.log("[UserActions] Password reset email sent successfully to:", email);
      toast({
        title: "Password reset email sent",
        description: "A login link has been sent to the user's email.",
      });
    } catch (error: any) {
      console.error("[UserActions] Error:", error);
      toast({
        title: "Error sending password reset",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    dialogOpen,
    setDialogOpen,
    selectedUser,
    setSelectedUser,
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    setUserToDelete,
    handleDeleteUser,
    handleSendPassword,
  };
};