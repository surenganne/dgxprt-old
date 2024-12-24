import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Chemical } from "@/types/chemical";
import { Database } from "@/integrations/supabase/types";

type ChemicalHazardClass = Database["public"]["Enums"]["chemical_hazard_class"];

interface ChemicalBasicFieldsProps {
  formData: Partial<Chemical>;
  setFormData: (data: any) => void;
  categories: any[];
}

export const ChemicalBasicFields = ({
  formData,
  setFormData,
  categories,
}: ChemicalBasicFieldsProps) => {
  return (
    <>
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
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category_id || "none"}
          onValueChange={(value) =>
            setFormData({ ...formData, category_id: value === "none" ? null : value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Category</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
    </>
  );
};