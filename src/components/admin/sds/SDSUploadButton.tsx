import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuditLogger } from "@/hooks/useAuditLogger";

interface SDSUploadButtonProps {
  chemicalId: string;
  onSuccess: () => void;
}

export const SDSUploadButton = ({ chemicalId, onSuccess }: SDSUploadButtonProps) => {
  const [uploading, setUploading] = useState(false);
  const { logUserAction } = useAuditLogger();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${chemicalId}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('sds')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create SDS document record
      const { error: dbError } = await supabase
        .from('sds_documents')
        .insert({
          chemical_id: chemicalId,
          version: '1.0', // Default version
          file_path: filePath,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (dbError) throw dbError;

      await logUserAction(
        "sds_documents",
        chemicalId,
        `Uploaded SDS document for chemical`,
        { file_name: file.name }
      );

      toast.success('SDS document uploaded successfully');
      onSuccess();
    } catch (error) {
      console.error('Error uploading SDS:', error);
      toast.error('Failed to upload SDS document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="border-primary-purple/20 hover:bg-primary-purple/10 text-primary-purple"
      disabled={uploading}
      onClick={() => document.getElementById('sds-upload')?.click()}
    >
      <Upload className="mr-2 h-4 w-4" />
      {uploading ? 'Uploading...' : 'Upload SDS'}
      <input
        id="sds-upload"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </Button>
  );
};