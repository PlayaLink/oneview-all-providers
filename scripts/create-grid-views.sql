-- Create views for grid tables that include provider information
-- This allows the existing column definitions to work without modification

-- 1. Create addresses_with_provider view
CREATE OR REPLACE VIEW addresses_with_provider AS
SELECT 
    a.*,
    p.provider_name,
    p.title,
    p.primary_specialty
FROM addresses a
LEFT JOIN providers_with_full_name p ON a.provider_id = p.id;

-- 2. Create birth_info_with_provider view
CREATE OR REPLACE VIEW birth_info_with_provider AS
SELECT 
    b.*,
    p.provider_name,
    p.title,
    p.primary_specialty
FROM birth_info b
LEFT JOIN providers_with_full_name p ON b.provider_id = p.id;

-- 3. Create state_licenses_with_provider view
CREATE OR REPLACE VIEW state_licenses_with_provider AS
SELECT 
    s.*,
    p.provider_name,
    p.title,
    p.primary_specialty
FROM state_licenses s
LEFT JOIN providers_with_full_name p ON s.provider_id = p.id;

-- 4. Create facility_affiliations_with_provider view
CREATE OR REPLACE VIEW facility_affiliations_with_provider AS
SELECT 
    f.*,
    p.provider_name,
    p.title,
    p.primary_specialty
FROM facility_affiliations f
LEFT JOIN providers_with_full_name p ON f.provider_id = p.id;

-- 5. Update grid_definitions to use the new views
UPDATE grid_definitions 
SET table_name = 'addresses_with_provider' 
WHERE key = 'addresses';

UPDATE grid_definitions 
SET table_name = 'birth_info_with_provider' 
WHERE key = 'birth_info';

UPDATE grid_definitions 
SET table_name = 'state_licenses_with_provider' 
WHERE key = 'state_licenses';

UPDATE grid_definitions 
SET table_name = 'facility_affiliations_with_provider' 
WHERE key = 'facility_affiliations';

-- 6. Verify the updates
SELECT key, table_name, display_name FROM grid_definitions WHERE key IN ('addresses', 'birth_info', 'state_licenses', 'facility_affiliations'); 