import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface LocationTableHeaderProps {
  onSelectAll: (isSelected: boolean) => void;
  areAllSelected: boolean;
  areSomeSelected: boolean;
}

export const LocationTableHeader = ({
  onSelectAll,
  areAllSelected,
  areSomeSelected,
}: LocationTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow className="bg-gray-50/50 hover:bg-gray-50/70 transition-colors">
        <TableHead className="w-[50px]">
          <Checkbox
            checked={areAllSelected}
            indeterminate={areSomeSelected}
            onCheckedChange={(checked) => onSelectAll(checked as boolean)}
            aria-label="Select all"
          />
        </TableHead>
        <TableHead className="text-primary-purple font-medium">Name</TableHead>
        <TableHead className="text-primary-purple font-medium">Type</TableHead>
        <TableHead className="text-primary-purple font-medium">Parent Location</TableHead>
        <TableHead className="text-primary-purple font-medium">Status</TableHead>
        <TableHead className="text-primary-purple font-medium">Created At</TableHead>
        <TableHead className="text-right text-primary-purple font-medium">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};