-- Debug script to check grid actions and grid definitions

-- 1. Check what grid definitions exist
SELECT 
    id,
    key,
    table_name,
    display_name,
    "group",
    "order"
FROM grid_definitions 
ORDER BY display_name;

-- 2. Check what grid actions exist
SELECT 
    ga.id,
    ga.grid_id,
    ga.action_id,
    ga."order",
    gd.display_name as grid_display_name,
    gd.key as grid_key,
    gd.table_name as grid_table_name,
    a.name as action_name,
    a.label as action_label,
    a.icon as action_icon
FROM grid_actions ga
LEFT JOIN grid_definitions gd ON ga.grid_id = gd.id
LEFT JOIN actions a ON ga.action_id = a.id
ORDER BY gd.display_name, ga."order";

-- 3. Check what actions exist
SELECT 
    id,
    name,
    label,
    icon,
    tooltip,
    description
FROM actions
ORDER BY name;

-- 4. Check if there are any grid actions at all
SELECT COUNT(*) as total_grid_actions FROM grid_actions;

-- 5. Check if there are any actions at all
SELECT COUNT(*) as total_actions FROM actions; 