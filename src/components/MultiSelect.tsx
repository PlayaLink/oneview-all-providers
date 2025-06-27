import * as React from "react";
import { Plus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

import { cn } from "@/lib/utils";
import { Tag } from "./Tag";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

const multiSelectVariants = cva("flex w-full gap-1", {
  variants: {
    orientation: {
      horizontal: "flex-row items-start",
      vertical: "flex-col",
    },
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    size: "default",
  },
});

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

export interface MultiSelectProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * Label displayed next to the component
   */
  label?: string;

  /**
   * Currently selected items
   */
  value: MultiSelectItem[];
  /**
   * Available options to select from
   */
  options: MultiSelectItem[];
  /**
   * Callback when items are added or removed
   */
  onChange: (items: MultiSelectItem[]) => void;
  /**
   * Custom component to render each selected item
   * Receives item, onRemove, and removable props
   */
  selectedItemUI?: React.ComponentType<SelectedItemUIProps>;
  /**
   * Text displayed on the add button
   */
  addButtonText?: string;
  /**
   * Placeholder text for the search input
   */
  searchPlaceholder?: string;
  /**
   * Maximum width of the component
   */
  maxWidth?: string;
  /**
   * Whether the component is disabled
   */
  disabled?: boolean;
  /**
   * Whether to show the add button
   */
  showAddButton?: boolean;
  /**
   * Whether items can be removed
   */
  allowRemove?: boolean;
  /**
   * Whether the add button should take full width on its own line
   */
  fullWidthButton?: boolean;
}

/**
 * MultiSelect Component
 *
 * A modern, accessible multi-select component with tags and dropdown functionality.
 * Built with React, TypeScript, and Tailwind CSS.
 *
 * @example
 * ```tsx
 * const [selectedItems, setSelectedItems] = useState<MultiSelectItem[]>([]);
 * const options = [
 *   { id: 1, label: "Option 1" },
 *   { id: 2, label: "Option 2" },
 * ];
 *
 * <MultiSelect
 *   label="Select items"
 *   value={selectedItems}
 *   options={options}
 *   onChange={setSelectedItems}
 * />
 * ```
 */
// Default selected item component
const DefaultSelectedItemUI: React.FC<SelectedItemUIProps> = ({
  item,
  onRemove,
  removable,
}) => (
  <Tag
    label={item.label}
    onRemove={onRemove}
    removable={removable}
    variant="default"
  />
);

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      className,
      orientation,
      size,
      label = "Tags",
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
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const [showCopied, setShowCopied] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const copiedTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleSelectionChange = React.useCallback(
      (item: MultiSelectItem, isSelected: boolean) => {
        if (disabled) return;

        let newItems: MultiSelectItem[];
        if (isSelected) {
          // Remove item
          newItems = value.filter((existing) => existing.id !== item.id);
        } else {
          // Add item
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

        // Create new item with unique ID (timestamp + random to avoid collisions)
        const newItem: MultiSelectItem = {
          id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          label: label.trim(),
        };

        // Add to selected items
        const newItems = [...value, newItem];
        onChange(newItems);

        // Close dropdown
        setOpen(false);
      },
      [value, onChange, disabled],
    );

    const handleRemove = React.useCallback(
      (itemToRemove: MultiSelectItem) => {
        if (disabled || !allowRemove) return;
        const newItems = value.filter((item) => item.id !== itemToRemove.id);
        onChange(newItems);
      },
      [value, onChange, disabled, allowRemove],
    );

    const handleOpenChange = React.useCallback(
      (newOpen: boolean) => {
        if (disabled) return;
        setOpen(newOpen);
        if (!newOpen) {
          setSearchValue("");
        }
      },
      [disabled],
    );

    const handleCopy = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!value || value.length === 0) return;

      const textToCopy = value.map((item) => item.label).join(", ");

      try {
        // Always use the fallback method in iframe environments to avoid permission issues
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (!successful) {
          throw new Error("Failed to copy using fallback method");
        }

        setShowCopied(true);

        // Clear any existing timeout
        if (copiedTimeoutRef.current) {
          clearTimeout(copiedTimeoutRef.current);
        }

        // Hide tooltip after 2 seconds
        copiedTimeoutRef.current = setTimeout(() => {
          setShowCopied(false);
          copiedTimeoutRef.current = null;
        }, 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
        // Still show the tooltip even if copy failed, for better UX
        setShowCopied(true);

        if (copiedTimeoutRef.current) {
          clearTimeout(copiedTimeoutRef.current);
        }

        copiedTimeoutRef.current = setTimeout(() => {
          setShowCopied(false);
          copiedTimeoutRef.current = null;
        }, 2000);
      }
    };

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (copiedTimeoutRef.current) {
          clearTimeout(copiedTimeoutRef.current);
        }
      };
    }, []);

    // Calculate available options (excluding already selected items)
    const availableOptions = React.useMemo(() => {
      return options.filter((option) => !option.disabled);
    }, [options]);

    // Label component
    const LabelComponent = label ? (
      <div
        className="flex w-[153px] items-start"
        style={{ padding: "7px 8px", width: "var(--Label-width, 153px)" }}
      >
        <span className="text-xs font-semibold text-[#545454] font-poppins tracking-[0.429px] break-words">
          {label}
        </span>
      </div>
    ) : null;

    // Value container with selected items and add button
    const ValueContainer =
      showAddButton && availableOptions.length > 0 ? (
        <div className="relative">
          <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
              <div className="absolute top-0 left-0 w-1 h-1 opacity-0 pointer-events-none" />
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 border-0 bg-transparent shadow-none"
              align="start"
              side="bottom"
              sideOffset={6}
              alignOffset={8}
            >
              <MultiSelectDropdown
                options={availableOptions}
                selectedItems={value}
                onSelectionChange={handleSelectionChange}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder={searchPlaceholder}
                onCreateNew={handleCreateNew}
              />
            </PopoverContent>
          </Popover>

          {/* Content container */}
          <div
            className={cn(
              "flex flex-1 min-h-[32px] pl-2 py-[6px] border border-[#E6E6E6] rounded",
              fullWidthButton
                ? "flex-col gap-2"
                : "flex-wrap items-center gap-2",
            )}
          >
            {/* Selected Items */}
            {fullWidthButton ? (
              <div className="flex flex-col gap-2 w-full">
                {value.map((item) => (
                  <div key={item.id} onClick={(e) => e.stopPropagation()}>
                    <SelectedItemComponent
                      item={item}
                      onRemove={
                        allowRemove ? () => handleRemove(item) : undefined
                      }
                      removable={allowRemove && !disabled}
                    />
                  </div>
                ))}
              </div>
            ) : (
              value.map((item) => (
                <div key={item.id} onClick={(e) => e.stopPropagation()}>
                  <SelectedItemComponent
                    item={item}
                    onRemove={
                      allowRemove ? () => handleRemove(item) : undefined
                    }
                    removable={allowRemove && !disabled}
                  />
                </div>
              ))
            )}

            {/* Add Button - now just triggers the popup */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={() => !disabled && setOpen(!open)}
              className={cn(
                "bg-[#FFF] px-2 py-0.5 text-xs font-semibold text-[#006CAB] hover:bg-blue-50 hover:text-blue-800 border-0 shadow-none rounded font-poppins tracking-[0.429px] disabled:opacity-50",
                fullWidthButton ? "w-full h-auto p-2 justify-start" : "h-6",
              )}
            >
              {addButtonText}
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-1 min-h-[32px] pl-2",
            fullWidthButton ? "flex-col gap-2" : "flex-wrap items-center gap-2",
          )}
        >
          {/* Selected Items */}
          {fullWidthButton ? (
            <div className="flex flex-col gap-2 w-full">
              {value.map((item) => (
                <SelectedItemComponent
                  key={item.id}
                  item={item}
                  onRemove={allowRemove ? () => handleRemove(item) : undefined}
                  removable={allowRemove && !disabled}
                />
              ))}
            </div>
          ) : (
            value.map((item) => (
              <SelectedItemComponent
                key={item.id}
                item={item}
                onRemove={allowRemove ? () => handleRemove(item) : undefined}
                removable={allowRemove && !disabled}
              />
            ))
          )}

          {/* Add Button (without dropdown) */}
          {showAddButton && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={true}
              className={cn(
                "bg-[#FFF] px-2 py-0.5 text-xs font-semibold text-[#006CAB] hover:bg-blue-50 hover:text-blue-800 border-0 shadow-none rounded font-poppins tracking-[0.429px] opacity-50",
                fullWidthButton ? "w-full h-auto p-2 justify-start" : "h-6",
              )}
            >
              {addButtonText}
              <Plus className="h-3 w-3" />
            </Button>
          )}
        </div>
      );
    return (
      <div
        className={cn(
          multiSelectVariants({ orientation, size }),
          "h-auto flex-grow-0",
          disabled && "opacity-50 pointer-events-none",
          className,
        )}
        style={{ maxWidth }}
        ref={ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {LabelComponent}
        <div className="flex items-start gap-1 flex-1">
          {ValueContainer}

          {/* Copy button - outside input, only show when there are selected items */}
          {value && value.length > 0 && (
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={handleCopy}
                disabled={disabled}
                className={cn(
                  "flex w-[20.5px] h-5 py-[1.667px] justify-center items-center gap-[6.667px] rounded-[3.333px] hover:bg-gray-50 transition-all disabled:opacity-50",
                  isHovered ? "opacity-100" : "opacity-0",
                )}
              >
                <FontAwesomeIcon
                  icon={faCopy}
                  className="text-[14px] text-[#3E88D5]"
                />
              </button>

              {/* Tooltip */}
              {showCopied && (
                <div className="absolute -top-[35px] left-1/2 transform -translate-x-1/2 z-50">
                  <div className="flex py-[6.667px] px-[13.333px] flex-col justify-end items-center gap-[13.333px] rounded-[3.333px] border border-[#E6E6E6] bg-white shadow-md">
                    <div className="text-[#545454] text-center text-[10px] font-normal leading-normal tracking-[0.357px] font-['Poppins',sans-serif]">
                      Copied
                    </div>
                    {/* Arrow pointing down */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3.75px] border-r-[3.75px] border-t-[8.333px] border-l-transparent border-r-transparent border-t-[#E6E6E6]" />
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3.75px] border-r-[3.75px] border-t-[7.5px] border-l-transparent border-r-transparent border-t-white translate-y-[-1px]" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

MultiSelect.displayName = "MultiSelect";
