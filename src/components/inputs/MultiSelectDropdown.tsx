import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MultiSelectItem } from "./MultiSelectInput";

interface MultiSelectDropdownProps {
  options: MultiSelectItem[];
  selectedItems: MultiSelectItem[];
  onSelectionChange: (item: MultiSelectItem, isSelected: boolean) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  className?: string;
  onCreateNew?: (label: string) => void;
}

export const MultiSelectDropdown = React.forwardRef<
  HTMLDivElement,
  MultiSelectDropdownProps
>(
  (
    {
      options,
      selectedItems,
      onSelectionChange,
      searchValue,
      onSearchChange,
      searchPlaceholder = "Search tags",
      className,
      onCreateNew,
      ...props
    },
    ref,
  ) => {
    const selectedIds = React.useMemo(
      () => new Set(selectedItems.map((item) => item.id)),
      [selectedItems],
    );

    const filteredOptions = React.useMemo(() => {
      if (!searchValue) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase()),
      );
    }, [options, searchValue]);

    const hasExactMatch = React.useMemo(() => {
      if (!searchValue.trim()) return true;
      return options.some(
        (option) => option.label.toLowerCase() === searchValue.toLowerCase(),
      );
    }, [options, searchValue]);

    const showCreateOption =
      searchValue.trim() && !hasExactMatch && onCreateNew;

    return (
      <div
        ref={ref}
        className={cn("flex w-[411px] flex-col bg-white shadow-lg", className)}
        {...props}
      >
        {/* Search Box */}
        <div className="flex min-h-[32px] items-center border-t border-r border-l border-blue-600 bg-white rounded-t">
          <div className="flex flex-1 items-center px-2 py-1.5">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 text-xs font-poppins text-gray-600 placeholder:text-gray-400 tracking-wide border-none outline-none"
              autoFocus
            />
          </div>
          <div className="flex items-center justify-center px-2 py-1">
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </div>
        </div>
        {/* Separator */}
        <div className="h-px bg-gray-200" />
        {/* Options List */}
        <div className="flex flex-col border-r border-b border-l border-blue-600 bg-white rounded-b-lg py-1 max-h-[200px] overflow-y-auto">
          {filteredOptions.length === 0 && !showCreateOption ? (
            <div className="px-2 py-2 text-xs text-gray-400 font-poppins">
              {searchValue
                ? "No matching options found"
                : "No options available"}
            </div>
          ) : (
            <>
              {filteredOptions.map((option) => {
                const isSelected = selectedIds.has(option.id);
                const isDisabled = option.disabled;
                return (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-center gap-2 px-2 py-2 cursor-pointer transition-colors",
                      isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50",
                    )}
                    onClick={() => {
                      if (!isDisabled) {
                        onSelectionChange(option, isSelected);
                      }
                    }}
                  >
                    {/* Custom Checkbox */}
                    <div className="flex w-5 items-center justify-center">
                      <div
                        className={cn(
                          "relative h-[18px] w-[18px] rounded-sm border flex items-center justify-center transition-colors",
                          isSelected
                            ? "bg-gray-600 border-gray-600"
                            : "bg-white border-gray-400",
                          isDisabled && "opacity-50",
                        )}
                      >
                        {isSelected && (
                          <Check
                            className="h-3 w-3 text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                    </div>
                    {/* Label */}
                    <span
                      className={cn(
                        "flex-1 text-xs font-medium font-poppins tracking-wide",
                        isDisabled ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      {option.label}
                    </span>
                  </div>
                );
              })}
              {/* Create New Option */}
              {showCreateOption && (
                <div
                  className="flex items-center justify-start gap-2 px-2 py-2 cursor-pointer transition-colors hover:bg-gray-50 self-stretch"
                  onClick={() => {
                    onCreateNew(searchValue.trim());
                    onSearchChange("");
                  }}
                >
                  <span className="flex-1 text-xs font-normal text-gray-600 font-poppins tracking-wide">
                    Create tag "{searchValue}"
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  },
);

MultiSelectDropdown.displayName = "MultiSelectDropdown"; 