import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Papa from 'papaparse';
import { supabase } from "@/integrations/supabase/client";

interface ExportLocationsProps {
  selectedLocations: string[];
}

export const ExportLocations = ({ selectedLocations }: ExportLocationsProps) => {
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      let query = supabase
        .from('locations')
        .select(`
          id,
          name,
          type,
          description,
          address,
          contact_email,
          contact_phone,
          parent_id,
          status
        `);

      if (selectedLocations.length > 0) {
        query = query.in('id', selectedLocations);
      }

      const { data, error } = await query;

      if (error) throw error;

      const locationsMap = new Map(data.map(loc => [loc.id, loc]));
      const exportData = data.map(location => {
        const parentLocation = location.parent_id ? locationsMap.get(location.parent_id) : null;
        return {
          name: location.name,
          type: location.type,
          description: location.description || '',
          address: location.address || '',
          contact_email: location.contact_email || '',
          contact_phone: location.contact_phone || '',
          parent_name: parentLocation ? parentLocation.name : '',
          status: location.status,
        };
      });

      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', 'locations_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: `${exportData.length} locations exported to CSV.`,
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      className="bg-white hover:bg-gray-50 border-primary-purple/20 text-primary-purple hover:text-primary-purple/80 transition-colors"
    >
      <Download className="mr-2 h-4 w-4" />
      Export Locations
    </Button>
  );
};