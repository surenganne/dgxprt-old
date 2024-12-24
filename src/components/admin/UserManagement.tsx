import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { UserFormDialog } from "./UserFormDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { UserTable } from "./UserTable";
import { useUsers } from "@/hooks/useUsers";
import { useUserActions } from "@/hooks/useUserActions";

export const UserManagement = () => {
  const { users, isLoading, setIsLoading, refetch } = useUsers();
  const {
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
  } = useUserActions(refetch);

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-primary-blue">
          User Management
        </h2>
        <Button
          onClick={handleAddUser}
          className="bg-primary-purple hover:bg-primary-purple/90 text-white"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <UserTable
        users={users || []}
        isLoading={isLoading}
        onEdit={handleEditUser}
        onDelete={(user) => {
          setUserToDelete(user);
          setDeleteDialogOpen(true);
        }}
        onSendPassword={handleSendPassword}
      />

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