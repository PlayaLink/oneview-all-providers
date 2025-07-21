-- Create facility_properties table first (referenced by facilities table)
CREATE TABLE facility_properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  "group" TEXT NOT NULL,
  value TEXT,
  type TEXT NOT NULL DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create facilities table
CREATE TABLE facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT,
  facility_properties UUID[] DEFAULT '{}', -- Array of facility_properties IDs
  requirements UUID[] DEFAULT '{}', -- Array of requirements IDs
  providers UUID[] DEFAULT '{}', -- Array of providers IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_facility_properties_key ON facility_properties(key);
CREATE INDEX idx_facility_properties_group ON facility_properties("group");
CREATE INDEX idx_facility_properties_type ON facility_properties(type);
CREATE INDEX idx_facilities_label ON facilities(label);
CREATE INDEX idx_facilities_facility_properties ON facilities USING GIN (facility_properties);
CREATE INDEX idx_facilities_requirements ON facilities USING GIN (requirements);
CREATE INDEX idx_facilities_providers ON facilities USING GIN (providers);

-- Add comments for documentation
COMMENT ON TABLE facilities IS 'Stores facility information with references to properties, requirements, and providers';
COMMENT ON TABLE facility_properties IS 'Stores individual property definitions for facilities';
COMMENT ON COLUMN facilities.facility_properties IS 'Array of UUIDs referencing facility_properties table';
COMMENT ON COLUMN facilities.requirements IS 'Array of UUIDs referencing requirements table';
COMMENT ON COLUMN facilities.providers IS 'Array of UUIDs referencing providers table';
COMMENT ON COLUMN facility_properties."group" IS 'Logical grouping for facility properties';
COMMENT ON COLUMN facility_properties.type IS 'Data type for the property value (text, number, boolean, date, etc.)';

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_facility_properties_updated_at 
  BEFORE UPDATE ON facility_properties 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facilities_updated_at 
  BEFORE UPDATE ON facilities 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views to join facilities with their related data
CREATE VIEW facilities_with_properties AS
SELECT 
  f.id,
  f.label,
  f.icon,
  f.facility_properties,
  f.requirements,
  f.providers,
  f.created_at,
  f.updated_at,
  -- Aggregate facility properties as JSON
  COALESCE(
    (SELECT json_agg(
      json_build_object(
        'id', fp.id,
        'key', fp.key,
        'label', fp.label,
        'group', fp."group",
        'value', fp.value,
        'type', fp.type
      )
    ) FROM facility_properties fp WHERE fp.id = ANY(f.facility_properties)),
    '[]'::json
  ) as facility_property_details
FROM facilities f;

CREATE VIEW facilities_with_all_data AS
SELECT 
  f.id,
  f.label,
  f.icon,
  f.facility_properties,
  f.requirements,
  f.providers,
  f.created_at,
  f.updated_at,
  -- Aggregate facility properties as JSON
  COALESCE(
    (SELECT json_agg(
      json_build_object(
        'id', fp.id,
        'key', fp.key,
        'label', fp.label,
        'group', fp."group",
        'value', fp.value,
        'type', fp.type
      )
    ) FROM facility_properties fp WHERE fp.id = ANY(f.facility_properties)),
    '[]'::json
  ) as facility_property_details,
  -- Aggregate requirements as JSON
  COALESCE(
    (SELECT json_agg(
      json_build_object(
        'id', r.id,
        'type', r.type,
        'key', r.key,
        'group', r."group",
        'label', r.label,
        'note', r.note,
        'visible', r.visible
      )
    ) FROM requirements r WHERE r.id = ANY(f.requirements)),
    '[]'::json
  ) as requirement_details,
  -- Aggregate providers as JSON
  COALESCE(
    (SELECT json_agg(
      json_build_object(
        'id', p.id,
        'first_name', p.first_name,
        'last_name', p.last_name,
        'npi_number', p.npi_number,
        'title', p.title,
        'primary_specialty', p.primary_specialty
      )
    ) FROM providers p WHERE p.id = ANY(f.providers)),
    '[]'::json
  ) as provider_details
FROM facilities f;

-- Grant permissions (adjust as needed for your setup)
GRANT ALL ON TABLE facilities TO authenticated;
GRANT ALL ON TABLE facility_properties TO authenticated;
GRANT ALL ON VIEW facilities_with_properties TO authenticated;
GRANT ALL ON VIEW facilities_with_all_data TO authenticated; 