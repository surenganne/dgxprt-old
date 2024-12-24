import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LocationFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
}

export const LocationFilters = ({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}: LocationFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        placeholder="Search locations..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full"
      />
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="country">Country</SelectItem>
          <SelectItem value="state">State</SelectItem>
          <SelectItem value="district">District</SelectItem>
          <SelectItem value="school">School</SelectItem>
          <SelectItem value="site">Site</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};