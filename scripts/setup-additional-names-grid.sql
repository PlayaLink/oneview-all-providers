-- Setup Additional Names Grid Configuration
-- This script creates the grid definition and columns for the additional_names grid

-- ============================================================================
-- 1. INSERT GRID DEFINITION
-- ============================================================================

-- Insert grid definition
INSERT INTO grid_definitions (key, display_name, table_name, "group", icon, description, default_visible, section_id, "order")
VALUES (
  'additional_names',
  'Additional Names',
  'additional_names_with_provider',
  'provider_info',
  'user-plus',
  'Additional names for providers including alternate names, authorized signers, etc.',
  true,
  (SELECT id FROM grid_sections WHERE key = 'provider_info' LIMIT 1),
  6
) ON CONFLICT (key) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  table_name = EXCLUDED.table_name,
  "group" = EXCLUDED."group",
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  default_visible = EXCLUDED.default_visible,
  section_id = EXCLUDED.section_id,
  "order" = EXCLUDED."order";

-- ============================================================================
-- 2. INSERT GRID COLUMNS
-- ============================================================================

-- Get the grid ID
DO $$
DECLARE
    grid_id_var UUID;
BEGIN
    -- Get the grid ID
    SELECT id INTO grid_id_var FROM grid_definitions WHERE key = 'additional_names';
    
    IF grid_id_var IS NULL THEN
        RAISE EXCEPTION 'Grid definition not found for additional_names';
    END IF;

    -- Insert columns
    INSERT INTO grid_columns (grid_id, name, display_name, type, "order", visible, width, "group", description) VALUES
    (grid_id_var, 'type', 'Type', 'single-select', 1, true, 200, 'Additional Names', 'Type of additional name'),
    (grid_id_var, 'first_name', 'First Name', 'text', 2, true, 150, 'Additional Names', 'First name'),
    (grid_id_var, 'middle_name', 'Middle Name', 'text', 3, false, 150, 'Additional Names', 'Middle name'),
    (grid_id_var, 'last_name', 'Last Name', 'text', 4, true, 150, 'Additional Names', 'Last name'),
    (grid_id_var, 'title', 'Title', 'single-select', 5, false, 120, 'Additional Names', 'Professional title'),
    (grid_id_var, 'start_date', 'Start Date', 'date', 6, false, 120, 'Additional Names', 'Start date for this name'),
    (grid_id_var, 'end_date', 'End Date', 'date', 7, false, 120, 'Additional Names', 'End date for this name'),
    (grid_id_var, 'tags', 'Tags', 'multi-select', 8, false, 200, 'Additional Names', 'Tags for categorization'),
    (grid_id_var, 'last_updated', 'Last Updated', 'date', 9, false, 120, 'Additional Names', 'Last updated timestamp'),
    (grid_id_var, 'provider_name', 'Provider', 'text', 10, true, 200, 'Provider Info', 'Provider name')
    ON CONFLICT (grid_id, name) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        type = EXCLUDED.type,
        "order" = EXCLUDED."order",
        visible = EXCLUDED.visible,
        width = EXCLUDED.width,
        "group" = EXCLUDED."group",
        description = EXCLUDED.description;

    RAISE NOTICE 'Grid columns inserted/updated for additional_names';
END $$;

-- ============================================================================
-- 3. INSERT GRID ACTIONS
-- ============================================================================

-- Get the grid ID and action IDs
DO $$
DECLARE
    grid_id_var UUID;
    download_action_id UUID;
    flag_action_id UUID;
    side_panel_action_id UUID;
    view_details_action_id UUID;
BEGIN
    -- Get the grid ID
    SELECT id INTO grid_id_var FROM grid_definitions WHERE key = 'additional_names';
    
    -- Get action IDs
    SELECT id INTO download_action_id FROM actions WHERE name = 'download';
    SELECT id INTO flag_action_id FROM actions WHERE name = 'flag';
    SELECT id INTO side_panel_action_id FROM actions WHERE name = 'side_panel';
    SELECT id INTO view_details_action_id FROM actions WHERE name = 'view_details';
    
    IF grid_id_var IS NULL THEN
        RAISE EXCEPTION 'Grid definition not found for additional_names';
    END IF;

    -- Insert grid actions
    INSERT INTO grid_actions (grid_id, action_id, "order") VALUES
    (grid_id_var, download_action_id, 1),
    (grid_id_var, flag_action_id, 2),
    (grid_id_var, side_panel_action_id, 3),
    (grid_id_var, view_details_action_id, 4)
    ON CONFLICT (grid_id, action_id) DO UPDATE SET
        "order" = EXCLUDED."order";

    RAISE NOTICE 'Grid actions inserted/updated for additional_names';
END $$;

-- ============================================================================
-- 4. VERIFICATION QUERIES
-- ============================================================================

-- Verify grid definition
SELECT 
    gd.key,
    gd.display_name,
    gd.table_name,
    gd."group",
    gd.icon,
    gd."order"
FROM grid_definitions gd 
WHERE gd.key = 'additional_names';

-- Verify grid columns
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
WHERE gd.key = 'additional_names'
ORDER BY gc."order";

-- Verify grid actions
SELECT 
    a.name as action_name,
    ga."order"
FROM grid_actions ga
JOIN grid_definitions gd ON ga.grid_id = gd.id
JOIN actions a ON ga.action_id = a.id
WHERE gd.key = 'additional_names'
ORDER BY ga."order";

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

SELECT 'Additional Names grid configuration completed successfully!' as status;
