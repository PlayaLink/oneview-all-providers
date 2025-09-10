import React, { useState, useRef, useEffect } from "react";
import DropdownMenuItem from "./DropdownMenuItem";
import { cn } from "@/lib/utils";

interface GridSettingsDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  onExportExcel?: () => void;
  onExportCSV?: () => void;
  onExportPDF?: () => void;
  onDownloadAllFiltered?: () => void;
  onDownloadAll?: () => void;
  onResetGridSettings?: () => void;
}

interface MenuState {
  recordVisibility: "all" | "inactive" | "active";
  flagVisibility: "all" | "flagged" | "unflagged";
  alertVisibility: "all" | "enabled" | "disabled";
  expiringDays: 7 | 14 | 30 | 60 | 90 | 120;
  verificationVisibility: "all" | "not-started" | "in-progress" | "ready-for-recred" | "verified" | "not-able-to-verify" | "due-diligence";
}

const GridSettingsDropdownMenu: React.FC<GridSettingsDropdownMenuProps> = ({
  isOpen,
  onClose,
  anchorRef,
  onExportExcel,
  onExportCSV,
  onExportPDF,
  onDownloadAllFiltered,
  onDownloadAll,
  onResetGridSettings,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  // Menu state management
  const [menuState, setMenuState] = useState<MenuState>({
    recordVisibility: "all",
    flagVisibility: "all",
    alertVisibility: "all",
    expiringDays: 14,
    verificationVisibility: "all",
  });

  // Position the dropdown relative to the anchor button
  useEffect(() => {
    if (isOpen && anchorRef.current && menuRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = anchorRect.bottom + 4; // 4px gap below button
      let left = anchorRect.right - 285 - 8; // Position menu so its top-right corner is just left of ellipsis icon

      // Adjust if menu goes off-screen horizontally
      if (left < 8) {
        left = 8; // 8px margin from left edge
      } else if (left + 285 > viewportWidth - 8) {
        left = viewportWidth - 285 - 8; // 8px margin from right edge
      }

      // Adjust if menu goes off-screen vertically
      if (top + menuRect.height > viewportHeight - 8) {
        top = anchorRect.top - menuRect.height - 4; // Show above button instead
      }

      setPosition({ top, left });
    }
  }, [isOpen, anchorRef]);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const Separator = () => (
    <div className="flex py-1 justify-center items-center">
      <div className="w-full h-px bg-[#E6E7EB]" />
    </div>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex px-4 py-2 justify-start items-center">
      <span
        className="text-xs font-medium tracking-[1px] text-[#4C5564] uppercase"
        style={{
          fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
        }}
      >
        {title}
      </span>
    </div>
  );

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-[285px] bg-white rounded-lg py-1"
      style={{
        top: position.top,
        left: position.left,
        boxShadow: "0 0 25px rgba(0, 0, 0, 0.15)",
      }}
      role="menu"
      aria-label="Grid settings menu"
      data-testid="grid-settings-dropdown-menu"
    >
      {/* Record Visibility Section */}
      <DropdownMenuItem
        name="Show All Records"
        type="checkbox"
        selected={menuState.recordVisibility === "all"}
        onClick={() => setMenuState(prev => ({ ...prev, recordVisibility: "all" }))}
      />
      <DropdownMenuItem
        name="Show Inactive Records"
        type="checkbox"
        selected={menuState.recordVisibility === "inactive"}
        onClick={() => setMenuState(prev => ({ ...prev, recordVisibility: "inactive" }))}
      />
      <DropdownMenuItem
        name="Show Active Records"
        type="checkbox"
        selected={menuState.recordVisibility === "active"}
        onClick={() => setMenuState(prev => ({ ...prev, recordVisibility: "active" }))}
      />

      <Separator />

      {/* Flag Visibility Section */}
      <DropdownMenuItem
        name="Show All Flags"
        type="checkbox"
        selected={menuState.flagVisibility === "all"}
        onClick={() => setMenuState(prev => ({ ...prev, flagVisibility: "all" }))}
      />
      <DropdownMenuItem
        name="Show Flagged Items"
        type="checkbox"
        selected={menuState.flagVisibility === "flagged"}
        onClick={() => setMenuState(prev => ({ ...prev, flagVisibility: "flagged" }))}
      />
      <DropdownMenuItem
        name="Show Unflagged Items"
        type="checkbox"
        selected={menuState.flagVisibility === "unflagged"}
        onClick={() => setMenuState(prev => ({ ...prev, flagVisibility: "unflagged" }))}
      />

      <Separator />

      {/* Alert Visibility Section */}
      <DropdownMenuItem
        name="Show All Alerts"
        type="checkbox"
        selected={menuState.alertVisibility === "all"}
        onClick={() => setMenuState(prev => ({ ...prev, alertVisibility: "all" }))}
      />
      <DropdownMenuItem
        name="Show Enabled Alerts"
        type="checkbox"
        selected={menuState.alertVisibility === "enabled"}
        onClick={() => setMenuState(prev => ({ ...prev, alertVisibility: "enabled" }))}
      />
      <DropdownMenuItem
        name="Show Disabled Alerts"
        type="checkbox"
        selected={menuState.alertVisibility === "disabled"}
        onClick={() => setMenuState(prev => ({ ...prev, alertVisibility: "disabled" }))}
      />

      <Separator />

      {/* Expiration Section */}
      <div className="px-2 py-1">
        <SectionHeader title="Expiration Status & Alerts" />
        <div className="flex px-4 py-0 justify-center items-center gap-2">
          <span
            className="flex-1 text-xs font-medium tracking-[0.429px] text-[#202938]"
            style={{
              fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
            }}
          >
            Mark records as Expiring if Exp. Date is within:
          </span>
        </div>
      </div>

      <DropdownMenuItem
        name="7 Days"
        type="radio"
        selected={menuState.expiringDays === 7}
        onClick={() => setMenuState(prev => ({ ...prev, expiringDays: 7 }))}
      />
      <DropdownMenuItem
        name="14 Days"
        type="radio"
        selected={menuState.expiringDays === 14}
        onClick={() => setMenuState(prev => ({ ...prev, expiringDays: 14 }))}
      />
      <DropdownMenuItem
        name="30 Days"
        type="radio"
        selected={menuState.expiringDays === 30}
        onClick={() => setMenuState(prev => ({ ...prev, expiringDays: 30 }))}
      />
      <DropdownMenuItem
        name="60 Days"
        type="radio"
        selected={menuState.expiringDays === 60}
        onClick={() => setMenuState(prev => ({ ...prev, expiringDays: 60 }))}
      />
      <DropdownMenuItem
        name="90 Days"
        type="radio"
        selected={menuState.expiringDays === 90}
        onClick={() => setMenuState(prev => ({ ...prev, expiringDays: 90 }))}
      />
      <DropdownMenuItem
        name="120 Days"
        type="radio"
        selected={menuState.expiringDays === 120}
        onClick={() => setMenuState(prev => ({ ...prev, expiringDays: 120 }))}
      />

      <Separator />

      {/* Verification Section */}
      <DropdownMenuItem
        name="Show All Verifications"
        type="checkbox"
        selected={menuState.verificationVisibility === "all"}
        onClick={() => setMenuState(prev => ({ ...prev, verificationVisibility: "all" }))}
      />
      <DropdownMenuItem
        name="Show Not Started"
        type="checkbox"
        selected={menuState.verificationVisibility === "not-started"}
        onClick={() => setMenuState(prev => ({ ...prev, verificationVisibility: "not-started" }))}
      />
      <DropdownMenuItem
        name="Show In Progress"
        type="checkbox"
        selected={menuState.verificationVisibility === "in-progress"}
        onClick={() => setMenuState(prev => ({ ...prev, verificationVisibility: "in-progress" }))}
      />
      <DropdownMenuItem
        name="Show Ready for Recred"
        type="checkbox"
        selected={menuState.verificationVisibility === "ready-for-recred"}
        onClick={() => setMenuState(prev => ({ ...prev, verificationVisibility: "ready-for-recred" }))}
      />
      <DropdownMenuItem
        name="Show Verified"
        type="checkbox"
        selected={menuState.verificationVisibility === "verified"}
        onClick={() => setMenuState(prev => ({ ...prev, verificationVisibility: "verified" }))}
      />
      <DropdownMenuItem
        name="Show Not Able to Verify"
        type="checkbox"
        selected={menuState.verificationVisibility === "not-able-to-verify"}
        onClick={() => setMenuState(prev => ({ ...prev, verificationVisibility: "not-able-to-verify" }))}
      />
      <DropdownMenuItem
        name="Show Due Diligence"
        type="checkbox"
        selected={menuState.verificationVisibility === "due-diligence"}
        onClick={() => setMenuState(prev => ({ ...prev, verificationVisibility: "due-diligence" }))}
      />

      <Separator />

      {/* Export Section */}
      <DropdownMenuItem
        icon="file-export"
        name="Export to Excel"
        onClick={onExportExcel}
      />
      <DropdownMenuItem
        icon="file-export"
        name="Export to CSV"
        onClick={onExportCSV}
      />
      <DropdownMenuItem
        icon="file-export"
        name="Export to PDF"
        onClick={onExportPDF}
      />
      <DropdownMenuItem
        icon="circle-down"
        name="Download All (Filtered)"
        onClick={onDownloadAllFiltered}
      />
      <DropdownMenuItem
        icon="circle-down"
        name="Download All"
        onClick={onDownloadAll}
      />

      <Separator />

      {/* Reset Section */}
      <DropdownMenuItem
        icon="rotate"
        name="Reset Grid Settings"
        onClick={onResetGridSettings}
      />
    </div>
  );
};

export default GridSettingsDropdownMenu;
