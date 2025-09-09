-- Create dea_licenses table
CREATE TABLE IF NOT EXISTS dea_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    state TEXT,
    license_number TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    status TEXT,
    payment_indicator TEXT,
    issue_date DATE,
    expiration_date DATE,
    dont_renew TEXT,
    dont_transfer TEXT,
    primary_license TEXT,
    approved_erx TEXT,
    dea_schedules TEXT,
    address TEXT,
    address2 TEXT,
    city TEXT,
    address_state TEXT,
    zip_code TEXT,
    tags TEXT[] DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on provider_id for performance
CREATE INDEX IF NOT EXISTS idx_dea_licenses_provider_id ON dea_licenses(provider_id);

-- Create index on license_number for search performance
CREATE INDEX IF NOT EXISTS idx_dea_licenses_license_number ON dea_licenses(license_number);

-- Create index on state for filtering
CREATE INDEX IF NOT EXISTS idx_dea_licenses_state ON dea_licenses(state);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_dea_licenses_status ON dea_licenses(status);

-- Create index on expiration_date for expiring licenses
CREATE INDEX IF NOT EXISTS idx_dea_licenses_expiration_date ON dea_licenses(expiration_date);

-- Enable RLS
ALTER TABLE dea_licenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view dea_licenses" ON dea_licenses
    FOR SELECT USING (true);

CREATE POLICY "Users can insert dea_licenses" ON dea_licenses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update dea_licenses" ON dea_licenses
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete dea_licenses" ON dea_licenses
    FOR DELETE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_dea_licenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_dea_licenses_updated_at
    BEFORE UPDATE ON dea_licenses
    FOR EACH ROW
    EXECUTE FUNCTION update_dea_licenses_updated_at();

