-- Check and fix grid sections for State Controlled Substance Licenses
-- This script ensures the "Licenses" section exists and our grid is properly linked

-- 1. Check what grid sections exist
SELECT 'EXISTING SECTIONS' as check_type, key, name, "order"
FROM grid_sections
ORDER BY "order";

-- 2. Check if "Licenses" section exists
SELECT 'LICENSES SECTION CHECK' as check_type,
       CASE 
           WHEN EXISTS (SELECT 1 FROM grid_sections WHERE key = 'Licenses') 
           THEN 'EXISTS' 
           ELSE 'MISSING' 
       END as status;

-- 3. Create "Licenses" section if it doesn't exist
INSERT INTO grid_sections (key, name, "order")
SELECT 'Licenses', 'Licenses', 3
WHERE NOT EXISTS (SELECT 1 FROM grid_sections WHERE key = 'Licenses');

-- 4. Check our grid's group assignment
SELECT 'GRID GROUP ASSIGNMENT' as check_type,
       gd.display_name,
       gd."group",
       gs.name as section_name,
       gs."order" as section_order
FROM grid_definitions gd
LEFT JOIN grid_sections gs ON gd."group" = gs.key
WHERE gd.display_name = 'State Controlled Substance Licenses';

-- 5. Check all grids in the Licenses group
SELECT 'ALL LICENSES GRIDS' as check_type,
       gd.display_name,
       gd."group",
       gd."order"
FROM grid_definitions gd
WHERE gd."group" = 'Licenses'
ORDER BY gd."order";

-- 6. Verify the section was created
SELECT 'VERIFICATION' as check_type, key, name, "order"
FROM grid_sections
WHERE key = 'Licenses';
