import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface SDSFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

export const SDSFilters = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}: SDSFiltersProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          placeholder="Search chemicals..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending_review">Pending Review</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};