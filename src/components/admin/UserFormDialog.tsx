import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserForm } from "./UserFormLogic";
import { UserFormFields } from "./UserFormFields";
import { useAuditLogger } from "@/hooks/useAuditLogger";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: {
    id: string;
    email: string;
    full_name: string | null;
    is_admin: boolean | null;
    status: 'active' | 'inactive';
  };
  onSuccess: () => void;
}

export const UserFormDialog = ({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserFormDialogProps) => {
  console.log('UserFormDialog render - open:', open, 'user:', user);
  const { logUserAction } = useAuditLogger();
  
  const { formData, setFormData, loading, handleSubmit: originalHandleSubmit } = useUserForm({
    user,
    onSuccess: async () => {
      await logUserAction(
        'user',
        user?.id || null,
        user ? `Updated user: ${formData.email}` : `Created user: ${formData.email}`,
        { ...formData }
      );
      onSuccess();
    },
    onOpenChange,
  });

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        console.log('Dialog onOpenChange triggered:', newOpen);
        onOpenChange(newOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={originalHandleSubmit} className="space-y-4">
          <UserFormFields
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            isEdit={!!user}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : user ? "Update User" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};