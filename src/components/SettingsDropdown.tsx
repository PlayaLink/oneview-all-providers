import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import GlobalFeatureToggle from "@/components/GlobalFeatureToggle";

interface SettingsDropdownProps {
  // This component can now be used independently without props
  // as it uses the global feature settings
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button 
          className="flex items-center gap-2 hover:bg-white hover:bg-opacity-10 rounded px-2 py-1 transition-colors"
          aria-label="Open settings menu"
          aria-expanded={open}
          aria-haspopup="true"
          data-testid="settings-dropdown-trigger"
        >
          <FontAwesomeIcon icon={faGear} className="w-4 h-4 text-white" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0 border border-gray-200 bg-white shadow-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <div className="p-4">
          {/* Grid Sections Setting */}
          <GlobalFeatureToggle
            settingKey="grid_section_navigation"
            label="Grid Sections Navigation"
            options={[
              { value: "left-nav", label: "Left Hand Nav" },
              { value: "horizontal", label: "Horizontal" },
            ]}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SettingsDropdown;
