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
}

const GridItemDetailModal: React.FC<GridItemDetailModalProps> = (props) => {
  const { isOpen, selectedRow, inputConfig, onClose, title, user, onUpdateSelectedProvider } = props;

  if (!selectedRow) return null;

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="max-w-5xl w-full h-[90vh] flex flex-col" data-testid="grid-item-detail-modal">
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