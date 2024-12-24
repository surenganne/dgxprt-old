import { FileText } from "lucide-react";

export const SDSHeader = () => {
  return (
    <div className="flex items-center gap-2">
      <FileText className="h-6 w-6 text-primary-purple" />
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary-purple to-primary-blue bg-clip-text text-transparent">
        SDS Management
      </h2>
    </div>
  );
};