import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { History, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface SDSVersionHistoryProps {
  chemicalId: string;
}

interface SDSVersion {
  id: string;
  version: string;
  created_at: string;
  uploaded_by: string;
  version_notes: string;
  is_latest: boolean;
  previous_version_id: string;
  file_path: string;
}

export const SDSVersionHistory = ({ chemicalId }: SDSVersionHistoryProps) => {
  const { data: versions, isLoading } = useQuery<SDSVersion[]>({
    queryKey: ["sds-versions", chemicalId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_sds_version_history",
        { p_chemical_id: chemicalId }
      );

      if (error) {
        toast.error("Failed to fetch version history");
        throw error;
      }

      // Get the file paths for each version
      const versionsWithPaths = await Promise.all(
        data.map(async (version) => {
          const { data: sdsDoc, error: sdsError } = await supabase
            .from('sds_documents')
            .select('file_path')
            .eq('id', version.id)
            .single();

          if (sdsError) {
            console.error('Error fetching SDS document:', sdsError);
            return { ...version, file_path: '' };
          }

          return { ...version, file_path: sdsDoc.file_path };
        })
      );

      return versionsWithPaths;
    },
  });

  const handleDownload = async (filePath: string, version: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("sds")
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SDS_v${version}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading SDS:", error);
      toast.error("Failed to download SDS document");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary-purple hover:text-primary-purple/80"
        >
          <History className="h-4 w-4 mr-2" />
          Version History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>SDS Version History</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isLoading ? (
            <p>Loading version history...</p>
          ) : !versions || versions.length === 0 ? (
            <p>No version history available</p>
          ) : (
            <div className="space-y-2">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Version {version.version}</span>
                      {version.is_latest && (
                        <span className="text-xs bg-primary-purple/10 text-primary-purple px-2 py-1 rounded-full">
                          Latest
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Uploaded on {format(new Date(version.created_at), "PPP")}
                    </div>
                    {version.version_notes && (
                      <p className="text-sm mt-2">{version.version_notes}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(version.file_path, version.version)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};