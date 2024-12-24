import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface LocationHeaderProps {
  onAdd: () => void;
}

export const LocationHeader = ({ onAdd }: LocationHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary-purple to-primary-blue bg-clip-text text-transparent">
        Location Management
      </h2>
      <Button 
        onClick={onAdd}
        className="bg-primary-purple hover:bg-primary-purple/90 text-white transition-colors duration-200"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Location
      </Button>
    </div>
  );
};