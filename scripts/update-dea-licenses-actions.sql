-- Update grid_actions table for DEA Licenses grid
-- Set actions: download, alert, side_panel, flag, deactivate

-- First, remove existing actions for DEA Licenses
DELETE FROM public.grid_actions 
WHERE grid_id = (SELECT id FROM public.grid_definitions WHERE display_name = 'DEA Licenses');

-- Insert new actions for DEA Licenses in the specified order
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT 
    gd.id as grid_id,
    a.id as action_id,
    CASE 
        WHEN a.name = 'download' THEN 1
        WHEN a.name = 'alert' THEN 2
        WHEN a.name = 'side_panel' THEN 3
        WHEN a.name = 'flag' THEN 4
        WHEN a.name = 'deactivate' THEN 5
    END as "order"
FROM public.grid_definitions gd
CROSS JOIN public.actions a
WHERE gd.display_name = 'DEA Licenses'
  AND a.name IN ('download', 'alert', 'side_panel', 'flag', 'deactivate');

-- Verify the update
SELECT 
    gd.display_name as grid_name,
    a.name as action_name,
    a.label as action_label,
    ga."order" as action_order
FROM public.grid_actions ga
JOIN public.grid_definitions gd ON ga.grid_id = gd.id
JOIN public.actions a ON ga.action_id = a.id
WHERE gd.display_name = 'DEA Licenses'
ORDER BY ga."order";
