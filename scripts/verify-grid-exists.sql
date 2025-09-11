-- Quick verification script to check if the State Controlled Substance Licenses grid exists
-- Run this before running the grid actions script

-- Check if grid definition exists
SELECT 
    id,
    key,
    display_name,
    table_name,
    "group",
    icon,
    "order"
FROM grid_definitions 
WHERE display_name = 'State Controlled Substance Licenses';

-- If no results, the grid doesn't exist yet
-- If results show, the grid exists and you can run the actions script
