import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, FolderTree } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type ChemicalHazardClass = Database["public"]["Enums"]["chemical_hazard_class"];

interface Category {
  id: string;
  name: string;
}

interface ChemicalsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  hazardClass: ChemicalHazardClass | "all";
  onHazardClassChange: (value: ChemicalHazardClass | "all") => void;
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export const ChemicalsFilters = ({
  searchQuery,
  onSearchChange,
  hazardClass,
  onHazardClassChange,
  categories,
  selectedCategory,
  onCategoryChange,
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
      <div className="w-full sm:w-[200px]">
        <Select
          value={selectedCategory}
          onValueChange={(value: string) => onCategoryChange(value)}
        >
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <FolderTree className="h-4 w-4" />
              <SelectValue placeholder="Filter by category" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};