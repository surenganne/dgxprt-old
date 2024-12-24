import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuditLogger } from "./useAuditLogger";

export const useLocationActions = (refetch: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { logUserAction } = useAuditLogger();

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
      await logUserAction(
        'location',
        locationId,
        `Deleted location`,
        { action: 'delete' }
      );
      
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
      await logUserAction(
        'location',
        location.id,
        `Updated location status to ${newStatus}`,
        { 
          action: 'status_update',
          previous_status: location.status,
          new_status: newStatus
        }
      );
      
      toast({
        title: "Location status updated",
        description: `Location is now ${newStatus}.`,
      });
      refetch();
    }
    setIsLoading(false);
  };

  const handleBatchDelete = async (locationIds: string[]) => {
    setIsLoading(true);
    const { error } = await supabase
      .from("locations")
      .delete()
      .in("id", locationIds);

    if (error) {
      throw error;
    }
    
    await logUserAction(
      'location',
      null,
      `Batch deleted ${locationIds.length} locations`,
      { 
        action: 'batch_delete',
        location_ids: locationIds
      }
    );
    
    refetch();
    setIsLoading(false);
  };

  const handleBatchUpdateStatus = async (locationIds: string[], newStatus: string) => {
    setIsLoading(true);
    const { error } = await supabase
      .from("locations")
      .update({ status: newStatus })
      .in("id", locationIds);

    if (error) {
      throw error;
    }
    
    await logUserAction(
      'location',
      null,
      `Batch updated status to ${newStatus} for ${locationIds.length} locations`,
      { 
        action: 'batch_status_update',
        location_ids: locationIds,
        new_status: newStatus
      }
    );
    
    refetch();
    setIsLoading(false);
  };

  return {
    isLoading,
    handleDeleteLocation,
    handleToggleStatus,
    handleBatchDelete,
    handleBatchUpdateStatus,
  };
};