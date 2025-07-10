import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Button } from "@/components/ui/button";
import SectionsDropdown from "@/components/SectionsDropdown";
import { useNavigate } from "react-router-dom";
import { useFeatureSettings } from "@/hooks/useFeatureSettings";

interface ProviderInfo {
  fullName: string;
  title: string;
  npi: string;
  specialty: string;
  email?: string;
}

interface ProviderSearchItem {
  fullName: string;
  firstName: string;
  lastName: string;
  title: string;
  npi: string;
  specialty: string;
  email?: string;
}

interface AllProvidersHeaderProps {
  title?: string;
  icon?: IconDefinition;
  buttonText?: string;
  buttonIcon?: IconDefinition;
  onButtonClick?: () => void;
  buttonClassName?: string;
  npi?: string;
  providerInfo?: ProviderInfo;
  onProviderSelect?: (npi: string) => void;
  providerSearchList?: ProviderSearchItem[];
  // SectionsDropdown props
  visibleSections?: Set<string>;
  onSectionVisibilityChange?: (sectionKey: string, visible: boolean) => void;
}

const AllProvidersHeader: React.FC<AllProvidersHeaderProps> = ({
  title,
  icon,
  buttonText,
  buttonIcon,
  onButtonClick,
  buttonClassName = "bg-[#79AC48] hover:bg-[#6B9A3F] text-white",
  npi,
  providerInfo,
  onProviderSelect,
  providerSearchList = [],
  visibleSections,
  onSectionVisibilityChange,
}) => {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { settings, isLoading: settingsLoading } = useFeatureSettings();
  const gridSectionMode = settingsLoading ? 'left-nav' : settings.grid_section_navigation;

  // Initialize search value when on provider detail route
  React.useEffect(() => {
    if (npi && providerInfo) {
      setSearch(providerInfo.fullName);
    } else {
      setSearch("");
    }
  }, [npi, providerInfo]);

  // Filter providers by name or NPI
  const filteredProviders = search.trim().length > 0
    ? providerSearchList.filter((p) =>
        p.fullName.toLowerCase().includes(search.toLowerCase()) ||
        (p.firstName && p.firstName.toLowerCase().includes(search.toLowerCase())) ||
        (p.lastName && p.lastName.toLowerCase().includes(search.toLowerCase())) ||
        p.npi.includes(search)
      )
    : [];

  const handleSelect = (provider: ProviderSearchItem) => {
    setSearch(provider.fullName);
    setDropdownOpen(false);
    if (onProviderSelect) onProviderSelect(provider.npi);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    
    // If the search becomes empty (user cleared it manually), go back to previous page
    if (newValue === "" && search !== "") {
      navigate(-1);
      return;
    }
    
    setDropdownOpen(true);
  };

  const handleInputFocus = () => {
    setDropdownOpen(true);
  };

  const handleClear = () => {
    setSearch("");
    setDropdownOpen(false);
    inputRef.current?.focus();
    // Go back to the previous page when search is cleared
    navigate(-1);
  };

  // Close dropdown on click outside
  React.useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  return (
    <header className="bg-white text-[#545454] px-4 py-4 border-b border-gray-300 relative z-10" role="banner" aria-label="All Providers Header" data-testid="all-providers-header">
      <div className="flex items-center justify-between">
        {/* Left: Icon and Title or Provider Info */}
        <div className="flex items-center gap-2 min-w-0">
          {!npi && title && (
            <h1 className="font-bold text-base tracking-wider capitalize" role="all-providers-header-title">
              {gridSectionMode === 'left-nav' ? 'All Records' : title.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())}
            </h1>
          )}
          {/* Single-provider view header */}
          {npi && providerInfo && (
            <div className="flex items-center gap-4">
              {/* User Icon in Circle */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center" aria-hidden="true">
                <FontAwesomeIcon icon={faUser} className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex flex-col">
                <h1 className="font-bold text-base text-[#545454]">
                  {providerInfo.fullName} - {providerInfo.title} <span className="font-normal">NPI {providerInfo.npi}</span>
                </h1>
                <p className="font-semibold text-[#3BA8D1] text-sm">{providerInfo.specialty}</p>
              </div>
            </div>
          )}
        </div>
        {/* Center: Searchbox */}
        <div className="flex-1 flex justify-center relative">
          <div className="w-[350px] relative">
            <label htmlFor="provider-search" className="sr-only">Search providers</label>
            <input
              id="provider-search"
              ref={inputRef}
              className="w-full rounded border border-gray-200 px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 pr-8"
              placeholder="Search by provider name or NPI #"
              value={search}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              role="combobox"
              aria-expanded={dropdownOpen}
              aria-autocomplete="list"
              aria-controls="provider-search-results"
              aria-activedescendant={dropdownOpen && filteredProviders.length > 0 ? "provider-option-0" : undefined}
            />
            {search && (
              <button
                className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={handleClear}
                type="button"
                aria-label="Clear search"
                data-testid="clear-search-button"
              >
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              aria-hidden="true"
            />
            {/* Dropdown */}
            {dropdownOpen && filteredProviders.length > 0 && (
              <div 
                id="provider-search-results"
                className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-60 overflow-y-auto"
                role="listbox"
                aria-label="Provider search results"
              >
                {filteredProviders.map((provider, index) => {
                  return (
                    <div
                      key={provider.npi}
                      id={`provider-option-${index}`}
                      className="px-4 py-3 cursor-pointer hover:bg-blue-50 flex flex-col gap-1"
                      onMouseDown={() => handleSelect(provider)}
                      role="option"
                      aria-selected="false"
                      data-testid={`provider-option-${provider.npi}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#545454]">
                          {provider.fullName} - {provider.title}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          NPI: {provider.npi}
                        </span>
                      </div>
                      <span className="font-bold text-[#3BA8D1] text-sm">
                        {provider.specialty}
                      </span>
                      {provider.email && (
                        <span className="text-xs text-gray-500">{provider.email}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {/* Right: Add Provider Button or SectionsDropdown */}
        <div className="flex items-center gap-4">
          {npi ? (
            // Single-provider view: show SectionsDropdown
            visibleSections && onSectionVisibilityChange && (
              <SectionsDropdown
                visibleSections={visibleSections}
                onSectionVisibilityChange={onSectionVisibilityChange}
              />
            )
          ) : (
            // Main view: show Add Provider button
            buttonText && (
              <Button
                size="sm"
                className={buttonClassName}
                onClick={onButtonClick}
                aria-label={buttonText}
                data-testid="add-provider-button"
              >
                {buttonIcon && (
                  <FontAwesomeIcon icon={buttonIcon} className="w-4 h-4 mr-2" aria-hidden="true" />
                )}
                {buttonText}
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default AllProvidersHeader; 