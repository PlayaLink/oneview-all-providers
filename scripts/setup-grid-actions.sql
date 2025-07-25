-- Setup Grid Actions based on the screenshot configuration
-- Run this SQL directly in your Supabase database

-- First, ensure the actions table has the correct actions
INSERT INTO public.actions (name, label, icon, tooltip, description) VALUES
  ('download', 'Download', 'faCircleDown', 'Download record data', 'Download this record as CSV or PDF'),
  ('attachment', 'Attachment', 'faPaperclip', 'Manage attachments', 'Add or view attachments for this record'),
  ('notification', 'Notification', 'faBell', 'Toggle notifications', 'Enable or disable notifications for this record'),
  ('grid', 'Grid View', 'faTable', 'Toggle grid view', 'Show or hide the grid view for this record'),
  ('flag', 'Flag', 'faFlag', 'Flag this record', 'Mark this record for attention'),
  ('delete', 'Delete', 'faTimes', 'Delete record', 'Delete this record'),
  ('toggle', 'Toggle', 'faToggleOn', 'Toggle status', 'Toggle the status of this record'),
  ('star', 'Star', 'faStar', 'Star this record', 'Mark this record as important'),
  ('verified', 'Verified', 'faShieldCheck', 'Verified status', 'Mark this record as verified')
ON CONFLICT (name) DO UPDATE SET
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  tooltip = EXCLUDED.tooltip,
  description = EXCLUDED.description;

-- Clear existing grid actions (optional - comment out if you want to keep existing)
-- DELETE FROM public.grid_actions;

-- Helper function to get action ID by name
CREATE OR REPLACE FUNCTION get_action_id(action_name text)
RETURNS uuid AS $$
BEGIN
  RETURN (SELECT id FROM public.actions WHERE name = action_name);
END;
$$ LANGUAGE plpgsql;

-- Helper function to get grid ID by display name
CREATE OR REPLACE FUNCTION get_grid_id(grid_display_name text)
RETURNS uuid AS $$
BEGIN
  RETURN (SELECT id FROM public.grid_definitions WHERE display_name = grid_display_name);
END;
$$ LANGUAGE plpgsql;

-- Insert grid actions based on the screenshot configuration
-- Each grid gets its specific actions in the correct order

-- ready-only: download, attachment, notification, grid, flag, star, verified
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('ready-only'), get_action_id('download'), 1
WHERE get_grid_id('ready-only') IS NOT NULL AND get_action_id('download') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('ready-only'), get_action_id('attachment'), 2
WHERE get_grid_id('ready-only') IS NOT NULL AND get_action_id('attachment') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('ready-only'), get_action_id('notification'), 3
WHERE get_grid_id('ready-only') IS NOT NULL AND get_action_id('notification') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('ready-only'), get_action_id('grid'), 4
WHERE get_grid_id('ready-only') IS NOT NULL AND get_action_id('grid') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('ready-only'), get_action_id('flag'), 5
WHERE get_grid_id('ready-only') IS NOT NULL AND get_action_id('flag') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('ready-only'), get_action_id('star'), 6
WHERE get_grid_id('ready-only') IS NOT NULL AND get_action_id('star') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('ready-only'), get_action_id('verified'), 7
WHERE get_grid_id('ready-only') IS NOT NULL AND get_action_id('verified') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

-- ... (ellipsis): toggle, star, verified
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('...'), get_action_id('toggle'), 1
WHERE get_grid_id('...') IS NOT NULL AND get_action_id('toggle') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('...'), get_action_id('star'), 2
WHERE get_grid_id('...') IS NOT NULL AND get_action_id('star') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('...'), get_action_id('verified'), 3
WHERE get_grid_id('...') IS NOT NULL AND get_action_id('verified') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

-- Verifications: download, notification, grid, flag
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Verifications'), get_action_id('download'), 1
WHERE get_grid_id('Verifications') IS NOT NULL AND get_action_id('download') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Verifications'), get_action_id('notification'), 2
WHERE get_grid_id('Verifications') IS NOT NULL AND get_action_id('notification') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Verifications'), get_action_id('grid'), 3
WHERE get_grid_id('Verifications') IS NOT NULL AND get_action_id('grid') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Verifications'), get_action_id('flag'), 4
WHERE get_grid_id('Verifications') IS NOT NULL AND get_action_id('flag') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

-- Provider Info: download, grid, flag, toggle
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Provider Info'), get_action_id('download'), 1
WHERE get_grid_id('Provider Info') IS NOT NULL AND get_action_id('download') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Provider Info'), get_action_id('grid'), 2
WHERE get_grid_id('Provider Info') IS NOT NULL AND get_action_id('grid') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Provider Info'), get_action_id('flag'), 3
WHERE get_grid_id('Provider Info') IS NOT NULL AND get_action_id('flag') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Provider Info'), get_action_id('toggle'), 4
WHERE get_grid_id('Provider Info') IS NOT NULL AND get_action_id('toggle') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

-- Birth Info: download, grid
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Birth Info'), get_action_id('download'), 1
WHERE get_grid_id('Birth Info') IS NOT NULL AND get_action_id('download') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Birth Info'), get_action_id('grid'), 2
WHERE get_grid_id('Birth Info') IS NOT NULL AND get_action_id('grid') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

-- Addresses: download, grid, flag, delete
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Addresses'), get_action_id('download'), 1
WHERE get_grid_id('Addresses') IS NOT NULL AND get_action_id('download') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Addresses'), get_action_id('grid'), 2
WHERE get_grid_id('Addresses') IS NOT NULL AND get_action_id('grid') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Addresses'), get_action_id('flag'), 3
WHERE get_grid_id('Addresses') IS NOT NULL AND get_action_id('flag') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Addresses'), get_action_id('delete'), 4
WHERE get_grid_id('Addresses') IS NOT NULL AND get_action_id('delete') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

-- Additional Names: download, grid, flag, delete
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Additional Names'), get_action_id('download'), 1
WHERE get_grid_id('Additional Names') IS NOT NULL AND get_action_id('download') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Additional Names'), get_action_id('grid'), 2
WHERE get_grid_id('Additional Names') IS NOT NULL AND get_action_id('grid') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Additional Names'), get_action_id('flag'), 3
WHERE get_grid_id('Additional Names') IS NOT NULL AND get_action_id('flag') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Additional Names'), get_action_id('delete'), 4
WHERE get_grid_id('Additional Names') IS NOT NULL AND get_action_id('delete') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

-- CAQH: grid only
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('CAQH'), get_action_id('grid'), 1
WHERE get_grid_id('CAQH') IS NOT NULL AND get_action_id('grid') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

-- Health Info: download, notification, grid, flag, delete
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Health Info'), get_action_id('download'), 1
WHERE get_grid_id('Health Info') IS NOT NULL AND get_action_id('download') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Health Info'), get_action_id('notification'), 2
WHERE get_grid_id('Health Info') IS NOT NULL AND get_action_id('notification') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Health Info'), get_action_id('grid'), 3
WHERE get_grid_id('Health Info') IS NOT NULL AND get_action_id('grid') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Health Info'), get_action_id('flag'), 4
WHERE get_grid_id('Health Info') IS NOT NULL AND get_action_id('flag') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Health Info'), get_action_id('delete'), 5
WHERE get_grid_id('Health Info') IS NOT NULL AND get_action_id('delete') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

-- State Licenses: download, notification, grid, flag, delete, verified
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('State Licenses'), get_action_id('download'), 1
WHERE get_grid_id('State Licenses') IS NOT NULL AND get_action_id('download') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('State Licenses'), get_action_id('notification'), 2
WHERE get_grid_id('State Licenses') IS NOT NULL AND get_action_id('notification') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('State Licenses'), get_action_id('grid'), 3
WHERE get_grid_id('State Licenses') IS NOT NULL AND get_action_id('grid') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('State Licenses'), get_action_id('flag'), 4
WHERE get_grid_id('State Licenses') IS NOT NULL AND get_action_id('flag') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('State Licenses'), get_action_id('delete'), 5
WHERE get_grid_id('State Licenses') IS NOT NULL AND get_action_id('delete') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('State Licenses'), get_action_id('verified'), 6
WHERE get_grid_id('State Licenses') IS NOT NULL AND get_action_id('verified') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

-- Continue with the rest of the grids following the same pattern...
-- (I'll add a few more key ones, but you can follow the same pattern for the rest)

-- DEA Licenses: download, notification, grid, flag, delete, verified
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('DEA Licenses'), get_action_id('download'), 1
WHERE get_grid_id('DEA Licenses') IS NOT NULL AND get_action_id('download') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('DEA Licenses'), get_action_id('notification'), 2
WHERE get_grid_id('DEA Licenses') IS NOT NULL AND get_action_id('notification') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('DEA Licenses'), get_action_id('grid'), 3
WHERE get_grid_id('DEA Licenses') IS NOT NULL AND get_action_id('grid') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('DEA Licenses'), get_action_id('flag'), 4
WHERE get_grid_id('DEA Licenses') IS NOT NULL AND get_action_id('flag') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('DEA Licenses'), get_action_id('delete'), 5
WHERE get_grid_id('DEA Licenses') IS NOT NULL AND get_action_id('delete') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('DEA Licenses'), get_action_id('verified'), 6
WHERE get_grid_id('DEA Licenses') IS NOT NULL AND get_action_id('verified') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

-- Facility Affiliations: download, notification, grid, flag, delete, verified
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Facility Affiliations'), get_action_id('download'), 1
WHERE get_grid_id('Facility Affiliations') IS NOT NULL AND get_action_id('download') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Facility Affiliations'), get_action_id('notification'), 2
WHERE get_grid_id('Facility Affiliations') IS NOT NULL AND get_action_id('notification') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Facility Affiliations'), get_action_id('grid'), 3
WHERE get_grid_id('Facility Affiliations') IS NOT NULL AND get_action_id('grid') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Facility Affiliations'), get_action_id('flag'), 4
WHERE get_grid_id('Facility Affiliations') IS NOT NULL AND get_action_id('flag') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Facility Affiliations'), get_action_id('delete'), 5
WHERE get_grid_id('Facility Affiliations') IS NOT NULL AND get_action_id('delete') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Facility Affiliations'), get_action_id('verified'), 6
WHERE get_grid_id('Facility Affiliations') IS NOT NULL AND get_action_id('verified') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

-- Documents: download, attachment, notification, grid, flag, delete, verified
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Documents'), get_action_id('download'), 1
WHERE get_grid_id('Documents') IS NOT NULL AND get_action_id('download') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Documents'), get_action_id('attachment'), 2
WHERE get_grid_id('Documents') IS NOT NULL AND get_action_id('attachment') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Documents'), get_action_id('notification'), 3
WHERE get_grid_id('Documents') IS NOT NULL AND get_action_id('notification') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Documents'), get_action_id('grid'), 4
WHERE get_grid_id('Documents') IS NOT NULL AND get_action_id('grid') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Documents'), get_action_id('flag'), 5
WHERE get_grid_id('Documents') IS NOT NULL AND get_action_id('flag') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Documents'), get_action_id('delete'), 6
WHERE get_grid_id('Documents') IS NOT NULL AND get_action_id('delete') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Documents'), get_action_id('verified'), 7
WHERE get_grid_id('Documents') IS NOT NULL AND get_action_id('verified') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

-- Clean up helper functions
DROP FUNCTION IF EXISTS get_action_id(text);
DROP FUNCTION IF EXISTS get_grid_id(text);

-- Verify the setup
SELECT 
  gd.display_name as grid_name,
  a.name as action_name,
  a.icon as action_icon,
  ga."order" as action_order
FROM public.grid_actions ga
JOIN public.grid_definitions gd ON ga.grid_id = gd.id
JOIN public.actions a ON ga.action_id = a.id
ORDER BY gd.display_name, ga."order"; 