import { Button } from "@/components/ui/button";
import type { Chemical } from "@/types/chemical";

interface ChemicalsBatchActionsProps {
  selectedChemicals: Chemical[];
  onBulkUpdate: () => void;
}

export const ChemicalsBatchActions = ({ 
  selectedChemicals, 
  onBulkUpdate 
}: ChemicalsBatchActionsProps) => {
  if (selectedChemicals.length === 0) return null;

  return (
    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-gray-100 shadow-sm mb-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {selectedChemicals.length} chemicals selected
        </span>
        <Button
          variant="outline"
          onClick={onBulkUpdate}
          className="border-primary-purple/20 hover:bg-primary-purple/10 text-primary-purple"
        >
          Update Category ({selectedChemicals.length})
        </Button>
      </div>
    </div>
  );
};