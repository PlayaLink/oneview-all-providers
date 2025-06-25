import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface TagProps {
  label: string;
  onRemove?: () => void;
  removable?: boolean;
  className?: string;
}

const Tag: React.FC<TagProps> = ({
  label,
  onRemove,
  removable = true,
  className = "",
}) => {
  return (
    <div
      className={`inline-flex items-center bg-[#E8F3FF] rounded-sm ${className}`}
    >
      <div className="px-2 py-1">
        <span className="text-[#212529] text-xs font-normal leading-normal tracking-[0.429px] font-['Poppins',sans-serif] line-clamp-1">
          {label}
        </span>
      </div>
      {removable && onRemove && (
        <div className="flex items-center justify-center w-[18px] h-6 border-l border-[#AFD6FF]">
          <button
            onClick={onRemove}
            className="w-4 flex-shrink-0 text-[#212529] text-center text-[8px] font-normal hover:text-red-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Tag;
