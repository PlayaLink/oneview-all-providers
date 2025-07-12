import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useFeatureFlags } from "@/contexts/FeatureFlagContext";

const FeatureFlags: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { allSettings, updateFlag, isLoading } = useFeatureFlags();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="text-white text-center text-xs leading-normal tracking-[0.429px] hover:underline bg-transparent border-none cursor-pointer px-2 py-1 rounded hover:bg-white/10 transition-colors"
          style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
          aria-label="New Features and settings"
          aria-haspopup="true"
          data-testid="feature-flags-dropdown-header"
        >
          New Features
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0 border border-gray-200 bg-white shadow-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <div className="p-4">
          {allSettings.map(setting => (
            <div key={setting.setting_key} className="mb-4 flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">
                {setting.label || setting.setting_key}
              </label>
              <input
                type="checkbox"
                checked={!!setting.setting_value}
                onChange={e => updateFlag(setting.setting_key as any, e.target.checked)}
                disabled={isLoading}
                className="ml-2"
              />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FeatureFlags;
