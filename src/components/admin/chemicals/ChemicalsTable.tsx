import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SDSList } from "@/components/admin/sds/SDSList";
import type { Chemical } from "@/types/chemical";

interface ChemicalsTableProps {
  chemicals: Chemical[];
  onEdit: (chemical: Chemical) => void;
  onDelete: (chemical: Chemical) => void;
  selectedChemicals: Chemical[];
  onSelectionChange: (chemicals: Chemical[]) => void;
  readOnly?: boolean;
}

export const ChemicalsTable = ({
  chemicals,
  onEdit,
  onDelete,
  selectedChemicals,
  onSelectionChange,
  readOnly = false,
}: ChemicalsTableProps) => {
  const handleToggleAll = () => {
    if (selectedChemicals.length === chemicals.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange([...chemicals]);
    }
  };

  const handleToggleOne = (chemical: Chemical) => {
    if (selectedChemicals.find((c) => c.id === chemical.id)) {
      onSelectionChange(selectedChemicals.filter((c) => c.id !== chemical.id));
    } else {
      onSelectionChange([...selectedChemicals, chemical]);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {!readOnly && (
            <TableHead className="w-[50px]">
              <Checkbox
                checked={
                  chemicals.length > 0 &&
                  selectedChemicals.length === chemicals.length
                }
                onCheckedChange={handleToggleAll}
              />
            </TableHead>
          )}
          <TableHead>Name</TableHead>
          <TableHead>CAS Number</TableHead>
          <TableHead>Hazard Class</TableHead>
          <TableHead>SDS Documents</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {chemicals.map((chemical) => (
          <TableRow key={chemical.id}>
            {!readOnly && (
              <TableCell>
                <Checkbox
                  checked={
                    selectedChemicals.find((c) => c.id === chemical.id) !==
                    undefined
                  }
                  onCheckedChange={() => handleToggleOne(chemical)}
                />
              </TableCell>
            )}
            <TableCell>{chemical.name}</TableCell>
            <TableCell>{chemical.cas_number || "-"}</TableCell>
            <TableCell>
              <Badge
                variant={
                  chemical.hazard_class === "hazardous"
                    ? "destructive"
                    : "secondary"
                }
              >
                {chemical.hazard_class === "hazardous"
                  ? "Hazardous"
                  : "Non-Hazardous"}
              </Badge>
            </TableCell>
            <TableCell>
              <SDSList chemicalId={chemical.id} />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(chemical)}
                >
                  {readOnly ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <Edit2 className="h-4 w-4" />
                  )}
                </Button>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(chemical)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};