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
import { Pencil, Trash2, Power } from "lucide-react";

interface LocationTableProps {
  locations: any[];
  onEdit: (location: any) => void;
  onDelete: (locationId: string) => void;
  onToggleStatus: (location: any) => void;
  isLoading: boolean;
}

export const LocationTable = ({
  locations,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading,
}: LocationTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
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
            <TableCell className="font-medium">{location.name}</TableCell>
            <TableCell>{location.type}</TableCell>
            <TableCell>{location.parent_id || "None"}</TableCell>
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