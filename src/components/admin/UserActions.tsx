import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Lock, Mail, Link2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UserActionsProps {
  user: {
    id: string;
    email: string;
    full_name: string | null;
    is_owner?: boolean;
    is_admin?: boolean;
  };
  isLoading: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSendPassword: () => void;
}

export const UserActions = ({
  user,
  isLoading,
  onEdit,
  onDelete,
  onSendPassword,
}: UserActionsProps) => {
  const session = useSession();
  const { toast } = useToast();

  // Fetch current user's profile to check permissions
  const { data: currentUserProfile } = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("is_owner, is_admin")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const canModifyUser = () => {
    if (!currentUserProfile) return false;
    
    // Owner accounts cannot be modified by anyone
    if (user.is_owner) return false;
    
    // Owner can modify anyone except other owners
    if (currentUserProfile.is_owner) {
      return !user.is_owner;
    }
    
    // Admin can only modify non-admin, non-owner users
    if (currentUserProfile.is_admin) {
      return !user.is_admin && !user.is_owner;
    }

    return false;
  };

  const getTooltipMessage = () => {
    if (user.is_owner) return "Owner accounts cannot be modified";
    if (user.is_admin && !currentUserProfile?.is_owner) return "Only owners can modify admin accounts";
    return "This action is not allowed";
  };

  const handleCopyMagicLink = async () => {
    try {
      console.log("[UserActions] Generating magic link for:", user.email);
      const { data, error } = await supabase.functions.invoke('create-user-with-magic-link', {
        body: { 
          email: user.email,
          fullName: user.full_name,
          isAdmin: user.is_admin,
          status: 'active'
        }
      });

      if (error) throw error;

      // Construct the magic link URL
      const magicLink = `${window.location.origin}/auth?email=${encodeURIComponent(user.email)}&temp=true`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(magicLink);
      
      toast({
        title: "Magic link copied!",
        description: "The login link has been copied to your clipboard.",
      });
    } catch (error: any) {
      console.error("[UserActions] Error generating magic link:", error);
      toast({
        title: "Error generating magic link",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-end space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="ghost"
                size="icon"
                disabled={isLoading || !canModifyUser()}
                onClick={onEdit}
                className="text-primary-blue hover:text-primary-purple hover:bg-primary-purple/10"
              >
                {user.is_owner ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Pencil className="h-4 w-4" />
                )}
              </Button>
            </span>
          </TooltipTrigger>
          {!canModifyUser() && (
            <TooltipContent>
              <p>{getTooltipMessage()}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="ghost"
                size="icon"
                disabled={isLoading || !canModifyUser()}
                onClick={handleCopyMagicLink}
                className="text-primary-blue hover:text-primary-purple hover:bg-primary-purple/10"
              >
                <Link2 className="h-4 w-4" />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy magic link</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="ghost"
                size="icon"
                disabled={isLoading || !canModifyUser()}
                onClick={onSendPassword}
                className="text-primary-blue hover:text-primary-purple hover:bg-primary-purple/10"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send password reset email</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="ghost"
                size="icon"
                disabled={isLoading || !canModifyUser()}
                onClick={onDelete}
                className="text-primary-blue hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </span>
          </TooltipTrigger>
          {!canModifyUser() && (
            <TooltipContent>
              <p>{getTooltipMessage()}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};