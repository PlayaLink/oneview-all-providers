import React, { useState, useRef, InputHTMLAttributes } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

interface TextInputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  labelPosition?: "left" | "top";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  labelPosition = "top",
  value,
  onChange,
  placeholder = "",
  disabled = false,
  className = "",
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const copiedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Only show placeholder when focused
  const showPlaceholder = focused;

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

  const input = (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={showPlaceholder ? placeholder : ""}
      disabled={disabled}
      className={cn(
        "w-full px-2 py-[10px] text-xs font-poppins text-[#4C5564] border border-gray-300 rounded bg-white outline-none transition-colors",
        "focus:ring-2 focus:ring-blue-200",
        disabled && "opacity-50 cursor-not-allowed bg-gray-100",
        className
      )}
      {...rest}
    />
  );

  return (
    <div className={cn(
      labelPosition === "left" ? "flex items-center gap-2 min-w-0" : "flex flex-col gap-1",
      className
    )}>
      {label && (
        <label
          className={cn(
            "text-xs font-semibold mb-1",
            labelPosition === "left" && "min-w-[120px] max-w-[120px] break-words whitespace-normal"
          )}
        >
          {label}
        </label>
      )}
      <div
        className="flex flex-1 items-center h-[38px] relative"
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
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={showPlaceholder ? placeholder : ""}
          disabled={disabled}
          className={cn(
            "w-full px-2 py-[10px] pr-8 text-xs font-poppins text-[#4C5564] border border-gray-300 rounded bg-white outline-none transition-colors",
            "focus:ring-2 focus:ring-blue-200",
            disabled && "opacity-50 cursor-not-allowed bg-gray-100",
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
              disabled={disabled}
              className={cn(
                "flex w-[20.5px] h-5 py-[1.667px] justify-center items-center gap-[6.667px] rounded-[3.333px] hover:bg-gray-50 transition-all disabled:opacity-50",
                isHovered ? "opacity-100" : "opacity-0"
              )}
              tabIndex={-1}
            >
              <FontAwesomeIcon icon={faCopy} className="text-[14px] text-[#3E88D5]" />
            </button>
            {/* Tooltip */}
            {showCopied && isHovered && (
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
};

export default TextInputField; 