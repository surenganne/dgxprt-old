import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UserFormData } from "@/types/user";

interface UserRoleFieldsProps {
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
  loading: boolean;
}

export const UserRoleFields = ({
  formData,
  setFormData,
  loading,
}: UserRoleFieldsProps) => {
  return (
    <div className="space-y-4">
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
      
      <div className="flex items-center space-x-2">
        <Switch
          id="is_compliance_officer"
          checked={formData.is_compliance_officer}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, is_compliance_officer: checked })
          }
          disabled={loading}
        />
        <Label htmlFor="is_compliance_officer">Compliance Officer</Label>
      </div>
    </div>
  );
};