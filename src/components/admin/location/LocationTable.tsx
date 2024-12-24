import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Power } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LocationTableProps {
  locations: any[];
  onEdit: (location: any) => void;
  onDelete: (locationId: string) => void;
  onToggleStatus: (location: any) => void;
  isLoading: boolean;
  selectedLocations: string[];
  onSelectLocation: (locationId: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
}

export const LocationTable = ({
  locations,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading,
  selectedLocations,
  onSelectLocation,
  onSelectAll,
}: LocationTableProps) => {
  const { data: hierarchyLevels } = useQuery({
    queryKey: ["locationHierarchy"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("location_hierarchy")
        .select("*")
        .order("level_order");
      
      if (error) {
        console.error("Error fetching hierarchy levels:", error);
        return [];
      }
      return data;
    },
  });

  const getTypeLabel = (type: string) => {
    const level = hierarchyLevels?.find(level => level.level_name === type);
    return level?.custom_label || level?.display_name || type;
  };

  const areAllSelected = locations?.length > 0 && selectedLocations.length === locations.length;
  const areSomeSelected = selectedLocations.length > 0 && selectedLocations.length < locations?.length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={areAllSelected}
              indeterminate={areSomeSelected}
              onCheckedChange={(checked) => onSelectAll(checked as boolean)}
              aria-label="Select all"
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Parent Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {locations?.map((location) => (
          <TableRow key={location.id}>
            <TableCell>
              <Checkbox
                checked={selectedLocations.includes(location.id)}
                onCheckedChange={(checked) => onSelectLocation(location.id, checked as boolean)}
                aria-label={`Select ${location.name}`}
              />
            </TableCell>
            <TableCell className="font-medium">{location.name}</TableCell>
            <TableCell>{getTypeLabel(location.type)}</TableCell>
            <TableCell>{location.parent_id ? locations.find(l => l.id === location.parent_id)?.name || "None" : "None"}</TableCell>
            <TableCell>
              <Badge
                variant={location.status === "active" ? "default" : "secondary"}
              >
                {location.status}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(location.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                disabled={isLoading}
                onClick={() => onToggleStatus(location)}
              >
                <Power className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                disabled={isLoading}
                onClick={() => onEdit(location)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={isLoading}
                onClick={() => onDelete(location.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};