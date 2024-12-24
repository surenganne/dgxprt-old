import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import type { Chemical } from "@/types/chemical";

interface BulkCategoryUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedChemicals: Chemical[];
  categories: { id: string; name: string }[];
  onSuccess: () => void;
}

export const BulkCategoryUpdateDialog = ({
  open,
  onOpenChange,
  selectedChemicals,
  categories,
  onSuccess,
}: BulkCategoryUpdateDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState<string>("");
  const { logUserAction } = useAuditLogger();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("chemicals")
        .update({ category_id: categoryId || null })
        .in(
          "id",
          selectedChemicals.map((c) => c.id)
        );

      if (error) throw error;

      await logUserAction(
        "chemicals",
        null,
        `Updated category for ${selectedChemicals.length} chemicals`,
        {
          chemical_count: selectedChemicals.length,
          category_id: categoryId,
        }
      );

      toast.success(
        `Successfully updated category for ${selectedChemicals.length} chemicals`
      );
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating categories:", error);
      toast.error("Failed to update categories");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Category for Selected Chemicals</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Selected Chemicals: {selectedChemicals.length}</Label>
            <ul className="mt-2 text-sm text-muted-foreground">
              {selectedChemicals.slice(0, 5).map((chemical) => (
                <li key={chemical.id}>{chemical.name}</li>
              ))}
              {selectedChemicals.length > 5 && (
                <li>...and {selectedChemicals.length - 5} more</li>
              )}
            </ul>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={categoryId}
              onValueChange={(value) => setCategoryId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Categories"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};