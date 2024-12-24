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

interface LocationBatchActionsProps {
  selectedLocations: string[];
  onBatchDelete: (locationIds: string[]) => Promise<void>;
  onBatchUpdateStatus: (locationIds: string[], newStatus: string) => Promise<void>;
}

export const LocationBatchActions = ({
  selectedLocations,
  onBatchDelete,
  onBatchUpdateStatus,
}: LocationBatchActionsProps) => {
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
                <AlertDialogAction onClick={handleBatchDelete}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button variant="outline" onClick={handleBatchActivate}>
            <Power className="mr-2 h-4 w-4" />
            Activate Selected
          </Button>
          <Button variant="outline" onClick={handleBatchDeactivate}>
            <Power className="mr-2 h-4 w-4" />
            Deactivate Selected
          </Button>
        </>
      )}
    </div>
  );
};