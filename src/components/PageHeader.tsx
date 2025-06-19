import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  icon: IconDefinition;
  buttonText?: string;
  buttonIcon?: IconDefinition;
  onButtonClick?: () => void;
  buttonClassName?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  icon,
  buttonText,
  buttonIcon,
  onButtonClick,
  buttonClassName = "bg-[#79AC48] hover:bg-[#6B9A3F] text-white",
}) => {
  return (
    <div className="bg-white text-[#545454] px-4 py-3 border-b border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={icon} className="w-4 h-4 text-[#545454]" />
          <span className="font-bold text-xs tracking-wider uppercase">
            {title}
          </span>
        </div>
        {buttonText && (
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              className={buttonClassName}
              onClick={onButtonClick}
            >
              {buttonIcon && (
                <FontAwesomeIcon icon={buttonIcon} className="w-4 h-4 mr-2" />
              )}
              {buttonText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
