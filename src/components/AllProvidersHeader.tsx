import React from "react";
import Icon from "@/components/ui/Icon";
import { useLocation } from "react-router-dom";
import SectionsDropdown from "@/components/SectionsDropdown";
import ProviderSearch from "@/components/ProviderSearch";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import AddProviderButton from "@/components/AddProviderButton";

interface Provider {
  id: string;
  provider_name: string;
  npi_number: string;
  title?: string;
  primary_specialty?: string;
  work_email?: string;
  first_name?: string;
  last_name?: string;
}

interface AllProvidersHeaderProps {
  provider?: Provider;
  onAddProvider?: () => void;
}

const AllProvidersHeader = React.forwardRef<HTMLElement, AllProvidersHeaderProps>(({ provider, onAddProvider }, ref) => {
  const location = useLocation();
  const { value: newNav } = useFeatureFlag("new_nav_option_1");

  // Determine title for non-provider view
  let headerTitle = "All Providers";
  if (!provider && location.pathname === "/team") {
    headerTitle = "Team";
  }

  return (
          <header ref={ref} className="bg-white text-gray-600 py-4 border-b border-gray-300 relative z-10" role="banner" aria-label="All Providers Header" data-testid="all-providers-header">
      <div className="flex items-center gap-2 pl-1 pr-4">
        {/* Provider Info or All Providers/Team Title */}
        {provider ? (
          <div className="flex items-center gap-4 mb-2">
            {/* User Icon in Circle */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center" aria-hidden="true">
              <Icon icon="user" className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-base text-gray-600">
                {provider.provider_name} 
              </h1>
              <h2 className="font-normal text-sm">
                {provider.title}
              </h2>
              {provider.primary_specialty && (
                <p className="font-semibold text-blue-500 text-sm">{provider.primary_specialty}</p> 
              )}
              {/* {provider.npi_number && (
                <span className="text-sm">NPI {provider.npi_number}</span> 
              )} */}

            </div>
          </div>
        ) : (
          <h1 className="font-bold text-base tracking-wider capitalize px-4 text-xs" role="all-providers-header-title">
            {headerTitle}
          </h1>
        )}
        {/* Searchbox (always visible) */}
        <div className="flex-1 flex justify-center relative">
          <ProviderSearch />
        </div>
        {/* Right: Add Provider Button or SectionsDropdown */}
        <div className="flex items-center gap-4">
          {provider || !newNav ? (
            <>
              {/* Only show SectionsDropdown when new_nav_option_1 is false */}
              {!newNav && (
                <SectionsDropdown
                  trigger={
                    <button
                    className="flex items-center gap-2 text-gray-600 font-bold tracking-wide rounded px-3 py-1 bg-white focus:outline-none focus:ring-0 text-xs"
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={false}
                    aria-label="Sections dropdown"
                    data-testid="sections-dropdown-button"
                  >
                    Sections
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" className="svg-inline--fa fa-chevron-down w-3 h-3 ml-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg>
                  </button>
                  }
                />
              )}
            </>
          ) : (
            <>
              {/* Only show Add Provider button when New Nav feature flag is true */}
              {newNav && (
                <AddProviderButton
                  onClick={onAddProvider}
                  data-testid="add-provider-button"
                  data-referenceid="add-provider"
                />
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
});

export default AllProvidersHeader; 