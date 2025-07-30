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
    return savedWidth ? parseInt(savedWidth, 10) : 575;
  });
  const [isDragging, setIsDragging] = useState(false);
  const dividerRef = useRef<HTMLDivElement>(null);

  // Save width to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidePanelWidth', panelWidth.toString());
  }, [panelWidth]);

  // Handle mouse down on divider
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    // Use requestAnimationFrame for smoother performance
    requestAnimationFrame(() => {
      // Get the container that holds both grids and sidepanel
      const container = dividerRef.current?.parentElement?.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      
      // Calculate new panel width based on mouse position
      // Mouse position from right edge of container
      const mouseXFromRight = containerRect.right - e.clientX;
      
      const minWidth = 300; // Minimum panel width
      const maxWidth = containerWidth * 0.8; // Maximum 80% of container width
      
      const newWidth = Math.max(minWidth, Math.min(maxWidth, mouseXFromRight));
      setPanelWidth(newWidth);
    });
  }, [isDragging]);

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  if (!selectedRow) return null;

  return (
    <>
      {/* Draggable Divider */}
      {isOpen && (
        <div
          ref={dividerRef}
          className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors duration-200 flex-shrink-0"
          onMouseDown={handleMouseDown}
          role="separator"
          aria-label="Resize side panel"
          aria-orientation="vertical"
          data-testid="side-panel-divider"
          style={{ minHeight: '100%' }}
        />
      )}
      
      {/* SidePanel */}
      <div
        className={`h-full bg-white border-l border-gray-300 flex flex-col ${isOpen ? "w-full" : "w-0 overflow-hidden"} ${isDragging ? "" : "transition-all duration-300 ease-in-out"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Side panel"
        data-testid="side-panel"
        style={{
          width: isOpen ? `${panelWidth}px` : '0px',
          minWidth: isOpen ? `${panelWidth}px` : '0px'
        }}
      >
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
    </>
  );
};

export default SidePanel;
