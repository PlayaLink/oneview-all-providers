import React, { useState, useRef, useEffect, useCallback } from "react";
import GridItemDetails, { InputField } from "./GridItemDetails";

interface SidePanelProps {
  isOpen: boolean;
  selectedRow: (any & { gridName: string }) | null;
  inputConfig: InputField[];
  onClose: () => void;
  title?: string;
  user: any;
  onUpdateSelectedProvider?: (gridName: string, updatedProvider: any) => void;
  /** Called when the expand icon is clicked in the header */
  onExpandDetailModal?: () => void;
}

const SidePanel: React.FC<SidePanelProps> = (props) => {
  const { isOpen, selectedRow, inputConfig, onClose, title, user, onUpdateSelectedProvider, onExpandDetailModal } = props;
  
  const [panelWidth, setPanelWidth] = useState(() => {
    // Load saved width from localStorage, fallback to default
    const savedWidth = localStorage.getItem('sidePanelWidth');
    return savedWidth ? parseInt(savedWidth, 10) : 484;
  });
  const [isResizing, setIsResizing] = useState(false);
  const [isHoveringResizeHandle, setIsHoveringResizeHandle] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Handle mouse down on resize handle
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  // Handle mouse move for resizing
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const viewportWidth = window.innerWidth;
    const newWidth = viewportWidth - e.clientX;
    const minWidth = 484; // Current minimum width
    const maxWidth = viewportWidth * 0.5; // 50% of viewport

    const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setPanelWidth(constrainedWidth);
  }, [isResizing]);

  // Save width to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidePanelWidth', panelWidth.toString());
  }, [panelWidth]);

  // Handle mouse up to stop resizing
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  if (!selectedRow) return null;

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white transform transition-transform duration-300 ease-in-out z-[1000] flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Side panel"
      data-testid="side-panel"
      style={{
        width: `${panelWidth}px`,
        boxShadow: isOpen
          ? "-8px 0 24px -2px rgba(0, 0, 0, 0.12), -4px 0 8px -2px rgba(0, 0, 0, 0.08)"
          : "none",
      }}
    >
      {/* Resize Handle */}
      <div
        ref={resizeRef}
        className={`absolute left-0 top-0 w-1 h-full cursor-col-resize z-10 transition-colors duration-200 ${
          isHoveringResizeHandle || isResizing 
            ? 'bg-[#008BC9]' 
            : 'bg-transparent hover:bg-[#E3F2FD]'
        }`}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHoveringResizeHandle(true)}
        onMouseLeave={() => setIsHoveringResizeHandle(false)}
        role="separator"
        aria-label="Resize side panel"
        aria-orientation="vertical"
        data-testid="side-panel-resize-handle"
      />
      
      <GridItemDetails
        selectedRow={selectedRow}
        inputConfig={inputConfig}
        onClose={onClose}
        title={title}
        user={user}
        onUpdateSelectedProvider={onUpdateSelectedProvider}
        onExpandDetailModal={onExpandDetailModal}
        context="sidepanel"
        panelWidth={panelWidth}
        isOpen={isOpen}
      />
    </div>
  );
};

export default SidePanel;
