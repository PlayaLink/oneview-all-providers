import React from "react";
import Icon from "@/components/ui/Icon";

interface AddProviderButtonProps {
  /** Click handler for the add provider action */
  onClick?: () => void;
  /** Additional CSS classes to apply */
  className?: string;
  /** Data test ID for testing */
  'data-testid'?: string;
  /** Data reference ID for DOM inspection */
  'data-referenceid'?: string;
}

const AddProviderButton: React.FC<AddProviderButtonProps> = ({
  onClick,
  className = "",
  'data-testid': dataTestId = "add-provider-button",
  'data-referenceid': dataReferenceId = "add-provider",
}) => {
  return (
    <button
      className={`bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-2 px-3 rounded flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 text-sm transition-colors ${className}`}
      type="button"
      aria-label="Add Provider"
      data-testid={dataTestId}
      data-referenceid={dataReferenceId}
      onClick={onClick}
    >
      Add Provider
      <Icon icon="plus" className="w-4 h-4" aria-hidden="true" />
    </button>
  );
};

export default AddProviderButton;
