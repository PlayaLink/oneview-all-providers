-- Create facility_requirement_values table for facility requirement compliance data
CREATE TABLE facility_requirement_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  requirement_id UUID REFERENCES requirements(id) ON DELETE CASCADE,
  requirement_data_id UUID REFERENCES requirement_data(id) ON DELETE CASCADE,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(facility_id, requirement_id, requirement_data_id)
);

-- Add indexes for better performance
CREATE INDEX idx_facility_requirement_values_facility_id ON facility_requirement_values(facility_id);
CREATE INDEX idx_facility_requirement_values_requirement_id ON facility_requirement_values(requirement_id);
CREATE INDEX idx_facility_requirement_values_requirement_data_id ON facility_requirement_values(requirement_data_id);
CREATE INDEX idx_facility_requirement_values_value ON facility_requirement_values USING GIN (value);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_facility_requirement_values_updated_at 
  BEFORE UPDATE ON facility_requirement_values 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE facility_requirement_values IS 'Stores facility-specific values for requirement compliance';
COMMENT ON COLUMN facility_requirement_values.facility_id IS 'Reference to the facility';
COMMENT ON COLUMN facility_requirement_values.requirement_id IS 'Reference to the requirement';
COMMENT ON COLUMN facility_requirement_values.requirement_data_id IS 'Reference to the requirement data item';
COMMENT ON COLUMN facility_requirement_values.value IS 'The actual value for this facility''s requirement (JSONB to support different data types)';

-- Grant permissions
GRANT ALL ON TABLE facility_requirement_values TO authenticated; 