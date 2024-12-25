import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { RiskAssessmentReviewDialog } from "./RiskAssessmentReviewDialog";
import { useSession } from "@supabase/auth-helpers-react";
import type { Chemical } from "@/types/chemical";

interface RiskAssessmentListProps {
  chemicalId: string;
  chemical: Chemical;
}

export const RiskAssessmentList = ({ chemicalId, chemical }: RiskAssessmentListProps) => {
  const session = useSession();
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: assessments, isLoading } = useQuery({
    queryKey: ["risk-assessments", chemicalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("risk_assessments")
        .select(
          `
          *,
          assessed_by:profiles!risk_assessments_assessed_by_fkey(full_name),
          reviewed_by:profiles!risk_assessments_reviewed_by_fkey(full_name)
        `
        )
        .eq("chemical_id", chemicalId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleReview = (assessment: any) => {
    setSelectedAssessment(assessment);
    setReviewOpen(true);
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading assessments...</div>;
  }

  if (!assessments?.length) {
    return (
      <div className="text-sm text-gray-500">No risk assessments available.</div>
    );
  }

  const canReview = profile?.is_admin || profile?.is_compliance_officer;

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending_review":
        return "bg-yellow-100 text-yellow-800";
      case "requires_revision":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {assessments.map((assessment) => (
        <div
          key={assessment.id}
          className="border rounded-lg p-4 space-y-2 bg-white/50"
        >
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={getRiskLevelColor(assessment.risk_level)}>
              {assessment.risk_level.toUpperCase()} RISK
            </Badge>
            <span className="text-sm text-gray-500">
              {format(new Date(assessment.created_at), "MMM d, yyyy")}
            </span>
          </div>
          
          <div className="text-sm">
            <p className="font-medium">Hazard Description:</p>
            <p className="text-gray-600">{assessment.hazard_description}</p>
          </div>

          {assessment.review_comments && (
            <div className="text-sm">
              <p className="font-medium">Review Comments:</p>
              <p className="text-gray-600">{assessment.review_comments}</p>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              By: {assessment.assessed_by.full_name}
              {assessment.reviewed_by && (
                <span className="ml-2">
                  | Reviewed by: {assessment.reviewed_by.full_name}
                </span>
              )}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getStatusColor(assessment.status)}>
                {assessment.status.toUpperCase().replace("_", " ")}
              </Badge>
              {canReview && assessment.status !== "draft" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReview(assessment)}
                  className="ml-2"
                >
                  Review
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}

      {selectedAssessment && (
        <RiskAssessmentReviewDialog
          assessment={selectedAssessment}
          chemical={chemical}
          open={reviewOpen}
          onOpenChange={setReviewOpen}
          onSuccess={() => {
            setSelectedAssessment(null);
          }}
        />
      )}
    </div>
  );
};