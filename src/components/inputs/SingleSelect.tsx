import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CopyOnHover from "./CopyOnHover";

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
            <div className="text-gray-600 text-xs font-semibold leading-normal tracking-wide font-['Poppins',sans-serif] break-words whitespace-normal">
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
                "flex min-h-[38px] px-2 items-center flex-1 rounded border border-gray-200 cursor-pointer w-full text-left bg-white",
                disabled && "opacity-50 cursor-not-allowed",
                open && "ring-1 ring-blue-400",
              )}
              aria-label={`Select ${label}`}
              aria-expanded={open}
              aria-haspopup="listbox"
              disabled={disabled}
              data-testid={`single-select-${label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {/* Content + Copy button */}
              <div className="flex items-center gap-1">
                <div className="text-gray-900 text-xs font-normal leading-normal tracking-wide font-['Poppins',sans-serif]">
                  {value ? value.label : (open ? placeholder : "")}
                </div>
                {value && (
                  <CopyOnHover 
                    value={value.label}
                    className="ml-1"
                    ariaLabel={`Copy ${label} selection to clipboard`}
                    dataTestId={`single-select-copy-${label.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                )}
              </div>
              <div className="flex-1" />
              {/* X + Caret */}
              <div className="flex items-center gap-1">
                {clearable && value && (
                  <div
                    onClick={handleClear}
                    className={cn(
                      "flex h-4 px-[6px] justify-center items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer",
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
                  <div className="flex w-[10px] h-3 flex-col justify-center flex-shrink-0 text-gray-600 text-center">
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
                      value?.id === option.id && "bg-blue-600 text-white",
                      value?.id !== option.id && "hover:bg-blue-50",
                      option.disabled && "opacity-50 cursor-not-allowed",
                    )}
                    onClick={() => {
              
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
