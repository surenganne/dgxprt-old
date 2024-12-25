import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import type { Chemical } from "@/types/chemical";

interface RiskAssessmentFormDialogProps {
  chemical: Chemical;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const RiskAssessmentFormDialog = ({
  chemical,
  open,
  onOpenChange,
  onSuccess,
}: RiskAssessmentFormDialogProps) => {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    likelihood: "1",
    severity: "1",
    hazard_description: "",
    existing_controls: "",
    additional_controls: "",
  });

  const calculateRiskLevel = (likelihood: number, severity: number) => {
    const riskScore = likelihood * severity;
    if (riskScore <= 4) return "low";
    if (riskScore <= 8) return "medium";
    if (riskScore <= 14) return "high";
    return "critical";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("risk_assessments").insert({
        chemical_id: chemical.id,
        assessed_by: session.user.id,
        risk_level: calculateRiskLevel(
          Number(formData.likelihood),
          Number(formData.severity)
        ),
        likelihood: Number(formData.likelihood),
        severity: Number(formData.severity),
        hazard_description: formData.hazard_description,
        existing_controls: formData.existing_controls,
        additional_controls: formData.additional_controls,
        status: "draft",
      });

      if (error) throw error;

      toast.success("Risk assessment created successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating risk assessment:", error);
      toast.error("Failed to create risk assessment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>New Risk Assessment for {chemical.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="likelihood">Likelihood (1-5)</Label>
              <Select
                value={formData.likelihood}
                onValueChange={(value) =>
                  setFormData({ ...formData, likelihood: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="severity">Severity (1-5)</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) =>
                  setFormData({ ...formData, severity: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="hazard_description">Hazard Description *</Label>
            <Textarea
              id="hazard_description"
              value={formData.hazard_description}
              onChange={(e) =>
                setFormData({ ...formData, hazard_description: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="existing_controls">Existing Controls</Label>
            <Textarea
              id="existing_controls"
              value={formData.existing_controls}
              onChange={(e) =>
                setFormData({ ...formData, existing_controls: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="additional_controls">Additional Controls</Label>
            <Textarea
              id="additional_controls"
              value={formData.additional_controls}
              onChange={(e) =>
                setFormData({ ...formData, additional_controls: e.target.value })
              }
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
              {loading ? "Creating..." : "Create Assessment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};