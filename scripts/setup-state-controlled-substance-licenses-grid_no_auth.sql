-- Setup State Controlled Substance Licenses Grid Configuration (No Auth Required)
-- This script creates the grid definition and all column configurations

-- Insert grid definition
INSERT INTO grid_definitions (
    key,
    display_name, 
    table_name, 
    "group", 
    icon, 
    "order"
) VALUES (
    'state-controlled-substance-licenses',
    'State Controlled Substance Licenses',
    'state_controlled_substance_licenses_with_provider',
    'Licenses',
    'faPrescription',
    3
) ON CONFLICT (key) DO UPDATE SET
    table_name = EXCLUDED.table_name,
    "group" = EXCLUDED."group",
    icon = EXCLUDED.icon,
    "order" = EXCLUDED."order";

-- Get the grid_id for the State Controlled Substance Licenses grid
DO $$
DECLARE
    grid_id_var UUID;
BEGIN
    -- Get the grid_id
    SELECT id INTO grid_id_var 
    FROM grid_definitions 
    WHERE display_name = 'State Controlled Substance Licenses';
    
    -- Delete existing columns to avoid conflicts
    DELETE FROM grid_columns WHERE grid_id = grid_id_var;
    
    -- Insert all columns for State Controlled Substance Licenses grid
    INSERT INTO grid_columns (
        grid_id,
        name,
        display_name,
        type,
        "order",
        visible,
        width,
        "group"
    ) VALUES 
        (grid_id_var, 'provider_name', 'Provider Name', 'text', 1, true, 200, 'provider_info'),
        (grid_id_var, 'title', 'Title', 'single-select', 2, true, 100, 'provider_info'),
        (grid_id_var, 'primary_specialty', 'Primary Specialty', 'single-select', 3, true, 180, 'provider_info'),
        (grid_id_var, 'license_type', 'License Type', 'single-select', 4, true, 120, 'search_criteria'),
        (grid_id_var, 'license_number', 'License', 'text', 5, true, 150, 'search_criteria'),
        (grid_id_var, 'state', 'State', 'single-select', 6, true, 80, 'search_criteria'),
        (grid_id_var, 'status', 'Status', 'single-select', 7, true, 120, 'additional_info'),
        (grid_id_var, 'issue_date', 'Issue Date', 'date', 8, true, 120, 'additional_info'),
        (grid_id_var, 'expiration_date', 'Exp. Date', 'date', 9, true, 120, 'additional_info'),
        (grid_id_var, 'expires_within', 'Expires Within', 'text', 10, true, 120, 'additional_info'),
        (grid_id_var, 'dont_renew', 'Don''t Renew?', 'single-select', 11, false, 120, 'additional_info'),
        (grid_id_var, 'is_primary', 'Primary?', 'single-select', 12, false, 100, 'additional_info'),
        (grid_id_var, 'first_name', 'First Name', 'text', 13, false, 120, 'search_criteria'),
        (grid_id_var, 'last_name', 'Last Name', 'text', 14, false, 120, 'search_criteria'),
        (grid_id_var, 'tags', 'Tags', 'multi-select', 15, true, 150, 'additional_info'),
        (grid_id_var, 'last_updated', 'Last Updated', 'date', 16, true, 120, 'additional_info');
    
    RAISE NOTICE 'Grid columns inserted successfully for State Controlled Substance Licenses';
END $$;

-- Verification queries
-- Check grid definition
SELECT 
    display_name,
    table_name,
    "group",
    icon,
    "order"
FROM grid_definitions 
WHERE display_name = 'State Controlled Substance Licenses';

-- Check grid columns
SELECT 
    gc.name,
    gc.display_name,
    gc.type,
    gc."order",
    gc.visible,
    gc.width,
    gc."group"
FROM grid_columns gc
JOIN grid_definitions gd ON gc.grid_id = gd.id
WHERE gd.display_name = 'State Controlled Substance Licenses'
ORDER BY gc."order";

-- Check column count
SELECT 
    COUNT(*) as total_columns,
    COUNT(CASE WHEN visible = true THEN 1 END) as visible_columns,
    COUNT(CASE WHEN visible = false THEN 1 END) as hidden_columns
FROM grid_columns gc
JOIN grid_definitions gd ON gc.grid_id = gd.id
WHERE gd.display_name = 'State Controlled Substance Licenses';
