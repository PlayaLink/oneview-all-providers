-- Complete Additional Names Grid Creation Script (No Auth Required)
-- This script creates the entire grid system in one go
-- Run this single script to set up everything

-- ============================================================================
-- 1. CREATE TABLE
-- ============================================================================

-- Create additional_names table
CREATE TABLE IF NOT EXISTS additional_names (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    title TEXT,
    start_date DATE,
    end_date DATE,
    tags TEXT[] DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_additional_names_provider_id ON additional_names(provider_id);
CREATE INDEX IF NOT EXISTS idx_additional_names_type ON additional_names(type);
CREATE INDEX IF NOT EXISTS idx_additional_names_last_name ON additional_names(last_name);
CREATE INDEX IF NOT EXISTS idx_additional_names_start_date ON additional_names(start_date);
CREATE INDEX IF NOT EXISTS idx_additional_names_end_date ON additional_names(end_date);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_additional_names_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_additional_names_updated_at
    BEFORE UPDATE ON additional_names
    FOR EACH ROW
    EXECUTE FUNCTION update_additional_names_updated_at();

-- Disable RLS for development
ALTER TABLE additional_names DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON additional_names TO public;

-- Add comments
COMMENT ON TABLE additional_names IS 'Additional names for providers including alternate names, authorized signers, etc.';
COMMENT ON COLUMN additional_names.type IS 'Type of additional name (Alternate Supervisor Name, Authorized Signer, etc.)';
COMMENT ON COLUMN additional_names.first_name IS 'First name';
COMMENT ON COLUMN additional_names.middle_name IS 'Middle name (optional)';
COMMENT ON COLUMN additional_names.last_name IS 'Last name';
COMMENT ON COLUMN additional_names.title IS 'Professional title (optional)';
COMMENT ON COLUMN additional_names.start_date IS 'Start date for this name (optional)';
COMMENT ON COLUMN additional_names.end_date IS 'End date for this name (optional)';
COMMENT ON COLUMN additional_names.tags IS 'Tags for categorization';
COMMENT ON COLUMN additional_names.last_updated IS 'Last updated timestamp for tracking changes';

-- ============================================================================
-- 2. CREATE PROVIDER VIEW
-- ============================================================================

-- Create additional_names_with_provider view
CREATE OR REPLACE VIEW additional_names_with_provider AS
SELECT 
    an.id,
    an.provider_id,
    p.provider_name,
    p.title,
    p.primary_specialty,
    an.type,
    an.first_name,
    an.middle_name,
    an.last_name,
    an.title as name_title,
    an.start_date,
    an.end_date,
    an.tags,
    an.last_updated,
    an.created_at,
    an.updated_at
FROM additional_names an
LEFT JOIN providers_with_full_name p ON an.provider_id = p.id;

-- Grant permissions
GRANT SELECT ON additional_names_with_provider TO public;

-- Add comment
COMMENT ON VIEW additional_names_with_provider IS 'Additional names joined with provider information for grid display';

-- ============================================================================
-- 3. SETUP GRID DEFINITION AND COLUMNS
-- ============================================================================

DO $$
DECLARE
    v_grid_id UUID;
    action_id UUID;
BEGIN
    -- Insert grid definition
    INSERT INTO grid_definitions (key, display_name, table_name, "group", icon, description, default_visible, "order")
    VALUES (
        'additional_names',
        'Additional Names',
        'additional_names_with_provider',
        'provider_info',
        'faHouseChimneyUser',
        'Additional names for providers including alternate names, authorized signers, etc.',
        true,
        4
    )
    ON CONFLICT (key) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        table_name = EXCLUDED.table_name,
        "group" = EXCLUDED."group",
        icon = EXCLUDED.icon,
        description = EXCLUDED.description,
        default_visible = EXCLUDED.default_visible,
        "order" = EXCLUDED."order"
    RETURNING id INTO v_grid_id;

    -- Get v_grid_id if it already exists
    IF v_grid_id IS NULL THEN
        SELECT id INTO v_grid_id FROM grid_definitions WHERE key = 'additional_names';
    END IF;

    -- Clear existing columns
    DELETE FROM grid_columns WHERE grid_id = v_grid_id;

    -- Insert grid columns
    INSERT INTO grid_columns (grid_id, name, display_name, type, "order", visible, width, "group", description, options)
    VALUES 
        (v_grid_id, 'provider_name', 'Provider Name', 'text', 1, true, 200, 'provider_info', 'Provider name', NULL),
        (v_grid_id, 'title', 'Title', 'text', 2, true, 100, 'provider_info', 'Provider title', NULL),
        (v_grid_id, 'primary_specialty', 'Primary Specialty', 'text', 3, true, 150, 'provider_info', 'Primary specialty', NULL),
        (v_grid_id, 'type', 'Type', 'single-select', 4, true, 150, 'name_info', 'Type of additional name', '["Alternate Supervisor Name", "Authorized Signer", "Autonomous Supervisor Name", "Credentialing", "Division President", "Practice Administrator", "Other Name"]'),
        (v_grid_id, 'first_name', 'First Name', 'text', 5, true, 120, 'name_info', 'First name', NULL),
        (v_grid_id, 'middle_name', 'Middle Name', 'text', 6, true, 120, 'name_info', 'Middle name', NULL),
        (v_grid_id, 'last_name', 'Last Name', 'text', 7, true, 120, 'name_info', 'Last name', NULL),
        (v_grid_id, 'start_date', 'Start Date', 'date', 8, true, 120, 'date_info', 'Start date for this name', NULL),
        (v_grid_id, 'end_date', 'End Date', 'date', 9, true, 120, 'date_info', 'End date for this name', NULL),
        (v_grid_id, 'tags', 'Tags', 'multi-select', 10, true, 150, 'metadata', 'Tags for categorization', '["active", "inactive", "verified", "unverified", "primary", "secondary", "legal", "preferred"]'),
        (v_grid_id, 'last_updated', 'Last Updated', 'date', 11, true, 120, 'metadata', 'Last updated timestamp', NULL);

    RAISE NOTICE 'Grid definition and columns created successfully for Additional Names';
END $$;

-- ============================================================================
-- 4. SETUP GRID ACTIONS
-- ============================================================================

DO $$
DECLARE
    v_grid_id UUID;
    action_order INTEGER := 1;
BEGIN
    -- Get v_grid_id
    SELECT id INTO v_grid_id FROM grid_definitions WHERE key = 'additional_names';
    
    IF v_grid_id IS NULL THEN
        RAISE EXCEPTION 'Grid definition not found for additional_names';
    END IF;

    -- Clear existing actions
    DELETE FROM grid_actions WHERE grid_id = v_grid_id;

    -- Insert grid actions
    INSERT INTO grid_actions (grid_id, action_id, "order")
    SELECT 
        v_grid_id,
        a.id,
        action_order + (ROW_NUMBER() OVER (ORDER BY a.name) - 1)
    FROM actions a
    WHERE a.name IN ('download', 'flag', 'deactivate', 'side_panel', 'view_details')
    ORDER BY a.name;

    RAISE NOTICE 'Grid actions configured successfully for Additional Names';
END $$;

-- ============================================================================
-- 5. VERIFICATION QUERIES
-- ============================================================================

-- Verify table creation
SELECT 
    'Table Creation' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'additional_names') 
        THEN 'PASS' 
        ELSE 'FAIL' 
    END as status;

-- Verify view creation
SELECT 
    'View Creation' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'additional_names_with_provider') 
        THEN 'PASS' 
        ELSE 'FAIL' 
    END as status;

-- Verify grid definition
SELECT 
    'Grid Definition' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM grid_definitions WHERE key = 'additional_names') 
        THEN 'PASS' 
        ELSE 'FAIL' 
    END as status;

-- Verify grid columns
SELECT 
    'Grid Columns' as check_type,
    COUNT(*) as column_count,
    CASE 
        WHEN COUNT(*) >= 11 
        THEN 'PASS' 
        ELSE 'FAIL' 
    END as status
FROM grid_columns gc
JOIN grid_definitions gd ON gc.grid_id = gd.id
WHERE gd.key = 'additional_names';

-- Verify grid actions
SELECT 
    'Grid Actions' as check_type,
    COUNT(*) as action_count,
    CASE 
        WHEN COUNT(*) >= 5 
        THEN 'PASS' 
        ELSE 'FAIL' 
    END as status
FROM grid_actions ga
JOIN grid_definitions gd ON ga.grid_id = gd.id
WHERE gd.key = 'additional_names';

-- Show grid configuration summary
SELECT 
    gd.display_name,
    gd.table_name,
    gd."group",
    gd.icon,
    gd."order",
    (SELECT COUNT(*) FROM grid_columns gc WHERE gc.grid_id = gd.id) as column_count,
    (SELECT COUNT(*) FROM grid_actions ga WHERE ga.grid_id = gd.id) as action_count
FROM grid_definitions gd
WHERE gd.key = 'additional_names';

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Additional Names Grid Creation Completed Successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Database table created: additional_names';
    RAISE NOTICE '✅ Provider view created: additional_names_with_provider';
    RAISE NOTICE '✅ Grid definition configured';
    RAISE NOTICE '✅ Grid columns configured (11 columns)';
    RAISE NOTICE '✅ Grid actions configured (5 actions)';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Next Steps:';
    RAISE NOTICE '1. Run the seeding script: npm run seed:additional-names';
    RAISE NOTICE '2. Add icon mapping to src/lib/iconMapping.ts';
    RAISE NOTICE '3. Create Details components';
    RAISE NOTICE '4. Update template configuration';
    RAISE NOTICE '';
    RAISE NOTICE '🔍 Verification queries completed above - check results for any issues';
    RAISE NOTICE '';
END $$;
