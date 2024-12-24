import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import type { Chemical } from "@/types/chemical";
import { useQuery } from "@tanstack/react-query";
import { ChemicalBasicFields } from "./chemical-form/ChemicalBasicFields";
import { ChemicalDetailsFields } from "./chemical-form/ChemicalDetailsFields";

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
  category_id: string | null;
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
    category_id: null,
    description: "",
    storage_conditions: "",
    handling_precautions: "",
  });

  const { data: categories } = useQuery({
    queryKey: ["chemical-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chemical_categories")
        .select("*")
        .order("name");

      if (error) {
        toast.error("Failed to fetch categories");
        throw error;
      }

      return data || [];
    },
  });

  useEffect(() => {
    if (chemical) {
      setFormData({
        name: chemical.name,
        cas_number: chemical.cas_number || "",
        hazard_class: chemical.hazard_class,
        category_id: chemical.category_id,
        description: chemical.description || "",
        storage_conditions: chemical.storage_conditions || "",
        handling_precautions: chemical.handling_precautions || "",
      });
    } else {
      setFormData({
        name: "",
        cas_number: "",
        hazard_class: "non_hazardous",
        category_id: null,
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
            <ChemicalBasicFields
              formData={formData}
              setFormData={setFormData}
              categories={categories || []}
            />
            <ChemicalDetailsFields
              formData={formData}
              setFormData={setFormData}
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