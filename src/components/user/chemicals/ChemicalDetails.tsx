import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SDSList } from "@/components/admin/sds/SDSList";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { RiskAssessmentFormDialog } from "./RiskAssessmentFormDialog";
import { RiskAssessmentList } from "./RiskAssessmentList";
import type { Chemical } from "@/types/chemical";

interface ChemicalDetailsProps {
  chemical: Chemical | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChemicalDetails = ({
  chemical,
  open,
  onOpenChange,
}: ChemicalDetailsProps) => {
  const [riskAssessmentOpen, setRiskAssessmentOpen] = useState(false);

  if (!chemical) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl font-semibold">
              {chemical.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 h-full min-h-0">
            <div className="space-y-6 py-4 px-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">CAS Number</h3>
                  <p className="mt-1">{chemical.cas_number || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Hazard Class</h3>
                  <Badge
                    variant={
                      chemical.hazard_class === "hazardous"
                        ? "destructive"
                        : "secondary"
                    }
                    className="mt-1"
                  >
                    {chemical.hazard_class === "hazardous"
                      ? "Hazardous"
                      : "Non-Hazardous"}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-gray-700">
                  {chemical.description || "No description available"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Storage Conditions
                </h3>
                <p className="mt-1 text-gray-700">
                  {chemical.storage_conditions || "No storage conditions specified"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Handling Precautions
                </h3>
                <p className="mt-1 text-gray-700">
                  {chemical.handling_precautions || "No handling precautions specified"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Safety Data Sheets
                </h3>
                <div className="mt-2">
                  <SDSList chemicalId={chemical.id} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Risk Assessments
                  </h3>
                  <Button
                    onClick={() => setRiskAssessmentOpen(true)}
                    className="bg-primary-purple hover:bg-primary-purple/90"
                    size="sm"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    New Assessment
                  </Button>
                </div>
                <RiskAssessmentList chemicalId={chemical.id} chemical={chemical} />
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <RiskAssessmentFormDialog
        chemical={chemical}
        open={riskAssessmentOpen}
        onOpenChange={setRiskAssessmentOpen}
        onSuccess={() => {
          setRiskAssessmentOpen(false);
        }}
      />
    </>
  );
};