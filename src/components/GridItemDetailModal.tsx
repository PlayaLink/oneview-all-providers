import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import GridItemDetails, { InputField } from "./GridItemDetails";

interface GridItemDetailModalProps {
  isOpen: boolean;
  selectedRow: (any & { gridName: string }) | null;
  inputConfig: InputField[];
  onClose: () => void;
  title?: string;
  user: any;
  onUpdateSelectedProvider?: (gridName: string, updatedProvider: any) => void;
}

const GridItemDetailModal: React.FC<GridItemDetailModalProps> = (props) => {
  const { isOpen, selectedRow, inputConfig, onClose, title, user, onUpdateSelectedProvider } = props;

  if (!selectedRow) return null;

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="max-w-5xl w-full h-[90vh] flex flex-col" data-testid="grid-item-detail-modal">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-gray-700 tracking-wider">
            {title || "Details"}
          </DialogTitle>
        </DialogHeader>
        <GridItemDetails
          selectedRow={selectedRow}
          inputConfig={inputConfig}
          onClose={onClose}
          title={title}
          user={user}
          onUpdateSelectedProvider={onUpdateSelectedProvider}
          context="modal"
          isModalOpen={isOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default GridItemDetailModal; 