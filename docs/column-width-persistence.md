# Column Width Persistence

This document describes how column widths are persisted in the OneView All Providers application.

## Overview

Column widths are now persisted in the database using the `grid_columns` table, which allows for consistent column sizing across sessions and users.

## Database Schema

The `grid_columns` table includes a `width` field that stores the pixel width of each column:

```sql
create table public.grid_columns (
  id uuid not null default gen_random_uuid (),
  grid_id uuid not null,
  name text not null,
  display_name text not null,
  type text not null,
  "order" integer not null default 0,
  visible boolean not null default true,
  width integer null,  -- This field stores the column width in pixels
  options jsonb null,
  required boolean null default false,
  "group" text null,
  description text null,
  constraint grid_columns_pkey primary key (id),
  constraint grid_columns_grid_id_fkey foreign KEY (grid_id) references grid_definitions (id) on delete CASCADE
);
```

## Implementation Details

### Data Flow

1. **Grid Loading**: When a grid is loaded, the `GridDataFetcher` component fetches column definitions from the `grid_columns` table
2. **Column Definition**: The `DataGrid` component receives both AG Grid column definitions and database column data
3. **Width Application**: Database widths are applied to column definitions during grid initialization
4. **User Interaction**: When users resize columns, the new widths are saved to both localStorage and the database
5. **Persistence**: On subsequent loads, database widths take precedence over localStorage

### Key Components

#### DataGrid Component
- Receives `gridColumnsData` and `gridName` props
- Maps column names to database IDs for width persistence
- Saves column widths to database on resize events
- Loads database widths during grid initialization

#### GridDataFetcher Component
- Fetches column definitions from `grid_columns` table
- Passes column data to DataGrid component
- Handles the connection between database and grid display

#### Database Functions
- `updateGridColumnWidths()`: Updates multiple column widths in a single transaction
- `fetchGridColumnsByGridName()`: Fetches columns for a specific grid by name

### Features

#### Debounced Saving
Column width changes are debounced (500ms delay) to prevent excessive database calls during rapid resizing.

#### Fallback Support
- If database widths are not available, the system falls back to localStorage
- If neither is available, default widths are used

#### Error Handling
- Database save failures are logged but don't break the grid functionality
- Graceful degradation ensures the grid remains functional even if persistence fails

## Usage

### For Developers

When creating new grids, ensure that:
1. Column definitions are properly stored in the `grid_columns` table
2. The `width` field is included in column definitions
3. The grid name/key is correctly passed to the DataGrid component

### For Users

Column widths are automatically saved when:
- Users drag column borders to resize
- Column widths are changed programmatically
- Grid state is restored on page reload

## Configuration

The persistence behavior can be controlled by:
- Setting the `width` field in the `grid_columns` table
- Modifying the debounce delay (currently 500ms)
- Adjusting the fallback width values

## Troubleshooting

### Common Issues

1. **Widths not persisting**: Check that `gridColumnsData` and `gridName` are properly passed to DataGrid
2. **Database errors**: Verify that the `grid_columns` table exists and has the correct schema
3. **Performance issues**: Adjust the debounce delay if needed

### Debugging

Enable console logging to see:
- When widths are saved to the database
- When database widths are applied
- Any errors during the persistence process

The logs will show messages like:
```
Saving column widths to database for grid providers: [{columnId: "...", width: 150}]
Successfully saved 1 column widths to database
Applied 3 database column widths: [{colId: "name", width: 200}, ...]
``` 