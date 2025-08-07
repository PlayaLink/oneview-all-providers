import React from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import GridItemDetails, { InputField } from "./GridItemDetails";

interface GridItemDetailModalProps {
  isOpen: boolean;
  selectedRow: (any & { gridName: string }) | null;
  inputConfig: InputField[];
  onClose: () => void;
  title?: string;
  user: any;
  onUpdateSelectedProvider?: (gridName: string, updatedProvider: any) => void;
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

  // For create mode, we need a minimal selectedRow with gridName
  const effectiveSelectedRow = isCreateMode && selectedRow?.gridName 
    ? { gridName: selectedRow.gridName, id: null }
    : selectedRow;

  if (!effectiveSelectedRow) return null;

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="max-w-5xl w-full h-[90vh] flex flex-col" data-testid="grid-item-detail-modal">
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