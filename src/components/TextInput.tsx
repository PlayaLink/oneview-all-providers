import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

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

  const handleFocus = () => {
    setHasBeenFocused(true);
  };

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
    }
  };

  return (
    <div className="flex items-start gap-1 self-stretch">
      <div className="flex w-[153px] py-[7px] px-2 items-start gap-1">
        <div className="text-[#545454] text-xs font-semibold leading-normal tracking-[0.429px] font-['Poppins',sans-serif]">
          {label}
        </div>
      </div>
      <div
        className="flex py-[6px] px-2 items-start gap-2 flex-1 rounded border border-[#E6E6E6] relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          placeholder={hasBeenFocused ? placeholder : ""}
          disabled={disabled}
          className="flex-1 text-[#545454] text-xs font-normal leading-normal tracking-[0.429px] font-['Poppins',sans-serif] bg-transparent border-none outline-none placeholder:text-gray-400"
        />
        {showCopyButton && value && isHovered && (
          <button
            onClick={handleCopy}
            className="flex w-[20.5px] h-5 py-[1.667px] px-[3.75px] justify-center items-center gap-[6.667px] rounded-[3.333px] hover:bg-gray-100 transition-colors"
          >
            <FontAwesomeIcon
              icon={faCopy}
              className="w-3 h-3 text-[#545454] hover:text-[#008BC9] cursor-pointer transition-colors"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default TextInput;
