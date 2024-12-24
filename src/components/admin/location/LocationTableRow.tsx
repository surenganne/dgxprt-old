import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Power } from "lucide-react";

interface LocationTableRowProps {
  location: any;
  isLoading: boolean;
  onEdit: (location: any) => void;
  onDelete: (locationId: string) => void;
  onToggleStatus: (location: any) => void;
  isSelected: boolean;
  onSelect: (locationId: string, isSelected: boolean) => void;
}

export const LocationTableRow = ({
  location,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
  isSelected,
  onSelect,
}: LocationTableRowProps) => {
  return (
    <TableRow className="hover:bg-gray-50/50 transition-colors">
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(location.id, checked as boolean)}
          aria-label={`Select ${location.name}`}
        />
      </TableCell>
      <TableCell className="font-medium text-primary-blue">{location.name}</TableCell>
      <TableCell className="text-gray-600">{location.type}</TableCell>
      <TableCell className="text-gray-600">
        {location.parent_id ? "Has Parent" : "None"}
      </TableCell>
      <TableCell>
        <Badge
          variant={location.status === "active" ? "default" : "secondary"}
          className={
            location.status === "active"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
          }
        >
          {location.status}
        </Badge>
      </TableCell>
      <TableCell className="text-gray-600">
        {new Date(location.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-600 hover:text-primary-purple hover:bg-primary-purple/10"
          disabled={isLoading}
          onClick={() => onToggleStatus(location)}
        >
          <Power className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-600 hover:text-primary-purple hover:bg-primary-purple/10"
          disabled={isLoading}
          onClick={() => onEdit(location)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-600 hover:text-primary-purple hover:bg-primary-purple/10"
          disabled={isLoading}
          onClick={() => onDelete(location.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};