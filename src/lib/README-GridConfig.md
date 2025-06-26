# Grid Configuration System

## How to Add New Grid Columns

### 1. Define your columns in `columnConfigs.ts`

Simply add a new entry to the `gridColumnConfigs` object:

```typescript
export const gridColumnConfigs: Record<string, ColumnConfig[]> = {
  // ... existing configs

  "your-grid-key": [
    ...baseColumns, // Includes Provider Name, Title, Primary Specialty

    // Add your custom columns
    {
      field: "licenseNumber",
      headerName: "License Number",
      width: 150,
      dataType: "string",
    },
    {
      field: "expirationDate",
      headerName: "Expiration Date",
      width: 140,
      dataType: "date",
    },

    // Reuse common columns
    commonColumns.lastUpdated,
  ],
};
```

### 2. That's it!

The system will automatically:

- Generate appropriate dummy data for your columns
- Display the grid with your columns when the nav item is selected
- Handle data types and formatting

### Available Data Types

- `string` - Text data
- `email` - Email addresses
- `phone` - Phone numbers
- `date` - Dates (ISO format)
- `number` - Numeric values
- `boolean` - True/false values
- `array` - Lists (displayed as comma-separated)

### Common Columns Available

Use `commonColumns.fieldName` for:

- `npiNumber`
- `workEmail`
- `personalEmail`
- `mobilePhone`
- `tags`
- `lastUpdated`
- `dateOfBirth`
- `countryOfCitizenship`
- `citizenshipWorkAuth`
- `usWorkAuth`

### Examples

```typescript
// State Licenses Grid
'state-licenses': [
  ...baseColumns,
  {
    field: 'licenseNumber',
    headerName: 'License #',
    width: 140,
    dataType: 'string'
  },
  {
    field: 'licenseState',
    headerName: 'State',
    width: 80,
    dataType: 'string'
  },
  {
    field: 'issueDate',
    headerName: 'Issue Date',
    width: 120,
    dataType: 'date'
  },
  {
    field: 'expirationDate',
    headerName: 'Expiration Date',
    width: 140,
    dataType: 'date'
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    dataType: 'string'
  },
  commonColumns.lastUpdated
]
```

That's it! No need to modify multiple files or generate sample data manually.
