import React, { useState, useRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import CopyOnHover from "./CopyOnHover";

interface TextInputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  labelPosition?: "left" | "above";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  type?: "text" | "date" | "email" | "url" | "tel";
}

// Utility: format YYYY-MM-DD or ISO date string as MM/DD/YYYY
function formatDateForDisplay(val: any): string {
  if (!val) return '';
  if (typeof val !== 'string') return String(val);
  // Match YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ
  const match = val.match(/^\d{4}-\d{2}-\d{2}/);
  if (match) {
    const [year, month, day] = match[0].split('-');
    if (year && month && day) {
      return `${month}/${day}/${year}`;
    }
  }
  return val;
}

// Utility: convert MM/DD/YYYY to YYYY-MM-DD for date inputs
function formatDateForInput(val: string): string {
  if (!val) return '';
  // Match MM/DD/YYYY format
  const match = val.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const [, month, day, year] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return val;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  labelPosition = "left",
  value,
  onChange,
  placeholder = "",
  disabled = false,
  className = "",
  type = "text",
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

  // Only show placeholder when focused
  const showPlaceholder = focused;

  // Only apply date formatting for date type inputs
  const isDateType = type === "date" || rest.name?.includes('date') || rest.name?.includes('Date');
  const displayValue = isDateType ? formatDateForDisplay(value) : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (isDateType) {
      // For date inputs, convert MM/DD/YYYY to YYYY-MM-DD for storage
      const formattedValue = formatDateForInput(newValue);
      onChange(formattedValue);
    } else {
      onChange(newValue);
    }
  };


  return (
    <div className={labelPosition === "above" ? `gap-2 flex flex-col items-start ${className}` : `flex items-center ${className}`}>
      {label && (
        <label className={labelPosition === "above" 
          ? "text-xs font-semibold" 
          : "mr-2 text-xs font-semibold min-w-[120px] max-w-[120px] align-top break-words whitespace-normal"}>
          {label}
        </label>
      )}
      <div
        className="flex flex-1 items-center h-[38px] relative w-full"
      >
        <input
          type={type}
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={showPlaceholder ? placeholder : ""}
          disabled={disabled}
          className={cn(
            "w-full px-2 py-[10px] pr-8 text-xs font-poppins text-gray-600 border border-gray-300 rounded bg-white outline-none transition-colors",
            "focus:ring-2 focus:ring-blue-200",
            disabled && "opacity-50 bg-gray-100",
            className
          )}
          style={{ height: 38 }}
          {...rest}
        />
        {value && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            <CopyOnHover 
              value={value}
              ariaLabel={`Copy ${label || 'value'} to clipboard`}
              dataTestId={`text-input-copy-${label?.toLowerCase().replace(/\s+/g, '-') || 'field'}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TextInputField; 