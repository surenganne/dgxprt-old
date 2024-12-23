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
import { UserPlus, Pencil, Trash2, Lock, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UserFormDialog } from "./UserFormDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export const UserManagement = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

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

  const handleDeleteUser = async (userId: string, email: string) => {
    if (email === "admin@dgxprt.ai") {
      toast({
        title: "Cannot delete admin account",
        description: "The main administrator account cannot be deleted.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // First delete the user from auth.users using admin API
      const { error: authError } = await supabase.auth.admin.deleteUser(
        userId
      );

      if (authError) {
        throw authError;
      }

      // The profile will be automatically deleted due to the ON DELETE CASCADE
      // constraint between auth.users and public.profiles

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
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                  {user.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mr-2"
                          disabled={isLoading || user.email === "admin@dgxprt.ai"}
                          onClick={() => handleEditUser(user)}
                        >
                          {user.email === "admin@dgxprt.ai" ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Pencil className="h-4 w-4" />
                          )}
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {user.email === "admin@dgxprt.ai" && (
                      <TooltipContent>
                        <p>The main administrator account cannot be modified</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mr-2"
                          disabled={isLoading || user.email === "admin@dgxprt.ai"}
                          onClick={() => handleSendPassword(user.email)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Send password reset email</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isLoading || user.email === "admin@dgxprt.ai"}
                          onClick={() => handleDeleteUser(user.id, user.email)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {user.email === "admin@dgxprt.ai" && (
                      <TooltipContent>
                        <p>The main administrator account cannot be deleted</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
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
    </div>
  );
};
