import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import FeatureFlagsMenu from "./FeatureFlagsMenu";

interface ModioLogoFeatureFlagsProps {
  user: any;
  onLogout: () => void;
}

const ModioLogoFeatureFlags: React.FC<ModioLogoFeatureFlagsProps> = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  


  const handleLogout = () => {
    onLogout();
    setOpen(false);
  };

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
          <div className="flex items-center gap-9" data-testid="modio-logo">
            {/* Modio Logo */}
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/045bcc3b8f1e2829d44e88fc2c2155dfab17ea83?width=229"
              alt="Modio"
              className="flex items-start gap-[7.436px]"
            />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0 border border-gray-200 bg-white shadow-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <FeatureFlagsMenu />
      </PopoverContent>
    </Popover>
  );
};

export default ModioLogoFeatureFlags; 