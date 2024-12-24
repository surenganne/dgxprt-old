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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 10;

const Chemicals = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: chemicalsData, refetch } = useQuery({
    queryKey: ["chemicals"],
    queryFn: async () => {
      const { data: totalCount } = await supabase
        .from("chemicals")
        .select("id", { count: "exact", head: true });

      const { data: chemicals, error } = await supabase
        .from("chemicals")
        .select("*")
        .order("name")
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);
      
      if (error) {
        toast.error("Failed to fetch chemicals");
        throw error;
      }
      
      return {
        chemicals,
        totalCount: totalCount?.count || 0
      };
    },
  });

  const totalPages = Math.ceil((chemicalsData?.totalCount || 0) / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

        if (!profile?.is_admin || profile.status !== 'active') {
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
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Chemical
              </Button>
            </div>

            {chemicalsData?.chemicals?.length === 0 ? (
              <p className="text-muted-foreground">
                No chemicals found. Click the button above to add one.
              </p>
            ) : (
              <>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>CAS Number</TableHead>
                        <TableHead>Hazard Class</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chemicalsData?.chemicals?.map((chemical) => (
                        <TableRow key={chemical.id}>
                          <TableCell>{chemical.name}</TableCell>
                          <TableCell>{chemical.cas_number || "-"}</TableCell>
                          <TableCell className="capitalize">
                            {chemical.hazard_class.replace("_", " ")}
                          </TableCell>
                          <TableCell>{chemical.description || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}

            <ChemicalFormDialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onSuccess={refetch}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Chemicals;