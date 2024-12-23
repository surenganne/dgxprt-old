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
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UserFormDialog } from "./UserFormDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    // Prevent deletion of admin@dgxprt.ai
    if (email === "admin@dgxprt.ai") {
      toast({
        title: "Cannot delete admin account",
        description: "The main administrator account cannot be deleted.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (error) {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "User deleted successfully",
        description: "The user has been removed from the system.",
      });
      refetch();
    }
    setIsLoading(false);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setDialogOpen(true);
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
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  disabled={isLoading}
                  onClick={() => handleEditUser(user)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
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