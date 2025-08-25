import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-enterprise";
import Icon from "@/components/ui/Icon";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { useGridActions } from "@/hooks/useGridActions";
import { updateGridColumnWidths, updateGridExpiringWithin, bulkDeleteRecords } from "@/lib/supabaseClient";
import ContextMenu from "./ContextMenu";
import ActionsColumn from "./ActionsColumn";
import ExpiringCellRenderer from "./ExpiringCellRenderer";

// Import AG Grid styles with Quartz theme
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-quartz.css";

// Custom Actions Header Component
const ActionsHeader: React.FC<{
  onAddRecord?: () => void;
  onMoreActions?: () => void;
  onHelp?: () => void;
}> = ({ onAddRecord, onMoreActions, onHelp }) => {
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
          className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors"
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
          className="w-6 h-6 bg-[#79AC48] hover:bg-[#6B9A3F] rounded transition-colors flex items-center justify-center"
          data-testid="actions-add-button"
          data-referenceid="actions-add"
          aria-label="Add new record"
          title="Add new record"
        >
          <Icon icon="plus" className="w-3 h-3 text-white" />
        </button>
        <button
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
  /** Grid name/key for database operations */
  gridName?: string;
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
    gridName,
    tableName,
    onRecordsDeleted,
  } = props;

  // Debug logging for props
  React.useEffect(() => {
    console.log('DataGrid props:', { title, tableName, gridName });
  }, [title, tableName, gridName]);

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
  // Expiration filter state
  const [expirationFilter, setExpirationFilter] = React.useState<string | null>(null);
  // Column state persistence
  const [gridApi, setGridApi] = React.useState<any>(null);
  const gridStateKey = `ag-grid-state-${title}`;

  // Handle bulk deletion of selected rows
  const handleBulkDelete = React.useCallback(async () => {
    console.log('handleBulkDelete called with:', { tableName, selectedRowsCount: selectedRows.length });

    if (!tableName || selectedRows.length === 0) {
      console.warn('No table name or selected rows for deletion:', { tableName, selectedRowsCount: selectedRows.length });
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
        console.log(`Successfully deleted ${result.totalDeleted} record(s)`);

        // Show warning if there were errors
        if (result.totalErrors > 0) {
          console.warn(`${result.totalErrors} records failed to delete:`, result.errors);
        }
      }
    } catch (error) {
      console.error('Bulk deletion failed:', error);
      alert('An error occurred while deleting records. Please try again.');
    }
  }, [tableName, selectedRows, gridApi, onRecordsDeleted]);

  // Use feature flag for floating filters
  const { value: showFloatingFilters } = useFeatureFlag("floating_filters");

  // External filter function for expiration dates
  const isExternalFilterPresent = React.useCallback(() => {
    console.log('isExternalFilterPresent called, expirationFilter:', expirationFilter);
    const result = expirationFilter !== null && expirationFilter !== 'All records';
    console.log('isExternalFilterPresent result:', result);
    return result;
  }, [expirationFilter]);

  const doesExternalFilterPass = React.useCallback((node: any) => {
    console.log('doesExternalFilterPass called for node:', node?.data?.id, 'expirationFilter:', expirationFilter);
    
    if (!expirationFilter || expirationFilter === 'All records') {
      console.log('No filter or All records selected, showing row');
      return true;
    }

    // Get the expiration date from the row data
    const data = node.data;
    const expirationDate = data.expiration_date || data.expires_within || data.end_date || data.expiry_date;
    if (!expirationDate) {
      console.log('No expiration date found, hiding row');
      return false; // Hide records without expiration dates
    }

    // Calculate days until expiration
    const today = new Date();
    const expDate = new Date(expirationDate);
    const timeDiff = expDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Parse the filter value (e.g., "7 Days" -> 7)
    const daysMatch = expirationFilter.match(/(\d+)\s*Days?/);
    if (!daysMatch) {
      console.log('Could not parse filter value:', expirationFilter);
      return false;
    }

    const filterDays = parseInt(daysMatch[1]);
    console.log('Days until expiration:', daysDiff, 'Filter days:', filterDays);

    // Filter based on the selected timeframe
    // Show records that expire within the specified number of days
    const shouldShow = daysDiff >= 0 && daysDiff <= filterDays;
    console.log('Should show row:', shouldShow);
    return shouldShow;
  }, [expirationFilter]);

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
    
    // Debug: Log all columns being processed
    console.log('Processing columns for DataGrid:', columns.map(col => ({ field: col.field, headerName: col.headerName })));
    
    // Debug: Look for expiration-related columns
    columns.forEach(col => {
      if (col.field && col.field.toLowerCase().includes('expir')) {
        console.log('Found expiration-related column:', {
          field: col.field,
          headerName: col.headerName
        });
      }
    });

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

                // Add custom cell renderer only for expires_within column (not for expiration_date)
        if (col.field === "expires_within") {
          console.log('Setting up expires_within column renderer for:', col);
          console.log('Column field name:', col.field, 'Column header:', col.headerName);
          
          // For expires_within column, we don't need the raw value since we calculate it
          baseCol.valueGetter = (params: any) => {
            // Return the row data so the ExpiringCellRenderer can calculate the days
            return params.data;
          };
          baseCol.cellRenderer = (params: any) => (
            <ExpiringCellRenderer
              value={params.value}
              data={params.data}
              colDef={params.colDef}
              expiringDaysFilter={expiringDaysFilter}
            />
          );
          
          // Add custom sorting for expires_within column using expiration_date
          baseCol.sortable = true;
          baseCol.comparator = (valueA: any, valueB: any, nodeA: any, nodeB: any) => {
            // Handle cases where nodes might be undefined (e.g., during filtering)
            if (!nodeA || !nodeB) {
              return 0;
            }
            
            // Safely access node data with null checks
            if (!nodeA.data || !nodeB.data) {
              return 0;
            }
            
            // Get the expiration dates from the row data
            const dateA = nodeA.data.expiration_date || nodeA.data.expires_within || nodeA.data.end_date || nodeA.data.expiry_date;
            const dateB = nodeB.data.expiration_date || nodeB.data.expires_within || nodeB.data.end_date || nodeB.data.expiry_date;
            
            // If either date is missing, handle appropriately
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;  // Missing dates go to the end
            if (!dateB) return -1; // Missing dates go to the end
            
            try {
              const timeA = new Date(dateA).getTime();
              const timeB = new Date(dateB).getTime();
              
              // Check if dates are valid
              if (isNaN(timeA) && isNaN(timeB)) return 0;
              if (isNaN(timeA)) return 1;  // Invalid dates go to the end
              if (isNaN(timeB)) return -1; // Invalid dates go to the end
              
              // Sort by expiration date (ascending = earliest first, descending = latest first)
              return timeA - timeB;
            } catch (error) {
              console.warn("Error comparing expiration dates:", error);
              return 0;
            }
          };
          
          // Add custom filter for expires_within column
          baseCol.filter = true;
          baseCol.filterParams = {
            // Use AG Grid's built-in set filter with custom values
            filterType: 'set',
            buttons: ['reset', 'apply'],
            closeOnApply: true,
            suppressAndOrCondition: true,
            // Provide custom filter values
            values: [
              'All records',
              '7 Days',
              '14 Days', 
              '30 Days',
              '60 Days',
              '90 Days',
              '120 Days',
              '150 Days',
              '180 Days',
              '210 Days',
              '240 Days',
              '270 Days',
              '300 Days',
              '330 Days',
              '360 Days'
            ],

          };
          
          // Debug logging
          console.log('Expires within column filter config:', {
            field: baseCol.field,
            filter: baseCol.filter,
            filterParams: baseCol.filterParams
          });
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
            headerComponent: (params: any) => (
              <ActionsHeader
                onAddRecord={onAddRecord}
                onMoreActions={onMoreHeaderActions}
                onHelp={() => { }}
              />
            ),
            cellRenderer: (params: any) => (
              <ActionsColumn
                gridName={title}
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
      onRowClicked(event.data);
    }
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

  // Save column state to localStorage and database
  const saveColumnState = React.useCallback(async () => {
    if (gridApi) {
      const columnState = gridApi.getColumnState();

      // Safety check for columnState
      if (!columnState || !Array.isArray(columnState)) {
        console.warn("No column state available to save");
        return;
      }

      localStorage.setItem(gridStateKey, JSON.stringify(columnState));

      // Save column widths to database if we have grid columns data
      if (gridColumnsData && gridName) {
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
          console.warn("Failed to save column widths to database:", error);
        }
      }
    }
  }, [gridApi, gridStateKey, gridColumnsData, gridName, columnIdMap]);

  // Debounced save function to prevent too many database calls
  const debouncedSaveColumnState = React.useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        saveColumnState().catch(error => {
          console.warn("Debounced save failed:", error);
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
          console.warn("Debounced save failed:", error);
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
          console.warn("Failed to parse saved column state:", error);
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
      borderBottom: "0.5px solid #D2D5DC",
      backgroundColor: "white",
    };

    const isRowSelected = selectedRowId === params.data.id;

    if (isRowSelected) {
      return {
        ...baseStyle,
        backgroundColor: "#C4D8F7",
      };
    }

    if (params.node.isSelected()) {
      return {
        ...baseStyle,
        backgroundColor: "#E3F2FD",
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

    let expiring = 0;
    let expired = 0;

    data.forEach((row: any) => {
      // Check for various expiration date fields
      const expirationDate = row.expiration_date || row.expires_within || row.end_date || row.expiry_date;

      if (expirationDate) {
        try {
          const expDate = new Date(expirationDate);

          // Check if the date is valid
          if (!isNaN(expDate.getTime())) {
            const now = new Date();
            const timeDiff = expDate.getTime() - now.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            // Check if expired (past date)
            if (daysDiff < 0) {
              expired++;
            } else if (daysDiff <= expiringDaysFilter) {
              // Check if expiring within selected days
              expiring++;
            }
          }
        } catch (error) {
          console.warn("Error parsing expiration date:", expirationDate, error);
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
        className={`flex items-center justify-between pl-1 pr-3 py-[9px] bg-[#CFD8DC] border-b border-gray-300 flex-shrink-0 overflow-visible cursor-pointer hover:bg-[#B0BEC5] transition-colors ${isSidePanelOpen ? 'rounded-tl' : 'rounded-t'
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
            className="pr-1 w-4 h-4 text-[#545454]"
            aria-hidden="true"
          />
          <h2 className="text-[#545454] font-semibold text-xs tracking-wider">
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
                    className="flex items-center gap-1 px-2.5 py-0.5 bg-[#F48100] rounded-full hover:bg-[#E67300] transition-colors"
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
                      icon="ellipsis-vertical"
                      className={`w-3 h-3 text-white`}
                    />
                  </button>

                  {showExpiringDropdown && (
                    <div
                      className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow- min-w-52 expiring-dropdown z-[10000] text-xs"
                      onClick={(e) => e.stopPropagation()}
                      role="dialog"
                      aria-label="Expiring days filter settings"
                      aria-modal="true"
                      data-testid="expiring-dropdown"
                    >

                      <div className="p-3 flex flex-col leading-6">
                        <div className="">
                          Mark records as <span className="gap-1 px-2.5 py-0.5 bg-[#F48100] rounded-full hover:bg-[#E67300] transition-colors text-white font-bold text-xs">Expiring</span> if Exp. Date is within
                        </div>

                        <select
                          id="expiring-days-select"
                          value={expiringDaysFilter}
                          onChange={async (e) => {
                            const newValue = Number(e.target.value);
                            console.log("Dropdown changed to:", newValue, "gridName:", gridName);
                            setExpiringDaysFilter(newValue);

                            // Save to database if we have a grid name
                            if (gridName) {
                              try {
                                console.log("Attempting to save to database...");
                                const result = await updateGridExpiringWithin(gridName, newValue);
                                console.log("Save successful:", result);
                              } catch (error) {
                                console.error("Failed to save expiring days to database:", error);
                              }
                            } else {
                              console.warn("No gridName available for saving");
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          data-testid="expiring-days-select"
                          aria-describedby="expiring-days-description"
                        >
                          {expiringDaysOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              data-testid={`expiring-option-${option.value}`}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div
                          id="expiring-days-description"
                          className="sr-only"
                          aria-live="polite"
                        >
                          Select the number of days to filter expiring records
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {expirationStats.expired > 0 && (
                <div
                  className="flex items-center gap-1 px-2.5 py-0.5 bg-[#DB0D00] rounded-full"
                  role="status"
                  aria-label={`${expirationStats.expired} items expired`}
                >
                  <span className="text-white font-bold text-xs">{expirationStats.expired}</span>
                  <span className="text-white font-bold text-xs">Expired</span>
                </div>
              )}
              <div
                className="flex items-center gap-1 px-2.5 py-0.5 bg-[#545454] rounded-full"
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
              className="w-9 h-5 bg-[#79AC48] rounded-full relative"
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
          className="flex px-4 py-2 border-b border-gray-300 gap-4"
          style={{
            height: '40px', // Match AG Grid header height
            backgroundColor: '#C4D8F7' // Match selected row background color
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
            rowSelection={showCheckboxes ? "multiple" : undefined}
            headerHeight={selectedRows.length > 0 ? 0 : 40} // Hide headers when rows are selected
            rowHeight={42}
            suppressRowClickSelection={true}
            suppressCellFocus={true}
            {...(!height ? { domLayout: "autoHeight" } : {})}
            getRowStyle={getRowStyle}
            getRowClass={getRowClass}
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              floatingFilter: showFloatingFilters,
              cellClass: "ag-cell-vertically-centered",
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
                console.warn("Column move save failed:", error);
              });
            }}
            onColumnResized={(event) => {
              debouncedSave();
            }}
            onSortChanged={(event) => {
              saveColumnState().catch(error => {
                console.warn("Sort change save failed:", error);
              });
            }}
            onFilterChanged={(event) => {
              console.log('Grid filter changed event:', event);
              
              // Save column state
              saveColumnState().catch(error => {
                console.warn("Filter change save failed:", error);
              });
              
              // Check if the expires_within column filter changed
              const filterModel = event.api.getFilterModel();
              console.log('Filter model from event:', filterModel);
              
              // Look for the expires_within column filter
              const expiresWithinFilter = filterModel.expires_within;
              console.log('Expires within filter from event:', expiresWithinFilter);
              
              if (expiresWithinFilter && expiresWithinFilter.values && expiresWithinFilter.values.length > 0) {
                // Get the first selected value
                const selectedValue = expiresWithinFilter.values[0];
                console.log('Setting expiration filter to:', selectedValue);
                setExpirationFilter(selectedValue);
              } else {
                console.log('Clearing expiration filter');
                setExpirationFilter(null);
              }
            }}
            // External filter for expiration dates
            isExternalFilterPresent={isExternalFilterPresent}
            doesExternalFilterPass={doesExternalFilterPass}
          />
        </div>
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          rowData={contextMenu.rowData}
          gridName={title}
          onClose={handleContextMenuClose}
          handleShowFacilityDetails={handleShowFacilityDetails}
        />
      )}
    </section>
  );
};

export default DataGrid;
