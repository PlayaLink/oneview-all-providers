-- Create state_controlled_substance_licenses table
CREATE TABLE IF NOT EXISTS state_controlled_substance_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    license_type TEXT,
    license_number TEXT,
    state TEXT,
    status TEXT,
    issue_date DATE,
    expiration_date DATE,
    expires_within TEXT,
    dont_renew TEXT,
    is_primary TEXT,
    first_name TEXT,
    last_name TEXT,
    tags TEXT[] DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_state_controlled_substance_licenses_provider_id 
ON state_controlled_substance_licenses(provider_id);

CREATE INDEX IF NOT EXISTS idx_state_controlled_substance_licenses_state 
ON state_controlled_substance_licenses(state);

CREATE INDEX IF NOT EXISTS idx_state_controlled_substance_licenses_status 
ON state_controlled_substance_licenses(status);

CREATE INDEX IF NOT EXISTS idx_state_controlled_substance_licenses_expiration_date 
ON state_controlled_substance_licenses(expiration_date);

-- Disable RLS for easier development/testing
ALTER TABLE state_controlled_substance_licenses DISABLE ROW LEVEL SECURITY;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_state_controlled_substance_licenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_state_controlled_substance_licenses_updated_at
    BEFORE UPDATE ON state_controlled_substance_licenses
    FOR EACH ROW
    EXECUTE FUNCTION update_state_controlled_substance_licenses_updated_at();

-- Debugging queries
-- Check table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'state_controlled_substance_licenses' 
ORDER BY ordinal_position;

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'state_controlled_substance_licenses';

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'state_controlled_substance_licenses';

-- Test insert with sample data
INSERT INTO state_controlled_substance_licenses (
    provider_id, 
    license_type, 
    license_number, 
    state, 
    status, 
    issue_date, 
    expiration_date, 
    expires_within,
    dont_renew,
    is_primary,
    first_name,
    last_name,
    tags
) VALUES (
    (SELECT id FROM providers LIMIT 1),
    'MD',
    'TEST123456',
    'IL',
    'Active',
    '2023-01-01',
    '2025-12-31',
    '365 days',
    'Renew (No)',
    'Yes',
    'Test',
    'Provider',
    ARRAY['Test Tag']
);

-- Verify insert worked
SELECT COUNT(*) as total_records FROM state_controlled_substance_licenses;

-- Check for orphaned records (should be 0)
SELECT COUNT(*) as orphaned_records 
FROM state_controlled_substance_licenses s 
LEFT JOIN providers p ON s.provider_id = p.id 
WHERE p.id IS NULL;

-- Clean up test data
DELETE FROM state_controlled_substance_licenses WHERE license_number = 'TEST123456';
