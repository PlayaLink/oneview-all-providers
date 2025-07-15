import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { createPopper, Instance, Placement } from "@popperjs/core";
import { useGridConfig } from "@/lib/useGridConfig";
import { useSectionFilterStore } from "@/lib/useVisibleSectionsStore";

interface SectionsDropdownProps {
  trigger: React.ReactElement;
  placement?: Placement;
}

const SectionsDropdown: React.FC<SectionsDropdownProps> = ({ trigger, placement = "bottom-start" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const popperInstance = useRef<Instance | null>(null);

  // Zustand global state (filter semantics)
  const sectionFilters = useSectionFilterStore((s) => s.sectionFilters);
  const setSectionFilters = useSectionFilterStore((s) => s.setSectionFilters);
  const addSectionFilter = useSectionFilterStore((s) => s.addSectionFilter);
  const removeSectionFilter = useSectionFilterStore((s) => s.removeSectionFilter);
  const clearSectionFilters = useSectionFilterStore((s) => s.clearSectionFilters);
  const toggleSectionFilter = useSectionFilterStore((s) => s.toggleSectionFilter);

  // Grid/section config
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
      console.log('[SectionsDropdown] groupGrids for group', group, groupGrids);
      return (
        groupKeyToSection[group]?.name?.toLowerCase().includes(search.toLowerCase()) ||
        group.toLowerCase().includes(search.toLowerCase()) ||
        groupGrids.some(grid => (grid.table_name || grid.tableName || "").replace(/_/g, " ").toLowerCase().includes(search.toLowerCase()))
      );
    });
  }, [search, sortedGroupKeys, groupKeyToSection, groupKeyToGrids]);

  const filteredGridsByGroup = (group: string) => {
    let groupGrids = groupKeyToGrids[group] || [];
    console.log('[SectionsDropdown] filteredGridsByGroup for group', group, groupGrids);
    if (!search.trim()) {
      // Sort by order property if present
      groupGrids = [...groupGrids].sort((a, b) => (a.order || 0) - (b.order || 0));
      return groupGrids;
    }
    const filtered = groupGrids.filter(grid =>
      (grid.table_name || grid.tableName || "").replace(/_/g, " ").toLowerCase().includes(search.toLowerCase())
    );
    // Sort filtered by order property
    return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  // Group checkbox state: checked if all children are checked, indeterminate if some
  // In filter mode: checked if all grids in group are in filter set, indeterminate if some
  const isGroupChecked = (group: string) => {
    const grids = (groupKeyToGrids[group] || []).filter((g: any) => !disabledGrids.has(g.table_name || g.tableName));
    return grids.length > 0 && grids.every(grid => sectionFilters.has(grid.table_name || grid.tableName));
  };
  const isGroupIndeterminate = (group: string) => {
    const grids = (groupKeyToGrids[group] || []).filter((g: any) => !disabledGrids.has(g.table_name || g.tableName));
    return grids.some(grid => sectionFilters.has(grid.table_name || grid.tableName)) && !isGroupChecked(group);
  };

  // Group toggle: toggles all children
  const handleGroupToggle = (group: string) => {
    const grids = (groupKeyToGrids[group] || []).filter((g: any) => !disabledGrids.has(g.table_name || g.tableName));
    const allChecked = grids.every(grid => sectionFilters.has(grid.table_name || grid.tableName));
    grids.forEach(grid => {
      const key = grid.table_name || grid.tableName;
      if (allChecked) {
        removeSectionFilter(key);
      } else {
        addSectionFilter(key);
      }
    });
  };

  // Grid toggle
  const handleGridToggle = (grid: any) => {
    const key = grid.table_name || grid.tableName;
    if (disabledGrids.has(key)) return;
    toggleSectionFilter(key);
  };

  // Clear all
  const handleClear = () => {
    clearSectionFilters();
  };

  // Show in 3 columns
  const columns = 3;
  const groupsPerCol = Math.ceil(filteredGroups.length / columns);
  const groupColumns = Array.from({ length: columns }, (_, i) =>
    filteredGroups.slice(i * groupsPerCol, (i + 1) * groupsPerCol)
  );

  // Compute checked grids for pills
  const checkedGrids = useMemo(() => {
    return gridDefs.filter(grid => sectionFilters.has(grid.table_name || grid.tableName));
  }, [sectionFilters, gridDefs]);

  // Popper.js positioning
  useEffect(() => {
    if (isOpen && buttonRef.current && menuRef.current) {
      popperInstance.current = createPopper(buttonRef.current, menuRef.current, {
        placement,
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
  }, [isOpen, placement]);

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
    return null;
  }
  if (error) {
    return null;
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
                onClick={() => removeSectionFilter(grid.table_name || grid.tableName)}
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
                      aria-checked={sectionFilters.has(grid.table_name || grid.tableName)}
                      data-testid={`grid-checkbox-label-${grid.table_name || grid.tableName}`}
                    >
                      <input
                        type="checkbox"
                        className="mr-2 accent-blue-600 h-4 w-4"
                        checked={sectionFilters.has(grid.table_name || grid.tableName)}
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

  // Handler to toggle dropdown
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Clone the trigger and inject onClick
  const triggerWithProps = React.cloneElement(trigger, {
    onClick: (e: React.MouseEvent) => {
      toggleDropdown();
      if (trigger.props.onClick) trigger.props.onClick(e);
    },
    ref: buttonRef,
    "aria-haspopup": "dialog",
    "aria-expanded": isOpen,
    "aria-controls": "sections-dropdown-menu",
    tabIndex: 0,
  });

  return (
    <>
      {triggerWithProps}
      {isOpen && createPortal(menu, document.body)}
    </>
  );
};

export default SectionsDropdown;
