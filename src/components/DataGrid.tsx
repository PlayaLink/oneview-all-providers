import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-enterprise";
import Icon from "@/components/ui/Icon";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { useGridActions } from "@/hooks/useGridActions";
import { updateGridColumnWidths, updateGridExpiringWithin, bulkDeleteRecords } from "@/lib/supabaseClient";
import { colorTokens } from "@/lib/colorTokens";
import ContextMenu from "./ContextMenu";
import ActionsColumn from "./ActionsColumn";
import ExpiringCellRenderer from "./ExpiringCellRenderer";
import GridSettingsDropdownMenu from "./GridSettingsDropdownMenu";

// Import AG Grid styles with Quartz theme
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-quartz.css";

// Custom Actions Header Component
const ActionsHeader: React.FC<{
  onAddRecord?: () => void;
  onMoreActions?: () => void;
  onHelp?: () => void;
  moreActionsRef?: React.RefObject<HTMLButtonElement>;
}> = ({ onAddRecord, onMoreActions, onHelp, moreActionsRef }) => {
  return (
    <div
      className="flex items-center justify-between w-full h-full"
      data-testid="actions-header"
      role="columnheader"
      aria-label="Actions column header"
    >
      <div className="flex items-center gap-2">
        <span className="ag-header-cell-text" data-testid="actions-header-text">
          Actions
        </span>
        <button
          onClick={onHelp}
          className="w-4 h-4 text-gray-800 hover:text-gray-600 transition-colors"
          data-testid="actions-help-button"
          data-referenceid="actions-help"
          aria-label="Help for actions"
          title="Help for actions"
        >
          <Icon icon="circle-exclamation" className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onAddRecord}
          className="w-6 h-6 bg-green-500 hover:bg-green-600 rounded transition-colors flex items-center justify-center"
          data-testid="actions-add-button"
          data-referenceid="actions-add"
          aria-label="Add new record"
          title="Add new record"
        >
          <Icon icon="plus" className="w-3 h-3 text-white" />
        </button>
        <button
          ref={moreActionsRef}
          onClick={onMoreActions}
          className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center"
          data-testid="actions-more-button"
          data-referenceid="actions-more"
          aria-label="More actions"
          title="More actions"
        >
          <Icon icon="ellipsis-vertical" className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

interface DataGridProps {
  title: string;
  icon: string;
  data: any[];
  columns: ColDef[];
  onSelectionChanged?: (event: any) => void;
  onRowClicked?: (data: any) => void;
  height?: string | number;
  showCheckboxes?: boolean;
  showStatusBadges?: boolean;
  selectedRowId?: string | null;
  handleShowFacilityDetails?: (facility: any) => void;
  showActionsColumn?: boolean;
  onDownload?: (data: any) => void;
  onToggleAlert?: (data: any, enabled: boolean) => void;
  onToggleSidebar?: (data: any) => void;
  onToggleFlag?: (data: any, flagged: boolean) => void;
  onToggleSummary?: (data: any, included: boolean) => void;
  onAddRecord?: () => void;
  onMoreHeaderActions?: () => void;
  /** Whether to pin the actions column to the right */
  pinActionsColumn?: boolean;
  /** Callback to open the detail modal */
  onOpenDetailModal?: (rowData: any) => void;
  /** Whether the side panel is open */
  isSidePanelOpen?: boolean;
  /** Grid columns data from database for width persistence */
  gridColumnsData?: Array<{ id: string; name: string; width?: number; visible?: boolean }>;
  /** Grid key for database operations (required) */
  gridKey: string;
  /** Default expiring days filter from grid definition */
  defaultExpiringDays?: number;
  /** Table name for database operations (e.g., 'state_licenses', 'addresses') */
  tableName?: string;
  /** Callback when records are deleted */
  onRecordsDeleted?: (deletedIds: string[]) => void;
}

const DataGrid: React.FC<DataGridProps> = (props) => {
  const {
    title,
    icon,
    data,
    columns,
    onSelectionChanged,
    onRowClicked,
    height,
    showCheckboxes = true,
    showStatusBadges = true,
    selectedRowId: controlledSelectedRowId,
    handleShowFacilityDetails,
    showActionsColumn = true,
    onDownload,
    onToggleAlert,
    onToggleSidebar,
    onToggleFlag,
    onToggleSummary,
    onAddRecord,
    onMoreHeaderActions,
    pinActionsColumn = true,
    onOpenDetailModal,
    isSidePanelOpen = false,
    gridColumnsData,
    gridKey,
    tableName,
    onRecordsDeleted,
  } = props;

  // Debug logging for props
  React.useEffect(() => {
    // Debug logging removed
  }, [title, tableName, gridKey]);
  // Collapsible state
  const [isExpanded, setIsExpanded] = React.useState(true);

  const [internalSelectedRowId, setInternalSelectedRowId] = React.useState<
    string | null
  >(null);
  const selectedRowId =
    controlledSelectedRowId !== undefined
      ? controlledSelectedRowId
      : internalSelectedRowId;

  // Context menu state
  const [contextMenu, setContextMenu] = React.useState<{
    show: boolean;
    x: number;
    y: number;
    rowData: any;
  } | null>(null);

  // Expiring dropdown state
  const [showExpiringDropdown, setShowExpiringDropdown] = React.useState(false);
  const [expiringDaysFilter, setExpiringDaysFilter] = React.useState(props.defaultExpiringDays || 30);

  // Row selection state for action bar
  const [selectedRows, setSelectedRows] = React.useState<any[]>([]);

  // Grid settings dropdown state
  const [isGridSettingsOpen, setIsGridSettingsOpen] = React.useState(false);
  const moreActionsRef = React.useRef<HTMLButtonElement>(null);
  


  // Column state persistence
  const [gridApi, setGridApi] = React.useState<any>(null);
  const gridStateKey = `ag-grid-state-${title}`;

  // Handle bulk deletion of selected rows
  const handleBulkDelete = React.useCallback(async () => {
    
    if (!tableName || selectedRows.length === 0) {
      // Warning: No table name or selected rows for deletion
      return;
    }

    try {
      // Show confirmation dialog
      const confirmed = window.confirm(
        `Are you sure you want to delete ${selectedRows.length} selected record${selectedRows.length > 1 ? 's' : ''}? This action cannot be undone.`
      );

      if (!confirmed) return;

      // Extract record IDs from selected rows
      const recordIds = selectedRows.map(row => row.id);
      
      // Call the bulk delete function from supabaseClient
      const result = await bulkDeleteRecords(tableName, recordIds);

      if (result.totalDeleted > 0) {
        // Clear selection
        if (gridApi) {
          gridApi.deselectAll();
        }
        setSelectedRows([]);
        
        // Notify parent component
        onRecordsDeleted?.(result.deletedIds);
        
        // Show success message
        // Success message handled by toast notification
        
        // Show warning if there were errors
        if (result.totalErrors > 0) {
          // Warning: Some records failed to delete
        }
      }
    } catch (error) {
      // Error handling with toast notification
      alert('An error occurred while deleting records. Please try again.');
    }
  }, [tableName, selectedRows, gridApi, onRecordsDeleted]);

  // Use feature flag for floating filters
  const { value: showFloatingFilters } = useFeatureFlag("floating_filters");

  // Get actual actions for this grid
  const { gridActions } = useGridActions(title);

  // Create a map of column names to their database IDs for width persistence
  const columnIdMap = React.useMemo(() => {
    if (!gridColumnsData) {
      return new Map();
    }
    const map = new Map(gridColumnsData.map(col => [col.name, col.id]));
    return map;
  }, [gridColumnsData]);

  // Grid settings dropdown handlers
  const handleMoreActions = React.useCallback(() => {
    setIsGridSettingsOpen(!isGridSettingsOpen);
  }, [isGridSettingsOpen]);

  const handleCloseGridSettings = React.useCallback(() => {
    setIsGridSettingsOpen(false);
  }, []);

  // Export handlers (placeholder implementations)
  const handleExportExcel = React.useCallback(() => {
    // Export to Excel functionality
    // TODO: Implement Excel export
    setIsGridSettingsOpen(false);
  }, []);

  const handleExportCSV = React.useCallback(() => {
    // Export to CSV functionality
    // TODO: Implement CSV export
    setIsGridSettingsOpen(false);
  }, []);

  const handleExportPDF = React.useCallback(() => {
    // Export to PDF functionality
    // TODO: Implement PDF export
    setIsGridSettingsOpen(false);
  }, []);

  const handleDownloadAllFiltered = React.useCallback(() => {
    // Download All (Filtered) functionality
    // TODO: Implement filtered download
    setIsGridSettingsOpen(false);
  }, []);

  const handleDownloadAll = React.useCallback(() => {
    // Download All functionality
    // TODO: Implement download all
    setIsGridSettingsOpen(false);
  }, []);

  const handleResetGridSettings = React.useCallback(() => {
    // Reset Grid Settings functionality
    // TODO: Implement grid settings reset
    if (gridApi) {
      // Reset column state
      gridApi.resetColumnState();
      // Clear localStorage
      localStorage.removeItem(`ag-grid-state-${title}`);
    }
    setIsGridSettingsOpen(false);
  }, [gridApi, title]);

  // Calculate actions column width based on number of actions
  const minWidthActionsColumn = 165;
  const calculateActionsColumnWidth = React.useCallback(() => {
    if (!showActionsColumn || !pinActionsColumn) return 120;

    // Each action button width (adjust this value to change action button size)
    // Plus some padding for the container
    const actionWidth = 32; // Width per action button
    const containerPadding = 16; // Padding on each side

    // Use actual action count from the grid
    const actualActions = gridActions?.length; // Fallback to 4 if not loaded yet

    return Math.min(
      Math.max(
        minWidthActionsColumn,
        actualActions * actionWidth + containerPadding,
      ),
      300,
    );
  }, [showActionsColumn, pinActionsColumn, title, gridActions]);

  // Prepare column definitions
  const columnDefs = React.useMemo(() => {
    const hasSort = columns.some((col) => col.sort);

    return [
      // Checkbox column
      ...(showCheckboxes
        ? [
            {
              headerName: "",
              headerCheckboxSelection: true,
              checkboxSelection: true,
              width: 50,
              pinned: "left" as const,
              lockPosition: true,
              suppressMenu: true,
              sortable: false,
              filter: false,
              resizable: false,
              editable: false,
            },
          ]
        : []),

      // Data columns
      ...columns.map((col) => {
        // Find database column data for width persistence
        const dbColumn = gridColumnsData?.find(dbCol => dbCol.name === col.field);
        
        const baseCol = {
          ...col,
          floatingFilter: showFloatingFilters,
          suppressMenu: false,
          filter: true,
          resizable: true,
          sortable: true,
          // Use database width if available, otherwise use column width or default
          width: dbColumn?.width || col.width || 120,
        };

        // Set default sort for provider_name if no sort is specified
        if (!hasSort && col.field === "provider_name") {
          baseCol.sort = "asc";
        }

        // Add custom cell renderer for expires_within column
        if (col.field === "expires_within") {
          baseCol.cellRenderer = (params: any) => (
            <ExpiringCellRenderer
              value={params.value}
              data={params.data}
              colDef={params.colDef}
              expiringDaysFilter={expiringDaysFilter}
            />
          );
        }

        return baseCol;
      }),

      // Actions column - only show when pinActionsColumn is true
      ...(showActionsColumn && pinActionsColumn
        ? [
            {
              headerName: "",
              field: "actions",
              width: calculateActionsColumnWidth(), // Dynamic width: 32px per action + 16px padding
              minWidth: minWidthActionsColumn, // Minimum width
              maxWidth: 300, // Maximum width
              suppressSizeToFit: true, // Prevent AG Grid from auto-sizing this column
              pinned: "right" as const,
              lockPosition: true,
              suppressMenu: true,
              sortable: false,
              filter: false,
              resizable: false,
              floatingFilter: false,
              suppressRowClickSelection: true,
              editable: false,
              headerComponent: (params: any) => (
                <ActionsHeader
                  onAddRecord={onAddRecord}
                  onMoreActions={handleMoreActions}
                  onHelp={() => {}}
                  moreActionsRef={moreActionsRef}
                />
              ),
              cellRenderer: (params: any) => (
                <ActionsColumn
                  gridKey={gridKey}
                  rowData={params.data}
                  onActionClick={(actionName, rowData) => {
                    switch (actionName) {
                      case "download":
                        onDownload?.(rowData);
                        break;
                      case "activate":
                        onDownload?.(rowData);
                        break;
                      case "alert":
                        onToggleAlert?.(rowData, true);
                        break;
                      case "side_panel":
                        onToggleSidebar?.(rowData);
                        break;
                      case "verifications":
                        onToggleFlag?.(rowData, true);
                        break;
                      case "flag":
                        onToggleFlag?.(rowData, true);
                        break;
                      case "view_details":
                        // Open the grid item details modal
                        onOpenDetailModal?.(rowData);
                        break;
                      case "deactivate":
                        break;
                      case "exclude":
                        break;
                      case "tracking":
                        break;
                      default:
                    }
                  }}
                  className="h-full flex items-center justify-center"
                />
              ),
            },
          ]
        : []),
    ];
  }, [
    columns,
    showCheckboxes,
    showFloatingFilters,
    showActionsColumn,
    onDownload,
    onToggleAlert,
    onToggleSidebar,
    onToggleFlag,
    onToggleSummary,
    onAddRecord,
    onMoreHeaderActions,
    pinActionsColumn,
    onOpenDetailModal,
    calculateActionsColumnWidth,
    expiringDaysFilter,
    gridColumnsData,
    selectedRows.length, // Re-render when selection changes
    handleBulkDelete, // Re-render when function changes
  ]);

  const isActionsColumnClickedRef = React.useRef(false);
  const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastClickTimeRef = React.useRef<number>(0);

  const handleCellClicked = (event: any) => {
    // If the click is on the actions column, set a flag to prevent row click
    if (event.column && event.column.getColId() === "actions") {
      isActionsColumnClickedRef.current = true;
      return;
    }
  };

  const handleRowClicked = (event: any) => {
    // Check if we just clicked on the actions column
    if (isActionsColumnClickedRef.current) {
      isActionsColumnClickedRef.current = false; // Reset the flag
      return;
    }
    
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTimeRef.current;
    
    // Clear any existing timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    
    // If this click happened within 200ms of the last click, treat it as a double-click
    if (timeSinceLastClick < 200) {
      // This is a double-click - don't trigger row selection
      // Let AG Grid handle the double-click for cell editing
      lastClickTimeRef.current = 0; // Reset to prevent triple-click issues
      return;
    }
    
    // Update the last click time
    lastClickTimeRef.current = currentTime;
    
    // Set a timeout to handle single-click after a delay
    clickTimeoutRef.current = setTimeout(() => {
      // This is a single-click - proceed with row selection
      event.api.setFocusedCell(null, null);

      if (selectedRowId === event.data.id) {
        if (controlledSelectedRowId === undefined) {
          setInternalSelectedRowId(null);
        }
        if (onRowClicked) {
          onRowClicked(null);
        }
        return;
      }

      if (controlledSelectedRowId === undefined) {
        setInternalSelectedRowId(event.data.id);
      }

      if (onRowClicked && event.data) {
        // Add gridKey to the row data for proper mapping
        const rowDataWithGridKey = { ...event.data, gridKey };
        onRowClicked(rowDataWithGridKey);
      }
    }, 200);
  };

  const handleSelectionChanged = (event: any) => {
    // Update selected rows for action bar
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node: any) => node.data);
    setSelectedRows(selectedData);

    if (onSelectionChanged) {
      onSelectionChanged(event);
    }
    if (controlledSelectedRowId === undefined) {
      setInternalSelectedRowId(null);
    }
  };

  const handleCellContextMenu = (event: any) => {
    event.event.preventDefault();
    const rowData = event.data;
    if (!rowData) return;

    setContextMenu({
      show: true,
      x: event.event.clientX,
      y: event.event.clientY,
      rowData: rowData,
    });
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const handleCellValueChanged = (event: any) => {
    // Handle cell value changes for inline editing
    const { data, colDef, newValue, oldValue } = event;
    
    // Only proceed if the value actually changed
    if (newValue === oldValue) return;
    
    // TODO: Add database update logic here
    // For now, just log the change
    console.log('Cell value changed:', {
      rowId: data.id,
      field: colDef.field,
      oldValue,
      newValue,
      gridKey
    });
    
    // You can add database update logic here:
    // await updateRecord(tableName, data.id, { [colDef.field]: newValue });
  };

  // Save column state to localStorage and database
  const saveColumnState = React.useCallback(async () => {
    if (gridApi) {
      const columnState = gridApi.getColumnState();
      
      // Safety check for columnState
      if (!columnState || !Array.isArray(columnState)) {
        // Warning: No column state available to save
        return;
      }
      
      localStorage.setItem(gridStateKey, JSON.stringify(columnState));
      
      // Save column widths to database if we have grid columns data
      if (gridColumnsData && gridKey) {
        try {
          const widthUpdates = columnState
            .filter((col: any) => col.width && columnIdMap.has(col.colId))
            .map((col: any) => ({
              columnId: columnIdMap.get(col.colId)!,
              width: col.width
            }));
          
          if (widthUpdates.length > 0) {
            await updateGridColumnWidths(widthUpdates);
          }
        } catch (error) {
          // Warning: Failed to save column widths to database
        }
      }
    }
  }, [gridApi, gridStateKey, gridColumnsData, gridKey, columnIdMap]);

  // Debounced save function to prevent too many database calls
  const debouncedSaveColumnState = React.useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        saveColumnState().catch(error => {
          // Warning: Debounced save failed
        });
      }, 500); // Debounce for 500ms
    };
  }, [saveColumnState]);

  // Create the actual debounced function
  const debouncedSave = React.useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        saveColumnState().catch(error => {
          // Warning: Debounced save failed
        });
      }, 500);
    };
  }, [saveColumnState]);

  // Load column state from localStorage and database
  const loadColumnState = React.useCallback(() => {
    if (gridApi) {
      const savedState = localStorage.getItem(gridStateKey);
      let columnState = [];
      
      if (savedState) {
        try {
          columnState = JSON.parse(savedState);
        } catch (error) {
          // Warning: Failed to parse saved column state
        }
      }
      
      // Apply database widths to column state if available
      if (gridColumnsData) {
        // If we have localStorage data, merge database widths with it
        if (columnState.length > 0) {
          columnState = columnState.map((col: any) => {
            const dbColumn = gridColumnsData.find(dbCol => dbCol.name === col.colId);
            if (dbColumn && dbColumn.width) {
              return { ...col, width: dbColumn.width };
            }
            return col;
          });
        } else {
          // If no localStorage data, create column state from database widths
          columnState = gridColumnsData
            .filter(col => col.width)
            .map(col => ({
              colId: col.name,
              width: col.width,
              hide: col.visible === false
            }));
        }
      }
      
      if (columnState.length > 0) {
        gridApi.applyColumnState({
          state: columnState,
          applyOrder: true,
          applyVisible: true,
          applySize: true,
          applySort: true,
          applyFilter: true,
        });
      }
    }
  }, [gridApi, gridStateKey, gridColumnsData]);

  const getRowStyle = (params: any) => {
    const baseStyle = {
      borderBottom: `1px solid ${colorTokens.gray[300]}`,
      backgroundColor: "white",
    };

    const isRowSelected = selectedRowId === params.data.id;

    if (isRowSelected) {
      return {
        ...baseStyle,
        backgroundColor: colorTokens.blue[100],
      };
    }

    if (params.node.isSelected()) {
      return {
        ...baseStyle,
        backgroundColor: colorTokens.blue[50],
      };
    }

    return baseStyle;
  };

  const getRowClass = (params: any) => {
    if (params.node.isSelected()) {
      return "checkbox-selected";
    }
    if (selectedRowId === params.data.id) {
      return "row-selected";
    }
    return "";
  };

  const computedHeight = typeof height === "number" ? `${height}px` : height;

  // Calculate expiration statistics from data
  const expirationStats = React.useMemo(() => {
    if (!data || data.length === 0) {
      return { expiring: 0, expired: 0, total: 0 };
    }

    const now = new Date();
    let expiring = 0;
    let expired = 0;

    data.forEach((row: any) => {
      // Check for various expiration date fields
      const expirationDate = row.expiration_date || row.expires_within || row.end_date || row.expiry_date;
      
      if (expirationDate) {
        const expDate = new Date(expirationDate);
        
        // Check if expired (past date)
        if (expDate < now) {
          expired++;
        } else {
          // Check if expiring within selected days
          const daysFromNow = new Date();
          daysFromNow.setDate(daysFromNow.getDate() + expiringDaysFilter);
          
          if (expDate <= daysFromNow) {
            expiring++;
          }
        }
      }
    });

    return {
      expiring,
      expired,
      total: data.length
    };
  }, [data, expiringDaysFilter]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Check if click is on the dropdown or the expiring button
      if (!target.closest('.expiring-dropdown') && !target.closest('[data-testid="expiring-button"]')) {
        setShowExpiringDropdown(false);
      }
    };

    if (showExpiringDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showExpiringDropdown]);

  // Expiring days options
  const expiringDaysOptions = [
    { value: 7, label: "7 Days" },
    { value: 14, label: "14 Days" },
    { value: 30, label: "30 Days" },
    { value: 60, label: "60 Days" },
    { value: 90, label: "90 Days" },
    { value: 120, label: "120 Days" },
    { value: 150, label: "150 Days" },
    { value: 180, label: "180 Days" },
    { value: 210, label: "210 Days" },
    { value: 240, label: "240 Days" },
    { value: 270, label: "270 Days" },
    { value: 300, label: "300 Days" },
    { value: 330, label: "330 Days" },
    { value: 360, label: "360 Days" },
  ];

  return (
    <section
      className="bg-white"
      role="region"
      aria-label={`${title} data grid`}
      data-testid="data-grid"
    >
      {/* Grid Header */}
      <header
        className={`flex items-center justify-between pl-1 pr-3 py-[9px] bg-gray-100 border-b border-gray-300 flex-shrink-0 overflow-visible cursor-pointer hover:bg-gray-200 transition-colors ${
          isSidePanelOpen ? 'rounded-tl' : 'rounded-t'
        }`}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`Toggle ${title} grid`}
        data-testid="grid-header"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className="flex items-center gap-2 pl-4">
          <Icon
            icon={icon}
            className="pr-1 w-4 h-4 text-gray-800"
            aria-hidden="true"
          />
          <h2 className="text-gray-800 font-semibold text-xs tracking-wider">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {showStatusBadges && (
            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Status indicators"
            >
              {expirationStats.expiring > 0 && (
                <div className="relative">
                  <button
                    className="flex items-center gap-1 px-2.5 py-0.5 bg-orange-500 rounded-full hover:bg-orange-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowExpiringDropdown(!showExpiringDropdown);
                    }}
                    aria-label={`${expirationStats.expiring} items expiring`}
                    data-testid="expiring-button"
                  >
                    <span className="text-white font-bold text-xs">{expirationStats.expiring}</span>
                    <span className="text-white font-bold text-xs">Expiring</span>
                    <Icon 
                      icon="chevron-down" 
                      className={`w-3 h-3 text-white`}
                    />
                  </button>
                  
                  {showExpiringDropdown && (
                    <div 
                      className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-48 expiring-dropdown z-[10000]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2 p-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Within
                        </label>
                        <select
                          value={expiringDaysFilter}
                          onChange={async (e) => {
                            const newValue = Number(e.target.value);
                            // Debug: Dropdown changed
                            setExpiringDaysFilter(newValue);
                            
                            // Save to database if we have a grid key
                            if (gridKey) {
                              try {
                                // Debug: Attempting to save to database
                                const result = await updateGridExpiringWithin(gridKey, newValue);
                                // Debug: Save successful
                              } catch (error) {
                                // Error: Failed to save expiring days to database
                              }
                            } else {
                              // Warning: No gridKey available for saving
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {expiringDaysOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {expirationStats.expired > 0 && (
                <div
                  className="flex items-center gap-1 px-2.5 py-0.5 bg-red-500 rounded-full"
                  role="status"
                  aria-label={`${expirationStats.expired} items expired`}
                >
                  <span className="text-white font-bold text-xs">{expirationStats.expired}</span>
                  <span className="text-white font-bold text-xs">Expired</span>
                </div>
              )}
              <div
                className="flex items-center gap-1 px-2.5 py-0.5 bg-gray-600 rounded-full"
                role="status"
                aria-label={`${expirationStats.total} total items`}
              >
                <span className="text-white font-bold text-xs">
                  {expirationStats.total > 999 ? '999+' : expirationStats.total}
                </span>
                <span className="text-white font-bold text-xs">Total</span>
              </div>
            </div>
          )}

          <div className="flex items-center">
            <div
              className="w-9 h-5 bg-green-500 rounded-full relative"
              role="switch"
              aria-label="Toggle view mode"
              aria-checked="true"
            >
              <div
                className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"
                aria-hidden="true"
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Action Bar - Shows when rows are selected */}
      {isExpanded && selectedRows.length > 0 && (
        <div
          className="flex px-4 py-2 border-b border-gray-300 gap-4 bg-blue-100"
          style={{ 
            height: '40px' // Match AG Grid header height
          }}
          role="toolbar"
          aria-label="Row actions"
          data-testid="action-bar"
        >
          <div className="flex items-center gap-4">
            <button
              className="w-4 h-4 bg-gray-600 rounded flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => {
                if (gridApi) {
                  gridApi.deselectAll();
                  setSelectedRows([]);
                }
              }}
              data-testid="unselect-all"
              aria-label="Unselect all rows"
              title="Unselect all rows"
            >
              <div className="w-2 h-0.5 bg-white"></div>
            </button>
            <span className="text-sm font-medium text-gray-700">
              {selectedRows.length} selected
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            
            
            <button
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 underline"
              onClick={handleBulkDelete}
              data-testid="action-delete"
            >
              <Icon icon="trash-can" className="w-3 h-3" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* AG Grid Container */}
      {isExpanded && (
        <div
          className="ag-theme-quartz"
          style={
            {
              width: "100%",
              ...(height ? { height: computedHeight } : {}),
            } as React.CSSProperties
          }
          role="grid"
          aria-label={`${title} data table`}
          aria-rowcount={data.length}
          aria-colcount={columnDefs.length}
          data-testid="ag-grid-container"
          onContextMenu={(e) => e.preventDefault()}
        >
        <AgGridReact
          theme="legacy"
          rowData={data}
          columnDefs={columnDefs}
          onSelectionChanged={handleSelectionChanged}
          onRowClicked={handleRowClicked}
          onCellClicked={handleCellClicked}
          onCellContextMenu={handleCellContextMenu}
          onCellValueChanged={handleCellValueChanged}
          rowSelection={showCheckboxes ? "multiple" : undefined}
          headerHeight={selectedRows.length > 0 ? 0 : 40} // Hide headers when rows are selected
          rowHeight={42}
          suppressRowClickSelection={true}
          suppressCellFocus={false}
          singleClickEdit={false}
          stopEditingWhenCellsLoseFocus={true}
          {...(!height ? { domLayout: "autoHeight" } : {})}
          getRowStyle={getRowStyle}
          getRowClass={getRowClass}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            floatingFilter: showFloatingFilters,
            cellClass: "ag-cell-vertically-centered",
            editable: true,
            filterParams: {
              buttons: ["reset"],
              closeOnApply: true,
              suppressApplyButton: true,
            },
          }}
          suppressColumnVirtualisation={false}
          cellSelection={false}
          maintainColumnOrder={true}
          onGridReady={(params) => {
            setGridApi(params.api);
            params.api.sizeColumnsToFit();
            // Load saved column state after grid is ready
            setTimeout(() => {
              loadColumnState();
            }, 100);
          }}
          onColumnMoved={(event) => {
            saveColumnState().catch(error => {
              // Warning: Column move save failed
            });
          }}
          onColumnResized={(event) => {
            debouncedSave();
          }}
          onSortChanged={(event) => {
            saveColumnState().catch(error => {
              // Warning: Sort change save failed
            });
          }}
          onFilterChanged={(event) => {
            saveColumnState().catch(error => {
              // Warning: Filter change save failed
            });
          }}
        />
        </div>
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          rowData={contextMenu.rowData}
          gridKey={gridKey}
          onClose={handleContextMenuClose}
          handleShowFacilityDetails={handleShowFacilityDetails}
        />
      )}

      <GridSettingsDropdownMenu
        isOpen={isGridSettingsOpen}
        onClose={handleCloseGridSettings}
        anchorRef={moreActionsRef}
        onExportExcel={handleExportExcel}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        onDownloadAllFiltered={handleDownloadAllFiltered}
        onDownloadAll={handleDownloadAll}
        onResetGridSettings={handleResetGridSettings}
      />
    </section>
  );
};

export default DataGrid;
