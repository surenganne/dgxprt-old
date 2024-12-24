import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserFormData } from "@/types/user";

interface LocationAssignmentsProps {
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
  loading: boolean;
}

export const LocationAssignments = ({
  formData,
  setFormData,
  loading,
}: LocationAssignmentsProps) => {
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

  const handleLocationChange = (locationId: string) => {
    const currentLocations = formData.assigned_locations || [];
    const newLocations = currentLocations.includes(locationId)
      ? currentLocations.filter(id => id !== locationId)
      : [...currentLocations, locationId];
    
    setFormData({ ...formData, assigned_locations: newLocations });
  };

  return (
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
  );
};