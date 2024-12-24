import { useState } from "react";
import { LocationFormDialog } from "./LocationFormDialog";
import { LocationHeader } from "./location/LocationHeader";
import { LocationFilters } from "./location/LocationFilters";
import { LocationTable } from "./location/LocationTable";
import { LocationBatchActions } from "./location/LocationBatchActions";
import { useLocations } from "@/hooks/useLocations";
import { useLocationActions } from "@/hooks/useLocationActions";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { isWithinInterval, parseISO } from "date-fns";

export const LocationManagement = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [parentFilter, setParentFilter] = useState("all");
  const [contactFilter, setContactFilter] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const itemsPerPage = 10;

  const { data: locations, refetch } = useLocations();
  const { 
    isLoading, 
    handleDeleteLocation, 
    handleToggleStatus,
    handleBatchDelete,
    handleBatchUpdateStatus
  } = useLocationActions(refetch);

  const handleEdit = (location: any) => {
    setSelectedLocation(location);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedLocation(null);
    setDialogOpen(true);
  };

  const handleSelectLocation = (locationId: string, isSelected: boolean) => {
    setSelectedLocations(prev => 
      isSelected 
        ? [...prev, locationId]
        : prev.filter(id => id !== locationId)
    );
  };

  const handleSelectAll = (isSelected: boolean) => {
    setSelectedLocations(
      isSelected ? filteredLocations?.map(location => location.id) || [] : []
    );
  };

  // Filter locations based on all criteria
  const filteredLocations = locations?.filter((location) => {
    const matchesSearch =
      !searchTerm ||
      location.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" || location.type === typeFilter;

    const matchesStatus =
      statusFilter === "all" || location.status === statusFilter;

    const matchesParent =
      parentFilter === "all" ||
      (parentFilter === "none" && !location.parent_id) ||
      location.parent_id === parentFilter;

    const matchesContact =
      !contactFilter ||
      (location.contact_email &&
        location.contact_email.toLowerCase().includes(contactFilter.toLowerCase())) ||
      (location.contact_phone &&
        location.contact_phone.includes(contactFilter));

    const matchesDateRange =
      !dateRange.from ||
      !dateRange.to ||
      isWithinInterval(parseISO(location.created_at), {
        start: dateRange.from,
        end: dateRange.to,
      });

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesParent &&
      matchesContact &&
      matchesDateRange
    );
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
      
      <LocationBatchActions 
        selectedLocations={selectedLocations}
        onBatchDelete={handleBatchDelete}
        onBatchUpdateStatus={handleBatchUpdateStatus}
      />

      <LocationFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        parentFilter={parentFilter}
        onParentFilterChange={setParentFilter}
        contactFilter={contactFilter}
        onContactFilterChange={setContactFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        locations={locations || []}
      />

      <LocationTable
        locations={paginatedLocations}
        onEdit={handleEdit}
        onDelete={handleDeleteLocation}
        onToggleStatus={handleToggleStatus}
        isLoading={isLoading}
        selectedLocations={selectedLocations}
        onSelectLocation={handleSelectLocation}
        onSelectAll={handleSelectAll}
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