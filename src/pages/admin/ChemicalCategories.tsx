import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AdminSidebarContent } from "@/components/admin/AdminSidebarContent";
import { AdminSidebarFooter } from "@/components/admin/AdminSidebarFooter";
import { Button } from "@/components/ui/button";
import { Plus, FolderTree } from "lucide-react";
import { CategoryFormDialog } from "@/components/admin/chemicals/CategoryFormDialog";
import { useQuery } from "@tanstack/react-query";
import { CategoriesTable } from "@/components/admin/chemicals/CategoriesTable";

const ChemicalCategories = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
    description: string | null;
  } | null>(null);

  const { data: categories, refetch, isLoading, error } = useQuery({
    queryKey: ["chemical-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chemical_categories")
        .select("*")
        .order("name");

      if (error) {
        toast.error("Failed to fetch categories");
        throw error;
      }

      return data || [];
    },
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("is_admin, status")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Error checking admin access");
          navigate("/dashboard");
          return;
        }

        if (!profile?.is_admin || profile.status !== "active") {
          toast.error("You don't have admin access");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error in admin access check:", error);
        toast.error("Error checking admin access");
        navigate("/dashboard");
      }
    };

    checkAdminAccess();
  }, [session, navigate]);

  if (!session) {
    return null;
  }

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
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <FolderTree className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Chemical Categories</h2>
              </div>
              <Button
                onClick={() => {
                  setSelectedCategory(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>

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

            <CategoryFormDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              onSuccess={refetch}
              category={selectedCategory}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ChemicalCategories;