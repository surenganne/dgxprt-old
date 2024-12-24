import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
}

export const ChemicalsTable = ({ chemicals, onEdit, onDelete }: ChemicalsTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(null);
  const { logUserAction } = useAuditLogger();

  const handleDelete = async (chemical: Chemical) => {
    try {
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
    }
    setDeleteDialogOpen(false);
    setSelectedChemical(null);
  };

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>CAS Number</TableHead>
              <TableHead>Hazard Class</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chemicals.map((chemical) => (
              <TableRow key={chemical.id}>
                <TableCell>{chemical.name}</TableCell>
                <TableCell>{chemical.cas_number || "-"}</TableCell>
                <TableCell className="capitalize">
                  {chemical.hazard_class.replace("_", " ")}
                </TableCell>
                <TableCell>{chemical.description || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(chemical)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit chemical</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedChemical(chemical);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete chemical</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the chemical
              {selectedChemical && `: ${selectedChemical.name}`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedChemical && handleDelete(selectedChemical)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};