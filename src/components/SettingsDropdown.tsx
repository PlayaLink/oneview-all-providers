import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface SettingsDropdownProps {
  gridSectionMode: "left-nav" | "horizontal";
  onGridSectionModeChange: (mode: "left-nav" | "horizontal") => void;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  gridSectionMode,
  onGridSectionModeChange,
}) => {
  const [open, setOpen] = useState(false);

  const gridSectionOptions = [
    { value: "left-nav" as const, label: "Left Hand Nav" },
    { value: "horizontal" as const, label: "Horizontal" },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 hover:bg-white hover:bg-opacity-10 rounded px-2 py-1 transition-colors">
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
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Settings</h3>

          {/* Grid Sections Setting */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">
              Grid Sections Navigation
            </label>
            <div className="relative">
              <select
                value={gridSectionMode}
                onChange={(e) =>
                  onGridSectionModeChange(
                    e.target.value as "left-nav" | "horizontal",
                  )
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {gridSectionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SettingsDropdown;
