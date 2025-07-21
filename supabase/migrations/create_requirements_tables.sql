-- Create enum for requirement types
CREATE TYPE requirement_type AS ENUM (
  'facility',
  'board'
);

-- Create enum for data types
CREATE TYPE requirement_data_type AS ENUM (
  'text',
  'number',
  'boolean',
  'date',
  'email',
  'url',
  'phone',
  'single-select',
  'multi-select',
  'file',
  'oneview_record'
);

-- Create requirement_data table first (referenced by requirements table)
CREATE TABLE requirement_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT,
  data_type requirement_data_type NOT NULL DEFAULT 'text',
  key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create requirements table
CREATE TABLE requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type requirement_type NOT NULL,
  key TEXT NOT NULL,
  "group" TEXT NOT NULL,
  label TEXT NOT NULL,
  note TEXT,
  data UUID[] DEFAULT '{}', -- Array of requirement_data IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_requirement_data_key ON requirement_data(key);
CREATE INDEX idx_requirement_data_type ON requirement_data(data_type);
CREATE INDEX idx_requirements_type ON requirements(type);
CREATE INDEX idx_requirements_key ON requirements(key);
CREATE INDEX idx_requirements_group ON requirements("group");

-- Add unique constraints
ALTER TABLE requirement_data ADD CONSTRAINT unique_requirement_data_key UNIQUE (key);
ALTER TABLE requirements ADD CONSTRAINT unique_requirement_key UNIQUE (key);

-- Add comments for documentation
COMMENT ON TABLE requirements IS 'Stores requirement definitions with their associated data references';
COMMENT ON TABLE requirement_data IS 'Stores individual data items that can be referenced by requirements';
COMMENT ON COLUMN requirements.data IS 'Array of UUIDs referencing requirement_data table';
COMMENT ON COLUMN requirements.type IS 'Type of requirement (facility, board)';
COMMENT ON COLUMN requirements."group" IS 'Logical grouping for requirements';
COMMENT ON COLUMN requirement_data.data_type IS 'Data type for validation and display purposes';

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_requirement_data_updated_at 
  BEFORE UPDATE ON requirement_data 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requirements_updated_at 
  BEFORE UPDATE ON requirements 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view to join requirements with their data
CREATE VIEW requirements_with_data AS
SELECT 
  r.id,
  r.type,
  r.key,
  r."group",
  r.label,
  r.note,
  r.data,
  r.created_at,
  r.updated_at,
  -- Aggregate requirement data as JSON
  COALESCE(
    (SELECT json_agg(
      json_build_object(
        'id', rd.id,
        'label', rd.label,
        'value', rd.value,
        'data_type', rd.data_type,
        'key', rd.key
      )
    ) FROM requirement_data rd WHERE rd.id = ANY(r.data)),
    '[]'::json
  ) as requirement_data_items
FROM requirements r;

-- Grant permissions (adjust as needed for your setup)
GRANT ALL ON TABLE requirements TO authenticated;
GRANT ALL ON TABLE requirement_data TO authenticated;
GRANT ALL ON VIEW requirements_with_data TO authenticated; 