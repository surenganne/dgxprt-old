import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UserFormData } from "@/types/user";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin } from "lucide-react";

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
  const session = useSession();

  // Fetch current user's profile to check permissions
  const { data: currentUserProfile } = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("is_owner, is_admin")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch all active locations
  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("id, name, location_type")
        .eq("status", "active")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  // Fetch user's assigned locations if editing
  const { data: assignedLocations } = useQuery({
    queryKey: ["assignedLocations", formData.id],
    enabled: !!formData.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("location_assignments")
        .select("location_id")
        .eq("user_id", formData.id);

      if (error) throw error;
      return data.map(assignment => assignment.location_id);
    },
  });

  const handleLocationChange = (locationId: string) => {
    const currentLocations = formData.assigned_locations || [];
    const newLocations = currentLocations.includes(locationId)
      ? currentLocations.filter(id => id !== locationId)
      : [...currentLocations, locationId];
    
    setFormData({ ...formData, assigned_locations: newLocations });
  };

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
          disabled={loading}
        />
      </div>
      {(currentUserProfile?.is_owner || currentUserProfile?.is_admin) && (
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
      )}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: 'active' | 'inactive') =>
            setFormData({ ...formData, status: value })
          }
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Assigned Locations
        </Label>
        <ScrollArea className="h-[200px] border rounded-md p-4">
          <div className="space-y-2">
            {locations?.map((location) => (
              <div key={location.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location.id}`}
                  checked={(formData.assigned_locations || []).includes(location.id)}
                  onCheckedChange={() => handleLocationChange(location.id)}
                  disabled={loading}
                />
                <Label htmlFor={`location-${location.id}`} className="text-sm">
                  {location.name} ({location.location_type})
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};