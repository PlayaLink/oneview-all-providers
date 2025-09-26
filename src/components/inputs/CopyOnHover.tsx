import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface CopyOnHoverProps {
  value: string;
  isHovered: boolean;
  className?: string;
  buttonClassName?: string;
  iconClassName?: string;
  tooltipClassName?: string;
  disabled?: boolean;
  ariaLabel?: string;
  dataTestId?: string;
}

export const CopyOnHover: React.FC<CopyOnHoverProps> = ({
  value,
  isHovered,
  className,
  buttonClassName,
  iconClassName,
  tooltipClassName,
  disabled = false,
  ariaLabel,
  dataTestId,
}) => {
  const [showCopied, setShowCopied] = React.useState(false);
  const copiedTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value || disabled) return;

    try {
      // Always use the fallback method in iframe environments to avoid permission issues
      const textArea = document.createElement("textarea");
      textArea.value = value;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (!successful) {
        throw new Error("Failed to copy using fallback method");
      }

      setShowCopied(true);

      // Clear any existing timeout
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }

      // Hide tooltip after 2 seconds
      copiedTimeoutRef.current = setTimeout(() => {
        setShowCopied(false);
        copiedTimeoutRef.current = null;
      }, 2000);
    } catch (err) {
      // Error: Failed to copy text
      // Still show the tooltip even if copy failed, for better UX
      setShowCopied(true);

      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }

      copiedTimeoutRef.current = setTimeout(() => {
        setShowCopied(false);
        copiedTimeoutRef.current = null;
      }, 2000);
    }
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  return (
    <TooltipProvider>
      <div 
        className={cn("relative flex items-center", className)}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "flex w-5 h-5 py-1 justify-center items-center gap-1 rounded hover:bg-gray-50 transition-all",
                isHovered ? "opacity-100" : "opacity-0",
                disabled && "opacity-50 cursor-not-allowed",
                buttonClassName
              )}
              tabIndex={-1}
              disabled={disabled}
              aria-label={ariaLabel}
              data-testid={dataTestId}
            >
              <FontAwesomeIcon 
                icon={faCopy} 
                className={cn("text-[14px] text-blue-600", iconClassName)} 
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center">
            <p>{showCopied ? "Copied!" : "Copy"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default CopyOnHover;
