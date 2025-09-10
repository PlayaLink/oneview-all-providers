-- Setup DEA Licenses grid actions
-- This script links the DEA Licenses grid with the specified actions

DO $$
DECLARE
    grid_id_var UUID;
    action_order INTEGER := 1;
    action_name TEXT;
    action_id_var UUID;
BEGIN
    -- Get the grid_id for DEA Licenses
    SELECT id INTO grid_id_var 
    FROM grid_definitions 
    WHERE key = 'dea_licenses';
    
    IF grid_id_var IS NULL THEN
        RAISE EXCEPTION 'DEA Licenses grid not found. Please run setup-dea-licenses-grid.sql first.';
    END IF;
    
    -- Define the actions to link
    FOR action_name IN VALUES 
        ('download'),
        ('bell'),
        ('sidebar-flip'),
        ('flag'),
        ('circle-xmark')
    LOOP
        -- Get the action_id for this action
        SELECT id INTO action_id_var 
        FROM actions 
        WHERE name = action_name;
        
        IF action_id_var IS NOT NULL THEN
            -- Insert or update the grid action
            INSERT INTO grid_actions (
                id,
                grid_id,
                action_id,
                "order",
                created_at,
                updated_at
            ) VALUES (
                gen_random_uuid(),
                grid_id_var,
                action_id_var,
                action_order,
                NOW(),
                NOW()
            ) ON CONFLICT (grid_id, action_id) DO UPDATE SET
                "order" = EXCLUDED."order",
                updated_at = NOW();
            
            RAISE NOTICE 'Linked action "%" to DEA Licenses grid (order: %)', action_name, action_order;
            action_order := action_order + 1;
        ELSE
            RAISE WARNING 'Action "%" not found in actions table', action_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'DEA Licenses grid actions setup completed successfully';
    
END $$;



