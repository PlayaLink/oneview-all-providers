import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MultiSelectItem } from "./MultiSelectInput";

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
  const [searchValue, setSearchValue] = React.useState("");
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Filter options based on search value
  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [options, searchValue]);

  // Handle outside click to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        setSearchValue(value?.label || "");
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, value]);

  // When value changes, update searchValue
  React.useEffect(() => {
    if (!dropdownOpen) {
      setSearchValue(value ? value.label : "");
    }
  }, [value, dropdownOpen]);

  const handleInputFocus = () => {
    if (!disabled) setDropdownOpen(true);
    setSearchValue("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setDropdownOpen(true);
  };

  const handleSelect = (item: MultiSelectItem) => {
    if (disabled) return;
    onChange(item);
    setDropdownOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(null);
    setSearchValue("");
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        labelPosition === "left"
          ? "flex items-center gap-2 min-w-0"
          : "flex flex-col gap-1",
        className,
      )}
      style={{ position: "relative" }}
    >
      {label && (
        <label className="text-xs font-semibold mb-1 min-w-[120px]">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={dropdownOpen ? searchValue || "" : value?.label || ""}
          onFocus={handleInputFocus}
          onChange={handleInputChange}
          placeholder={dropdownOpen ? placeholder : ""}
          disabled={disabled}
          className={cn(
            "w-full px-2 py-[10px] text-xs font-poppins text-[#4C5564] border border-gray-300 rounded bg-white outline-none transition-colors",
            "focus:ring-2 focus:ring-blue-200",
            disabled && "opacity-50 cursor-not-allowed bg-gray-100",
          )}
        />
        {/* Only show clear X if a value is set and not searching */}
        {value && !dropdownOpen && (
          <button
            type="button"
            className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center justify-center px-1 text-[#BABABA] hover:text-gray-600 focus:outline-none"
            onClick={handleClear}
            tabIndex={-1}
            disabled={disabled}
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center px-1">
          <ChevronDown className="h-4 w-4 text-[#545454]" />
        </span>
        {/* Dropdown List */}
        {dropdownOpen && (
          <div
            className="absolute left-0 z-50 w-full bg-white border border-gray-300 rounded-b shadow-lg max-h-60 overflow-y-auto"
            style={{
              minWidth: inputRef.current?.offsetWidth || undefined,
              top: "calc(100% + 1px)",
            }}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-2 text-xs text-[#BABABA] font-poppins">
                {searchValue
                  ? "No matching options found"
                  : "No options available"}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value && value.id === option.id;
                const isDisabled = option.disabled;
                return (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-center gap-2 px-2 py-2 cursor-pointer transition-colors",
                      isSelected
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50",
                      isDisabled && "opacity-50 cursor-not-allowed",
                    )}
                    onClick={() => {
                      if (!isDisabled) handleSelect(option);
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
        )}
      </div>
    </div>
  );
};

export default SingleSelectInput;
