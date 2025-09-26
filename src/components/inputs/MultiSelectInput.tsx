import * as React from "react";
import { cn } from "@/lib/utils";
import { Tag } from "../Tag";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import Icon from "../ui/Icon";
import { CopyOnHover } from "./CopyOnHover";

export interface MultiSelectItem {
  id: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectedItemUIProps {
  item: MultiSelectItem;
  onRemove?: () => void;
  removable?: boolean;
}

export interface MultiSelectInputProps {
  label: string;
  labelPosition?: "left" | "above";
  value: MultiSelectItem[];
  options: MultiSelectItem[];
  onChange: (items: MultiSelectItem[]) => void;
  selectedItemUI?: React.ComponentType<SelectedItemUIProps>;
  addButtonText?: string;
  searchPlaceholder?: string;
  maxWidth?: string;
  disabled?: boolean;
  showAddButton?: boolean;
  allowRemove?: boolean;
  fullWidthButton?: boolean;
  className?: string;
  placeholder?: string;
}

const DefaultSelectedItemUI: React.FC<SelectedItemUIProps> = ({ item, onRemove, removable }) => (
  <Tag label={item.label} onRemove={onRemove} removable={removable} variant="default" />
);

// Utility to extract the main noun from a label and generate add/search text
function getNounFromLabel(label: string): { nounSingular: string; nounPlural: string } {
  // Remove common suffixes like 'List', 'Type', etc.
  let base = label.trim();
  base = base.replace(/list$/i, '').replace(/type$/i, '').replace(/types$/i, '').replace(/list$/i, '').replace(/info$/i, '').replace(/group$/i, '').replace(/status$/i, '').replace(/codes?$/i, '').replace(/services?$/i, '').replace(/classifications?$/i, '').replace(/specialties$/i, 'specialty').replace(/languages$/i, 'language').replace(/\s+$/, '');
  // Take the last word as the noun, unless it's a stopword
  let words = base.split(/\s+/).filter(Boolean);
  let noun = words[words.length - 1] || base;
  // Special cases
  if (/services?/i.test(label)) noun = 'service';
  if (/specialties?/i.test(label)) noun = 'specialty';
  if (/languages?/i.test(label)) noun = 'language';
  if (/codes?/i.test(label)) noun = 'code';
  if (/classifications?/i.test(label)) noun = 'classification';
  // Pluralize (very basic)
  let nounPlural = noun;
  if (noun.endsWith('y')) {
    nounPlural = noun.slice(0, -1) + 'ies';
  } else if (!noun.endsWith('s')) {
    nounPlural = noun + 's';
  }
  // Capitalize
  noun = noun.charAt(0).toUpperCase() + noun.slice(1);
  nounPlural = nounPlural.charAt(0).toLowerCase() + nounPlural.slice(1);
  return { nounSingular: noun, nounPlural };
}

export const MultiSelectInput = React.forwardRef<HTMLDivElement, MultiSelectInputProps>(
  (
    {
      className,
      label,
      labelPosition = "left",
      value = [],
      options = [],
      onChange,
      selectedItemUI: SelectedItemComponent = DefaultSelectedItemUI,
      addButtonText,
      searchPlaceholder,
      maxWidth = "568px",
      disabled = false,
      showAddButton = true,
      allowRemove = true,
      fullWidthButton = false,
      placeholder,
      ...props
    },
    ref,
  ) => {
    // Console log the label
    console.log('MultiSelectInput label:', label);
    
    // Extra safety: ensure value and options are never undefined
    value = Array.isArray(value) ? value : [];
    options = options ?? [];

    // Filter out any invalid items from value array
    const validValue = value.filter(item => item && typeof item === 'object' && item.id !== undefined && item.label !== undefined);
    
    // If the filtered array is different from the original, update the parent
    React.useEffect(() => {
      if (validValue.length !== value.length) {
        onChange(validValue);
      }
    }, [value, validValue, onChange]);

    // Generate add/search text if not provided
    const { nounSingular, nounPlural } = getNounFromLabel(label);
    const computedAddButtonText = addButtonText || `Add ${nounSingular}`;
    const computedSearchPlaceholder = searchPlaceholder || `Search ${nounPlural}`;
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);
    const anchorRef = React.useRef<HTMLButtonElement>(null);
    const [contentWidth, setContentWidth] = React.useState<number | undefined>(undefined);
    const [isHovered, setIsHovered] = React.useState(false);

    const handleSelectionChange = React.useCallback(
      (item: MultiSelectItem, isSelected: boolean) => {
        if (disabled) return;
        let newItems: MultiSelectItem[];
        if (isSelected) {
          newItems = validValue.filter((existing) => existing.id !== item.id);
        } else {
          const itemExists = validValue.some((existing) => existing.id === item.id);
          if (!itemExists) {
            newItems = [...validValue, item];
          } else {
            newItems = validValue;
          }
        }
        onChange(newItems);
      },
      [validValue, onChange, disabled],
    );

    const handleCreateNew = React.useCallback(
      (label: string) => {
        if (disabled) return;
        const newItem: MultiSelectItem = {
          id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          label: label.trim(),
        };
        const newItems = [...validValue, newItem];
        onChange(newItems);
        setOpen(false);
      },
      [validValue, onChange, disabled],
    );

    const handleRemove = React.useCallback(
      (itemToRemove: MultiSelectItem) => {
        if (disabled) return;
        const newItems = validValue.filter((item) => item.id !== itemToRemove.id);
        onChange(newItems);
      },
      [validValue, onChange, disabled],
    );

    React.useEffect(() => {
      if (open && containerRef.current) {
        setContentWidth(containerRef.current.offsetWidth);
      }
    }, [open]);

    return (
      <div
        ref={containerRef}
        className={cn(
          labelPosition === "above"
            ? "flex flex-col items-start gap-1 min-w-0"
            : "flex items-start gap-2 min-w-0",
          className
        )}
        {...props}
      >
        {label && (
          <label className={cn(
            "text-xs font-semibold",
            labelPosition === "left" && "min-w-[120px] max-w-[120px] break-words whitespace-normal mt-3"
          )}>{label}</label>
        )}
        <div 
          data-testid="multiselect-input-container" 
          className={cn("flex-1 flex items-start gap-2")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        > {/* Value UI container */}
          <Popover open={open} onOpenChange={(newOpen) => {
        
            setOpen(newOpen);
          }}>
            <PopoverTrigger asChild>
              <div
                ref={containerRef}
                className={cn(
                  "flex flex-wrap items-center gap-1 rounded px-2 min-h-[40px] bg-white relative z-10 flex-1",
                  disabled && "opacity-50 cursor-not-allowed",
                  labelPosition === "left" && "min-h-[38px]"
                )}
                tabIndex={0}
                role="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                style={{ width: '100%' }}
                onClick={() => { if (!disabled) setOpen((prev) => !prev); }}
              >
                {/* Only show selected items and their remove buttons if there are selected values */}
                {validValue.length > 0 && validValue.map((item) => (
                  <SelectedItemComponent
                    key={item.id}
                    item={item}
                    onRemove={allowRemove ? () => handleRemove(item) : undefined}
                    removable={allowRemove}
                  />
                ))}
                <button
                  className="py-1 px-2 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded transition-colors duration-150"
                  tabIndex={-1}
                  aria-label={computedAddButtonText}
                >
                  <span className="text-xs font-medium mr-2">Add</span>
                  <Icon icon="plus" className="h-4 w-4" />
                </button>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 z-[9999]"
              align="start"
              sideOffset={0}
              style={{ width: containerRef.current ? containerRef.current.offsetWidth : undefined }}
            >
              <MultiSelectDropdown
                options={options}
                selectedItems={validValue}
                onSelectionChange={handleSelectionChange}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder={placeholder || computedSearchPlaceholder}
                onCreateNew={handleCreateNew}
                className="w-full"
              />
            </PopoverContent>
          </Popover>
          {/* CopyOnHover component to the right of the Value UI container - only show if there are values */}
          {validValue.length > 0 && (
            <CopyOnHover
              value={validValue.map(item => item.label).join(', ')}
              isHovered={isHovered}
              disabled={disabled}
              className="mt-1"
              ariaLabel="Copy selected items"
              dataTestId="multiselect-copy-button"
            />
          )}
        </div>
      </div>
    );
  },
);

MultiSelectInput.displayName = "MultiSelectInput"; 