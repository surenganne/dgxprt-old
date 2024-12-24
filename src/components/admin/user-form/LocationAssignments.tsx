import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, School } from "lucide-react";
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
        .select("id, name, type, parent_id, location_type")
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

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'site':
        return <MapPin className="h-4 w-4 text-primary-purple" />;
      case 'school':
        return <School className="h-4 w-4 text-primary-purple" />;
      default:
        return <Building2 className="h-4 w-4 text-primary-purple" />;
    }
  };

  const getParentLocation = (parentId: string | null) => {
    if (!parentId || !locations) return null;
    return locations.find(loc => loc.id === parentId);
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-primary-blue font-medium">
        <MapPin className="h-4 w-4" />
        Assigned Locations
      </Label>
      <ScrollArea className="h-[200px] border border-gray-200 rounded-lg">
        <div className="p-4 space-y-3">
          {locations?.map((location) => {
            const parentLocation = getParentLocation(location.parent_id);
            return (
              <div 
                key={location.id} 
                className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  id={`location-${location.id}`}
                  checked={(formData.assigned_locations || []).includes(location.id)}
                  onCheckedChange={() => handleLocationChange(location.id)}
                  disabled={loading}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {getLocationIcon(location.type)}
                    <Label 
                      htmlFor={`location-${location.id}`} 
                      className="text-sm font-medium text-gray-900 cursor-pointer"
                    >
                      {location.name}
                    </Label>
                  </div>
                  {parentLocation && (
                    <div className="mt-1">
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-primary-purple/10 text-primary-purple hover:bg-primary-purple/20"
                      >
                        {parentLocation.name}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};