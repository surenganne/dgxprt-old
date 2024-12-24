import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LocationFormDialog } from "./LocationFormDialog";
import { LocationHeader } from "./location/LocationHeader";
import { LocationFilters } from "./location/LocationFilters";
import { LocationTable } from "./location/LocationTable";
import { LocationBatchActions } from "./location/LocationBatchActions";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

export const LocationManagement = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: locations, refetch } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching locations",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data;
    },
  });

  const handleDeleteLocation = async (locationId: string) => {
    setIsLoading(true);
    const { error } = await supabase
      .from("locations")
      .delete()
      .eq("id", locationId);

    if (error) {
      toast({
        title: "Error deleting location",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Location deleted successfully",
        description: "The location has been removed from the system.",
      });
      refetch();
    }
    setIsLoading(false);
  };

  const handleToggleStatus = async (location: any) => {
    setIsLoading(true);
    const newStatus = location.status === "active" ? "inactive" : "active";
    
    const { error } = await supabase
      .from("locations")
      .update({ status: newStatus })
      .eq("id", location.id);

    if (error) {
      toast({
        title: "Error updating location status",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Location status updated",
        description: `Location is now ${newStatus}.`,
      });
      refetch();
    }
    setIsLoading(false);
  };

  const handleEdit = (location: any) => {
    setSelectedLocation(location);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedLocation(null);
    setDialogOpen(true);
  };

  // Filter locations based on search term, type filter, and status filter
  const filteredLocations = locations?.filter((location) => {
    const matchesSearch =
      !searchTerm ||
      location.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" || location.type === typeFilter;

    const matchesStatus =
      statusFilter === "all" || location.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil((filteredLocations?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLocations = filteredLocations?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-4">
      <LocationHeader onAdd={handleAdd} />
      
      <LocationBatchActions />

      <LocationFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <LocationTable
        locations={paginatedLocations}
        onEdit={handleEdit}
        onDelete={handleDeleteLocation}
        onToggleStatus={handleToggleStatus}
        isLoading={isLoading}
      />

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <LocationFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={refetch}
        initialData={selectedLocation}
      />
    </div>
  );
};