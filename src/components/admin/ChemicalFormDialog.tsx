import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type ChemicalHazardClass = Database["public"]["Enums"]["chemical_hazard_class"];

interface ChemicalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
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
}: ChemicalFormDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ChemicalFormData>({
    name: "",
    cas_number: "",
    hazard_class: "non_hazardous",
    description: "",
    storage_conditions: "",
    handling_precautions: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("chemicals").insert(formData);

      if (error) throw error;

      toast.success("Chemical added successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding chemical:", error);
      toast.error("Failed to add chemical");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Chemical</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="cas_number">CAS Number</Label>
            <Input
              id="cas_number"
              value={formData.cas_number}
              onChange={(e) =>
                setFormData({ ...formData, cas_number: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storage_conditions">Storage Conditions</Label>
            <Textarea
              id="storage_conditions"
              value={formData.storage_conditions}
              onChange={(e) =>
                setFormData({ ...formData, storage_conditions: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="handling_precautions">Handling Precautions</Label>
            <Textarea
              id="handling_precautions"
              value={formData.handling_precautions}
              onChange={(e) =>
                setFormData({ ...formData, handling_precautions: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Chemical"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};