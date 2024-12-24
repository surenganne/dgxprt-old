import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Chemical } from "@/types/chemical";
import { useAuditLogger } from "@/hooks/useAuditLogger";

interface ChemicalsTableProps {
  chemicals: Chemical[];
  onEdit: (chemical: Chemical) => void;
  onDelete: () => void;
  selectedChemicals: Chemical[];
  onSelectionChange: (chemicals: Chemical[]) => void;
}

export const ChemicalsTable = ({
  chemicals,
  onEdit,
  onDelete,
  selectedChemicals,
  onSelectionChange,
}: ChemicalsTableProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { logUserAction } = useAuditLogger();

  const handleDelete = async (chemical: Chemical) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("chemicals")
        .delete()
        .eq("id", chemical.id);

      if (error) throw error;

      await logUserAction(
        "chemicals",
        chemical.id,
        `Deleted chemical: ${chemical.name}`,
        { chemical_name: chemical.name }
      );

      toast.success("Chemical deleted successfully");
      onDelete();
    } catch (error) {
      console.error("Error deleting chemical:", error);
      toast.error("Failed to delete chemical");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    onSelectionChange(checked ? chemicals : []);
  };

  const handleSelectChemical = (chemical: Chemical, checked: boolean) => {
    const newSelection = checked
      ? [...selectedChemicals, chemical]
      : selectedChemicals.filter((c) => c.id !== chemical.id);
    onSelectionChange(newSelection);
  };

  const isSelected = (chemical: Chemical) =>
    selectedChemicals.some((c) => c.id === chemical.id);

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50/50 hover:bg-gray-50/70 transition-colors">
          <TableHead className="w-[50px]">
            <Checkbox
              checked={chemicals.length > 0 && selectedChemicals.length === chemicals.length}
              onCheckedChange={handleSelectAll}
              aria-label="Select all chemicals"
            />
          </TableHead>
          <TableHead className="text-primary-purple font-medium">Name</TableHead>
          <TableHead className="text-primary-purple font-medium">CAS Number</TableHead>
          <TableHead className="text-primary-purple font-medium">Hazard Class</TableHead>
          <TableHead className="text-primary-purple font-medium">Description</TableHead>
          <TableHead className="text-right text-primary-purple font-medium">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {chemicals.map((chemical) => (
          <TableRow key={chemical.id} className="hover:bg-gray-50/50 transition-colors">
            <TableCell>
              <Checkbox
                checked={isSelected(chemical)}
                onCheckedChange={(checked) =>
                  handleSelectChemical(chemical, checked as boolean)
                }
                aria-label={`Select ${chemical.name}`}
              />
            </TableCell>
            <TableCell className="font-medium text-primary-blue">{chemical.name}</TableCell>
            <TableCell className="text-gray-600">{chemical.cas_number || "-"}</TableCell>
            <TableCell>
              <Badge
                variant={chemical.hazard_class === "hazardous" ? "destructive" : "secondary"}
                className={
                  chemical.hazard_class === "hazardous"
                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                }
              >
                {chemical.hazard_class.replace("_", " ")}
              </Badge>
            </TableCell>
            <TableCell className="text-gray-600">
              {chemical.description || "-"}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-600 hover:text-primary-purple hover:bg-primary-purple/10"
                disabled={isDeleting}
                onClick={() => onEdit(chemical)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-600 hover:text-primary-purple hover:bg-primary-purple/10"
                disabled={isDeleting}
                onClick={() => handleDelete(chemical)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};