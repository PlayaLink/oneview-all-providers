-- Add the missing "download" action to the actions table
INSERT INTO public.actions (name, label, icon, tooltip, description)
VALUES (
  'download',
  'Download',
  'circle-down',
  'Download',
  'Download Record'
) ON CONFLICT (name) DO UPDATE SET
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  tooltip = EXCLUDED.tooltip,
  description = EXCLUDED.description;

-- Verify the action was added
SELECT * FROM public.actions WHERE name = 'download'; 