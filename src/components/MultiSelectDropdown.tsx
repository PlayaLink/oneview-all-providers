import * as React from "react";
import { Check, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { MultiSelectItem } from "./MultiSelect";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface MultiSelectDropdownProps {
  options: MultiSelectItem[];
  selectedItems: MultiSelectItem[];
  onSelectionChange: (item: MultiSelectItem, isSelected: boolean) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onCreateNew: (label: string) => void;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedItems,
  onSelectionChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  onCreateNew,
}) => {
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!searchValue.trim()) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [options, searchValue]);

  // Check if an item is selected
  const isSelected = React.useCallback(
    (item: MultiSelectItem) => {
      return selectedItems.some((selected) => selected.id === item.id);
    },
    [selectedItems],
  );

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          const item = filteredOptions[focusedIndex];
          onSelectionChange(item, isSelected(item));
        } else if (searchValue.trim() && filteredOptions.length === 0) {
          onCreateNew(searchValue.trim());
        }
      }
    },
    [
      filteredOptions,
      focusedIndex,
      searchValue,
      onSelectionChange,
      onCreateNew,
      isSelected,
    ],
  );

  const showCreateNew = searchValue.trim() && filteredOptions.length === 0;

  return (
    <div className="w-64 bg-white border border-gray-200 rounded-md shadow-lg p-2">
      {/* Search Input */}
      <div className="relative mb-2">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-8 text-sm"
          autoFocus
        />
      </div>

      {/* Options List */}
      <div className="max-h-48 overflow-y-auto">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option, index) => {
            const selected = isSelected(option);
            return (
              <div
                key={option.id}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer transition-colors",
                  focusedIndex === index && "bg-gray-100",
                  selected && "bg-blue-50 text-blue-700",
                  !selected && "hover:bg-gray-50",
                )}
                onClick={() => onSelectionChange(option, selected)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                <div className="flex-1">{option.label}</div>
                {selected && <Check className="h-4 w-4 text-blue-600" />}
              </div>
            );
          })
        ) : (
          <div className="text-sm text-gray-500 px-2 py-1.5">
            No options found
          </div>
        )}

        {/* Create New Option */}
        {showCreateNew && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCreateNew(searchValue.trim())}
            className="w-full justify-start px-2 py-1.5 h-auto text-sm font-normal text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create "{searchValue.trim()}"
          </Button>
        )}
      </div>
    </div>
  );
};
