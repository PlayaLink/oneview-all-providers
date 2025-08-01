import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useFeatureFlags } from "@/contexts/FeatureFlagContext";

interface ModioLogoFeatureFlagsProps {
  user: any;
  onLogout: () => void;
}

const ModioLogoFeatureFlags: React.FC<ModioLogoFeatureFlagsProps> = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const { allSettings, updateFlag, isLoading } = useFeatureFlags();

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
        <div className="p-4 flex flex-col gap-4 border-b border-gray-200">
          {/* User Profile */}
          <div ref={profileRef} className="flex items-center gap-2 relative" role="button" tabIndex={0} aria-label="User profile menu">
            <div className="flex items-center justify-center w-6 h-6 aspect-square">
              <FontAwesomeIcon
                icon={faUser}
                className="w-5 h-5"
                aria-hidden="true"
                role="user-icon"
              />
            </div>
            <button
              className="text-center font-bold text-lg leading-normal tracking-[0.429px] bg-transparent border-none cursor-pointer"
              style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
              onClick={() => setProfileDropdownOpen((open) => !open)}
              aria-label="Toggle user profile menu"
              aria-expanded={profileDropdownOpen}
              aria-haspopup="true"
              data-testid="user-profile-toggle"
            >
              {user?.user_metadata?.full_name || user?.full_name || user?.email || 'User'}
            </button>
          </div>
          
          {/* Logout Button */}
          <button
            className="w-full text-center font-bold px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md"
            onClick={handleLogout}
            aria-label="Logout from application"
            data-testid="logout-button"
          >
            Logout
          </button>
          
          {/* Divider */}
          <div className="border-t border-gray-200 my-3"></div>
          
          {/* Feature Flags */}
          <div className="pt-2 pb-1">
            <h3 className="text-md font-semibold text-gray-900 mb-1">Feature Flags</h3>
          </div>
          {allSettings.map(setting => (
            <div key={setting.setting_key} className="mb-4 flex items-center justify-between">
              <label className="font-medium text-gray-700">
                {setting.label || setting.setting_key}
              </label>
              <Switch
                checked={!!setting.setting_value}
                onCheckedChange={(checked) => updateFlag(setting.setting_key as any, checked)}
                disabled={isLoading}
                className={!!setting.setting_value ? "data-[state=checked]:bg-[#3BA8D1]" : ""}
              />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ModioLogoFeatureFlags; 