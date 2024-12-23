import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UserFormData } from "./UserFormLogic";

interface UserFormFieldsProps {
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
  loading: boolean;
  isEdit: boolean;
}

export const UserFormFields = ({
  formData,
  setFormData,
  loading,
  isEdit,
}: UserFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
          disabled={loading || isEdit}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) =>
            setFormData({ ...formData, full_name: e.target.value })
          }
          required
          disabled={loading}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_admin"
          checked={formData.is_admin}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, is_admin: checked })
          }
          disabled={loading}
        />
        <Label htmlFor="is_admin">Admin User</Label>
      </div>
    </>
  );
};