import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuditLogger } from "@/hooks/useAuditLogger";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  category?: {
    id: string;
    name: string;
    description: string | null;
  };
}

interface CategoryFormData {
  name: string;
  description: string;
}

export const CategoryFormDialog = ({
  open,
  onOpenChange,
  onSuccess,
  category,
}: CategoryFormDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { logUserAction } = useAuditLogger();
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || "",
    description: category?.description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (category) {
        const { error } = await supabase
          .from("chemical_categories")
          .update(formData)
          .eq("id", category.id);

        if (error) throw error;

        await logUserAction(
          "chemical_categories",
          category.id,
          `Updated category: ${formData.name}`,
          { category_name: formData.name }
        );

        toast.success("Category updated successfully");
      } else {
        const { error, data } = await supabase
          .from("chemical_categories")
          .insert(formData)
          .select()
          .single();

        if (error) throw error;

        await logUserAction(
          "chemical_categories",
          data.id,
          `Created category: ${formData.name}`,
          { category_name: formData.name }
        );

        toast.success("Category added successfully");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(`Failed to ${category ? "update" : "add"} category`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
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
              {loading
                ? category
                  ? "Updating..."
                  : "Adding..."
                : category
                ? "Update Category"
                : "Add Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};