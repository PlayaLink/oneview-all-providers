-- Query to view all actions in the actions table
-- This script shows all available actions with their details

SELECT 
    id,
    name,
    label,
    icon,
    tooltip,
    description,
    created_at,
    updated_at
FROM public.actions
ORDER BY name;

-- Alternative query with additional information
-- Shows action usage across grids
SELECT 
    a.id,
    a.name,
    a.label,
    a.icon,
    a.tooltip,
    a.description,
    COUNT(ga.id) as usage_count,
    STRING_AGG(gd.display_name, ', ') as used_in_grids
FROM public.actions a
LEFT JOIN public.grid_actions ga ON a.id = ga.action_id
LEFT JOIN public.grid_definitions gd ON ga.grid_id = gd.id
GROUP BY a.id, a.name, a.label, a.icon, a.tooltip, a.description
ORDER BY a.name;

-- Query to see actions with their grid assignments and order
SELECT 
    a.name as action_name,
    a.label as action_label,
    a.icon as action_icon,
    a.tooltip as action_tooltip,
    gd.display_name as grid_name,
    ga."order" as action_order
FROM public.actions a
LEFT JOIN public.grid_actions ga ON a.id = ga.action_id
LEFT JOIN public.grid_definitions gd ON ga.grid_id = gd.id
ORDER BY gd.display_name, ga."order";
