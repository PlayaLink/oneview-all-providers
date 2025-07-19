import React from "react";
import { cn } from "@/lib/utils";

interface FormCheckboxProps {
  label: string;
  checked?: boolean;
  className?: string;
  "data-testid"?: string;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  checked = false,
  className = "",
  "data-testid": testId,
}) => {
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      data-testid={testId}
    >
      <div
        className={cn(
          "w-[18px] h-[18px] rounded-[2px] border border-[#BABABA] bg-white",
          checked && "bg-[#008BC9] border-[#008BC9]",
        )}
        role="checkbox"
        aria-checked={checked}
      />
      <span className="text-black text-xs font-normal leading-normal tracking-[0.429px] font-['Poppins',sans-serif]">
        {label}
      </span>
    </div>
  );
};

export { FormCheckbox };
