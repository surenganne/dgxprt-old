import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { LocationFormData } from "./types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LocationBasicFieldsProps {
  form: UseFormReturn<LocationFormData>;
  locations?: any[];
}

export function LocationBasicFields({ form, locations }: LocationBasicFieldsProps) {
  const { data: hierarchyLevels } = useQuery({
    queryKey: ["locationHierarchy"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("location_hierarchy")
        .select("*")
        .order("level_order");
      
      if (error) {
        console.error("Error fetching hierarchy levels:", error);
        return [];
      }
      return data;
    },
  });

  // Get valid parent types based on selected type
  const getValidParentTypes = (type: string): string[] => {
    const currentLevel = hierarchyLevels?.find(level => level.level_name === type);
    if (!currentLevel) return [];
    
    const currentOrder = currentLevel.level_order;
    return hierarchyLevels
      ?.filter(level => level.level_order === currentOrder - 1)
      .map(level => level.level_name) || [];
  };

  // Get custom label for type if available
  const getTypeLabel = (type: string) => {
    const level = hierarchyLevels?.find(level => level.level_name === type);
    return level?.custom_label || level?.display_name || type;
  };

  // Filter locations based on selected type
  const filteredLocations = locations?.filter(location => {
    const validParentTypes = getValidParentTypes(form.watch("type"));
    return validParentTypes.includes(location.type);
  });

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter location name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                // Reset parent_id when type changes
                form.setValue("parent_id", "none");
              }} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {hierarchyLevels?.map((level) => (
                  <SelectItem key={level.level_name} value={level.level_name}>
                    {level.custom_label || level.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="parent_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Parent {getTypeLabel(getValidParentTypes(form.watch("type"))[0] || "Location")}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value || "none"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={`Select parent ${getTypeLabel(getValidParentTypes(form.watch("type"))[0] || "location").toLowerCase()}`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                <SelectItem value="none">None</SelectItem>
                {filteredLocations?.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name} ({getTypeLabel(location.type)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}