-- Comprehensive debugging script for grid system
-- This will help identify why State Controlled Substance Licenses grid isn't showing

-- 1. Check all grid sections
SELECT 'GRID SECTIONS' as check_type, 
       key, name, "order"
FROM grid_sections
ORDER BY "order";

-- 2. Check all grid definitions
SELECT 'GRID DEFINITIONS' as check_type,
       key, display_name, table_name, "group", icon, "order"
FROM grid_definitions
ORDER BY "group", "order";

-- 3. Check grids in Licenses group specifically
SELECT 'LICENSES GROUP GRIDS' as check_type,
       key, display_name, table_name, "group", icon, "order"
FROM grid_definitions
WHERE "group" = 'Licenses'
ORDER BY "order";

-- 4. Check if our specific grid exists
SELECT 'OUR GRID CHECK' as check_type,
       key, display_name, table_name, "group", icon, "order"
FROM grid_definitions
WHERE display_name = 'State Controlled Substance Licenses';

-- 5. Check grid columns for our grid
SELECT 'GRID COLUMNS' as check_type,
       gc.name, gc.display_name, gc.type, gc."order", gc.visible
FROM grid_columns gc
JOIN grid_definitions gd ON gc.grid_id = gd.id
WHERE gd.display_name = 'State Controlled Substance Licenses'
ORDER BY gc."order";

-- 6. Check grid actions for our grid
SELECT 'GRID ACTIONS' as check_type,
       a.name as action_name, a.label, ga."order"
FROM grid_actions ga
JOIN grid_definitions gd ON ga.grid_id = gd.id
JOIN actions a ON ga.action_id = a.id
WHERE gd.display_name = 'State Controlled Substance Licenses'
ORDER BY ga."order";

-- 7. Check if there's data in our table
SELECT 'TABLE DATA' as check_type,
       COUNT(*) as total_records
FROM state_controlled_substance_licenses;

-- 8. Check if the view works
SELECT 'VIEW DATA' as check_type,
       COUNT(*) as view_records,
       COUNT(provider_name) as records_with_provider_name
FROM state_controlled_substance_licenses_with_provider;

-- 9. Sample data from the view
SELECT 'SAMPLE VIEW DATA' as check_type,
       license_number, state, status, provider_name
FROM state_controlled_substance_licenses_with_provider
LIMIT 3;
