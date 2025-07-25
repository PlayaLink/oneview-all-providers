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

-- Insert grid actions for existing grids with conflict handling

-- Addresses: download, flag, deactivate, side_panel, view_details
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Addresses'), get_action_id('activate'), 1
WHERE get_grid_id('Addresses') IS NOT NULL AND get_action_id('activate') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Addresses'), get_action_id('verifications'), 2
WHERE get_grid_id('Addresses') IS NOT NULL AND get_action_id('verifications') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Addresses'), get_action_id('deactivate'), 3
WHERE get_grid_id('Addresses') IS NOT NULL AND get_action_id('deactivate') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Addresses'), get_action_id('side_panel'), 4
WHERE get_grid_id('Addresses') IS NOT NULL AND get_action_id('side_panel') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Addresses'), get_action_id('view_details'), 5
WHERE get_grid_id('Addresses') IS NOT NULL AND get_action_id('view_details') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

-- Birth Info: download, side_panel, view_details
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Birth Info'), get_action_id('activate'), 1
WHERE get_grid_id('Birth Info') IS NOT NULL AND get_action_id('activate') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Birth Info'), get_action_id('side_panel'), 2
WHERE get_grid_id('Birth Info') IS NOT NULL AND get_action_id('side_panel') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Birth Info'), get_action_id('view_details'), 3
WHERE get_grid_id('Birth Info') IS NOT NULL AND get_action_id('view_details') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

-- Facility Affiliations: download, alert, flag, deactivate, verifications, side_panel, view_details
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Facility Affiliations'), get_action_id('activate'), 1
WHERE get_grid_id('Facility Affiliations') IS NOT NULL AND get_action_id('activate') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Facility Affiliations'), get_action_id('alert'), 2
WHERE get_grid_id('Facility Affiliations') IS NOT NULL AND get_action_id('alert') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Facility Affiliations'), get_action_id('verifications'), 3
WHERE get_grid_id('Facility Affiliations') IS NOT NULL AND get_action_id('verifications') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Facility Affiliations'), get_action_id('deactivate'), 4
WHERE get_grid_id('Facility Affiliations') IS NOT NULL AND get_action_id('deactivate') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Facility Affiliations'), get_action_id('verifications'), 5
WHERE get_grid_id('Facility Affiliations') IS NOT NULL AND get_action_id('verifications') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Facility Affiliations'), get_action_id('side_panel'), 6
WHERE get_grid_id('Facility Affiliations') IS NOT NULL AND get_action_id('side_panel') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Facility Affiliations'), get_action_id('view_details'), 7
WHERE get_grid_id('Facility Affiliations') IS NOT NULL AND get_action_id('view_details') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

-- Provider Info: download, flag, side_panel, view_details
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Provider Info'), get_action_id('activate'), 1
WHERE get_grid_id('Provider Info') IS NOT NULL AND get_action_id('activate') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Provider Info'), get_action_id('verifications'), 2
WHERE get_grid_id('Provider Info') IS NOT NULL AND get_action_id('verifications') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Provider Info'), get_action_id('side_panel'), 3
WHERE get_grid_id('Provider Info') IS NOT NULL AND get_action_id('side_panel') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('Provider Info'), get_action_id('view_details'), 4
WHERE get_grid_id('Provider Info') IS NOT NULL AND get_action_id('view_details') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

-- State Licenses: download, alert, flag, deactivate, verifications, side_panel, view_details
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('State Licenses'), get_action_id('activate'), 1
WHERE get_grid_id('State Licenses') IS NOT NULL AND get_action_id('activate') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('State Licenses'), get_action_id('alert'), 2
WHERE get_grid_id('State Licenses') IS NOT NULL AND get_action_id('alert') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('State Licenses'), get_action_id('verifications'), 3
WHERE get_grid_id('State Licenses') IS NOT NULL AND get_action_id('verifications') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('State Licenses'), get_action_id('deactivate'), 4
WHERE get_grid_id('State Licenses') IS NOT NULL AND get_action_id('deactivate') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('State Licenses'), get_action_id('verifications'), 5
WHERE get_grid_id('State Licenses') IS NOT NULL AND get_action_id('verifications') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('State Licenses'), get_action_id('side_panel'), 6
WHERE get_grid_id('State Licenses') IS NOT NULL AND get_action_id('side_panel') IS NOT NULL
ON CONFLICT (grid_id, action_id) DO UPDATE SET "order" = EXCLUDED."order";

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('State Licenses'), get_action_id('view_details'), 7
WHERE get_grid_id('State Licenses') IS NOT NULL AND get_action_id('view_details') IS NOT NULL
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