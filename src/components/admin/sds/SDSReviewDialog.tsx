import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, X, ClipboardCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface SDSReviewDialogProps {
  documentId: string;
  currentStatus: string;
}

export const SDSReviewDialog = ({ documentId, currentStatus }: SDSReviewDialogProps) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const handleReview = async (status: "active" | "archived") => {
    try {
      const { error } = await supabase.rpc("review_sds_document", {
        p_document_id: documentId,
        p_reviewer_id: (await supabase.auth.getUser()).data.user?.id,
        p_status: status,
        p_comment: comment,
      });

      if (error) throw error;

      toast.success(`SDS document ${status === "active" ? "approved" : "rejected"}`);
      queryClient.invalidateQueries({ queryKey: ["sds-documents"] });
      setOpen(false);
    } catch (error) {
      console.error("Error reviewing SDS:", error);
      toast.error("Failed to review SDS document");
    }
  };

  if (currentStatus !== "pending_review") {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ClipboardCheck className="h-4 w-4 mr-2" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review SDS Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Review Comment
            </label>
            <Textarea
              id="comment"
              placeholder="Enter your review comments..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => handleReview("archived")}
              className="bg-red-50 hover:bg-red-100 text-red-600"
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => handleReview("active")}
              className="bg-green-50 hover:bg-green-100 text-green-600"
            >
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};