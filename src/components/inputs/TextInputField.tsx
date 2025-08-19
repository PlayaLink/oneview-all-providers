import React, { useState, useRef, InputHTMLAttributes } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

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
  const [isHovered, setIsHovered] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const copiedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;
    try {
      const textArea = document.createElement("textarea");
      textArea.value = value;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShowCopied(true);
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
      copiedTimeoutRef.current = setTimeout(() => {
        setShowCopied(false);
        copiedTimeoutRef.current = null;
      }, 2000);
    } catch (err) {
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowCopied(false);
          if (copiedTimeoutRef.current) {
            clearTimeout(copiedTimeoutRef.current);
            copiedTimeoutRef.current = null;
          }
        }}
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
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "flex w-[20.5px] h-5 py-[1.667px] justify-center items-center gap-[6.667px] rounded-[3.333px] hover:bg-gray-50 transition-all",
                isHovered ? "opacity-100" : "opacity-0"
              )}
              tabIndex={-1}
            >
              <FontAwesomeIcon icon={faCopy} className="text-[14px] text-blue-600" />
            </button>
            {/* Tooltip */}
            {showCopied && isHovered && (
              <div className="absolute -top-[35px] left-1/2 transform -translate-x-1/2 z-50">
                <div className="flex py-[6.667px] px-[13.333px] flex-col justify-end items-center gap-[13.333px] rounded-[3.333px] border border-gray-200 bg-white shadow-md">
                  <div className="text-gray-600 text-center text-[10px] font-normal leading-normal tracking-[0.357px] font-['Poppins',sans-serif]">
                    Copied
                  </div>
                  {/* Arrow pointing down */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3.75px] border-r-[3.75px] border-t-[8.333px] border-l-transparent border-r-transparent border-t-gray-200" />
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3.75px] border-r-[3.75px] border-t-[7.5px] border-l-transparent border-r-transparent border-t-white translate-y-[-1px]" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextInputField; 