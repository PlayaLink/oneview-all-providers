-- Create state_licenses table for provider state licensing information
CREATE TABLE state_licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  license_type TEXT,
  license TEXT,
  license_additional_info TEXT,
  state TEXT,
  status TEXT,
  issue_date DATE,
  expiration_date DATE,
  expires_within TEXT,
  dont_renew BOOLEAN,
  is_primary BOOLEAN,
  is_multistate BOOLEAN,
  taxonomy_code TEXT,
  enrolled_in_pdmp BOOLEAN,
  fee_exemption TEXT,
  tags TEXT[],
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_state_licenses_provider_id ON state_licenses(provider_id);
CREATE INDEX idx_state_licenses_state ON state_licenses(state);
CREATE INDEX idx_state_licenses_status ON state_licenses(status);
CREATE INDEX idx_state_licenses_license_type ON state_licenses(license_type);
CREATE INDEX idx_state_licenses_expiration_date ON state_licenses(expiration_date);
CREATE INDEX idx_state_licenses_is_primary ON state_licenses(is_primary);

-- Add comments for documentation
COMMENT ON TABLE state_licenses IS 'Stores state licensing information for healthcare providers';
COMMENT ON COLUMN state_licenses.provider_id IS 'Reference to the provider';
COMMENT ON COLUMN state_licenses.license_type IS 'Type of license (e.g., MD, RN, NP)';
COMMENT ON COLUMN state_licenses.license IS 'License number';
COMMENT ON COLUMN state_licenses.license_additional_info IS 'Additional license information';
COMMENT ON COLUMN state_licenses.state IS 'State where license is issued';
COMMENT ON COLUMN state_licenses.status IS 'License status (active, inactive, suspended, etc.)';
COMMENT ON COLUMN state_licenses.issue_date IS 'Date license was issued';
COMMENT ON COLUMN state_licenses.expiration_date IS 'Date license expires';
COMMENT ON COLUMN state_licenses.expires_within IS 'Time until expiration (e.g., "30 days")';
COMMENT ON COLUMN state_licenses.dont_renew IS 'Flag indicating license should not be renewed';
COMMENT ON COLUMN state_licenses.is_primary IS 'Whether this is the primary license';
COMMENT ON COLUMN state_licenses.is_multistate IS 'Whether this is a multistate license';
COMMENT ON COLUMN state_licenses.taxonomy_code IS 'NPI taxonomy code';
COMMENT ON COLUMN state_licenses.enrolled_in_pdmp IS 'Whether enrolled in Prescription Drug Monitoring Program';
COMMENT ON COLUMN state_licenses.fee_exemption IS 'Fee exemption information';
COMMENT ON COLUMN state_licenses.tags IS 'Array of tags for categorization';

-- Grant permissions
GRANT ALL ON TABLE state_licenses TO authenticated; 