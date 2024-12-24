import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SDSHeader } from "./SDSHeader";
import { SDSTable } from "./SDSTable";
import { SDSFilters } from "./SDSFilters";
import { useState } from "react";

export const SDSManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const { data: sdsDocuments, isLoading } = useQuery({
    queryKey: ["sds-documents", searchQuery, selectedStatus],
    queryFn: async () => {
      let query = supabase
        .from("sds_documents")
        .select(`
          *,
          chemicals (
            name,
            cas_number
          ),
          profiles (
            full_name
          )
        `);

      if (searchQuery) {
        query = query.textSearch('chemicals.name', searchQuery);
      }

      if (selectedStatus !== "all") {
        query = query.eq("status", selectedStatus);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  return (
    <div className="space-y-6">
      <SDSHeader />
      <SDSFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
      />
      <SDSTable documents={sdsDocuments || []} isLoading={isLoading} />
    </div>
  );
};