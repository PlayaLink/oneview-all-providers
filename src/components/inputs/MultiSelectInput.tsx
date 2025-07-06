import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tag } from "../Tag";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

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
  labelPosition?: "left" | "top";
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
      labelPosition,
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
    // Extra safety: ensure value and options are never undefined
    value = value ?? [];
    options = options ?? [];

    // Generate add/search text if not provided
    const { nounSingular, nounPlural } = getNounFromLabel(label);
    const computedAddButtonText = addButtonText || `Add ${nounSingular}`;
    const computedSearchPlaceholder = searchPlaceholder || `Search ${nounPlural}`;
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);
    const anchorRef = React.useRef<HTMLButtonElement>(null);
    const [contentWidth, setContentWidth] = React.useState<number | undefined>(undefined);

    const handleSelectionChange = React.useCallback(
      (item: MultiSelectItem, isSelected: boolean) => {
        if (disabled) return;
        let newItems: MultiSelectItem[];
        if (isSelected) {
          newItems = value.filter((existing) => existing.id !== item.id);
        } else {
          const itemExists = value.some((existing) => existing.id === item.id);
          if (!itemExists) {
            newItems = [...value, item];
          } else {
            newItems = value;
          }
        }
        onChange(newItems);
      },
      [value, onChange, disabled],
    );

    const handleCreateNew = React.useCallback(
      (label: string) => {
        if (disabled) return;
        const newItem: MultiSelectItem = {
          id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          label: label.trim(),
        };
        const newItems = [...value, newItem];
        onChange(newItems);
        setOpen(false);
      },
      [value, onChange, disabled],
    );

    const handleRemove = React.useCallback(
      (itemToRemove: MultiSelectItem) => {
        if (disabled) return;
        const newItems = value.filter((item) => item.id !== itemToRemove.id);
        onChange(newItems);
      },
      [value, onChange, disabled],
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
          (labelPosition === "left" ? "flex items-start gap-2 min-w-0" : "flex flex-col gap-1"),
          className
        )}
        {...props}
      >
        {label && (
          <label className={cn(
            "text-xs font-semibold mb-1",
            labelPosition === "left" && "min-w-[120px] max-w-[120px] break-words whitespace-normal"
          )}>{label}</label>
        )}
        <div className={cn("flex-1")}> {/* Value UI container */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div
                ref={containerRef}
                className={cn(
                  "flex flex-wrap items-center gap-1 rounded px-2 min-h-[40px] bg-white cursor-pointer relative z-10",
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
                {value.length > 0 && value.map((item) => (
                  <SelectedItemComponent
                    key={item.id}
                    item={item}
                    onRemove={allowRemove ? () => handleRemove(item) : undefined}
                    removable={allowRemove}
                  />
                ))}
                {value.length === 0 && (
                  <span className="text-gray-400 text-xs mr-1">{computedAddButtonText}</span>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 p-0 flex items-center justify-center"
                  tabIndex={-1}
                  disabled={disabled}
                  aria-label={computedAddButtonText}
                >
                  <Plus className="h-4 w-4 text-gray-600 group-hover:text-[#008BC9] transition-colors duration-150" />
                </Button>
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
                selectedItems={value}
                onSelectionChange={handleSelectionChange}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder={placeholder || computedSearchPlaceholder}
                onCreateNew={handleCreateNew}
                className="w-full"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  },
);

MultiSelectInput.displayName = "MultiSelectInput"; 