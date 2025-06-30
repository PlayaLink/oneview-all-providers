import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faSearch, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Button } from "@/components/ui/button";
import SectionsDropdown from "@/components/SectionsDropdown";

interface ProviderInfo {
  fullName: string;
  title: string;
  npi: string;
  specialty: string;
  email?: string;
}

interface ProviderSearchItem {
  fullName: string;
  title: string;
  npi: string;
  specialty: string;
  email?: string;
}

interface PageHeaderProps {
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

const PageHeader: React.FC<PageHeaderProps> = ({
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

  // Initialize search value when on provider detail route
  React.useEffect(() => {
    if (npi && providerInfo) {
      setSearch(providerInfo.fullName);
    } else {
      setSearch("");
    }
  }, [npi, providerInfo]);

  // Filter providers by name or NPI
  const filteredProviders = search.trim()
    ? providerSearchList.filter((p) =>
        p.fullName.toLowerCase().includes(search.toLowerCase()) ||
        p.npi.includes(search)
      )
    : [];

  const handleSelect = (provider: ProviderSearchItem) => {
    setSearch(provider.fullName);
    setDropdownOpen(false);
    if (onProviderSelect) onProviderSelect(provider.npi);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setDropdownOpen(true);
  };

  const handleInputFocus = () => {
    if (search.trim()) setDropdownOpen(true);
  };

  const handleClear = () => {
    setSearch("");
    setDropdownOpen(false);
    inputRef.current?.focus();
    if (onProviderSelect) onProviderSelect(""); // reroute to main view
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
    <div className="bg-white text-[#545454] px-4 py-4 relative z-10">
      <div className="flex items-center justify-between">
        {/* Left: Icon and Title or Provider Info */}
        <div className="flex items-center gap-2 min-w-0">
          {!npi && title && (
            <span className="font-bold text-base tracking-wider capitalize">
              {title.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())}
            </span>
          )}
          {/* Single-provider view header */}
          {npi && providerInfo && (
            <div className="flex items-center gap-4">
              {/* User Icon in Circle */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-[#545454]">
                  {providerInfo.fullName} - {providerInfo.title} <span className="font-normal">NPI {providerInfo.npi}</span>
                </span>
                <span className="font-semibold text-[#3BA8D1] text-sm">{providerInfo.specialty}</span>
              </div>
            </div>
          )}
        </div>
        {/* Center: Searchbox */}
        <div className="flex-1 flex justify-center relative">
          <div className="w-[350px] relative">
            <input
              ref={inputRef}
              className="w-full rounded border border-gray-200 px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 pr-8"
              placeholder="Search by provider name or NPI #"
              value={search}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
            {search && (
              <button
                className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={handleClear}
                tabIndex={-1}
                type="button"
              >
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
              </button>
            )}
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            />
            {/* Dropdown */}
            {dropdownOpen && filteredProviders.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-60 overflow-y-auto">
                {filteredProviders.map((provider) => {
                  return (
                    <div
                      key={provider.npi}
                      className="px-4 py-3 cursor-pointer hover:bg-blue-50 flex flex-col gap-1"
                      onMouseDown={() => handleSelect(provider)}
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
              >
                {buttonIcon && (
                  <FontAwesomeIcon icon={buttonIcon} className="w-4 h-4 mr-2" />
                )}
                {buttonText}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
