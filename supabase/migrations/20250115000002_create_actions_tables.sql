-- Create actions table
CREATE TABLE IF NOT EXISTS public.actions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  label text NOT NULL,
  icon text NOT NULL,
  tooltip text NOT NULL,
  description text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT actions_pkey PRIMARY KEY (id),
  CONSTRAINT actions_name_key UNIQUE (name)
);

-- Create index on actions name
CREATE INDEX IF NOT EXISTS idx_actions_name ON public.actions USING btree (name);

-- Create grid_actions table
CREATE TABLE IF NOT EXISTS public.grid_actions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  grid_id uuid NOT NULL,
  action_id uuid NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT grid_actions_pkey PRIMARY KEY (id),
  CONSTRAINT grid_actions_grid_id_fkey FOREIGN KEY (grid_id) REFERENCES grid_definitions (id) ON DELETE CASCADE,
  CONSTRAINT grid_actions_action_id_fkey FOREIGN KEY (action_id) REFERENCES actions (id) ON DELETE CASCADE,
  CONSTRAINT grid_actions_grid_action_unique UNIQUE (grid_id, action_id)
);

-- Create indexes on grid_actions
CREATE INDEX IF NOT EXISTS idx_grid_actions_grid_id ON public.grid_actions USING btree (grid_id);
CREATE INDEX IF NOT EXISTS idx_grid_actions_action_id ON public.grid_actions USING btree (action_id);
CREATE INDEX IF NOT EXISTS idx_grid_actions_order ON public.grid_actions USING btree ("order");

-- Add trigger to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_actions_updated_at BEFORE UPDATE ON actions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grid_actions_updated_at BEFORE UPDATE ON grid_actions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default actions
INSERT INTO public.actions (name, label, icon, tooltip, description) VALUES
  ('download', 'Download', 'faCircleDown', 'Download record data', 'Download this record as CSV or PDF'),
  ('alert', 'Alert', 'faBell', 'Toggle alerts for this record', 'Enable or disable alerts for this record'),
  ('sidebar', 'Sidebar', 'faColumns', 'Toggle sidebar view', 'Show or hide the sidebar for this record'),
  ('flag', 'Flag', 'faFlag', 'Flag this record', 'Mark this record for attention'),
  ('summary', 'Summary', 'faChartBar', 'Include in summary', 'Include this record in summary reports')
ON CONFLICT (name) DO NOTHING;

-- Insert some default grid actions for common grids
-- Note: This will need to be updated once we have actual grid_definition IDs
-- For now, we'll create a placeholder that can be updated later
INSERT INTO public.grid_actions (grid_id, action_id, "order")
SELECT 
  gd.id as grid_id,
  a.id as action_id,
  CASE 
    WHEN a.name = 'download' THEN 1
    WHEN a.name = 'alert' THEN 2
    WHEN a.name = 'sidebar' THEN 3
    WHEN a.name = 'flag' THEN 4
    WHEN a.name = 'summary' THEN 5
    ELSE 6
  END as "order"
FROM public.grid_definitions gd
CROSS JOIN public.actions a
WHERE gd.display_name IN ('Providers', 'State Licenses', 'Birth Info', 'Addresses', 'Facility Affiliations')
ON CONFLICT (grid_id, action_id) DO NOTHING; 