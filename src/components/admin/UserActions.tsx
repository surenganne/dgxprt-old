import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Lock, Mail } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserActionsProps {
  user: {
    id: string;
    email: string;
    full_name: string | null;
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
  const isAdmin = user.email === "admin@dgxprt.ai";

  return (
    <div className="flex justify-end space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="ghost"
                size="icon"
                disabled={isLoading || isAdmin}
                onClick={onEdit}
                className="text-primary-blue hover:text-primary-purple hover:bg-primary-purple/10"
              >
                {isAdmin ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Pencil className="h-4 w-4" />
                )}
              </Button>
            </span>
          </TooltipTrigger>
          {isAdmin && (
            <TooltipContent>
              <p>The main administrator account cannot be modified</p>
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
                disabled={isLoading || isAdmin}
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
                disabled={isLoading || isAdmin}
                onClick={onDelete}
                className="text-primary-blue hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </span>
          </TooltipTrigger>
          {isAdmin && (
            <TooltipContent>
              <p>The main administrator account cannot be deleted</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};