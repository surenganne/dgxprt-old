import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserFormDialog } from "./UserFormDialog";
import { Badge } from "@/components/ui/badge";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { UserActions } from "./UserActions";

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

    if (userToDelete.email === "admin@dgxprt.ai") {
      toast({
        title: "Cannot delete admin account",
        description: "The main administrator account cannot be deleted.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error: authError } = await supabase.auth.admin.deleteUser(
        userToDelete.id
      );

      if (authError) {
        throw authError;
      }

      toast({
        title: "User deleted successfully",
        description: "The user has been completely removed from the system.",
      });
      refetch();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleEditUser = (user: any) => {
    if (user.email === "admin@dgxprt.ai") {
      toast({
        title: "Cannot edit admin account",
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
    if (email === "admin@dgxprt.ai") {
      toast({
        title: "Cannot reset admin password",
        description: "The main administrator password cannot be reset.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
    });

    if (error) {
      toast({
        title: "Error sending password reset",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password reset email sent",
        description: "A login link has been sent to the user's email.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <Button onClick={handleAddUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.full_name || "N/A"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.is_admin ? "Admin" : "User"}</TableCell>
              <TableCell>
                <Badge
                  variant={user.status === "active" ? "default" : "secondary"}
                >
                  {user.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <UserActions
                  user={user}
                  isLoading={isLoading}
                  onEdit={() => handleEditUser(user)}
                  onDelete={() => {
                    setUserToDelete(user);
                    setDeleteDialogOpen(true);
                  }}
                  onSendPassword={() => handleSendPassword(user.email)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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