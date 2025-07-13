-- Debug script to check and fix grid_definitions table

-- 1. Check what's currently in the grid_definitions table
SELECT * FROM grid_definitions ORDER BY display_name;

-- 2. Check if provider_info grid exists
SELECT * FROM grid_definitions WHERE key = 'provider_info' OR table_name = 'provider_info' OR table_name = 'providers_with_full_name';

-- 3. If the provider_info grid is missing or has wrong table_name, insert/update it
-- First, let's see what we have:
SELECT 
    id,
    key,
    table_name,
    display_name,
    "group",
    icon,
    "order"
FROM grid_definitions 
WHERE key = 'provider_info' 
   OR table_name = 'provider_info' 
   OR table_name = 'providers_with_full_name'
   OR display_name ILIKE '%provider%';

-- 4. If no provider_info grid exists, insert it:
INSERT INTO grid_definitions (key, table_name, display_name, "group", icon, "order")
VALUES ('provider_info', 'providers_with_full_name', 'Provider Info', 'provider_info', 'user-doctor', 1)
ON CONFLICT (key) DO UPDATE SET
    table_name = EXCLUDED.table_name,
    display_name = EXCLUDED.display_name,
    "group" = EXCLUDED."group",
    icon = EXCLUDED.icon,
    "order" = EXCLUDED."order";

-- 5. Verify the fix
SELECT * FROM grid_definitions WHERE key = 'provider_info'; 