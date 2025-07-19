-- Create facility_affiliations table for provider-facility relationships
CREATE TABLE facility_affiliations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  staff_category TEXT,
  in_good_standing BOOLEAN,
  currently_affiliated BOOLEAN,
  appt_end_date DATE,
  start_date DATE,
  end_date DATE,
  reason_for_leaving TEXT,
  accepting_new_patients BOOLEAN,
  telemedicine BOOLEAN,
  takes_calls BOOLEAN,
  admitting_privileges BOOLEAN,
  primary_affiliation BOOLEAN,
  tags TEXT[],
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_facility_affiliations_facility_id ON facility_affiliations(facility_id);
CREATE INDEX idx_facility_affiliations_provider_facility ON facility_affiliations(provider_id, facility_id);
CREATE INDEX idx_facility_affiliations_provider_id ON facility_affiliations(provider_id);
CREATE INDEX idx_facility_affiliations_staff_category ON facility_affiliations(staff_category);
CREATE INDEX idx_facility_affiliations_currently_affiliated ON facility_affiliations(currently_affiliated);
CREATE INDEX idx_facility_affiliations_primary_affiliation ON facility_affiliations(primary_affiliation);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_facility_affiliations_updated_at 
  BEFORE UPDATE ON facility_affiliations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE facility_affiliations IS 'Stores provider-facility affiliation relationships';
COMMENT ON COLUMN facility_affiliations.provider_id IS 'Reference to the provider';
COMMENT ON COLUMN facility_affiliations.facility_id IS 'Reference to the facility';
COMMENT ON COLUMN facility_affiliations.staff_category IS 'Category of staff (e.g., attending, resident, consultant)';
COMMENT ON COLUMN facility_affiliations.in_good_standing IS 'Whether provider is in good standing at this facility';
COMMENT ON COLUMN facility_affiliations.currently_affiliated IS 'Whether currently affiliated with this facility';
COMMENT ON COLUMN facility_affiliations.appt_end_date IS 'Appointment end date';
COMMENT ON COLUMN facility_affiliations.start_date IS 'Affiliation start date';
COMMENT ON COLUMN facility_affiliations.end_date IS 'Affiliation end date';
COMMENT ON COLUMN facility_affiliations.reason_for_leaving IS 'Reason for leaving the facility';
COMMENT ON COLUMN facility_affiliations.accepting_new_patients IS 'Whether accepting new patients';
COMMENT ON COLUMN facility_affiliations.telemedicine IS 'Whether providing telemedicine services';
COMMENT ON COLUMN facility_affiliations.takes_calls IS 'Whether taking call duty';
COMMENT ON COLUMN facility_affiliations.admitting_privileges IS 'Whether has admitting privileges';
COMMENT ON COLUMN facility_affiliations.primary_affiliation IS 'Whether this is the primary facility affiliation';
COMMENT ON COLUMN facility_affiliations.tags IS 'Array of tags for categorization';

-- Grant permissions
GRANT ALL ON TABLE facility_affiliations TO authenticated; 