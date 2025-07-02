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
  label?: string;
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

export const MultiSelectInput = React.forwardRef<HTMLDivElement, MultiSelectInputProps>(
  (
    {
      className,
      label = "Tags",
      labelPosition,
      value = [],
      options = [],
      onChange,
      selectedItemUI: SelectedItemComponent = DefaultSelectedItemUI,
      addButtonText = "Add Tags",
      searchPlaceholder = "Search tags",
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
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");

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

    return (
      <div className={cn(
        (labelPosition === "left" ? "flex items-center gap-2 min-w-0" : "flex flex-col gap-1"),
        className
      )} ref={ref} {...props}>
        {label && <label className="text-xs font-semibold mb-1">{label}</label>}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div
              className={cn(
                "flex flex-wrap items-center gap-1 border border-gray-300 rounded px-2 py-1 min-h-[40px] bg-white cursor-pointer",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !disabled && setOpen(true)}
            >
              {value.length === 0 && (
                <span className="text-gray-400 text-xs">{addButtonText}</span>
              )}
              {value.map((item) => (
                <SelectedItemComponent
                  key={item.id}
                  item={item}
                  onRemove={allowRemove ? () => handleRemove(item) : undefined}
                  removable={allowRemove}
                />
              ))}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-auto"
                tabIndex={-1}
                disabled={disabled}
              >
                <Plus className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[411px]" align="start">
            <MultiSelectDropdown
              options={options}
              selectedItems={value}
              onSelectionChange={handleSelectionChange}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              searchPlaceholder={placeholder || searchPlaceholder}
              onCreateNew={handleCreateNew}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

MultiSelectInput.displayName = "MultiSelectInput"; 