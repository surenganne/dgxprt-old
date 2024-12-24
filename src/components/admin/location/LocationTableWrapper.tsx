import { Table, TableBody } from "@/components/ui/table";
import { LocationTableHeader } from "./LocationTableHeader";
import { LocationTableRow } from "./LocationTableRow";

interface LocationTableWrapperProps {
  locations: any[];
  isLoading: boolean;
  onEdit: (location: any) => void;
  onDelete: (locationId: string) => void;
  onToggleStatus: (location: any) => void;
  selectedLocations: string[];
  onSelectLocation: (locationId: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
}

export const LocationTableWrapper = ({
  locations,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
  selectedLocations,
  onSelectLocation,
  onSelectAll,
}: LocationTableWrapperProps) => {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm overflow-hidden">
      <Table>
        <LocationTableHeader
          onSelectAll={onSelectAll}
          areAllSelected={locations?.length > 0 && selectedLocations.length === locations.length}
          areSomeSelected={selectedLocations.length > 0 && selectedLocations.length < (locations?.length || 0)}
        />
        <TableBody>
          {locations?.map((location) => (
            <LocationTableRow
              key={location.id}
              location={location}
              isLoading={isLoading}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
              isSelected={selectedLocations.includes(location.id)}
              onSelect={onSelectLocation}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};