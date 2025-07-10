import { ColDef } from "ag-grid-community";
import { gridDefinitions } from "./gridDefinitions";

// Helper function to format column names for display
const formatColumnName = (columnName: string): string => {
  return columnName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Helper function to check if a column is a date field
const isDateColumn = (columnName: string): boolean => {
  return (
    columnName.toLowerCase().includes('date') ||
    columnName.toLowerCase().includes('expiration') ||
    columnName.toLowerCase().includes('issue')
  );
};

// AG Grid valueFormatter for MM/DD/YYYY
const dateValueFormatter = (params: any) => {
  if (!params.value) return '';
  const date = new Date(params.value);
  if (isNaN(date.getTime())) return params.value; // fallback if not a valid date
  return (
    (date.getMonth() + 1).toString().padStart(2, '0') +
    '/' +
    date.getDate().toString().padStart(2, '0') +
    '/' +
    date.getFullYear()
  );
};

// Reusable valueFormatter for multi-select (array) fields
export const multiSelectValueFormatter = (params: any) => {
  const val = params.value;
  if (Array.isArray(val)) {
    if (val.length > 0 && typeof val[0] === 'object') {
      return val.map(v => v.label || v.id || v).join(', ');
    }
    return val.join(', ');
  }
  return val || '';
};

// Generate column definitions for any grid based on its column names
export const getColumnsForGrid = (gridKey: string): ColDef[] => {
  const grid = gridDefinitions.find(g => g.tableName === gridKey);
  if (!grid) {
    return [];
  }

  return grid.columns.map(columnName => {
    const colDef: ColDef = {
      field: columnName,
      headerName: formatColumnName(columnName),
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 120,
      flex: 1,
    };
    if (columnName === "provider_name") {
      colDef.valueGetter = (params: any) => {
        if (!params.data) return '';
        const { first_name, last_name, provider_name } = params.data;
        if (first_name || last_name) {
          return [last_name, first_name].filter(Boolean).join(', ');
        }
        // fallback: try to split provider_name
        const name = provider_name || '';
        const [first, ...rest] = name.split(' ');
        const last = rest.join(' ');
        if (first || last) {
          return [last, first].filter(Boolean).join(', ');
        }
        return name;
      };
    }
    if (isDateColumn(columnName)) {
      colDef.valueFormatter = dateValueFormatter;
    }
    // Use multiSelectValueFormatter for known multi-select fields
    if ([
      'primary_specialty',
      'tags',
      'classifications',
      'taxonomy_codes',
      'clinical_services',
      'fluent_languages',
      'cms_medicare_specialty_codes',
      'other_specialties',
    ].includes(columnName)) {
      colDef.valueFormatter = multiSelectValueFormatter;
    }
    return colDef;
  });
};

// Generate column definitions for single provider view (filters out provider-specific columns)
export const getColumnsForSingleProviderView = (gridKey: string): ColDef[] => {
  const grid = gridDefinitions.find(g => g.tableName === gridKey);
  if (!grid) {
    return [];
  }

  // Columns to exclude in single provider view
  const excludedColumns = ['provider_name', 'title', 'primary_specialty'];

  return grid.columns
    .filter(columnName => !excludedColumns.includes(columnName))
    .map(columnName => {
      const colDef: ColDef = {
        field: columnName,
        headerName: formatColumnName(columnName),
        sortable: true,
        filter: true,
        resizable: true,
        minWidth: 120,
        flex: 1,
      };
      if (isDateColumn(columnName)) {
        colDef.valueFormatter = dateValueFormatter;
      }
      return colDef;
    });
};

// Legacy exports for backward compatibility
export const standardColumns: ColDef[] = [
  {
    field: "provider_name",
    headerName: "Provider Name",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 150,
    flex: 1,
    valueGetter: (params: any) => {
      if (!params.data) return '';
      const { first_name, last_name, provider_name } = params.data;
      if (first_name || last_name) {
        return [last_name, first_name].filter(Boolean).join(', ');
      }
      // fallback: try to split provider_name
      const name = provider_name || '';
      const [first, ...rest] = name.split(' ');
      const last = rest.join(' ');
      if (first || last) {
        return [last, first].filter(Boolean).join(', ');
      }
      return name;
    },
  },
  {
    field: "title",
    headerName: "Title",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100,
    flex: 1,
  },
  {
    field: "primary_specialty",
    headerName: "Primary Specialty",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 150,
    flex: 1,
    valueFormatter: multiSelectValueFormatter,
  },
  {
    field: "npi_number",
    headerName: "NPI Number",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 120,
    flex: 1,
  },
  {
    field: "work_email",
    headerName: "Work Email",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 200,
    flex: 1,
  },
  {
    field: "personal_email",
    headerName: "Personal Email",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 200,
    flex: 1,
  },
  {
    field: "mobile_phone_number",
    headerName: "Mobile Phone",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 130,
    flex: 1,
  },
  {
    field: "tags",
    headerName: "Tags",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 120,
    flex: 1,
    valueFormatter: multiSelectValueFormatter,
  },
  {
    field: "last_updated",
    headerName: "Last Updated",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 120,
    flex: 1,
  },
];

export const birthInfoColumns: ColDef[] = [
  {
    field: "provider_name",
    headerName: "Provider Name",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 150,
    flex: 1,
    valueGetter: (params: any) => {
      if (!params.data) return '';
      const { first_name, last_name, provider_name } = params.data;
      if (first_name && last_name) {
        return `${last_name}, ${first_name}`;
      }
      // fallback: try to split provider_name
      const name = provider_name || '';
      const [first, ...rest] = name.split(' ');
      const last = rest.join(' ');
      if (first && last) {
        return `${last}, ${first}`;
      }
      return name;
    },
  },
  {
    field: "title",
    headerName: "Title",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100,
    flex: 1,
  },
  {
    field: "primary_specialty",
    headerName: "Primary Specialty",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 150,
    flex: 1,
  },
  {
    field: "date_of_birth",
    headerName: "Date of Birth",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 120,
    flex: 1,
  },
  {
    field: "country_of_citizenship",
    headerName: "Country of Citizenship",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 180,
    flex: 1,
  },
  {
    field: "citizenship/work_auth",
    headerName: "Citizenship/Work Auth",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 180,
    flex: 1,
  },
  {
    field: "us_work_auth",
    headerName: "US Work Auth",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 120,
    flex: 1,
  },
  {
    field: "tags",
    headerName: "Tags",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 120,
    flex: 1,
  },
  {
    field: "last_updated",
    headerName: "Last Updated",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 120,
    flex: 1,
  },
];
