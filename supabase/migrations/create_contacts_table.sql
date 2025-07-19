-- Create contacts table for facility contact information
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'general',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  job_title TEXT,
  department TEXT,
  restrictions TEXT,
  preferred_contact_method TEXT DEFAULT 'email',
  email TEXT,
  phone TEXT,
  fax TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_contacts_department ON contacts(department);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_facility_id ON contacts(facility_id);
CREATE INDEX idx_contacts_last_name ON contacts(last_name);
CREATE INDEX idx_contacts_type ON contacts(type);
CREATE INDEX idx_contacts_first_name ON contacts(first_name);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contacts_updated_at 
  BEFORE UPDATE ON contacts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE contacts IS 'Stores contact information for facilities';
COMMENT ON COLUMN contacts.facility_id IS 'Reference to the facility';
COMMENT ON COLUMN contacts.type IS 'Type of contact (general, credentialing, billing, emergency, administrative, clinical, technical)';
COMMENT ON COLUMN contacts.first_name IS 'Contact first name';
COMMENT ON COLUMN contacts.last_name IS 'Contact last name';
COMMENT ON COLUMN contacts.job_title IS 'Job title or position';
COMMENT ON COLUMN contacts.department IS 'Department or division';
COMMENT ON COLUMN contacts.restrictions IS 'Any restrictions or special requirements';
COMMENT ON COLUMN contacts.preferred_contact_method IS 'Preferred method of contact (email, phone, fax)';
COMMENT ON COLUMN contacts.email IS 'Email address';
COMMENT ON COLUMN contacts.phone IS 'Phone number';
COMMENT ON COLUMN contacts.fax IS 'Fax number';
COMMENT ON COLUMN contacts.notes IS 'Additional notes or comments';

-- Grant permissions
GRANT ALL ON TABLE contacts TO authenticated; 