import React, { useState, InputHTMLAttributes } from "react";
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

  // Only show placeholder when focused
  const showPlaceholder = focused;

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
        <label className="text-xs font-semibold mb-1 min-w-[120px]">{label}</label>
      )}
      <div className="flex-1">{input}</div>
    </div>
  );
};

export default TextInputField; 