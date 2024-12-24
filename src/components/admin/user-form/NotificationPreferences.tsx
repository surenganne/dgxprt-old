import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell } from "lucide-react";
import { UserFormData } from "@/types/user";

interface NotificationPreferencesProps {
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
  loading: boolean;
}

export const NotificationPreferences = ({
  formData,
  setFormData,
  loading,
}: NotificationPreferencesProps) => {
  if (!formData.is_compliance_officer) return null;

  return (
    <div className="space-y-2 pl-6 border-l-2 border-gray-200">
      <Label className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        Notification Preferences
      </Label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="notify_upload"
            checked={formData.notify_on_upload}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, notify_on_upload: checked as boolean })
            }
            disabled={loading}
          />
          <Label htmlFor="notify_upload">Notify on new SDS uploads</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="notify_review"
            checked={formData.notify_on_review}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, notify_on_review: checked as boolean })
            }
            disabled={loading}
          />
          <Label htmlFor="notify_review">Notify on SDS reviews</Label>
        </div>
      </div>
    </div>
  );
};