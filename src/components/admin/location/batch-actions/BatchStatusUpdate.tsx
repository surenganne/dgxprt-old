import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";

interface BatchStatusUpdateProps {
  selectedLocations: string[];
  onBatchUpdateStatus: (locationIds: string[], newStatus: string) => Promise<void>;
}

export const BatchStatusUpdate = ({
  selectedLocations,
  onBatchUpdateStatus,
}: BatchStatusUpdateProps) => {
  return (
    <>
      <Button 
        variant="outline"
        onClick={() => onBatchUpdateStatus(selectedLocations, 'active')}
        className="bg-white hover:bg-gray-50 border-primary-purple/20 text-primary-purple hover:text-primary-purple/80 transition-colors"
      >
        <Power className="mr-2 h-4 w-4" />
        Activate Selected
      </Button>
      <Button 
        variant="outline"
        onClick={() => onBatchUpdateStatus(selectedLocations, 'inactive')}
        className="bg-white hover:bg-gray-50 border-primary-purple/20 text-primary-purple hover:text-primary-purple/80 transition-colors"
      >
        <Power className="mr-2 h-4 w-4" />
        Deactivate Selected
      </Button>
    </>
  );
};