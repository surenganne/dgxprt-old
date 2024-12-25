import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Chemical } from "@/types/chemical";

interface RiskAssessmentListProps {
  chemicalId: string;
}

export const RiskAssessmentList = ({ chemicalId }: RiskAssessmentListProps) => {
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

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading assessments...</div>;
  }

  if (!assessments?.length) {
    return (
      <div className="text-sm text-gray-500">No risk assessments available.</div>
    );
  }

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

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              By: {assessment.assessed_by.full_name}
            </span>
            <Badge variant="outline">
              {assessment.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};