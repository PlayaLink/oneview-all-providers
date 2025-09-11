-- Verification script to check if State Controlled Substance Licenses grid is properly configured
-- Run this to diagnose why the grid might not be showing in the UI

-- 1. Check if the grid definition exists
SELECT 'GRID DEFINITION' as check_type, 
       id, key, display_name, table_name, "group", icon, "order"
FROM grid_definitions 
WHERE display_name = 'State Controlled Substance Licenses';

-- 2. Check if the table exists and has data
SELECT 'TABLE DATA' as check_type,
       COUNT(*) as total_records,
       COUNT(DISTINCT provider_id) as unique_providers
FROM state_controlled_substance_licenses;

-- 3. Check if the view exists and works
SELECT 'VIEW TEST' as check_type,
       COUNT(*) as view_records,
       COUNT(provider_name) as records_with_provider_name
FROM state_controlled_substance_licenses_with_provider;

-- 4. Check grid columns configuration
SELECT 'GRID COLUMNS' as check_type,
       COUNT(*) as total_columns,
       COUNT(CASE WHEN visible = true THEN 1 END) as visible_columns
FROM grid_columns gc
JOIN grid_definitions gd ON gc.grid_id = gd.id
WHERE gd.display_name = 'State Controlled Substance Licenses';

-- 5. Check grid actions
SELECT 'GRID ACTIONS' as check_type,
       COUNT(*) as total_actions
FROM grid_actions ga
JOIN grid_definitions gd ON ga.grid_id = gd.id
WHERE gd.display_name = 'State Controlled Substance Licenses';

-- 6. Check if the grid is in the correct group/section
SELECT 'GRID GROUP' as check_type,
       gd.display_name,
       gd."group",
       gd."order",
       gs.name as section_name,
       gs."order" as section_order
FROM grid_definitions gd
LEFT JOIN grid_sections gs ON gd."group" = gs.key
WHERE gd.display_name = 'State Controlled Substance Licenses';

-- 7. Check if there are any providers to display
SELECT 'PROVIDERS' as check_type,
       COUNT(*) as total_providers
FROM providers;

-- 8. Sample data check
SELECT 'SAMPLE DATA' as check_type,
       s.license_number,
       s.state,
       s.status,
       p.provider_name
FROM state_controlled_substance_licenses s
JOIN providers_with_full_name p ON s.provider_id = p.id
LIMIT 5;
