import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Chemical } from "@/types/chemical";

interface ChemicalDetailsFieldsProps {
  formData: Partial<Chemical>;
  setFormData: (data: any) => void;
}

export const ChemicalDetailsFields = ({
  formData,
  setFormData,
}: ChemicalDetailsFieldsProps) => {
  return (
    <>
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
            setFormData({
              ...formData,
              storage_conditions: e.target.value,
            })
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
    </>
  );
};