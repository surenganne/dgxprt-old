import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserFormDialog } from "./UserFormDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { UserTableHeader } from "./UserTableHeader";
import { UserTableRow } from "./UserTableRow";

export const UserManagement = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const { data: users, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data;
    },
  });

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    // Check if trying to delete owner or current admin
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

    setIsLoading(true);
    try {
      console.log("[UserManagement] Attempting to delete user:", userToDelete.id);
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId: userToDelete.id }
      });

      if (error) {
        console.error("[UserManagement] Error from delete-user function:", error);
        // Parse the error message if it's in the response body
        let errorMessage = error.message;
        try {
          if (error.message.includes('{')) {
            const parsedError = JSON.parse(error.message);
            errorMessage = parsedError.error || error.message;
          }
        } catch (e) {
          console.error("[UserManagement] Error parsing error message:", e);
        }
        throw new Error(errorMessage);
      }

      toast({
        title: "User deleted successfully",
        description: "The user has been completely removed from the system.",
      });
      refetch();
    } catch (error: any) {
      console.error("[UserManagement] Error deleting user:", error);
      toast({
        title: "Error deleting user",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleEditUser = (user: any) => {
    if (user.email === "owner@dgxprt.ai") {
      toast({
        title: "Cannot edit owner account",
        description: "The main administrator account cannot be modified.",
        variant: "destructive",
      });
      return;
    }
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleSendPassword = async (email: string) => {
    console.log("[UserManagement] Starting password reset for email:", email);
    
    if (email === "owner@dgxprt.ai") {
      console.log("[UserManagement] Attempted to reset owner password - blocked");
      toast({
        title: "Cannot reset owner password",
        description: "The main administrator password cannot be reset.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("[UserManagement] Calling custom password reset function for email:", email);
    
    try {
      const { error } = await supabase.functions.invoke('send-password-reset', {
        body: { email }
      });

      if (error) {
        console.error("[UserManagement] Error sending password reset:", error);
        throw error;
      }

      console.log("[UserManagement] Password reset email sent successfully to:", email);
      toast({
        title: "Password reset email sent",
        description: "A login link has been sent to the user's email.",
      });
    } catch (error: any) {
      console.error("[UserManagement] Error:", error);
      toast({
        title: "Error sending password reset",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-primary-blue">User Management</h2>
        <Button 
          onClick={handleAddUser}
          className="bg-primary-purple hover:bg-primary-purple/90 text-white"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <Table>
          <UserTableHeader />
          <TableBody>
            {users?.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                isLoading={isLoading}
                onEdit={handleEditUser}
                onDelete={() => {
                  setUserToDelete(user);
                  setDeleteDialogOpen(true);
                }}
                onSendPassword={handleSendPassword}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        onSuccess={refetch}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteUser}
        userName={userToDelete?.full_name || userToDelete?.email || "this user"}
        loading={isLoading}
      />
    </div>
  );
};