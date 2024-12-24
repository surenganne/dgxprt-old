import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SDSHeader } from "./SDSHeader";
import { SDSTable } from "./SDSTable";
import { SDSFilters } from "./SDSFilters";
import { SDSUploadButton } from "./SDSUploadButton";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export const SDSManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const { data: sdsDocuments, isLoading, refetch } = useQuery({
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
          uploader:uploaded_by (
            full_name
          ),
          reviewer:reviewed_by (
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
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">SDS Documents</h2>
            <SDSUploadButton 
              chemicalId="" 
              onSuccess={refetch}
              className="ml-auto"
            />
          </div>
          
          <SDSFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <SDSTable documents={sdsDocuments || []} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};