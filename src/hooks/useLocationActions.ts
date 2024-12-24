import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useLocationActions = (refetch: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteLocation = async (locationId: string) => {
    setIsLoading(true);
    const { error } = await supabase
      .from("locations")
      .delete()
      .eq("id", locationId);

    if (error) {
      toast({
        title: "Error deleting location",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Location deleted successfully",
        description: "The location has been removed from the system.",
      });
      refetch();
    }
    setIsLoading(false);
  };

  const handleToggleStatus = async (location: any) => {
    setIsLoading(true);
    const newStatus = location.status === "active" ? "inactive" : "active";
    
    const { error } = await supabase
      .from("locations")
      .update({ status: newStatus })
      .eq("id", location.id);

    if (error) {
      toast({
        title: "Error updating location status",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Location status updated",
        description: `Location is now ${newStatus}.`,
      });
      refetch();
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    handleDeleteLocation,
    handleToggleStatus,
  };
};