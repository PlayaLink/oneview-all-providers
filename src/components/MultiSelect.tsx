import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Tag from "./Tag";

interface MultiSelectProps {
  label: string;
  selectedItems: string[];
  onRemoveItem: (item: string) => void;
  onAddClick: () => void;
  className?: string;
  labelClassName?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  selectedItems,
  onRemoveItem,
  onAddClick,
  className = "",
  labelClassName = "",
}) => {
  return (
    <div className={`flex items-start gap-1 w-full ${className}`}>
      {/* Label */}
      <div
        className={`flex w-[153px] py-[7px] px-2 items-start content-start gap-1 flex-shrink-0 flex-wrap ${labelClassName}`}
      >
        <div className="flex-1 text-[#545454] text-xs font-bold leading-normal tracking-[0.429px] font-['Poppins',sans-serif]">
          {label}
        </div>
      </div>

      {/* Value section */}
      <div className="flex min-h-8 flex-col justify-center items-start flex-1">
        <div className="flex min-h-8 py-1 items-start content-start gap-2 self-stretch flex-wrap">
          {/* Selected items */}
          {selectedItems.map((item, index) => (
            <Tag key={index} label={item} onRemove={() => onRemoveItem(item)} />
          ))}

          {/* Add button */}
          <div className="flex flex-col items-start">
            <button
              onClick={onAddClick}
              className="flex h-6 px-2 py-[2px] justify-center items-center gap-2 rounded bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-[#006CAB] text-xs font-bold leading-normal tracking-[0.429px] font-['Poppins',sans-serif]">
                Add
              </span>
              <div className="flex pb-[1px] justify-center items-center">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-[#006CAB] text-xs"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
