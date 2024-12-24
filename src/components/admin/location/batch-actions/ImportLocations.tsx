import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Papa from 'papaparse';
import { supabase } from "@/integrations/supabase/client";
import { LocationImportData } from "./types";

export const ImportLocations = () => {
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);

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
            for (const location of validLocations) {
              const { parent_name, ...locationData } = location;
              const { error } = await supabase
                .from('locations')
                .insert([locationData]);
              
              if (error) throw error;
            }

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

  return (
    <>
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
        className="bg-white hover:bg-gray-50 border-primary-purple/20 text-primary-purple hover:text-primary-purple/80 transition-colors"
      >
        <Upload className="mr-2 h-4 w-4" />
        Import Locations
      </Button>
    </>
  );
};