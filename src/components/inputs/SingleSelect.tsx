import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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
   * Label position: 'left' or 'top'. Default is 'left'.
   */
  labelPosition?: 'left' | 'above';
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
      labelPosition = 'left',
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
      console.log('SingleSelect handleSelect called:', { option, label });
      onChange(option);
      setOpen(false);
      setSearchValue("");
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
    };

    const handleOpenChange = (newOpen: boolean) => {
      console.log('SingleSelect handleOpenChange:', { newOpen, disabled, label, options: options.length });
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
        // Always use the fallback method in iframe environments to avoid permission issues
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
        className={cn(
          labelPosition === 'above'
            ? 'flex flex-col items-start gap-1 flex-1 min-w-0'
            : 'flex items-center gap-2 flex-1 min-w-0',
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Label */}
        {labelPosition === 'left' ? (
          <div
            className="text-xs font-semibold mb-1 min-w-[120px] max-w-[120px] break-words whitespace-normal"
          >
            {label}
          </div>
        ) : (
          <div className="mb-1" role="single-select-label">
            <div className="text-[#545454] text-xs font-semibold leading-normal tracking-[0.429px] font-['Poppins',sans-serif] break-words whitespace-normal">
              {label}
            </div>
          </div>
        )}

        {/* Value */}
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex min-h-[38px] px-2 items-center flex-1 rounded border border-[#E6E6E6] cursor-pointer w-full text-left bg-transparent",
                disabled && "opacity-50 cursor-not-allowed",
                open && "ring-1 ring-blue-400",
              )}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                setShowCopied(false);
                if (copiedTimeoutRef.current) {
                  clearTimeout(copiedTimeoutRef.current);
                  copiedTimeoutRef.current = null;
                }
              }}
              aria-label={`Select ${label}`}
              aria-expanded={open}
              aria-haspopup="listbox"
              disabled={disabled}
              data-testid={`single-select-${label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {/* Content + Copy button */}
              <div className="flex items-center gap-1">
                <div className="text-[#212529] text-xs font-normal leading-normal tracking-[0.429px] font-['Poppins',sans-serif]">
                  {value ? value.label : (open ? placeholder : "")}
                </div>
                {value && (
                  <div className="relative flex items-center">
                    <div
                      onClick={handleCopy}
                      className={cn(
                        "flex w-[20.5px] h-5 py-[1.667px] justify-center items-center gap-[6.667px] rounded-[3.333px] hover:bg-gray-50 transition-all disabled:opacity-50 ml-1 cursor-pointer",
                        isHovered ? "opacity-100" : "opacity-0",
                        disabled && "opacity-50 cursor-not-allowed"
                      )}
                      aria-label={`Copy ${label} selection to clipboard`}
                      data-testid={`single-select-copy-${label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Icon
                        icon="copy"
                        className="text-[14px] text-[#3E88D5]"
                      />
                    </div>
                    {/* Tooltip */}
                    {showCopied && isHovered && (
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
              <div className="flex-1" />
              {/* X + Caret */}
              <div className="flex items-center gap-1">
                {clearable && value && (
                  <div
                    onClick={handleClear}
                    className={cn(
                      "flex h-4 px-[6px] justify-center items-center text-[#BABABA] hover:text-gray-600 transition-colors cursor-pointer",
                      disabled && "opacity-50 cursor-not-allowed"
                    )}
                    aria-label={`Clear ${label} selection`}
                    data-testid={`single-select-clear-${label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Icon icon="times" className="text-[11px]" />
                  </div>
                )}
                {/* Dropdown arrow */}
                <div className="flex w-[18px] h-4 px-[6px] justify-center items-center">
                  <div className="flex w-[10px] h-3 flex-col justify-center flex-shrink-0 text-[#545454] text-center">
                    <Icon icon="caret-down" className="text-base" />
                  </div>
                </div>
              </div>
            </button>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto p-0 border border-gray-200 bg-white shadow-lg z-[9999]"
            align="start"
            side="bottom"
            sideOffset={4}
            alignOffset={0}
          >
            <div 
              className="w-64 max-h-48 overflow-y-auto p-2" 
              role="listbox"
              aria-label={`${label} options`}
              data-testid={`single-select-dropdown-${label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-center px-2 py-1.5 rounded text-sm cursor-pointer transition-colors",
                      value?.id === option.id && "bg-[#008BC9] text-white",
                      value?.id !== option.id && "hover:bg-blue-50",
                      option.disabled && "opacity-50 cursor-not-allowed",
                    )}
                    onClick={() => {
                      console.log('SingleSelect option clicked:', { option, label, disabled: option.disabled });
                      if (!option.disabled) {
                        handleSelect(option);
                      }
                    }}
                    role="option"
                    aria-selected={value?.id === option.id}
                    data-testid={`single-select-option-${option.id}`}
                  >
                    <span className="flex-1">{option.label}</span>
                    {value?.id === option.id && (
                      <Icon icon="check" className="ml-2 text-white text-xs"  />
                    )}
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
