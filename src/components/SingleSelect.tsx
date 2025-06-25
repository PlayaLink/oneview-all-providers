import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faTimes } from "@fortawesome/free-solid-svg-icons";
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
                "flex py-[6px] px-2 items-start gap-2 flex-1 rounded border border-[#E6E6E6] cursor-pointer",
                disabled && "opacity-50 cursor-not-allowed",
                open && "ring-1 ring-blue-400",
              )}
            >
              {/* Content */}
              <div className="flex-1 text-[#545454] text-xs font-normal leading-normal tracking-[0.429px] font-['Poppins',sans-serif]">
                {value ? value.label : placeholder}
              </div>

              {/* Copy area - placeholder for any copy functionality */}
              <div className="flex w-[20.5px] h-5 py-[1.667px] px-[3.75px] justify-center items-center gap-[6.667px] rounded-[3.333px]" />

              {/* Dropdown controls */}
              <div className="flex py-0 px-1 items-center gap-3 self-stretch rounded-r border-0">
                {/* Clear button */}
                {clearable && value && (
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={disabled}
                    className="flex h-4 justify-center items-center text-[#BABABA] hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-[11px]" />
                  </button>
                )}

                {/* Dropdown arrow */}
                <div className="flex h-4 justify-center items-center">
                  <div className="flex w-[10px] h-3 flex-col justify-center text-[#545454] text-center">
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
