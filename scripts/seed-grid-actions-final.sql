-- Clean and seed grid_actions table with exact JSON configuration

-- First, drop all existing grid_actions records
DELETE FROM public.grid_actions;

-- Helper function to get action ID by name
CREATE OR REPLACE FUNCTION get_action_id(action_name text)
RETURNS uuid AS $$
BEGIN
  RETURN (SELECT id FROM public.actions WHERE name = action_name);
END;
$$ LANGUAGE plpgsql;

-- Helper function to get grid ID by table name/key
CREATE OR REPLACE FUNCTION get_grid_id(grid_key text)
RETURNS uuid AS $$
BEGIN
  RETURN (SELECT id FROM public.grid_definitions WHERE key = grid_key);
END;
$$ LANGUAGE plpgsql;

-- provider_info: ["download", "flag", "side_panel", "view_details"]
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('provider_info'), get_action_id('download'), 1
WHERE get_grid_id('provider_info') IS NOT NULL AND get_action_id('download') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('provider_info'), get_action_id('flag'), 2
WHERE get_grid_id('provider_info') IS NOT NULL AND get_action_id('flag') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('provider_info'), get_action_id('side_panel'), 3
WHERE get_grid_id('provider_info') IS NOT NULL AND get_action_id('side_panel') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('provider_info'), get_action_id('view_details'), 4
WHERE get_grid_id('provider_info') IS NOT NULL AND get_action_id('view_details') IS NOT NULL;

-- birth_info: ["download", "side_panel", "view_details"]
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('birth_info'), get_action_id('download'), 1
WHERE get_grid_id('birth_info') IS NOT NULL AND get_action_id('download') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('birth_info'), get_action_id('side_panel'), 2
WHERE get_grid_id('birth_info') IS NOT NULL AND get_action_id('side_panel') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('birth_info'), get_action_id('view_details'), 3
WHERE get_grid_id('birth_info') IS NOT NULL AND get_action_id('view_details') IS NOT NULL;

-- addresses: ["download", "flag", "deactivate", "side_panel", "view_details"]
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('addresses'), get_action_id('download'), 1
WHERE get_grid_id('addresses') IS NOT NULL AND get_action_id('download') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('addresses'), get_action_id('flag'), 2
WHERE get_grid_id('addresses') IS NOT NULL AND get_action_id('flag') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('addresses'), get_action_id('deactivate'), 3
WHERE get_grid_id('addresses') IS NOT NULL AND get_action_id('deactivate') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('addresses'), get_action_id('side_panel'), 4
WHERE get_grid_id('addresses') IS NOT NULL AND get_action_id('side_panel') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('addresses'), get_action_id('view_details'), 5
WHERE get_grid_id('addresses') IS NOT NULL AND get_action_id('view_details') IS NOT NULL;

-- state_licenses: ["download", "alert", "flag", "deactivate", "verifications", "side_panel", "view_details"]
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('state_licenses'), get_action_id('download'), 1
WHERE get_grid_id('state_licenses') IS NOT NULL AND get_action_id('download') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('state_licenses'), get_action_id('alert'), 2
WHERE get_grid_id('state_licenses') IS NOT NULL AND get_action_id('alert') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('state_licenses'), get_action_id('flag'), 3
WHERE get_grid_id('state_licenses') IS NOT NULL AND get_action_id('flag') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('state_licenses'), get_action_id('deactivate'), 4
WHERE get_grid_id('state_licenses') IS NOT NULL AND get_action_id('deactivate') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('state_licenses'), get_action_id('verifications'), 5
WHERE get_grid_id('state_licenses') IS NOT NULL AND get_action_id('verifications') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('state_licenses'), get_action_id('side_panel'), 6
WHERE get_grid_id('state_licenses') IS NOT NULL AND get_action_id('side_panel') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('state_licenses'), get_action_id('view_details'), 7
WHERE get_grid_id('state_licenses') IS NOT NULL AND get_action_id('view_details') IS NOT NULL;

-- facility_affiliations: ["download", "alert", "flag", "deactivate", "verifications", "side_panel", "view_details"]
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('facility_affiliations'), get_action_id('download'), 1
WHERE get_grid_id('facility_affiliations') IS NOT NULL AND get_action_id('download') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('facility_affiliations'), get_action_id('alert'), 2
WHERE get_grid_id('facility_affiliations') IS NOT NULL AND get_action_id('alert') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('facility_affiliations'), get_action_id('flag'), 3
WHERE get_grid_id('facility_affiliations') IS NOT NULL AND get_action_id('flag') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('facility_affiliations'), get_action_id('deactivate'), 4
WHERE get_grid_id('facility_affiliations') IS NOT NULL AND get_action_id('deactivate') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('facility_affiliations'), get_action_id('verifications'), 5
WHERE get_grid_id('facility_affiliations') IS NOT NULL AND get_action_id('verifications') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('facility_affiliations'), get_action_id('side_panel'), 6
WHERE get_grid_id('facility_affiliations') IS NOT NULL AND get_action_id('side_panel') IS NOT NULL;

INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT get_grid_id('facility_affiliations'), get_action_id('view_details'), 7
WHERE get_grid_id('facility_affiliations') IS NOT NULL AND get_action_id('view_details') IS NOT NULL;

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