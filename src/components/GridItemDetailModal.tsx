import React from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import GridItemDetails, { InputField } from "./GridItemDetails";

interface GridItemDetailModalProps {
  isOpen: boolean;
  selectedRow: (any & { gridKey: string }) | null;
  inputConfig: InputField[];
  onClose: () => void;
  title?: string;
  user: any;
  onUpdateSelectedProvider?: (gridKey: string, updatedProvider: any) => void;
  /** Whether this modal is in create mode (for new records) */
  isCreateMode?: boolean;
  /** Callback when a new record is created */
  onRecordCreated?: (newRecord: any) => void;
}

const GridItemDetailModal: React.FC<GridItemDetailModalProps> = (props) => {
  const { 
    isOpen, 
    selectedRow, 
    inputConfig, 
    onClose, 
    title, 
    user, 
    onUpdateSelectedProvider,
    isCreateMode = false,
    onRecordCreated 
  } = props;

  // For create mode, we need a minimal selectedRow with gridKey
  const effectiveSelectedRow = isCreateMode && selectedRow?.gridKey 
    ? { gridKey: selectedRow.gridKey, id: null }
    : selectedRow;

  if (!effectiveSelectedRow) return null;

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent 
        className="max-w-5xl w-full h-[90vh] flex flex-col" 
        data-testid="grid-item-detail-modal"
        onOpenAutoFocus={(e) => {
          // Prevent default focus behavior
          e.preventDefault();
          // Focus the first tab instead (details tab)
          const firstTab = document.querySelector('[data-testid="grid-item-details-tab"]');
          if (firstTab) {
            (firstTab as HTMLElement).focus();
          }
        }}
      >
        <GridItemDetails
          selectedRow={effectiveSelectedRow}
          inputConfig={inputConfig}
          onClose={onClose}
          title={isCreateMode ? `New ${title || 'Record'}` : title}
          user={user}
          onUpdateSelectedProvider={onUpdateSelectedProvider}
          context="modal"
          isModalOpen={isOpen}
          isCreateMode={isCreateMode}
          onRecordCreated={onRecordCreated}
        />
      </DialogContent>
    </Dialog>
  );
};

export default GridItemDetailModal; 