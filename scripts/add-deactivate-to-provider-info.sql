-- Remove third action from provider_info grid
-- This script removes the third action from the provider_info grid's action list

-- ============================================================================
-- 1. REMOVE THIRD ACTION FROM PROVIDER_INFO GRID
-- ============================================================================

-- Remove the third action (whatever it is) from provider_info grid
-- This will remove any action that has order = 3
DELETE FROM public.grid_actions 
WHERE grid_id = (SELECT id FROM public.grid_definitions WHERE key = 'provider_info')
  AND "order" = 3;

-- ============================================================================
-- 2. REORDER REMAINING ACTIONS
-- ============================================================================

-- Helper function to get action ID by name
CREATE OR REPLACE FUNCTION get_action_id(action_name text)
RETURNS uuid AS $$
BEGIN
  RETURN (SELECT id FROM public.actions WHERE name = action_name);
END;
$$ LANGUAGE plpgsql;

-- Helper function to get grid ID by key
CREATE OR REPLACE FUNCTION get_grid_id(grid_key text)
RETURNS uuid AS $$
BEGIN
  RETURN (SELECT id FROM public.grid_definitions WHERE key = grid_key);
END;
$$ LANGUAGE plpgsql;

-- Reorder remaining actions to fill the gap left by removing the third action
-- Move side_panel from 4 to 3, and view_details from 5 to 4
UPDATE public.grid_actions 
SET "order" = 3
WHERE grid_id = (SELECT id FROM public.grid_definitions WHERE key = 'provider_info')
  AND action_id = (SELECT id FROM public.actions WHERE name = 'side_panel');

UPDATE public.grid_actions 
SET "order" = 4
WHERE grid_id = (SELECT id FROM public.grid_definitions WHERE key = 'provider_info')
  AND action_id = (SELECT id FROM public.actions WHERE name = 'view_details');

-- ============================================================================
-- 3. VERIFICATION QUERIES
-- ============================================================================

-- Verify the third action was removed from provider_info grid
SELECT 
    gd.display_name as grid_name,
    gd.key as grid_key,
    a.name as action_name,
    a.label as action_label,
    a.icon as action_icon,
    ga."order" as action_order
FROM public.grid_actions ga
JOIN public.grid_definitions gd ON ga.grid_id = gd.id
JOIN public.actions a ON ga.action_id = a.id
WHERE gd.key = 'provider_info'
ORDER BY ga."order";

-- Show all actions for provider_info grid
SELECT 
    'Provider Info Grid Actions:' as info,
    STRING_AGG(a.name || ' (' || ga."order" || ')', ', ' ORDER BY ga."order") as actions_list
FROM public.grid_actions ga
JOIN public.grid_definitions gd ON ga.grid_id = gd.id
JOIN public.actions a ON ga.action_id = a.id
WHERE gd.key = 'provider_info';

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

SELECT 'SUCCESS: Third action removed from provider_info grid' as status;