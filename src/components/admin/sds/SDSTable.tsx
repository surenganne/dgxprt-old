import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SDSVersionHistory } from "./SDSVersionHistory";
import { SDSReviewDialog } from "./SDSReviewDialog";

interface SDSTableProps {
  documents: any[];
  isLoading: boolean;
}

export const SDSTable = ({ documents, isLoading }: SDSTableProps) => {
  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("sds")
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading SDS:", error);
      toast.error("Failed to download SDS document");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      pending_review: "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-800",
      archived: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={variants[status]}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return null;

    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (daysUntilExpiry <= 30) {
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-700">
          Expires Soon
        </Badge>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Chemical Name</TableHead>
            <TableHead>CAS Number</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.chemicals?.name}</TableCell>
              <TableCell>{doc.chemicals?.cas_number}</TableCell>
              <TableCell>{doc.version}</TableCell>
              <TableCell>{getStatusBadge(doc.status)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>
                    {doc.expiry_date
                      ? format(new Date(doc.expiry_date), "MMM d, yyyy")
                      : "No expiry date"}
                  </span>
                  {getExpiryStatus(doc.expiry_date)}
                </div>
              </TableCell>
              <TableCell>{doc.profiles?.full_name}</TableCell>
              <TableCell>
                {format(new Date(doc.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleDownload(
                        doc.file_path,
                        `${doc.chemicals?.name}_SDS_v${doc.version}.pdf`
                      )
                    }
                    className="text-primary-purple hover:text-primary-purple/80 hover:bg-primary-purple/10"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <SDSVersionHistory chemicalId={doc.chemical_id} />
                  <SDSReviewDialog documentId={doc.id} currentStatus={doc.status} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};