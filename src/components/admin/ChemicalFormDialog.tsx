import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import type { Chemical } from "@/types/chemical";

type ChemicalHazardClass = Database["public"]["Enums"]["chemical_hazard_class"];

interface ChemicalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  chemical?: Chemical;
}

interface ChemicalFormData {
  name: string;
  cas_number: string;
  hazard_class: ChemicalHazardClass;
  description: string;
  storage_conditions: string;
  handling_precautions: string;
}

export const ChemicalFormDialog = ({
  open,
  onOpenChange,
  onSuccess,
  chemical,
}: ChemicalFormDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { logUserAction } = useAuditLogger();
  const [formData, setFormData] = useState<ChemicalFormData>({
    name: "",
    cas_number: "",
    hazard_class: "non_hazardous",
    description: "",
    storage_conditions: "",
    handling_precautions: "",
  });

  useEffect(() => {
    if (chemical) {
      setFormData({
        name: chemical.name,
        cas_number: chemical.cas_number || "",
        hazard_class: chemical.hazard_class,
        description: chemical.description || "",
        storage_conditions: chemical.storage_conditions || "",
        handling_precautions: chemical.handling_precautions || "",
      });
    } else {
      setFormData({
        name: "",
        cas_number: "",
        hazard_class: "non_hazardous",
        description: "",
        storage_conditions: "",
        handling_precautions: "",
      });
    }
  }, [chemical]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (chemical) {
        // Update existing chemical
        const { error } = await supabase
          .from("chemicals")
          .update(formData)
          .eq("id", chemical.id);

        if (error) throw error;

        await logUserAction(
          "chemicals",
          chemical.id,
          `Updated chemical: ${formData.name}`,
          { chemical_name: formData.name }
        );

        toast.success("Chemical updated successfully");
      } else {
        // Create new chemical
        const { error, data } = await supabase
          .from("chemicals")
          .insert(formData)
          .select()
          .single();

        if (error) throw error;

        await logUserAction(
          "chemicals",
          data.id,
          `Created chemical: ${formData.name}`,
          { chemical_name: formData.name }
        );

        toast.success("Chemical added successfully");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving chemical:", error);
      toast.error(`Failed to ${chemical ? "update" : "add"} chemical`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {chemical ? "Edit Chemical" : "Add New Chemical"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="cas_number">CAS Number</Label>
              <Input
                id="cas_number"
                value={formData.cas_number}
                onChange={(e) =>
                  setFormData({ ...formData, cas_number: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="hazard_class">Hazard Class *</Label>
              <Select
                value={formData.hazard_class}
                onValueChange={(value: ChemicalHazardClass) =>
                  setFormData({ ...formData, hazard_class: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="non_hazardous">Non-Hazardous</SelectItem>
                  <SelectItem value="hazardous">Hazardous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="storage_conditions">Storage Conditions</Label>
              <Textarea
                id="storage_conditions"
                value={formData.storage_conditions}
                onChange={(e) =>
                  setFormData({ ...formData, storage_conditions: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="handling_precautions">Handling Precautions</Label>
              <Textarea
                id="handling_precautions"
                value={formData.handling_precautions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    handling_precautions: e.target.value,
                  })
                }
              />
            </div>
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
              {loading
                ? chemical
                  ? "Updating..."
                  : "Adding..."
                : chemical
                ? "Update Chemical"
                : "Add Chemical"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};