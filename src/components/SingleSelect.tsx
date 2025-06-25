import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faTimes,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export interface SingleSelectOption {
  id: string | number;
  label: string;
  disabled?: boolean;
}

export interface SingleSelectProps {
  /**
   * Label displayed next to the component
   */
  label: string;
  /**
   * Currently selected option
   */
  value?: SingleSelectOption;
  /**
   * Available options to select from
   */
  options: SingleSelectOption[];
  /**
   * Callback when option is selected
   */
  onChange: (option: SingleSelectOption | null) => void;
  /**
   * Placeholder text when no option is selected
   */
  placeholder?: string;
  /**
   * Whether the component is disabled
   */
  disabled?: boolean;
  /**
   * Whether to show the clear button
   */
  clearable?: boolean;
  /**
   * Custom class name
   */
  className?: string;
}

export const SingleSelect = React.forwardRef<HTMLDivElement, SingleSelectProps>(
  (
    {
      label,
      value,
      options,
      onChange,
      placeholder = "Start typing",
      disabled = false,
      clearable = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const [showCopied, setShowCopied] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const copiedTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    // Filter options based on search
    const filteredOptions = React.useMemo(() => {
      if (!searchValue.trim()) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase()),
      );
    }, [options, searchValue]);

    const handleSelect = (option: SingleSelectOption) => {
      onChange(option);
      setOpen(false);
      setSearchValue("");
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
    };

    const handleOpenChange = (newOpen: boolean) => {
      if (disabled) return;
      setOpen(newOpen);
      if (!newOpen) {
        setSearchValue("");
      }
    };

    const handleCopy = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!value?.label) return;

      try {
        // Try modern clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value.label);
        } else {
          // Fallback for environments where clipboard API is blocked (like iframes)
          const textArea = document.createElement("textarea");
          textArea.value = value.label;
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
        console.error("Failed to copy text: ", err);
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
        className={cn("flex items-start gap-1 self-stretch", className)}
        ref={ref}
        {...props}
      >
        {/* Label */}
        <div
          className="flex w-[153px] py-[7px] px-2 items-start gap-1"
          style={{ width: "var(--Label-width, 153px)" }}
        >
          <div className="text-[#545454] text-xs font-semibold leading-normal tracking-[0.429px] font-['Poppins',sans-serif]">
            {label}
          </div>
        </div>

        {/* Value */}
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <div
              className={cn(
                "flex py-[6px] px-2 items-center gap-2 flex-1 rounded border border-[#E6E6E6] cursor-pointer relative",
                disabled && "opacity-50 cursor-not-allowed",
                open && "ring-1 ring-blue-400",
              )}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Value container */}
              <div className="flex items-center gap-2 flex-1">
                {/* Content */}
                <div className="text-[#212529] text-xs font-normal leading-normal tracking-[0.429px] font-['Poppins',sans-serif]">
                  {value ? value.label : placeholder}
                </div>

                {/* Copy button - only show on hover and when there's a value */}
                {value && isHovered && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleCopy}
                      disabled={disabled}
                      className="flex w-[20.5px] h-5 py-[1.667px] justify-center items-center gap-[6.667px] rounded-[3.333px] hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <FontAwesomeIcon
                        icon={faCopy}
                        className="text-[14px] text-[#3E88D5]"
                      />
                    </button>

                    {/* Tooltip */}
                    {showCopied && (
                      <div className="absolute -top-[35px] left-1/2 transform -translate-x-1/2 z-50">
                        <div className="flex py-[6.667px] px-[13.333px] flex-col justify-end items-center gap-[13.333px] rounded-[3.333px] border border-[#E6E6E6] bg-white shadow-md">
                          <div className="text-[#545454] text-center text-[10px] font-normal leading-normal tracking-[0.357px] font-['Poppins',sans-serif]">
                            Copied
                          </div>
                          {/* Arrow pointing down */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3.75px] border-r-[3.75px] border-t-[8.333px] border-l-transparent border-r-transparent border-t-[#E6E6E6]" />
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3.75px] border-r-[3.75px] border-t-[7.5px] border-l-transparent border-r-transparent border-t-white translate-y-[-1px]" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Dropdown controls */}
              <div className="flex py-0 px-1 items-center gap-3 self-stretch rounded-r border-0">
                {/* Clear button */}
                {clearable && value && (
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={disabled}
                    className="flex h-4 px-[6px] justify-center items-center text-[#BABABA] hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-[11px]" />
                  </button>
                )}

                {/* Dropdown arrow */}
                <div className="flex w-[18px] h-4 px-[6px] justify-center items-center">
                  <div className="flex w-[10px] h-3 flex-col justify-center flex-shrink-0 text-[#545454] text-center">
                    <FontAwesomeIcon icon={faCaretDown} className="text-base" />
                  </div>
                </div>
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto p-0 border border-gray-200 bg-white shadow-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <div className="w-64 max-h-48 overflow-y-auto p-2">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-center px-2 py-1.5 rounded text-sm cursor-pointer transition-colors",
                      value?.id === option.id && "bg-blue-50 text-blue-700",
                      value?.id !== option.id && "hover:bg-gray-50",
                      option.disabled && "opacity-50 cursor-not-allowed",
                    )}
                    onClick={() => !option.disabled && handleSelect(option)}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 px-2 py-1.5">
                  No options found
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

SingleSelect.displayName = "SingleSelect";
