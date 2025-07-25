-- Add the missing "flag" action to the actions table
INSERT INTO public.actions (name, label, icon, tooltip, description)
VALUES (
  'flag',
  'Flag',
  'flag',
  'Flag',
  'Flag Record'
) ON CONFLICT (name) DO UPDATE SET
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  tooltip = EXCLUDED.tooltip,
  description = EXCLUDED.description;

-- Verify the action was added
SELECT * FROM public.actions WHERE name = 'flag'; 