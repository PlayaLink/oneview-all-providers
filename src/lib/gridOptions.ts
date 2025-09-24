// Grid Options Utility
// This utility maps grid keys and column names to their corresponding SelectInputOptions

import { PRIMARY_SPECIALTY_OPTIONS, TITLE_OPTIONS, STATE_OPTIONS, STATUS_OPTIONS, DONT_RENEW_OPTIONS, IS_PRIMARY_OPTIONS, TAGS_OPTIONS } from '../components/grid-item-details/StateControlledSubstanceLicensesSelectInputOptions';

// Map grid keys to their SelectInputOptions files
const gridOptionsMap: Record<string, Record<string, Array<{ id: string; label: string }>>> = {
  'state_controlled_substance_licenses': {
    'primary_specialty': PRIMARY_SPECIALTY_OPTIONS,
    'title': TITLE_OPTIONS,
    'state': STATE_OPTIONS,
    'status': STATUS_OPTIONS,
    'dont_renew': DONT_RENEW_OPTIONS,
    'is_primary': IS_PRIMARY_OPTIONS,
    'tags': TAGS_OPTIONS,
  },
  // Add more grids as needed
  // 'additional_names': {
  //   'type': ADDITIONAL_NAMES_TYPE_OPTIONS,
  //   // ... other columns
  // },
};

// Function to get options for a specific grid and column
export function getColumnOptions(gridKey: string, columnName: string): string[] {
  console.log('getColumnOptions called with:', { gridKey, columnName });
  console.log('Available grids in map:', Object.keys(gridOptionsMap));
  
  const gridOptions = gridOptionsMap[gridKey];
  if (!gridOptions) {
    console.warn(`No options found for grid: ${gridKey}`);
    return [];
  }
  
  console.log('Grid options found:', gridOptions);
  console.log('Available columns in grid:', Object.keys(gridOptions));
  
  const columnOptions = gridOptions[columnName];
  if (!columnOptions) {
    console.warn(`No options found for column ${columnName} in grid ${gridKey}`);
    return [];
  }
  
  console.log('Column options found:', columnOptions);
  
  // Convert from { id, label } format to string array
  const result = columnOptions.map(option => option.id);
  console.log('Converted options:', result);
  return result;
}

// Function to check if a column has options (is single-select or multi-select)
export function hasColumnOptions(gridKey: string, columnName: string): boolean {
  console.log('hasColumnOptions called with:', { gridKey, columnName });
  console.log('Available grids in map:', Object.keys(gridOptionsMap));
  
  const gridOptions = gridOptionsMap[gridKey];
  if (!gridOptions) {
    console.log('No grid options found for:', gridKey);
    return false;
  }
  
  console.log('Grid options found:', gridOptions);
  console.log('Available columns in grid:', Object.keys(gridOptions));
  
  const hasOptions = columnName in gridOptions;
  console.log('Column has options:', hasOptions);
  return hasOptions;
}

// Function to check if a column is multi-select
export function isMultiSelectColumn(gridKey: string, columnName: string): boolean {
  // For now, we'll assume tags is multi-select, others are single-select
  // This could be made more sophisticated by adding metadata to the options
  return columnName === 'tags';
}
