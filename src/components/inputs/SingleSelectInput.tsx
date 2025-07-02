import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { MultiSelectItem } from "./MultiSelectInput";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

interface SingleSelectInputProps {
  label?: string;
  labelPosition?: "left" | "top";
  value: MultiSelectItem | null;
  options: MultiSelectItem[];
  onChange: (item: MultiSelectItem | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const SingleSelectInput: React.FC<SingleSelectInputProps> = ({
  label,
  labelPosition = "top",
  value,
  options,
  onChange,
  placeholder = "Select...",
  disabled = false,
  className = "",
}) => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  // Only show placeholder when open/focused and no value
  const showPlaceholder = open && !value;

  const handleSelect = (item: MultiSelectItem, isSelected: boolean) => {
    if (disabled) return;
    if (!isSelected) {
      onChange(item);
      setOpen(false);
      setSearchValue("");
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(null);
    setSearchValue("");
  };

  return (
    <div className={cn(
      labelPosition === "left" ? "flex items-center gap-2 min-w-0" : "flex flex-col gap-1",
      className
    )}>
      {label && (
        <label className="text-xs font-semibold mb-1 min-w-[120px]">{label}</label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex flex-1 items-center border border-gray-300 rounded px-2 py-[10px] min-h-[40px] bg-white cursor-pointer",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            tabIndex={0}
            onClick={() => !disabled && setOpen(true)}
          >
            <div className="flex-1 text-xs font-poppins text-[#4C5564] truncate">
              {showPlaceholder ? (
                <span className="text-[#BABABA]">{placeholder}</span>
              ) : value ? (
                value.label
              ) : null}
            </div>
            {value && (
              <button
                type="button"
                className="flex items-center justify-center px-1 text-[#BABABA] hover:text-gray-600 focus:outline-none"
                onClick={handleClear}
                tabIndex={-1}
                disabled={disabled}
                aria-label="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="flex items-center justify-center px-1">
              <ChevronDown className="h-4 w-4 text-[#545454]" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[411px]" align="start">
          <MultiSelectDropdown
            options={options}
            selectedItems={value ? [value] : []}
            onSelectionChange={handleSelect}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder={placeholder}
            // No onCreateNew for single select
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SingleSelectInput; 