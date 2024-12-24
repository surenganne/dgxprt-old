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
import { Plus, Beaker } from "lucide-react";
import { ChemicalFormDialog } from "@/components/admin/ChemicalFormDialog";
import { useQuery } from "@tanstack/react-query";
import { ChemicalsTable } from "@/components/admin/chemicals/ChemicalsTable";
import { ChemicalsPagination } from "@/components/admin/chemicals/ChemicalsPagination";
import { ChemicalsFilters } from "@/components/admin/chemicals/ChemicalsFilters";
import type { Chemical, ChemicalsResponse } from "@/types/chemical";
import type { Database } from "@/integrations/supabase/types";

const ITEMS_PER_PAGE = 10;
type ChemicalHazardClass = Database["public"]["Enums"]["chemical_hazard_class"];

const Chemicals = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [hazardClass, setHazardClass] = useState<ChemicalHazardClass | "all">("all");
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(null);

  const { data: chemicalsData, refetch } = useQuery({
    queryKey: ["chemicals", currentPage, searchQuery, hazardClass],
    queryFn: async () => {
      let query = supabase
        .from("chemicals")
        .select("*", { count: "exact" });

      // Apply search filter if search query exists
      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      // Apply hazard class filter if selected
      if (hazardClass !== "all") {
        query = query.eq("hazard_class", hazardClass);
      }

      // Get total count
      const countQuery = await query;

      // Get paginated results
      const { data: chemicals, error } = await query
        .order("name")
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (error) {
        toast.error("Failed to fetch chemicals");
        throw error;
      }

      return {
        chemicals: chemicals || [],
        totalCount: countQuery.count || 0,
      };
    },
  });

  const totalPages = Math.ceil((chemicalsData?.totalCount || 0) / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleHazardClassChange = (value: ChemicalHazardClass | "all") => {
    setHazardClass(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleEditChemical = (chemical: Chemical) => {
    setSelectedChemical(chemical);
    setDialogOpen(true);
  };

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
        <Sidebar
          className="bg-primary-blue transition-all duration-300 ease-in-out"
          variant="sidebar"
          collapsible="icon"
        >
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
                <Beaker className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Chemical Management</h2>
              </div>
              <Button onClick={() => {
                setSelectedChemical(null);
                setDialogOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Chemical
              </Button>
            </div>

            <ChemicalsFilters
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              hazardClass={hazardClass}
              onHazardClassChange={handleHazardClassChange}
            />

            {chemicalsData?.chemicals?.length === 0 ? (
              <p className="text-muted-foreground">
                No chemicals found. Click the button above to add one.
              </p>
            ) : (
              <>
                <ChemicalsTable
                  chemicals={chemicalsData?.chemicals || []}
                  onEdit={handleEditChemical}
                  onDelete={refetch}
                />
                <ChemicalsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}

            <ChemicalFormDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              onSuccess={refetch}
              chemical={selectedChemical}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Chemicals;