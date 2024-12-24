import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Upload, Download, Trash2, Power } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Papa from 'papaparse';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

interface LocationBatchActionsProps {
  selectedLocations: string[];
  onBatchDelete: (locationIds: string[]) => Promise<void>;
  onBatchUpdateStatus: (locationIds: string[], newStatus: string) => Promise<void>;
}

interface LocationImportData {
  name: string;
  type: string;
  description?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  parent_name?: string;
}

export const LocationBatchActions = ({
  selectedLocations,
  onBatchDelete,
  onBatchUpdateStatus,
}: LocationBatchActionsProps) => {
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();
  
  const validateLocationData = (data: LocationImportData): string[] => {
    const errors: string[] = [];
    
    if (!data.name) errors.push("Name is required");
    if (!data.type) errors.push("Type is required");
    if (data.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email)) {
      errors.push("Invalid email format");
    }
    if (data.contact_phone && !/^\+?[\d\s-()]+$/.test(data.contact_phone)) {
      errors.push("Invalid phone format");
    }
    
    return errors;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const importErrors: { row: number; errors: string[] }[] = [];
          const validLocations: LocationImportData[] = [];
          
          results.data.forEach((row: any, index: number) => {
            const errors = validateLocationData(row);
            if (errors.length > 0) {
              importErrors.push({ row: index + 1, errors });
            } else {
              validLocations.push(row);
            }
          });

          if (importErrors.length > 0) {
            toast({
              title: "Import validation failed",
              description: `Found ${importErrors.length} errors in the import file`,
              variant: "destructive",
            });
            console.error("Import validation errors:", importErrors);
            return;
          }

          try {
            // First pass: Create locations without parent relationships
            for (const location of validLocations) {
              const { parent_name, ...locationData } = location;
              const { error } = await supabase
                .from('locations')
                .insert([locationData]);
              
              if (error) throw error;
            }

            // Second pass: Update parent relationships
            for (const location of validLocations) {
              if (location.parent_name) {
                const { data: parentLocation } = await supabase
                  .from('locations')
                  .select('id')
                  .eq('name', location.parent_name)
                  .single();

                if (parentLocation) {
                  const { error } = await supabase
                    .from('locations')
                    .update({ parent_id: parentLocation.id })
                    .eq('name', location.name);
                  
                  if (error) throw error;
                }
              }
            }

            toast({
              title: "Import successful",
              description: `Successfully imported ${validLocations.length} locations.`,
            });
          } catch (error: any) {
            toast({
              title: "Import failed",
              description: error.message,
              variant: "destructive",
            });
          }
        },
        error: (error) => {
          toast({
            title: "CSV parsing failed",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

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

      // Transform data to include parent names
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

  const handleBatchDelete = async () => {
    try {
      await onBatchDelete(selectedLocations);
      toast({
        title: "Locations deleted",
        description: `Successfully deleted ${selectedLocations.length} locations.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete locations.",
        variant: "destructive",
      });
    }
  };

  const handleBatchActivate = async () => {
    try {
      await onBatchUpdateStatus(selectedLocations, "active");
      toast({
        title: "Locations activated",
        description: `Successfully activated ${selectedLocations.length} locations.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate locations.",
        variant: "destructive",
      });
    }
  };

  const handleBatchDeactivate = async () => {
    try {
      await onBatchUpdateStatus(selectedLocations, "inactive");
      toast({
        title: "Locations deactivated",
        description: `Successfully deactivated ${selectedLocations.length} locations.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate locations.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
        id="location-import"
      />
      <Button
        variant="outline"
        onClick={() => document.getElementById('location-import')?.click()}
        disabled={importing}
      >
        <Upload className="mr-2 h-4 w-4" />
        Import Locations
      </Button>
      <Button variant="outline" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        Export Locations
      </Button>

      {selectedLocations.length > 0 && (
        <>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedLocations.length})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the selected locations.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onBatchDelete(selectedLocations)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button 
            variant="outline" 
            onClick={() => onBatchUpdateStatus(selectedLocations, 'active')}
          >
            <Power className="mr-2 h-4 w-4" />
            Activate Selected
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onBatchUpdateStatus(selectedLocations, 'inactive')}
          >
            <Power className="mr-2 h-4 w-4" />
            Deactivate Selected
          </Button>
        </>
      )}
    </div>
  );
};
