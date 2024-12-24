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
import { Edit, Trash, Inbox, AlertCircle, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuditLogger } from "@/hooks/useAuditLogger";

interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const CategoriesTable = ({
  categories,
  onEdit,
  onDelete,
  isLoading = false,
  error = null,
}: CategoriesTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { logUserAction } = useAuditLogger();

  const handleDelete = async (category: Category) => {
    try {
      const { error } = await supabase
        .from("chemical_categories")
        .delete()
        .eq("id", category.id);

      if (error) throw error;

      await logUserAction(
        "chemical_categories",
        category.id,
        `Deleted category: ${category.name}`,
        { category_name: category.name }
      );

      toast.success("Category deleted successfully");
      onDelete();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
        <LoaderCircle className="h-8 w-8 animate-spin mb-4" />
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-destructive">
        <AlertCircle className="h-8 w-8 mb-4" />
        <p>Error loading categories</p>
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground border rounded-lg">
        <Inbox className="h-8 w-8 mb-4" />
        <p>No categories found</p>
        <p className="text-sm mt-2">Add a category to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit category</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedCategory(category);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete category</span>
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
              This action cannot be undone. This will permanently delete the
              category
              {selectedCategory && `: ${selectedCategory.name}`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedCategory && handleDelete(selectedCategory)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};