import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { createPopper, Instance } from "@popperjs/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { getGroups, getGridsByGroup, gridDefinitions, GridDefinition } from "@/lib/gridDefinitions";

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
  const allGroups = getGroups();

  // Optionally, you can add disabled grids here by tableName
  const disabledGrids = new Set([
    "SAM", "FSMB Actions", "Verifications"
  ]);

  // Filtered groups and grids based on search
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return allGroups;
    return allGroups.filter(group => {
      const groupGrids = getGridsByGroup(group);
      return (
        group.toLowerCase().includes(search.toLowerCase()) ||
        groupGrids.some(grid => grid.tableName.replace(/_/g, " ").toLowerCase().includes(search.toLowerCase()))
      );
    });
  }, [search, allGroups]);

  const filteredGridsByGroup = (group: string) => {
    const groupGrids = getGridsByGroup(group);
    if (!search.trim()) return groupGrids;
    return groupGrids.filter(grid =>
      grid.tableName.replace(/_/g, " ").toLowerCase().includes(search.toLowerCase())
    );
  };

  // Group checkbox state: checked if all children are checked, indeterminate if some
  const isGroupChecked = (group: string) => {
    const grids = getGridsByGroup(group).filter(grid => !disabledGrids.has(grid.tableName));
    return grids.length > 0 && grids.every(grid => visibleSections.has(grid.tableName));
  };
  const isGroupIndeterminate = (group: string) => {
    const grids = getGridsByGroup(group).filter(grid => !disabledGrids.has(grid.tableName));
    return grids.some(grid => visibleSections.has(grid.tableName)) && !isGroupChecked(group);
  };

  // Group toggle: toggles all children
  const handleGroupToggle = (group: string) => {
    const grids = getGridsByGroup(group).filter(grid => !disabledGrids.has(grid.tableName));
    const allChecked = grids.every(grid => visibleSections.has(grid.tableName));
    grids.forEach(grid => {
      onSectionVisibilityChange(grid.tableName, !allChecked);
    });
  };

  // Grid toggle
  const handleGridToggle = (grid: GridDefinition) => {
    if (disabledGrids.has(grid.tableName)) return;
    onSectionVisibilityChange(grid.tableName, !visibleSections.has(grid.tableName));
  };

  // Clear all
  const handleClear = () => {
    gridDefinitions.forEach(grid => {
      if (!disabledGrids.has(grid.tableName)) {
        onSectionVisibilityChange(grid.tableName, false);
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
    return gridDefinitions.filter(grid => visibleSections.has(grid.tableName));
  }, [visibleSections]);

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
      <div className="flex items-center mb-4">
        {/* Pills and input in a flex container to mimic multi-select */}
        <div className="flex flex-1 flex-wrap items-center rounded bg-gray-100 px-2 py-1 min-h-[40px] border border-transparent focus-within:border-blue-400">
          {checkedGrids.map(grid => (
            <span
              key={grid.tableName}
              className="flex items-center bg-[#545454] text-white font-bold rounded px-3 py-1 mr-2 mb-1 text-sm"
              style={{ lineHeight: '1.2' }}
            >
              {grid.tableName.replace(/_/g, " ")}
              <button
                type="button"
                className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                style={{ fontWeight: 'bold', fontSize: '1rem', lineHeight: '1' }}
                onClick={() => onSectionVisibilityChange(grid.tableName, false)}
                aria-label={`Remove ${grid.tableName.replace(/_/g, ' ')}`}
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
          />
        </div>
        <button
          className="ml-2 text-blue-600 text-sm font-medium hover:underline"
          onClick={handleClear}
          type="button"
          aria-label="Clear all selected sections"
          data-testid="clear-sections-button"
        >
          Clear
        </button>
      </div>
      {/* Columns */}
      <div className="flex gap-8">
        {groupColumns.map((groups, colIdx) => (
          <div key={colIdx} className="flex-1 min-w-0">
            {groups.map(group => (
              <div key={group} className="mb-4">
                {/* Group Checkbox */}
                <label className="flex items-center font-semibold text-gray-800 mb-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 accent-blue-600 h-4 w-4"
                    checked={isGroupChecked(group)}
                    ref={el => {
                      if (el) el.indeterminate = isGroupIndeterminate(group);
                    }}
                    onChange={() => handleGroupToggle(group)}
                  />
                  {group}
                </label>
                {/* Grids */}
                <div className="pl-6 flex flex-col gap-1">
                  {filteredGridsByGroup(group).map(grid => (
                    <label
                      key={grid.tableName}
                      className={`flex items-center text-gray-700 font-medium cursor-pointer ${disabledGrids.has(grid.tableName) ? "text-gray-300 cursor-not-allowed" : ""}`}
                    >
                      <input
                        type="checkbox"
                        className="mr-2 accent-blue-600 h-4 w-4"
                        checked={visibleSections.has(grid.tableName)}
                        disabled={disabledGrids.has(grid.tableName)}
                        onChange={() => handleGridToggle(grid)}
                      />
                      {grid.tableName.replace(/_/g, " ")}
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
    <div className="relative" style={{ display: "inline-block" }} role="group" aria-label="Section visibility controls">
      <button
        ref={buttonRef}
        className="flex items-center gap-2 text-xs font-medium tracking-wide border border-gray-300 rounded px-3 py-1 bg-white focus:outline-none focus:ring-0"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Sections dropdown${visibleSections.size > 0 ? ` (${visibleSections.size} selected)` : ""}`}
        data-testid="sections-dropdown-button"
      >
        Sections{visibleSections.size > 0 ? ` (${visibleSections.size})` : ""}
        <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3 ml-1" aria-hidden="true" />
      </button>
      {isOpen && typeof window !== "undefined"
        ? createPortal(menu, document.body)
        : null}
    </div>
  );
};

export default SectionsDropdown;
