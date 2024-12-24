import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type ChemicalHazardClass = Database["public"]["Enums"]["chemical_hazard_class"];

interface ChemicalsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  hazardClass: ChemicalHazardClass | "all";
  onHazardClassChange: (value: ChemicalHazardClass | "all") => void;
}

export const ChemicalsFilters = ({
  searchQuery,
  onSearchChange,
  hazardClass,
  onHazardClassChange,
}: ChemicalsFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search chemicals..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="w-full sm:w-[200px]">
        <Select
          value={hazardClass}
          onValueChange={(value: ChemicalHazardClass | "all") =>
            onHazardClassChange(value)
          }
        >
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by hazard class" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="hazardous">Hazardous</SelectItem>
            <SelectItem value="non_hazardous">Non-Hazardous</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};