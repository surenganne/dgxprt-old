import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryFormDialog } from "@/components/admin/chemicals/CategoryFormDialog";
import { CategoriesTable } from "@/components/admin/chemicals/CategoriesTable";
import { Button } from "@/components/ui/button";
import { FolderTree, Plus } from "lucide-react";
import { Sidebar, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebarContent } from "@/components/admin/AdminSidebarContent";
import { AdminSidebarFooter } from "@/components/admin/AdminSidebarFooter";

const ChemicalCategories = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { data: categories, isLoading, error, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="bg-primary-blue transition-all duration-300 ease-in-out">
          <SidebarHeader className="p-4 border-b border-border/10 bg-white flex justify-center">
            <img
              src="/dg-text-logo.png"
              alt="DGXPRT Logo"
              className="h-10 w-auto object-contain group-data-[state=collapsed]:hidden"
            />
            <img
              src="/dg-only-logo.png"
              alt="DGXPRT Icon"
              className="h-10 w-10 hidden group-data-[state=collapsed]:block object-contain"
            />
          </SidebarHeader>
          <AdminSidebarContent />
          <AdminSidebarFooter />
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FolderTree className="h-6 w-6 text-primary-purple" />
                  <h2 className="text-2xl font-semibold text-primary-blue">
                    Chemical Categories
                  </h2>
                </div>
                <Button
                  onClick={() => {
                    setSelectedCategory(null);
                    setDialogOpen(true);
                  }}
                  className="bg-primary-purple hover:bg-primary-purple/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </div>

              <div className="bg-white rounded-lg border">
                <CategoriesTable
                  categories={categories || []}
                  onEdit={(category) => {
                    setSelectedCategory(category);
                    setDialogOpen(true);
                  }}
                  onDelete={refetch}
                  isLoading={isLoading}
                  error={error as Error}
                />
              </div>

              <CategoryFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                category={selectedCategory}
                onSuccess={() => {
                  refetch();
                  setDialogOpen(false);
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ChemicalCategories;
