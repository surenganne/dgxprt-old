import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";

interface LocationFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  parentFilter: string;
  onParentFilterChange: (value: string) => void;
  contactFilter: string;
  onContactFilterChange: (value: string) => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  locations: any[];
}

export function LocationFilters({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  parentFilter,
  onParentFilterChange,
  contactFilter,
  onContactFilterChange,
  dateRange,
  onDateRangeChange,
  locations,
}: LocationFiltersProps) {
  // Get unique parent locations for the filter
  const parentLocations = locations
    ? Array.from(new Set(locations.filter(loc => loc.parent_id).map(loc => {
        const parent = locations.find(l => l.id === loc.parent_id);
        return parent ? { id: parent.id, name: parent.name } : null;
      }).filter(Boolean)))
    : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Search</Label>
          <Input
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="site">Site</SelectItem>
              <SelectItem value="building">Building</SelectItem>
              <SelectItem value="room">Room</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Parent Location</Label>
          <Select value={parentFilter} onValueChange={onParentFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by parent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Parents</SelectItem>
              <SelectItem value="none">No Parent</SelectItem>
              {parentLocations.map((parent: any) => (
                <SelectItem key={parent.id} value={parent.id}>
                  {parent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Contact Information</Label>
          <Input
            placeholder="Search by email or phone..."
            value={contactFilter}
            onChange={(e) => onContactFilterChange(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <Label>Date Range</Label>
          <DatePickerWithRange
            date={dateRange}
            onDateChange={onDateRangeChange}
          />
        </div>
      </div>
    </div>
  );
}