import * as React from "react";
import { MultiSelect, MultiSelectItem } from "oneview-react-multiselect-component";

export interface MultiSelectInputProps {
  label?: string;
  labelPosition?: "left" | "top";
  value: MultiSelectItem[];
  options: MultiSelectItem[];
  onChange: (items: MultiSelectItem[]) => void;
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

export const MultiSelectInput = React.forwardRef<HTMLDivElement, MultiSelectInputProps>(
  (
    {
      label,
      labelPosition = "top",
      value = [],
      options = [],
      onChange,
      addButtonText,
      searchPlaceholder,
      maxWidth,
      disabled,
      showAddButton,
      allowRemove,
      fullWidthButton,
      className,
      placeholder,
      ...props
    },
    ref,
  ) => {
    return (
      <MultiSelect
        ref={ref}
        label={label}
        labelPosition={labelPosition}
        value={value}
        options={options}
        onChange={onChange}
        addButtonText={addButtonText}
        searchPlaceholder={searchPlaceholder}
        maxWidth={maxWidth}
        disabled={disabled}
        showAddButton={showAddButton}
        allowRemove={allowRemove}
        fullWidthButton={fullWidthButton}
        className={className}
        placeholder={placeholder}
        {...props}
      />
    );
  }
);

MultiSelectInput.displayName = "MultiSelectInput"; 