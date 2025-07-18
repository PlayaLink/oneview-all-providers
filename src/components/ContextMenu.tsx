import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { getIconByName } from "@/lib/iconMapping";
import { cn } from "@/lib/utils";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  rowData?: any;
  gridName?: string;
}

interface MenuItem {
  id: string;
  label?: string;
  icon?: string;
  action?: string;
  enabled?: boolean;
  shortcut?: string;
  type?: "separator";
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  rowData,
  gridName,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleMenuItemClick = (action: string) => {
    console.log(`Context menu action: ${action}`, { rowData, gridName });
    onClose();
  };

  const menuItems: MenuItem[] = [
    {
      id: "add",
      label: "Add",
      icon: "plus",
      action: "add",
      enabled: true,
    },
    {
      id: "open-single-provider",
      label: "Open Single Provider View",
      icon: "external-link-alt",
      action: "open-single-provider",
      enabled: true,
    },
    {
      id: "open-prior-version",
      label: "Open in Prior Version",
      icon: "external-link-alt",
      action: "open-prior-version",
      enabled: true,
    },
    {
      id: "show-facility-details",
      label: "Show Facility Details",
      icon: "id-card",
      action: "show-facility-details",
      enabled: true,
    },
    {
      id: "clear-filters",
      label: "Clear All Filters",
      icon: "filter-circle-xmark",
      action: "clear-filters",
      enabled: true,
    },
    {
      id: "separator-1",
      type: "separator",
    },
    {
      id: "update-licenses",
      label: "Update Selected Licenses",
      icon: "rotate",
      action: "update-licenses",
      enabled: false,
    },
    {
      id: "unlock-record",
      label: "Unlock Selected Record",
      icon: "unlock",
      action: "unlock-record",
      enabled: false,
    },
    {
      id: "toggle-alerts",
      label: "Enable/Disable Selected Alerts",
      icon: "bell",
      action: "toggle-alerts",
      enabled: false,
    },
    {
      id: "enable-alerts",
      label: "Enable Selected Alerts",
      icon: "bell",
      action: "enable-alerts",
      enabled: false,
    },
    {
      id: "disable-alerts",
      label: "Disable Selected Alerts",
      icon: "bell-slash",
      action: "disable-alerts",
      enabled: false,
    },
    {
      id: "separator-2",
      type: "separator",
    },
    {
      id: "copy",
      label: "Copy",
      icon: "copy",
      action: "copy",
      enabled: true,
      shortcut: "Ctrl+C",
    },
    {
      id: "copy-with-headers",
      label: "Copy with Headers",
      icon: "copy",
      action: "copy-with-headers",
      enabled: true,
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-[285px] bg-white rounded-lg shadow-[0_0_25px_rgba(0,0,0,0.15)] py-1"
      style={{
        left: x,
        top: y,
      }}
      role="menu"
      aria-label="Row context menu"
      data-testid="context-menu"
      data-referenceid="context-menu"
    >
      {menuItems.map((item) => {
        if (item.type === "separator") {
          return (
            <div
              key={item.id}
              className="flex justify-center items-center py-1"
            >
              <div className="w-full h-px bg-[#EAECEF]" />
            </div>
          );
        }

        const IconComponent = getIconByName(item.icon!);
        const isEnabled = item.enabled;

        return (
          <button
            key={item.id}
            className={cn(
              "w-full flex items-center justify-end gap-2 px-2 py-1 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150",
              !isEnabled && "cursor-not-allowed",
            )}
            onClick={() => isEnabled && handleMenuItemClick(item.action!)}
            disabled={!isEnabled}
            role="menuitem"
            aria-label={item.label}
            data-testid={`context-menu-item-${item.id}`}
            data-referenceid={`context-menu-${item.id}`}
          >
            <div className="flex w-5 h-4 justify-center items-center">
              {IconComponent && (
                <FontAwesomeIcon
                  icon={IconComponent}
                  className={cn(
                    "w-4 h-4",
                    isEnabled ? "text-[#545454]" : "text-[#BABABA]",
                  )}
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="flex items-center gap-2 flex-1">
              <span
                className={cn(
                  "text-xs font-medium tracking-[0.429px]",
                  isEnabled ? "text-[#545454]" : "text-[#BABABA]",
                )}
                style={{
                  fontFamily:
                    "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                {item.label}
              </span>
            </div>

            {item.shortcut && (
              <span
                className={cn(
                  "text-xs font-medium tracking-[0.429px] text-right flex-1",
                  isEnabled ? "text-[#545454]" : "text-[#BABABA]",
                )}
                style={{
                  fontFamily:
                    "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                {item.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ContextMenu;
