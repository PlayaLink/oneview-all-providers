import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { createPopper, Instance } from "@popperjs/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useGridConfig } from "@/lib/useGridConfig";

interface SectionsDropdownProps {
  visibleSections: Set<string>;
  onSectionVisibilityChange: (sectionKey: string, visible: boolean) => void;
}

const getGroupKey = (group: string) => group;

const SectionsDropdown: React.FC<SectionsDropdownProps> = ({
  visibleSections,
  onSectionVisibilityChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const popperInstance = useRef<Instance | null>(null);

  // Use the new useGridConfig hook
  const {
    gridDefs,
    groupKeyToSection,
    groupKeyToGrids,
    sortedGroupKeys,
    isLoading,
    error,
  } = useGridConfig();

  // Optionally, you can add disabled grids here by tableName
  const disabledGrids = new Set([
    "SAM", "FSMB Actions", "Verifications"
  ]);

  // Filtered groups and grids based on search
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return sortedGroupKeys;
    return sortedGroupKeys.filter(group => {
      const groupGrids = groupKeyToGrids[group] || [];
      return (
        groupKeyToSection[group]?.name?.toLowerCase().includes(search.toLowerCase()) ||
        group.toLowerCase().includes(search.toLowerCase()) ||
        groupGrids.some(grid => (grid.table_name || grid.tableName || "").replace(/_/g, " ").toLowerCase().includes(search.toLowerCase()))
      );
    });
  }, [search, sortedGroupKeys, groupKeyToSection, groupKeyToGrids]);

  const filteredGridsByGroup = (group: string) => {
    const groupGrids = groupKeyToGrids[group] || [];
    if (!search.trim()) return groupGrids;
    return groupGrids.filter(grid =>
      (grid.table_name || grid.tableName || "").replace(/_/g, " ").toLowerCase().includes(search.toLowerCase())
    );
  };

  // Group checkbox state: checked if all children are checked, indeterminate if some
  const isGroupChecked = (group: string) => {
    const grids = (groupKeyToGrids[group] || []).filter((g: any) => !disabledGrids.has(g.table_name || g.tableName));
    return grids.length > 0 && grids.every(grid => visibleSections.has(grid.table_name || grid.tableName));
  };
  const isGroupIndeterminate = (group: string) => {
    const grids = (groupKeyToGrids[group] || []).filter((g: any) => !disabledGrids.has(g.table_name || g.tableName));
    return grids.some(grid => visibleSections.has(grid.table_name || grid.tableName)) && !isGroupChecked(group);
  };

  // Group toggle: toggles all children
  const handleGroupToggle = (group: string) => {
    const grids = (groupKeyToGrids[group] || []).filter((g: any) => !disabledGrids.has(g.table_name || g.tableName));
    const allChecked = grids.every(grid => visibleSections.has(grid.table_name || grid.tableName));
    grids.forEach(grid => {
      onSectionVisibilityChange(grid.table_name || grid.tableName, !allChecked);
    });
  };

  // Grid toggle
  const handleGridToggle = (grid: any) => {
    const key = grid.table_name || grid.tableName;
    if (disabledGrids.has(key)) return;
    onSectionVisibilityChange(key, !visibleSections.has(key));
  };

  // Clear all
  const handleClear = () => {
    gridDefs.forEach(grid => {
      const key = grid.table_name || grid.tableName;
      if (!disabledGrids.has(key)) {
        onSectionVisibilityChange(key, false);
      }
    });
  };

  // Show in 3 columns
  const columns = 3;
  const groupsPerCol = Math.ceil(filteredGroups.length / columns);
  const groupColumns = Array.from({ length: columns }, (_, i) =>
    filteredGroups.slice(i * groupsPerCol, (i + 1) * groupsPerCol)
  );

  // Compute checked grids for pills
  const checkedGrids = useMemo(() => {
    return gridDefs.filter(grid => visibleSections.has(grid.table_name || grid.tableName));
  }, [visibleSections, gridDefs]);

  // Popper.js positioning
  useEffect(() => {
    if (isOpen && buttonRef.current && menuRef.current) {
      popperInstance.current = createPopper(buttonRef.current, menuRef.current, {
        placement: "bottom-start",
        modifiers: [
          { name: "offset", options: { offset: [0, 4] } },
          { name: "preventOverflow", options: { padding: 8 } },
        ],
      });
    }
    return () => {
      if (popperInstance.current) {
        popperInstance.current.destroy();
        popperInstance.current = null;
      }
    };
  }, [isOpen]);

  // Click-away listener
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Loading and error states
  if (isLoading) {
    return <div className="text-gray-500 p-4" role="status" data-testid="sections-loading">Loading sections...</div>;
  }
  if (error) {
    return <div className="text-red-500 p-4" role="alert" data-testid="sections-error">Error loading sections: {error.message}</div>;
  }

  // Render dropdown menu in portal
  const menu = (
    <div
      ref={menuRef}
      className="z-[1000] border border-gray-200 rounded shadow-lg p-4 bg-white w-[700px] min-w-[300px]"
      style={{ display: isOpen ? undefined : "none" }}
      role="dialog"
      aria-label="Section visibility settings"
      aria-modal="true"
      data-testid="sections-dropdown-menu"
    >
      {/* Search and Clear */}
      <div className="flex items-center mb-4" role="search" data-testid="sections-search-row">
        {/* Pills and input in a flex container to mimic multi-select */}
        <div className="flex flex-1 flex-wrap items-center rounded bg-gray-100 px-2 py-1 min-h-[40px] border border-transparent focus-within:border-blue-400" role="list" data-testid="sections-pill-list">
          {checkedGrids.map(grid => (
            <span
              key={grid.table_name || grid.tableName}
              className="flex items-center bg-[#545454] text-white font-bold rounded px-3 py-1 mr-2 mb-1 text-sm"
              style={{ lineHeight: '1.2' }}
              role="listitem"
              data-testid={`section-pill-${grid.table_name || grid.tableName}`}
            >
              {grid.display_name || grid.table_name || grid.tableName}
              <button
                type="button"
                className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                style={{ fontWeight: 'bold', fontSize: '1rem', lineHeight: '1' }}
                onClick={() => onSectionVisibilityChange(grid.table_name || grid.tableName, false)}
                aria-label={`Remove ${grid.display_name || grid.table_name || grid.tableName}`}
                data-testid={`remove-section-${(grid.table_name || grid.tableName).toLowerCase().replace(/_/g, '-')}`}
                role="button"
              >
                ×
              </button>
            </span>
          ))}
          {/* The actual search input, flex-1 so it fills remaining space */}
          <input
            className="flex-1 min-w-[120px] bg-transparent outline-none border-none text-sm py-2 px-2"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ minWidth: '80px' }}
            aria-label="Search sections"
            data-testid="sections-search-input"
            role="searchbox"
          />
        </div>
        <button
          className="ml-2 text-blue-600 text-sm font-medium hover:underline"
          onClick={handleClear}
          type="button"
          aria-label="Clear all selected sections"
          data-testid="clear-sections-button"
          role="button"
        >
          Clear
        </button>
      </div>
      {/* Columns */}
      <div className="flex gap-8" role="list" data-testid="sections-group-list">
        {groupColumns.map((groups, colIdx) => (
          <div key={colIdx} className="flex-1 min-w-0" role="listitem" data-testid={`sections-group-col-${colIdx}`}> 
            {groups.map(group => (
              <div key={group} className="mb-4" role="group" aria-label={groupKeyToSection[group]?.name || group} data-testid={`sections-group-${group}`}>
                {/* Group Checkbox */}
                <label className="flex items-center font-semibold text-gray-800 mb-1 cursor-pointer" role="checkbox" aria-checked={isGroupChecked(group)} data-testid={`sections-group-checkbox-${group}`}>
                  <input
                    type="checkbox"
                    className="mr-2 accent-blue-600 h-4 w-4"
                    checked={isGroupChecked(group)}
                    ref={el => {
                      // for indeterminate state
                      if (el) el.indeterminate = isGroupIndeterminate(group);
                    }}
                    onChange={() => handleGroupToggle(group)}
                    aria-label={`Toggle ${groupKeyToSection[group]?.name || group} group`}
                    data-testid={`sections-group-toggle-${group}`}
                  />
                  {groupKeyToSection[group]?.name || group}
                </label>
                <div className="pl-6 flex flex-col gap-1" role="list" data-testid={`sections-grid-list-${group}`}> 
                  {filteredGridsByGroup(group).map(grid => (
                    <label
                      key={grid.table_name || grid.tableName}
                      className={`flex items-center text-gray-700 font-medium cursor-pointer ${disabledGrids.has(grid.table_name || grid.tableName) ? "text-gray-300 cursor-not-allowed" : ""}`}
                      role="checkbox"
                      aria-checked={visibleSections.has(grid.table_name || grid.tableName)}
                      data-testid={`grid-checkbox-label-${grid.table_name || grid.tableName}`}
                    >
                      <input
                        type="checkbox"
                        className="mr-2 accent-blue-600 h-4 w-4"
                        checked={visibleSections.has(grid.table_name || grid.tableName)}
                        disabled={disabledGrids.has(grid.table_name || grid.tableName)}
                        onChange={() => handleGridToggle(grid)}
                        aria-label={`Toggle ${grid.display_name || grid.table_name || grid.tableName} section`}
                        data-testid={`grid-checkbox-${(grid.table_name || grid.tableName).toLowerCase().replace(/_/g, '-')}`}
                      />
                      {grid.display_name || grid.table_name || grid.tableName}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative" role="presentation" data-testid="sections-dropdown-root">
      <button
        ref={buttonRef}
        className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="sections-dropdown-menu"
        data-testid="sections-dropdown-toggle"
        role="button"
      >
        Sections
        <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
      </button>
      {isOpen && createPortal(menu, document.body)}
    </div>
  );
};

export default SectionsDropdown;
