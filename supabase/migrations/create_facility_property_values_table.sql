-- Create facility_property_values table to store actual values for each facility
CREATE TABLE facility_property_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  facility_property_id UUID NOT NULL REFERENCES facility_properties(id) ON DELETE CASCADE,
  value JSONB, -- Use JSONB to store different data types (string, number, boolean, array, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(facility_id, facility_property_id)
);

-- Add indexes for better performance
CREATE INDEX idx_facility_property_values_facility_id ON facility_property_values(facility_id);
CREATE INDEX idx_facility_property_values_property_id ON facility_property_values(facility_property_id);
CREATE INDEX idx_facility_property_values_value ON facility_property_values USING GIN (value);

-- Add updated_at trigger
CREATE TRIGGER update_facility_property_values_updated_at 
  BEFORE UPDATE ON facility_property_values 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE facility_property_values IS 'Stores the actual values for each facility''s properties';
COMMENT ON COLUMN facility_property_values.facility_id IS 'Reference to the facility';
COMMENT ON COLUMN facility_property_values.facility_property_id IS 'Reference to the property definition';
COMMENT ON COLUMN facility_property_values.value IS 'The actual value for this facility''s property (JSONB to support different data types)';

-- Grant permissions
GRANT ALL ON TABLE facility_property_values TO authenticated; 