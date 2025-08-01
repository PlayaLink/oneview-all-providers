import React, { useState, useRef } from "react";
import Icon from "@/components/ui/Icon";
import { useQuery } from "@tanstack/react-query";
import { fetchProviders } from "@/lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import SectionsDropdown from "@/components/SectionsDropdown";

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
}

const AllProvidersHeader = React.forwardRef<HTMLElement, AllProvidersHeaderProps>(({ provider }, ref) => {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch all providers
  const { data: providers = [], isLoading } = useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
    initialData: [],
  });

  // Filter providers by name or NPI
  const searchString = search.toLowerCase();
  const filteredProviders = searchString.length > 0
    ? providers.filter((p: Provider) =>
        (p.provider_name && p.provider_name.toLowerCase().includes(searchString)) ||
        (p.npi_number && p.npi_number.includes(searchString))
      )
    : providers;

  // Handle selection
  const handleSelect = (selected: Provider) => {
    setSearch("");
    setDropdownOpen(false);
    navigate(`/${selected.id}`);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setDropdownOpen(true);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setDropdownOpen(true);
  };

  // Handle clear
  const handleClear = () => {
    setSearch("");
    setDropdownOpen(false);
    inputRef.current?.focus();
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

  // Determine title for non-provider view
  let headerTitle = "All Providers";
  if (!provider && location.pathname === "/team") {
    headerTitle = "Team";
  }

  return (
    <header ref={ref} className="bg-white text-[#545454] py-4 border-b border-gray-300 relative z-10" role="banner" aria-label="All Providers Header" data-testid="all-providers-header">
      <div className="flex items-center gap-2 pl-1 pr-4">
        {/* Provider Info or All Providers/Team Title */}
        {provider ? (
          <div className="flex items-center gap-4 mb-2">
            {/* User Icon in Circle */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center" aria-hidden="true">
              <Icon icon="user" className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-base text-[#545454]">
                {provider.provider_name} 
              </h1>
              <h2 className="font-normal text-sm">
                {provider.title}
              </h2>
              {provider.primary_specialty && (
                <p className="font-semibold text-[#3BA8D1] text-sm">{provider.primary_specialty}</p> 
              )}
              {/* {provider.npi_number && (
                <span className="text-sm">NPI {provider.npi_number}</span> 
              )} */}

            </div>
          </div>
        ) : (
          <h1 className="font-bold text-base tracking-wider capitalize px-4" role="all-providers-header-title">
            {headerTitle}
          </h1>
        )}
        {/* Searchbox (always visible) */}
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
              autoComplete="off"
            />
            {search && (
              <button
                className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={handleClear}
                type="button"
                aria-label="Clear search"
                data-testid="clear-search-button"
              >
                <Icon icon="times" className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            <Icon
              icon="search"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              aria-hidden="true"
            />
            {/* Dropdown */}
            {dropdownOpen && search.trim().length > 0 && filteredProviders.length > 0 && (
              <div
                id="provider-search-results"
                className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-60 overflow-y-auto"
                role="listbox"
                aria-label="Provider search results"
              >
                {filteredProviders.map((prov, index) => (
                  <div
                    key={prov.id}
                    id={`provider-option-${index}`}
                    className="px-4 py-3 cursor-pointer hover:bg-blue-50 flex flex-col gap-1"
                    onMouseDown={() => handleSelect(prov)}
                    role="option"
                    aria-selected="false"
                    data-testid={`provider-option-${prov.id}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-[#545454]">
                        {prov.provider_name} {prov.title ? `- ${prov.title}` : ""}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        ID: {prov.id}
                      </span>
                    </div>
                    <span className="font-bold text-[#3BA8D1] text-sm">
                      {prov.primary_specialty}
                    </span>
                    {prov.work_email && (
                      <span className="text-xs text-gray-500">{prov.work_email}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Right: Add Provider Button or SectionsDropdown */}
        <div className="flex items-center gap-4">
          {provider ? (
            <SectionsDropdown
              trigger={
                <button
                  className="flex items-center gap-2 text-xs font-medium tracking-wide border border-gray-300 rounded px-3 py-1 bg-white focus:outline-none focus:ring-0"
                  type="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                  aria-label="Sections dropdown"
                  data-testid="sections-dropdown-button"
                >
                  Sections
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" className="svg-inline--fa fa-chevron-down w-3 h-3 ml-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg>
                </button>
              }
            />
          ) : (
            <button
              className="bg-[#79AC48] hover:bg-[#6B9A3F] text-white font-semibold h-10 px-4 rounded flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#79AC48] text-sm"
              type="button"
              aria-label="Add Provider"
              data-testid="add-provider-button"
              // onClick={handleAddProvider}
            >
              <Icon icon="plus" className="w-4 h-4" aria-hidden="true" />
              Add Provider
            </button>
          )}
        </div>
      </div>
    </header>
  );
});

export default AllProvidersHeader; 