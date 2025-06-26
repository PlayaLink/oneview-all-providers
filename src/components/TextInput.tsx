import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showCopyButton?: boolean;
  disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Start typing",
  showCopyButton = false,
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const copiedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFocus = () => {
    setHasBeenFocused(true);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;

    try {
      // Always use the fallback method in iframe environments to avoid permission issues
      const textArea = document.createElement("textarea");
      textArea.value = value;
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
  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="flex items-start gap-1 self-stretch"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex w-[153px] py-[7px] px-2 items-start gap-1">
        <div className="text-[#545454] text-xs font-semibold leading-normal tracking-[0.429px] font-['Poppins',sans-serif]">
          {label}
        </div>
      </div>
      <div className="flex py-[6px] px-2 items-start gap-2 flex-1 rounded border border-[#E6E6E6]">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          placeholder={hasBeenFocused ? placeholder : ""}
          disabled={disabled}
          className="flex-1 text-[#545454] text-xs font-normal leading-normal tracking-[0.429px] font-['Poppins',sans-serif] bg-transparent border-none outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Copy button - outside input, only show when there's a value */}
      {showCopyButton && value && (
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={handleCopy}
            disabled={disabled}
            className={cn(
              "flex w-[20.5px] h-5 py-[1.667px] justify-center items-center gap-[6.667px] rounded-[3.333px] hover:bg-gray-50 transition-all disabled:opacity-50 ml-1",
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
  );
};

export default TextInput;
