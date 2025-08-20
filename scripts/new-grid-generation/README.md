# New Grid Generation Templates

This directory contains templates and automation tools for creating new grids in the OneView application.

## 📁 Files

### 1. `template-grid-creation.sql`
Generic SQL template for creating new grid tables, views, and grid configurations.

**Usage:**
1. Copy this file to your project
2. Replace all `[PLACEHOLDER]` values with your specific grid details
3. Run the script in your Supabase SQL editor

**Key Placeholders to Replace:**
- `[GRID_KEY]` = unique identifier (e.g., `facility_credentials`)
- `[DISPLAY_NAME]` = human-readable name (e.g., `Facility Credentials`)
- `[TABLE_NAME]` = database table name (e.g., `facility_credentials`)
- `[VIEW_NAME]` = database view name (e.g., `facility_credentials_with_provider`)
- `[ICON_NAME]` = icon name (e.g., `building`, `certificate`, `user`)
- `[GROUP_NAME]` = section group (e.g., `facilities`, `certifications`, `providers`)

### 2. `template-GridDetails.tsx`
Generic React component template for grid detail components.

**Usage:**
1. Copy this file to `src/components/sidepanel-details/`
2. Replace all `[PLACEHOLDER]` values with your specific grid details
3. Customize the field groups and field definitions
4. Update the component name and exports

**Key Placeholders to Replace:**
- `[GRID_NAME]` = Human-readable grid name (e.g., `Facility Credentials`)
- `[GRID_KEY]` = Grid key identifier (e.g., `facility_credentials`)
- `[GridName]` = Component name (e.g., `FacilityCredentialsDetails`)
- `[CUSTOMIZE_FIELDS_HERE]` = Your specific field definitions

## 🚀 Quick Start

### Step 1: Create the SQL Script
```bash
cp scripts/new-grid-generation/template-grid-creation.sql scripts/create-[your-grid-name].sql
```

### Step 2: Customize the SQL Script
Edit the copied file and replace all placeholders with your grid details.

### Step 3: Create the React Components
```bash
cp scripts/new-grid-generation/template-GridDetails.tsx src/components/sidepanel-details/[YourGridName]Details.tsx
cp scripts/new-grid-generation/template-GridDetails.tsx src/components/sidepanel-details/[YourGridName]DetailsWide.tsx
```

### Step 4: Customize the React Components
Edit both component files and replace all placeholders with your grid details.

### Step 5: Run the SQL Script
Execute your customized SQL script in your Supabase SQL editor.

## 📋 Required Information

Before using these templates, gather:

1. **Grid Configuration**
   - Grid key (unique identifier)
   - Display name
   - Icon name
   - Group/section

2. **Field Definitions**
   - Field names and types
   - Which fields should be visible by default
   - Field grouping for the UI

3. **Actions Configuration**
   - Which grid actions to include
   - Custom actions if needed

4. **Example Components**
   - Existing component to use as reference
   - Specific UI requirements

## 🔧 Integration Steps

After creating the grid:

1. **Update `supabaseClient.ts`**
   - Add Zod schema for your table
   - Add fetch function for your grid

2. **Update `templateConfigs.ts`**
   - Add template configuration for your grid
   - Configure routing between side panel and modal

3. **Test the Grid**
   - Verify data loading
   - Test side panel and modal functionality
   - Check action functionality

## 📚 Examples

See the Board Certifications implementation for a complete example:
- `scripts/create-board-certifications-table.sql`
- `scripts/setup-board-certifications-complete.sql`
- `src/components/sidepanel-details/BoardCertificationDetails.tsx`
- `src/components/sidepanel-details/BoardCertificationDetailsWide.tsx`

## 🆘 Need Help?

Reference the cursor rule: `.cursor/rules/grid-creation-automation.mdc`

This rule provides the complete automated process for creating new grids with minimal manual work.
