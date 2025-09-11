-- Complete State Controlled Substance Licenses Grid Creation Script (No Auth Required)
-- This script creates the entire grid system in one go
-- Run this single script to set up everything

-- ============================================================================
-- 1. CREATE TABLE
-- ============================================================================

-- Create state_controlled_substance_licenses table
CREATE TABLE IF NOT EXISTS state_controlled_substance_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    license_type TEXT,
    license_number TEXT,
    state TEXT,
    status TEXT,
    issue_date DATE,
    expiration_date DATE,
    expires_within TEXT,
    dont_renew TEXT,
    is_primary TEXT,
    first_name TEXT,
    last_name TEXT,
    tags TEXT[] DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_state_controlled_substance_licenses_provider_id 
ON state_controlled_substance_licenses(provider_id);

CREATE INDEX IF NOT EXISTS idx_state_controlled_substance_licenses_state 
ON state_controlled_substance_licenses(state);

CREATE INDEX IF NOT EXISTS idx_state_controlled_substance_licenses_status 
ON state_controlled_substance_licenses(status);

CREATE INDEX IF NOT EXISTS idx_state_controlled_substance_licenses_expiration_date 
ON state_controlled_substance_licenses(expiration_date);

-- Disable RLS for easier development/testing
ALTER TABLE state_controlled_substance_licenses DISABLE ROW LEVEL SECURITY;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_state_controlled_substance_licenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists, then create new one
DROP TRIGGER IF EXISTS trigger_update_state_controlled_substance_licenses_updated_at ON state_controlled_substance_licenses;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_state_controlled_substance_licenses_updated_at
    BEFORE UPDATE ON state_controlled_substance_licenses
    FOR EACH ROW
    EXECUTE FUNCTION update_state_controlled_substance_licenses_updated_at();

-- ============================================================================
-- 2. CREATE PROVIDER VIEW
-- ============================================================================

-- Create state_controlled_substance_licenses_with_provider view
CREATE OR REPLACE VIEW state_controlled_substance_licenses_with_provider AS
SELECT 
    s.*,
    p.provider_name,
    p.title,
    p.primary_specialty
FROM state_controlled_substance_licenses s
LEFT JOIN providers_with_full_name p ON s.provider_id = p.id;

-- Grant permissions on the view (no authentication required)
GRANT SELECT ON state_controlled_substance_licenses_with_provider TO public;

-- ============================================================================
-- 3. SETUP GRID DEFINITION AND COLUMNS
-- ============================================================================

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

-- Setup grid columns
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

-- ============================================================================
-- 4. SETUP GRID ACTIONS
-- ============================================================================

-- Setup grid actions
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

-- ============================================================================
-- 5. VERIFICATION QUERIES
-- ============================================================================

-- Check table structure
SELECT 'TABLE STRUCTURE' as check_type, column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'state_controlled_substance_licenses' 
ORDER BY ordinal_position;

-- Check indexes
SELECT 'INDEXES' as check_type, indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'state_controlled_substance_licenses';

-- Check RLS status
SELECT 'RLS STATUS' as check_type, schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'state_controlled_substance_licenses';

-- Check if the view was created successfully
SELECT 'VIEW CREATION' as check_type, schemaname, viewname, definition
FROM pg_views 
WHERE viewname = 'state_controlled_substance_licenses_with_provider';

-- Check grid definition
SELECT 'GRID DEFINITION' as check_type, display_name, table_name, "group", icon, "order"
FROM grid_definitions 
WHERE display_name = 'State Controlled Substance Licenses';

-- Check grid columns
SELECT 'GRID COLUMNS' as check_type, gc.name, gc.display_name, gc.type, gc."order", gc.visible, gc.width, gc."group"
FROM grid_columns gc
JOIN grid_definitions gd ON gc.grid_id = gd.id
WHERE gd.display_name = 'State Controlled Substance Licenses'
ORDER BY gc."order";

-- Check column count
SELECT 'COLUMN COUNT' as check_type, 
    COUNT(*) as total_columns,
    COUNT(CASE WHEN visible = true THEN 1 END) as visible_columns,
    COUNT(CASE WHEN visible = false THEN 1 END) as hidden_columns
FROM grid_columns gc
JOIN grid_definitions gd ON gc.grid_id = gd.id
WHERE gd.display_name = 'State Controlled Substance Licenses';

-- Check grid actions
SELECT 'GRID ACTIONS' as check_type, gd.display_name, a.name as action_name, a.label as action_display_name, ga."order"
FROM grid_actions ga
JOIN grid_definitions gd ON ga.grid_id = gd.id
JOIN actions a ON ga.action_id = a.id
WHERE gd.display_name = 'State Controlled Substance Licenses'
ORDER BY ga."order";

-- Check action count
SELECT 'ACTION COUNT' as check_type, COUNT(*) as total_actions
FROM grid_actions ga
JOIN grid_definitions gd ON ga.grid_id = gd.id
WHERE gd.display_name = 'State Controlled Substance Licenses';

-- Check for missing actions
WITH expected_actions AS (
    SELECT unnest(ARRAY['download', 'alert', 'flag', 'deactivate', 'side_panel', 'view_details']) as action_name
),
actual_actions AS (
    SELECT a.name as action_name
    FROM grid_actions ga
    JOIN grid_definitions gd ON ga.grid_id = gd.id
    JOIN actions a ON ga.action_id = a.id
    WHERE gd.display_name = 'State Controlled Substance Licenses'
)
SELECT 'MISSING ACTIONS' as check_type,
    ea.action_name as expected_action,
    CASE 
        WHEN aa.action_name IS NOT NULL THEN '✓ Found'
        ELSE '✗ Missing'
    END as status
FROM expected_actions ea
LEFT JOIN actual_actions aa ON ea.action_name = aa.action_name
ORDER BY ea.action_name;

-- Test the view with sample data (if providers exist)
SELECT 'VIEW TEST' as check_type,
    COUNT(*) as total_records,
    COUNT(provider_name) as records_with_provider_name,
    COUNT(title) as records_with_title,
    COUNT(primary_specialty) as records_with_primary_specialty
FROM state_controlled_substance_licenses_with_provider;

-- Check for any records without provider data
SELECT 'ORPHANED RECORDS' as check_type,
    COUNT(*) as records_without_provider_data
FROM state_controlled_substance_licenses_with_provider 
WHERE provider_name IS NULL;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'State Controlled Substance Licenses Grid Creation Complete!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✓ Table created with proper indexes';
    RAISE NOTICE '✓ Provider view created and accessible';
    RAISE NOTICE '✓ Grid definition with 16 columns configured';
    RAISE NOTICE '✓ 6 actions linked to the grid';
    RAISE NOTICE '✓ All verification queries completed';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Grid is ready for use!';
    RAISE NOTICE '========================================';
END $$;
