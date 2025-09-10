-- Create dea_licenses_with_provider view
-- This view joins dea_licenses with providers to include provider information
CREATE OR REPLACE VIEW dea_licenses_with_provider AS
SELECT 
    d.*,
    p.provider_name,
    p.title,
    p.primary_specialty
FROM dea_licenses d
LEFT JOIN providers_with_full_name p ON d.provider_id = p.id;

-- Update grid_definitions to use the new view
UPDATE grid_definitions 
SET table_name = 'dea_licenses_with_provider' 
WHERE key = 'dea_licenses';

-- Verify the update
SELECT key, table_name, display_name FROM grid_definitions WHERE key = 'dea_licenses';
