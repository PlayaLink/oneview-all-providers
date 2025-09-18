import React, { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import { useQuery } from "@tanstack/react-query";
import { fetchProviders } from "@/lib/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import { extractTitleAcronym } from "@/lib/utils";

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

interface ProviderSearchProps {
  className?: string;
  placeholder?: string;
  onSelect?: (provider: Provider) => void;
  onClear?: () => void;
  isCreateMode?: boolean;
}

const ProviderSearch: React.FC<ProviderSearchProps> = ({ 
  className = "w-[375px]", 
  placeholder = "Search by Provider Name or NPI...",
  onSelect,
  onClear,
  isCreateMode
}) => {
  const [search, setSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { provider_id } = useParams();

  // Fetch all providers
  const { data: providers = [], isLoading } = useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
    initialData: [],
  });



  // When on a single-provider route, keep the input reflecting the selected provider
  useEffect(() => {
    if (!provider_id) return;
    const match = (providers as Provider[]).find((p) => p.id === provider_id);
    if (match) {
      setSelectedProvider(match);
      const fullName = `${match.first_name || ""} ${match.last_name || ""}`.trim();
      setSearch(fullName || match.provider_name || "");
    }
  }, [provider_id, providers]);

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
    setSelectedProvider(selected);
    // Prefer explicit first and last name in the input after selection
    const fullName = `${selected.first_name || ""} ${selected.last_name || ""}`.trim();
    setSearch(fullName || selected.provider_name || "");
    setDropdownOpen(false);
    
    if (onSelect) {
      // If onSelect is provided, call it instead of navigating
      onSelect(selected);
    } else {
      // Default behavior: navigate to provider page
      navigate(`/${selected.id}`);
    }
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
    setSelectedProvider(null);
    setSearch("");
    setDropdownOpen(false);
    inputRef.current?.focus();
    
    // Call onClear callback if provided
    if (onClear) {
      onClear();
    }
    
    // If we're on the single-provider page, navigate back to all providers
    if (provider_id) {
      navigate("/all-records");
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
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
    <div className={`relative ${className}`} data-testid="provider-search">
      <label htmlFor="provider-search" className="sr-only">Search providers</label>
      <input
        id="provider-search"
        ref={inputRef}
        className="w-full rounded border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 pr-8"
        placeholder={placeholder}
        value={search}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        role="combobox"
        aria-expanded={dropdownOpen}
        aria-autocomplete="list"
        aria-controls="provider-search-results"
        aria-activedescendant={dropdownOpen && filteredProviders.length > 0 ? "provider-option-0" : undefined}
        autoComplete="off"
        data-testid="provider-search-input"
      />
      {search && (
        <button
          className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          onClick={handleClear}
          type="button"
          aria-label="Clear search"
          data-testid="clear-search-button"
          data-referenceid="clear-search"
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
          data-testid="provider-search-results"
        >
          {filteredProviders.map((prov, index) => (
            <div
              key={prov.id}
              id={`provider-option-${index}`}
              className="px-4 py-3 cursor-pointer hover:bg-gray-50 flex flex-col gap-1 border-b border-gray-100 last:border-b-0"
              onMouseDown={() => handleSelect(prov)}
              role="option"
              aria-selected="false"
              data-testid={`provider-option-${prov.id}`}
              data-referenceid={`provider-option-${prov.id}`}
            >
              <div className="flex justify-between items-start">
                {/* Left side - Provider name, location, specialty, and email */}
                <div className="flex-1 min-w-0">
                  {/* First line: Provider name and location/affiliation */}
                  <div className="font-semibold text-gray-600 text-sm">
                    {prov.provider_name} {prov.title ? `- ${extractTitleAcronym(prov.title)}` : ""}
                  </div>
                  {/* Second line: Specialty/Role in bold */}
                  {prov.primary_specialty && (
                    <div className="font-bold text-gray-600 text-sm mt-1">
                      {prov.primary_specialty}
                    </div>
                  )}
                  {/* Third line: Email in smaller gray text */}
                  {prov.work_email && (
                    <div className="text-xs text-gray-500 mt-1">
                      {prov.work_email}
                    </div>
                  )}
                </div>
                {/* Right side - NPI number aligned with top line */}
                <div className="text-xs text-gray-500 font-medium ml-4 flex-shrink-0">
                  NPI: {prov.npi_number || "N/A"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderSearch; 