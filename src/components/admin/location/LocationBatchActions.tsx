import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Papa from 'papaparse';

export const LocationBatchActions = () => {
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      Papa.parse(file, {
        complete: (results) => {
          // TODO: Implement batch import logic
          console.log('Parsed CSV:', results.data);
          toast({
            title: "Import successful",
            description: "Locations have been imported successfully.",
          });
        },
        error: (error) => {
          toast({
            title: "Import failed",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    } finally {
      setImporting(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement export logic
    toast({
      title: "Export started",
      description: "Your locations export will begin shortly.",
    });
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
    </div>
  );
};