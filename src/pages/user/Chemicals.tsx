import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { UserLayout } from "@/components/user/UserLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Beaker } from "lucide-react";
import { ChemicalsFilters } from "@/components/admin/chemicals/ChemicalsFilters";
import { ChemicalsTable } from "@/components/admin/chemicals/ChemicalsTable";
import { ChemicalsPagination } from "@/components/admin/chemicals/ChemicalsPagination";
import type { Chemical } from "@/types/chemical";
import type { Database } from "@/integrations/supabase/types";

type ChemicalHazardClass = Database["public"]["Enums"]["chemical_hazard_class"];

const ITEMS_PER_PAGE = 10;

const UserChemicals = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [hazardClass, setHazardClass] = useState<ChemicalHazardClass | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: categories } = useQuery({
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

  const { data: chemicalsData, isLoading } = useQuery({
    queryKey: ["chemicals", currentPage, searchQuery, hazardClass, selectedCategory],
    queryFn: async () => {
      let query = supabase.from("chemicals").select("*", { count: "exact" });

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      if (hazardClass !== "all") {
        query = query.eq("hazard_class", hazardClass);
      }

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      const countQuery = await query;

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
    setCurrentPage(1);
  };

  const handleHazardClassChange = (value: ChemicalHazardClass | "all") => {
    setHazardClass(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!session?.user) {
      navigate("/auth");
    }
  }, [session, navigate]);

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-purple/5 to-primary-blue/5 p-8 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2">
            <Beaker className="h-6 w-6 text-primary-purple" />
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary-purple to-primary-blue bg-clip-text text-transparent">
              Chemical Register
            </h2>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-gray-100 shadow-sm">
          <ChemicalsFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            hazardClass={hazardClass}
            onHazardClassChange={handleHazardClassChange}
            categories={categories || []}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-purple mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading chemicals...</p>
          </div>
        ) : chemicalsData?.chemicals?.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No chemicals found matching your criteria.
          </p>
        ) : (
          <>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm overflow-hidden">
              <ChemicalsTable
                chemicals={chemicalsData?.chemicals || []}
                onEdit={() => {}}
                onDelete={() => {}}
                selectedChemicals={[]}
                onSelectionChange={() => {}}
                readOnly
              />
            </div>
            <ChemicalsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </UserLayout>
  );
};

export default UserChemicals;