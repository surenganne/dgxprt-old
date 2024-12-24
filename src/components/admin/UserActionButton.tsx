import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";

interface UserActionButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  disabled: boolean;
  tooltipText: string;
  showTooltipError?: boolean;
  tooltipErrorText?: string;
  variant?: "default" | "destructive";
}

export const UserActionButton = ({
  icon: Icon,
  onClick,
  disabled,
  tooltipText,
  showTooltipError,
  tooltipErrorText,
  variant = "default",
}: UserActionButtonProps) => {
  const baseClassName = "text-primary-blue hover:text-primary-purple hover:bg-primary-purple/10";
  const destructiveClassName = "text-primary-blue hover:text-destructive hover:bg-destructive/10";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              variant="ghost"
              size="icon"
              disabled={disabled}
              onClick={onClick}
              className={variant === "destructive" ? destructiveClassName : baseClassName}
            >
              <Icon className="h-4 w-4" />
            </Button>
          </span>
        </TooltipTrigger>
        {showTooltipError ? (
          <TooltipContent>
            <p>{tooltipErrorText}</p>
          </TooltipContent>
        ) : (
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};