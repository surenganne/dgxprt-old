import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface LocationHeaderProps {
  onAdd: () => void;
}

export const LocationHeader = ({ onAdd }: LocationHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Location Management</h2>
      <Button onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" />
        Add Location
      </Button>
    </div>
  );
};