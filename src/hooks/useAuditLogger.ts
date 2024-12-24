import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export const useAuditLogger = () => {
  const { toast } = useToast();
  const session = useSession();

  const logUserAction = async (
    entityType: string,
    entityId: string | null,
    description: string,
    metadata: any = {}
  ) => {
    try {
      const { error } = await supabase.rpc('log_audit_event', {
        p_user_id: session?.user?.id,
        p_action_type: 'user_action',
        p_entity_type: entityType,
        p_entity_id: entityId,
        p_description: description,
        p_metadata: metadata
      });

      if (error) throw error;

      // Show notification for the action
      toast({
        title: "Action Logged",
        description: description,
      });

    } catch (error: any) {
      console.error('Error logging action:', error);
      toast({
        title: "Error Logging Action",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { logUserAction };
};