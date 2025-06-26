import { ColDef } from "ag-grid-community";

// Column configuration type
export interface ColumnConfig {
  field: string;
  headerName: string;
  width?: number;
  valueGetter?: (params: any) => string;
  valueFormatter?: (params: any) => string;
  dataType?:
    | "string"
    | "number"
    | "date"
    | "email"
    | "phone"
    | "array"
    | "boolean";
  sampleDataGenerator?: () => any;
}

// Base columns that appear in most grids
const baseColumns: ColumnConfig[] = [
  {
    field: "providerName",
    headerName: "Provider Name",
    width: 200,
    valueGetter: (params) =>
      `${params.data.lastName}, ${params.data.firstName}`,
    dataType: "string",
  },
  {
    field: "title",
    headerName: "Title",
    width: 120,
    dataType: "string",
  },
  {
    field: "primarySpecialty",
    headerName: "Primary Specialty",
    width: 200,
    dataType: "string",
  },
];

// Common columns that can be reused
const commonColumns: Record<string, ColumnConfig> = {
  npiNumber: {
    field: "npiNumber",
    headerName: "NPI #",
    width: 140,
    dataType: "string",
  },
  workEmail: {
    field: "workEmail",
    headerName: "Work Email",
    width: 250,
    dataType: "email",
  },
  personalEmail: {
    field: "personalEmail",
    headerName: "Personal Email",
    width: 250,
    dataType: "email",
  },
  mobilePhone: {
    field: "mobilePhone",
    headerName: "Mobile Phone",
    width: 145,
    dataType: "phone",
  },
  tags: {
    field: "tags",
    headerName: "Tags",
    width: 200,
    valueFormatter: (params) => {
      return params.value && Array.isArray(params.value)
        ? params.value.join(", ")
        : "";
    },
    dataType: "array",
  },
  lastUpdated: {
    field: "lastUpdated",
    headerName: "Last Updated",
    width: 120,
    dataType: "date",
  },
  dateOfBirth: {
    field: "dateOfBirth",
    headerName: "Date of Birth",
    width: 140,
    dataType: "date",
  },
  countryOfCitizenship: {
    field: "countryOfCitizenship",
    headerName: "Country Of Citizenship",
    width: 180,
    dataType: "string",
  },
  citizenshipWorkAuth: {
    field: "citizenshipWorkAuth",
    headerName: "Citizenship/Work Auth",
    width: 180,
    dataType: "string",
  },
  usWorkAuth: {
    field: "usWorkAuth",
    headerName: "US Work Auth",
    width: 140,
    dataType: "string",
  },
};

// Grid-specific column configurations
export const gridColumnConfigs: Record<string, ColumnConfig[]> = {
  "provider-info": [
    ...baseColumns,
    commonColumns.npiNumber,
    commonColumns.workEmail,
    commonColumns.personalEmail,
    commonColumns.mobilePhone,
    commonColumns.tags,
    commonColumns.lastUpdated,
  ],

  "birth-info": [
    ...baseColumns,
    commonColumns.dateOfBirth,
    commonColumns.countryOfCitizenship,
    commonColumns.citizenshipWorkAuth,
    commonColumns.usWorkAuth,
    commonColumns.tags,
    commonColumns.lastUpdated,
  ],

  // Add more grid configurations here as needed
  addresses: [
    ...baseColumns,
    {
      field: "homeAddress",
      headerName: "Home Address",
      width: 250,
      dataType: "string",
    },
    {
      field: "workAddress",
      headerName: "Work Address",
      width: 250,
      dataType: "string",
    },
    {
      field: "city",
      headerName: "City",
      width: 150,
      dataType: "string",
    },
    {
      field: "state",
      headerName: "State",
      width: 120,
      dataType: "string",
    },
    {
      field: "zipCode",
      headerName: "Zip Code",
      width: 120,
      dataType: "string",
    },
    commonColumns.lastUpdated,
  ],

  caqh: [
    ...baseColumns,
    {
      field: "caqhProviderId",
      headerName: "CAQH Provider ID",
      width: 180,
      dataType: "string",
    },
    {
      field: "accountStatus",
      headerName: "Account Status",
      width: 150,
      dataType: "string",
    },
    {
      field: "reattestationDate",
      headerName: "Reattestation Date",
      width: 160,
      dataType: "date",
    },
    {
      field: "reattestationStatus",
      headerName: "Reattestation Status",
      width: 180,
      dataType: "string",
    },
    commonColumns.tags,
    commonColumns.lastUpdated,
  ],

  "state-licenses": [
    ...baseColumns,
    {
      field: "licenseType",
      headerName: "License Type",
      width: 155,
      dataType: "string",
    },
    {
      field: "license",
      headerName: "License",
      width: 170,
      dataType: "string",
    },
    {
      field: "additionalInfo",
      headerName: "Add'l Info",
      width: 170,
      dataType: "string",
    },
    {
      field: "state",
      headerName: "State",
      width: 120,
      dataType: "string",
    },
    {
      field: "status",
      headerName: "Status",
      width: 170,
      dataType: "string",
    },
    {
      field: "issueDate",
      headerName: "Issue Date",
      width: 120,
      dataType: "date",
    },
    {
      field: "expirationDate",
      headerName: "Exp. Date",
      width: 120,
      dataType: "date",
    },
    {
      field: "expiresWithin",
      headerName: "Expires Within",
      width: 160,
      dataType: "string",
    },
    commonColumns.lastUpdated,
  ],

  "dea-licenses": [
    ...baseColumns,
    {
      field: "license",
      headerName: "License",
      width: 170,
      dataType: "string",
    },
    {
      field: "state",
      headerName: "State",
      width: 120,
      dataType: "string",
    },
    {
      field: "status",
      headerName: "Status",
      width: 170,
      dataType: "string",
    },
    {
      field: "paymentIndicator",
      headerName: "Payment Indicator",
      width: 170,
      dataType: "string",
    },
    {
      field: "issueDate",
      headerName: "Issue Date",
      width: 120,
      dataType: "date",
    },
    {
      field: "expirationDate",
      headerName: "Exp. Date",
      width: 120,
      dataType: "date",
    },
    {
      field: "expiresWithin",
      headerName: "Expires Within",
      width: 160,
      dataType: "string",
    },
    commonColumns.tags,
    commonColumns.lastUpdated,
  ],
};

// Convert column configs to AG Grid column definitions
export function convertToAgGridColumns(configs: ColumnConfig[]): ColDef[] {
  return configs.map((config) => {
    const colDef: ColDef = {
      headerName: config.headerName,
      width: config.width || 150,
    };

    if (config.valueGetter) {
      colDef.valueGetter = config.valueGetter;
    } else {
      colDef.field = config.field;
    }

    if (config.valueFormatter) {
      colDef.valueFormatter = config.valueFormatter;
    }

    return colDef;
  });
}

// Get columns for a specific grid
export function getColumnsForGrid(gridKey: string): ColDef[] {
  const configs = gridColumnConfigs[gridKey];
  if (!configs) {
    // Fallback to provider-info if grid not found
    return convertToAgGridColumns(gridColumnConfigs["provider-info"]);
  }
  return convertToAgGridColumns(configs);
}

// Export for backward compatibility
export const standardColumns = getColumnsForGrid("provider-info");
export const birthInfoColumns = getColumnsForGrid("birth-info");
