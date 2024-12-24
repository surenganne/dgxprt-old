import { Button } from "@/components/ui/button";
import { Plus, Beaker } from "lucide-react";

interface ChemicalsHeaderProps {
  onAdd: () => void;
  onManageCategories: () => void;
}

export const ChemicalsHeader = ({ onAdd, onManageCategories }: ChemicalsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Beaker className="h-6 w-6 text-primary-purple" />
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary-purple to-primary-blue bg-clip-text text-transparent">
          Chemical Management
        </h2>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={onManageCategories}
          className="border-primary-purple/20 hover:bg-primary-purple/10 text-primary-purple"
        >
          Manage Categories
        </Button>
        <Button
          onClick={onAdd}
          className="bg-primary-purple hover:bg-primary-purple/90 text-white transition-colors duration-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Chemical
        </Button>
      </div>
    </div>
  );
};