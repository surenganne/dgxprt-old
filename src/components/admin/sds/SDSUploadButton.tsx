import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SDSUploadButtonProps {
  chemicalId: string;
  onSuccess: () => void;
  currentVersion?: string;
}

export const SDSUploadButton = ({ 
  chemicalId, 
  onSuccess,
  currentVersion 
}: SDSUploadButtonProps) => {
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [versionNotes, setVersionNotes] = useState("");
  const { logUserAction } = useAuditLogger();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Get the previous version if it exists
      const { data: previousVersion } = await supabase
        .from('sds_documents')
        .select('id')
        .eq('chemical_id', chemicalId)
        .eq('is_latest', true)
        .single();

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${chemicalId}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('sds')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Calculate new version number
      const newVersion = currentVersion 
        ? (parseFloat(currentVersion) + 0.1).toFixed(1)
        : '1.0';

      // Create SDS document record
      const { error: dbError } = await supabase
        .from('sds_documents')
        .insert({
          chemical_id: chemicalId,
          version: newVersion,
          file_path: filePath,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id,
          expiry_date: expiryDate || null,
          version_notes: versionNotes,
          previous_version_id: previousVersion?.id || null,
        });

      if (dbError) throw dbError;

      await logUserAction(
        "sds_documents",
        chemicalId,
        `Uploaded new SDS version ${newVersion}`,
        { file_name: file.name }
      );

      toast.success('SDS document uploaded successfully');
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error('Error uploading SDS:', error);
      toast.error('Failed to upload SDS document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-primary-purple/20 hover:bg-primary-purple/10 text-primary-purple"
          disabled={uploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload SDS'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload New SDS Version</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expiry-date">Expiry Date</Label>
            <Input
              id="expiry-date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="version-notes">Version Notes</Label>
            <Textarea
              id="version-notes"
              placeholder="Enter any notes about this version..."
              value={versionNotes}
              onChange={(e) => setVersionNotes(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sds-upload">Select File</Label>
            <Input
              id="sds-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};