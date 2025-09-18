import React from "react";
import TeamsToggle from "@/components/TeamsToggle";
import AddProviderButton from "@/components/AddProviderButton";

interface NavigationTeamAddProvider_LegacyProps {
  onAddProvider?: () => void;
}

const NavigationTeamAddProvider_Legacy: React.FC<NavigationTeamAddProvider_LegacyProps> = ({ 
  onAddProvider 
}) => {
  return (
    <nav 
      className="bg-white border-b border-gray-300 px-4 py-3 flex items-center justify-between w-full" 
      role="navigation" 
      aria-label="Team navigation and add provider"
      data-testid="navigation-team-add-provider-legacy"
    >
      {/* Left side: Teams Toggle */}
      <div className="flex items-center" data-testid="teams-toggle-container">
        <TeamsToggle textVariant="dark" logoClassName="w-11 h-11" />
      </div>

      {/* Right side: Add Provider Button */}
      <div className="flex items-center" data-testid="add-provider-container">
        <AddProviderButton
          onClick={onAddProvider}
          data-testid="add-provider-button-legacy"
          data-referenceid="add-provider-legacy"
        />
      </div>
    </nav>
  );
};

export default NavigationTeamAddProvider_Legacy;
