import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

interface CopyOnHoverProps {
  value: string;
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
  className,
  buttonClassName,
  iconClassName,
  tooltipClassName,
  disabled = false,
  ariaLabel,
  dataTestId,
}) => {
  const [showCopied, setShowCopied] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
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
    <div 
      className={cn("relative flex items-center", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowCopied(false);
        if (copiedTimeoutRef.current) {
          clearTimeout(copiedTimeoutRef.current);
          copiedTimeoutRef.current = null;
        }
      }}
    >
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
      {/* Tooltip */}
      {showCopied && isHovered && (
        <div className={cn("absolute -top-[35px] left-1/2 transform -translate-x-1/2 z-50", tooltipClassName)}>
          <div className="flex py-1 px-3 flex-col justify-end items-center gap-1 rounded border border-gray-200 bg-white shadow-md">
            <div className="text-gray-600 text-center text-[10px] font-normal leading-normal tracking-wide font-['Poppins',sans-serif]">
              Copied
            </div>
            {/* Arrow pointing down */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-1 border-r-1 border-t-2 border-l-transparent border-r-transparent border-t-gray-200" />
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-1 border-r-1 border-t-2 border-l-transparent border-r-transparent border-t-white translate-y-[-1px]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CopyOnHover;
