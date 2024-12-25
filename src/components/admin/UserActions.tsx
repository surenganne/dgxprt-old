import { Pencil, Trash2, Lock, Mail, Link2 } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserActionButton } from "./UserActionButton";
import { generateMagicLink } from "@/services/userMagicLinkService";

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

  console.log("[UserActions] Component rendered for user:", {
    userId: user.id,
    userEmail: user.email,
    isOwner: user.is_owner,
    isAdmin: user.is_admin
  });
  console.log("[UserActions] Current session:", session);

  const { data: currentUserProfile } = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      console.log("[UserActions] Fetching current user profile for:", session?.user?.id);
      if (!session?.user?.id) {
        console.log("[UserActions] No session user ID found");
        return null;
      }
      
      const { data, error } = await supabase
        .from("profiles")
        .select("is_owner, is_admin")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("[UserActions] Error fetching profile:", error);
        throw error;
      }
      
      console.log("[UserActions] Current user profile data:", data);
      return data;
    },
    onError: (error) => {
      console.error("[UserActions] Query error:", error);
    }
  });

  const canModifyUser = () => {
    console.log("[UserActions] Checking permissions:", {
      currentProfile: currentUserProfile,
      targetUser: user,
      canModify: Boolean(currentUserProfile && 
        (!user.is_owner && 
        (currentUserProfile.is_owner || 
        (currentUserProfile.is_admin && !user.is_admin))))
    });

    if (!currentUserProfile) return false;
    if (user.is_owner) return false;
    if (currentUserProfile.is_owner) return !user.is_owner;
    if (currentUserProfile.is_admin) return !user.is_admin && !user.is_owner;
    return false;
  };

  const getTooltipMessage = () => {
    const message = user.is_owner 
      ? "Owner accounts cannot be modified"
      : user.is_admin && !currentUserProfile?.is_owner 
        ? "Only owners can modify admin accounts"
        : "This action is not allowed";
    
    console.log("[UserActions] Tooltip message:", {
      message,
      userIsOwner: user.is_owner,
      userIsAdmin: user.is_admin,
      currentUserIsOwner: currentUserProfile?.is_owner
    });
    
    return message;
  };

  const handleCopyMagicLink = async () => {
    try {
      console.log("[UserActions] Generating magic link for:", user.email);
      const magicLink = await generateMagicLink(user.email);
      
      console.log("[UserActions] Checking user profile for reset status");
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("has_reset_password")
        .eq("email", user.email)
        .single();
      
      if (error) {
        console.error("[UserActions] Error checking profile:", error);
        throw error;
      }
      
      console.log("[UserActions] User profile data:", profile);
      
      await navigator.clipboard.writeText(magicLink);
      
      console.log("[UserActions] Magic link copied to clipboard");
      
      toast({
        title: "Magic link copied!",
        description: profile?.has_reset_password 
          ? "The login link has been copied to your clipboard."
          : "The password reset link has been copied to your clipboard.",
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
      <UserActionButton
        icon={user.is_owner ? Lock : Pencil}
        onClick={onEdit}
        disabled={isLoading || !canModifyUser()}
        tooltipText="Edit user"
        showTooltipError={!canModifyUser()}
        tooltipErrorText={getTooltipMessage()}
      />

      <UserActionButton
        icon={Link2}
        onClick={handleCopyMagicLink}
        disabled={isLoading || !canModifyUser()}
        tooltipText="Copy magic link"
      />

      <UserActionButton
        icon={Mail}
        onClick={onSendPassword}
        disabled={isLoading || !canModifyUser()}
        tooltipText="Send password reset email"
      />

      <UserActionButton
        icon={Trash2}
        onClick={onDelete}
        disabled={isLoading || !canModifyUser()}
        tooltipText="Delete user"
        showTooltipError={!canModifyUser()}
        tooltipErrorText={getTooltipMessage()}
        variant="destructive"
      />
    </div>
  );
};