import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SDSListProps {
  chemicalId: string;
}

export const SDSList = ({ chemicalId }: SDSListProps) => {
  const { data: documents, isLoading } = useQuery({
    queryKey: ["sds-documents", chemicalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sds_documents")
        .select("*")
        .eq("chemical_id", chemicalId)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to fetch SDS documents");
        throw error;
      }

      return data || [];
    },
  });

  const handleDownload = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("sds")
        .download(filePath);

      if (error) throw error;

      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = filePath.split("/").pop() || "sds-document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading SDS:", error);
      toast.error("Failed to download SDS document");
    }
  };

  if (isLoading) {
    return <div>Loading SDS documents...</div>;
  }

  if (!documents?.length) {
    return <div className="text-sm text-gray-500">No SDS documents available</div>;
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-2 rounded-md bg-gray-50"
        >
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-primary-purple" />
            <span className="text-sm">Version {doc.version}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDownload(doc.file_path)}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};