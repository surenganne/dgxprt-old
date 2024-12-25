import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { Chemical } from "@/types/chemical";

interface RiskAssessmentReviewDialogProps {
  assessment: any;
  chemical: Chemical;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const RiskAssessmentReviewDialog = ({
  assessment,
  chemical,
  open,
  onOpenChange,
  onSuccess,
}: RiskAssessmentReviewDialogProps) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: assessment.status,
    review_comments: assessment.review_comments || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("risk_assessments")
        .update({
          status: formData.status,
          review_comments: formData.review_comments,
          reviewed_by: session.user.id,
          review_date: new Date().toISOString(),
        })
        .eq("id", assessment.id);

      if (error) throw error;

      toast.success("Risk assessment review submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["risk-assessments"] });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating risk assessment:", error);
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>Review Risk Assessment for {chemical.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="requires_revision">Requires Revision</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="review_comments">Review Comments</Label>
            <Textarea
              id="review_comments"
              value={formData.review_comments}
              onChange={(e) =>
                setFormData({ ...formData, review_comments: e.target.value })
              }
              placeholder="Enter your review comments..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};