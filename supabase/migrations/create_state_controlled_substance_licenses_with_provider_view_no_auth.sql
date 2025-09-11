-- Create state_controlled_substance_licenses_with_provider view
CREATE OR REPLACE VIEW state_controlled_substance_licenses_with_provider AS
SELECT 
    s.*,
    p.provider_name,
    p.title,
    p.primary_specialty
FROM state_controlled_substance_licenses s
LEFT JOIN providers_with_full_name p ON s.provider_id = p.id;

-- Grant permissions on the view (no authentication required)
GRANT SELECT ON state_controlled_substance_licenses_with_provider TO public;

-- Update grid_definitions to use the new view
UPDATE grid_definitions 
SET table_name = 'state_controlled_substance_licenses_with_provider'
WHERE display_name = 'State Controlled Substance Licenses';

-- If the grid doesn't exist yet, insert it
INSERT INTO grid_definitions (
    key,
    display_name, 
    table_name, 
    "group", 
    icon, 
    "order"
) 
SELECT 
    'state-controlled-substance-licenses',
    'State Controlled Substance Licenses',
    'state_controlled_substance_licenses_with_provider',
    'Licenses',
    'faPrescription',
    3
WHERE NOT EXISTS (
    SELECT 1 FROM grid_definitions 
    WHERE display_name = 'State Controlled Substance Licenses'
);

-- Verification queries
-- Check if the view was created successfully
SELECT 
    schemaname,
    viewname,
    definition
FROM pg_views 
WHERE viewname = 'state_controlled_substance_licenses_with_provider';

-- Check if grid_definitions was updated correctly
SELECT 
    display_name,
    table_name,
    "group",
    icon,
    "order"
FROM grid_definitions 
WHERE display_name = 'State Controlled Substance Licenses';

-- Test the view with sample data
SELECT 
    COUNT(*) as total_records,
    COUNT(provider_name) as records_with_provider_name,
    COUNT(title) as records_with_title,
    COUNT(primary_specialty) as records_with_primary_specialty
FROM state_controlled_substance_licenses_with_provider;

-- Check for any records without provider data
SELECT 
    COUNT(*) as records_without_provider_data
FROM state_controlled_substance_licenses_with_provider 
WHERE provider_name IS NULL;
