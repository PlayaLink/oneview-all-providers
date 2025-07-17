import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCopy, faEye, faDownload } from '@fortawesome/free-solid-svg-icons';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  rowData?: any;
  gridName?: string;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, rowData, gridName }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleMenuItemClick = (action: string) => {
    console.log(`Context menu action: ${action}`, { rowData, gridName });
    onClose();
  };

  const menuItems = [
    {
      id: 'view',
      label: 'View Details',
      icon: faEye,
      action: 'view',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      id: 'edit',
      label: 'Edit Record',
      icon: faEdit,
      action: 'edit',
      description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      id: 'copy',
      label: 'Copy Record',
      icon: faCopy,
      action: 'copy',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.'
    },
    {
      id: 'download',
      label: 'Download Data',
      icon: faDownload,
      action: 'download',
      description: 'Laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      id: 'delete',
      label: 'Delete Record',
      icon: faTrash,
      action: 'delete',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit.'
    }
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-64"
      style={{
        left: x,
        top: y,
        maxHeight: '400px',
        overflowY: 'auto'
      }}
      role="menu"
      aria-label="Row context menu"
      data-testid="context-menu"
      data-referenceid="context-menu"
    >
      {/* Header */}
      <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <h3 className="text-sm font-semibold text-gray-700" data-testid="context-menu-title">
          {gridName ? `${gridName} Actions` : 'Row Actions'}
        </h3>
        {rowData?.provider_name && (
          <p className="text-xs text-gray-500 mt-1" data-testid="context-menu-subtitle">
            {rowData.provider_name}
          </p>
        )}
      </div>

      {/* Menu Items */}
      <div className="py-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors duration-150"
            onClick={() => handleMenuItemClick(item.action)}
            role="menuitem"
            aria-label={item.label}
            data-testid={`context-menu-item-${item.id}`}
            data-referenceid={`context-menu-${item.id}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <FontAwesomeIcon 
                  icon={item.icon} 
                  className="w-4 h-4 text-gray-500" 
                  aria-hidden="true"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  {item.label}
                </div>
                <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {item.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-lg">
        <p className="text-xs text-gray-400 text-center">
          Right-click to close • ESC to cancel
        </p>
      </div>
    </div>
  );
};

export default ContextMenu; 