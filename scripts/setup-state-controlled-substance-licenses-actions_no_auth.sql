-- Setup State Controlled Substance Licenses Grid Actions (No Auth Required)
-- This script links the grid with the specified actions

-- Helper function to get grid_id by name
DO $$
DECLARE
    grid_id_var UUID;
    action_id_var UUID;
    action_order INTEGER := 1;
    action_name TEXT;
    action_names TEXT[] := ARRAY['download', 'alert', 'flag', 'deactivate', 'side_panel', 'view_details'];
BEGIN
    -- Get the grid_id for State Controlled Substance Licenses
    SELECT id INTO grid_id_var 
    FROM grid_definitions 
    WHERE display_name = 'State Controlled Substance Licenses';
    
    IF grid_id_var IS NULL THEN
        RAISE EXCEPTION 'Grid "State Controlled Substance Licenses" not found';
    END IF;
    
    -- Delete existing grid actions to avoid conflicts
    DELETE FROM grid_actions WHERE grid_id = grid_id_var;
    
    -- Insert each action
    FOREACH action_name IN ARRAY action_names
    LOOP
        -- Get the action_id
        SELECT id INTO action_id_var 
        FROM actions 
        WHERE name = action_name;
        
        IF action_id_var IS NOT NULL THEN
            -- Insert the grid action
            INSERT INTO grid_actions (
                grid_id,
                action_id,
                "order"
            ) VALUES (
                grid_id_var,
                action_id_var,
                action_order
            );
            
            RAISE NOTICE 'Added action "%" to State Controlled Substance Licenses grid', action_name;
            action_order := action_order + 1;
        ELSE
            RAISE WARNING 'Action "%" not found in actions table', action_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Grid actions setup completed for State Controlled Substance Licenses';
END $$;

-- Verification queries
-- Check grid actions
SELECT 
    gd.display_name,
    a.name as action_name,
    a.label as action_display_name,
    ga."order"
FROM grid_actions ga
JOIN grid_definitions gd ON ga.grid_id = gd.id
JOIN actions a ON ga.action_id = a.id
WHERE gd.display_name = 'State Controlled Substance Licenses'
ORDER BY ga."order";

-- Check action count
SELECT 
    COUNT(*) as total_actions
FROM grid_actions ga
JOIN grid_definitions gd ON ga.grid_id = gd.id
WHERE gd.display_name = 'State Controlled Substance Licenses';

-- Check for missing actions
SELECT 
    unnest(ARRAY['download', 'alert', 'flag', 'deactivate', 'side_panel', 'view_details']) as expected_action,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM grid_actions ga
            JOIN grid_definitions gd ON ga.grid_id = gd.id
            JOIN actions a ON ga.action_id = a.id
            WHERE gd.display_name = 'State Controlled Substance Licenses' 
            AND a.name = unnest(ARRAY['download', 'alert', 'flag', 'deactivate', 'side_panel', 'view_details'])
        ) THEN '✓ Found'
        ELSE '✗ Missing'
    END as status;
