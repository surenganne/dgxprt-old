import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LocationBasicFields } from "./location-form/LocationBasicFields";
import { LocationContactFields } from "./location-form/LocationContactFields";
import { LocationFormData, LocationData } from "./location-form/types";

interface LocationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: LocationData;
}

export function LocationFormDialog({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: LocationFormDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("name");
      
      if (error) {
        toast({
          title: "Error fetching locations",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data;
    },
  });

  const defaultValues: LocationFormData = {
    name: "",
    type: "site",
    description: "",
    address: "",
    contact_email: "",
    contact_phone: "",
    parent_id: null,
  };

  const form = useForm<LocationFormData>({
    defaultValues: initialData || defaultValues,
  });

  // Reset form when dialog opens/closes or when initialData changes
  useEffect(() => {
    if (open) {
      form.reset(initialData || defaultValues);
    }
  }, [open, initialData, form]);

  const onSubmit = async (data: LocationFormData) => {
    setIsLoading(true);
    try {
      const formData = {
        ...data,
        parent_id: data.parent_id === "none" ? null : data.parent_id,
      };

      if (initialData) {
        const { error } = await supabase
          .from("locations")
          .update(formData)
          .eq("id", initialData.id);

        if (error) throw error;
        toast({
          title: "Location updated",
          description: "The location has been updated successfully.",
        });
      } else {
        const { error } = await supabase.from("locations").insert(formData);
        if (error) throw error;
        toast({
          title: "Location created",
          description: "The location has been created successfully.",
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Location" : "Create Location"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <LocationBasicFields form={form} locations={locations} />
            <LocationContactFields form={form} />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {initialData ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}