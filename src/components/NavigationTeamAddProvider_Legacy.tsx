import React from "react";
import Icon from "@/components/ui/Icon";
import TeamsToggle from "@/components/TeamsToggle";

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
        <TeamsToggle textVariant="dark" />
      </div>

      {/* Right side: Add Provider Button */}
      <div className="flex items-center" data-testid="add-provider-container">
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 text-sm transition-colors"
          type="button"
          aria-label="Add Provider"
          data-testid="add-provider-button-legacy"
          data-referenceid="add-provider-legacy"
          onClick={onAddProvider}
        >
          Add Provider
          <Icon icon="plus" className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

export default NavigationTeamAddProvider_Legacy;
