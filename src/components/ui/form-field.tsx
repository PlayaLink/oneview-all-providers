import React from "react";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

interface FormFieldProps {
  label: string;
  value?: string | number;
  className?: string;
  fieldClassName?: string;
  isDropdown?: boolean;
  width?: "full" | "half" | "quarter" | "custom";
  customWidth?: string;
  "data-testid"?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value = "",
  className = "",
  fieldClassName = "",
  isDropdown = false,
  width = "full",
  customWidth,
  "data-testid": testId,
}) => {
  const getWidthClass = () => {
    switch (width) {
      case "half":
        return "flex-1";
      case "quarter":
        return "w-1/4";
      case "custom":
        return customWidth || "flex-1";
      default:
        return "w-full";
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-1 px-2",
        getWidthClass(),
        className,
      )}
      data-testid={testId}
    >
      <label className="flex py-[3px] items-center gap-4 self-stretch">
        <span className="text-[#545454] text-xs font-semibold leading-normal tracking-[0.429px] font-['Poppins',sans-serif]">
          {label}
        </span>
      </label>
      <div
        className={cn(
          "flex py-[7px] px-2 items-start gap-2 self-stretch rounded border border-[#E6E6E6] bg-[rgba(233,236,239,0.64)] min-h-[32px]",
          fieldClassName,
        )}
      >
        <div className="flex-1 text-[#212529] text-xs font-normal leading-normal tracking-[0.429px] font-['Poppins',sans-serif]">
          {value}
        </div>
        {isDropdown && (
          <div className="flex px-[6px] items-center gap-3 self-stretch rounded-r">
            <div className="flex h-4 justify-center items-center">
              <FontAwesomeIcon
                icon={faCaretDown}
                className="w-[10px] h-3 text-[#545454]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { FormField };
