# Side Panel Template System

This document describes the template system for the side panel that determines how different grid types display their data.

## Overview

The side panel now uses a template-based system that:
1. Receives the grid name that triggered the side panel
2. Receives the record ID of the selected row
3. Receives the template ID that corresponds to the grid type
4. Fetches data from the database using the record ID
5. Displays the data according to the template configuration

## Template Configuration

Templates are defined in `src/lib/templateConfigs.ts` and include:

### TemplateConfig Interface
```typescript
interface TemplateConfig {
  id: string;                    // Unique template identifier
  name: string;                  // Human-readable name
  description: string;           // Template description
  tabs: TabConfig[];            // Available tabs for this template
  fieldGroups: FieldGroup[];    // Field groups for the Details tab
}
```

### TabConfig Interface
```typescript
interface TabConfig {
  id: string;                   // Tab identifier
  label: string;                // Tab display name
  icon: string;                 // FontAwesome icon name
  component?: string;           // Optional custom component
  enabled: boolean;             // Whether tab is enabled
}
```

### FieldGroup Interface
```typescript
interface FieldGroup {
  id: string;                   // Group identifier
  title: string;                // Group display name
  fields: InputField[];         // Fields in this group
}
```

## Current Templates

### 1. Provider Information Template (`provider_info`)
- **Tabs**: Details, Notes, Documents, History
- **Field Groups**:
  - Provider Name (Prefix, First Name, Middle Name, Last Name, Suffix)
  - Provider Details (Provider Title, NPI Number, Primary Specialty)
  - Contact Information (Work Email, Personal Email, Mobile Phone, Work Phone)

### 2. State Licenses Template (`state_licenses`)
- **Tabs**: Details, Notes, Documents, Renewal
- **Field Groups**:
  - License Information (License Type, License Number, State, Status)
  - Important Dates (Issue Date, Expiration Date, Renewal Date)
  - Additional Information (License Additional Info, Tags)

## Grid to Template Mapping

The mapping between grid table names and template IDs is defined in `gridToTemplateMap`:

```typescript
export const gridToTemplateMap: Record<string, string> = {
  "Provider_Info": "provider_info",
  "State_Licenses": "state_licenses"
};
```

## Database Integration

The system uses the following database functions:

- `fetchRecordById(tableName, id)` - Fetches a record by table name and ID
- `updateRecord(tableName, id, updates)` - Updates a record by table name and ID

## Side Panel Title Format

The side panel title follows the format:
`{Grid title} for {Provider Name}, {Title}`

For example:
- "Provider Info for John Smith, MD"
- "State Licenses for Jane Doe, NP"

## Adding New Templates

To add a new template:

1. **Define the template configuration** in `templateConfigs.ts`:
   ```typescript
   {
     id: "new_template",
     name: "New Template",
     description: "Template for new grid type",
     tabs: [...],
     fieldGroups: [...]
   }
   ```

2. **Add the grid mapping** in `gridToTemplateMap`:
   ```typescript
   "New_Grid": "new_template"
   ```

3. **Add database functions** if needed in `supabaseClient.ts`

4. **Update the data generator** in `dataGenerator.ts` to handle the new grid type

## Usage

The side panel is now used with these props:

```typescript
<SidePanel
  isOpen={sidePanelOpen}
  gridName={activeGridName}
  recordId={selectedRowId}
  templateId={templateId}
  onClose={handleClose}
  user={user}
/>
```

## Benefits

1. **Consistent UI**: All grids use the same side panel component with different templates
2. **Flexible**: Easy to add new grid types and templates
3. **Database-driven**: Data is fetched directly from the database using record IDs
4. **Maintainable**: Template configurations are centralized and easy to modify
5. **Extensible**: New tabs and field types can be easily added 