import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MultiSelectItem } from "./MultiSelectInput";

interface SingleSelectDropdownProps {
  options: MultiSelectItem[];
  selectedItem: MultiSelectItem | null;
  onSelect: (item: MultiSelectItem) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  className?: string;
}

export const SingleSelectDropdown = React.forwardRef<
  HTMLDivElement,
  SingleSelectDropdownProps
>((
  {
    options,
    selectedItem,
    onSelect,
    searchValue,
    onSearchChange,
    searchPlaceholder = "Search...",
    className,
    ...props
  },
  ref,
) => {
  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [options, searchValue]);

  return (
    <div
      ref={ref}
      className={cn("flex w-[411px] flex-col bg-white shadow-lg", className)}
      {...props}
    >
      {/* Search Box */}
      <div className="flex items-center border border-gray-300 rounded px-2 py-[10px] min-h-[40px] bg-white">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="flex-1 bg-transparent text-xs font-poppins text-[#4C5564] placeholder:text-[#BABABA] tracking-[0.429px] border-none outline-none"
          autoFocus
          style={{ minHeight: 0 }}
        />
        <div className="flex items-center justify-center px-1">
          <ChevronDown className="h-4 w-4 text-[#545454]" />
        </div>
      </div>
      {/* Separator */}
      <div className="h-px bg-[#E6E6E6]" />
      {/* Options List */}
      <div className="flex flex-col border-r border-b border-l border-[#008BC9] bg-white rounded-b-lg py-1 max-h-[200px] overflow-y-auto">
        {filteredOptions.length === 0 ? (
          <div className="px-2 py-2 text-xs text-[#BABABA] font-poppins">
            {searchValue ? "No matching options found" : "No options available"}
          </div>
        ) : (
          filteredOptions.map((option) => {
            const isSelected = selectedItem && selectedItem.id === option.id;
            const isDisabled = option.disabled;
            return (
              <div
                key={option.id}
                className={cn(
                  "flex items-center gap-2 px-2 py-2 cursor-pointer transition-colors",
                  isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50",
                  isDisabled && "opacity-50 cursor-not-allowed",
                )}
                onClick={() => {
                  if (!isDisabled) {
                    onSelect(option);
                  }
                }}
              >
                <span className="flex-1 text-xs font-medium font-poppins tracking-[0.429px]">
                  {option.label}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

SingleSelectDropdown.displayName = "SingleSelectDropdown"; 