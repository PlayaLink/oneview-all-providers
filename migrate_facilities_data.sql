-- =====================================================
-- FACILITIES DATA MIGRATION SCRIPT
-- =====================================================
-- This script migrates data from the current array-based structure
-- to the new normalized junction table structure

-- =====================================================
-- STEP 1: BACKUP EXISTING DATA
-- =====================================================

-- Create backup tables
CREATE TABLE IF NOT EXISTS facilities_backup AS SELECT * FROM facilities;
CREATE TABLE IF NOT EXISTS facility_properties_backup AS SELECT * FROM facility_properties;

-- =====================================================
-- STEP 2: MIGRATE FACILITY PROPERTIES
-- =====================================================

-- Insert facility properties (these are templates/definitions)
INSERT INTO facility_properties (key, label, "group", description, data_type, default_value, is_required, validation_rules)
SELECT 
  key,
  label,
  "group",
  'Migrated from existing facility_properties' as description,
  COALESCE(type, 'text') as data_type,
  value as default_value,
  false as is_required, -- Set default, can be updated later
  '{}'::jsonb as validation_rules
FROM facility_properties_backup
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- STEP 3: MIGRATE FACILITIES (Core Data)
-- =====================================================

-- Insert facilities with basic information
INSERT INTO facilities (name, display_name, facility_type, status, created_at, updated_at)
SELECT 
  label as name,
  label as display_name,
  'hospital' as facility_type, -- Default type, can be updated later
  'active' as status,
  created_at,
  updated_at
FROM facilities_backup
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STEP 4: MIGRATE FACILITY PROPERTY VALUES
-- =====================================================

-- Migrate facility property values from the old structure
-- This assumes you have facility_property_values table with the old structure
INSERT INTO facility_property_values (facility_id, facility_property_id, value)
SELECT 
  fpv.facility_id,
  fp.id as facility_property_id,
  fpv.value
FROM facility_property_values_old fpv
JOIN facility_properties fp ON fp.key = (
  SELECT key FROM facility_properties_backup WHERE id = fpv.facility_property_id
)
ON CONFLICT (facility_id, facility_property_id) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- =====================================================
-- STEP 5: MIGRATE FACILITY REQUIREMENT VALUES
-- =====================================================

-- Migrate facility requirement values
INSERT INTO facility_requirement_values (facility_id, requirement_id, requirement_data_id, value, status)
SELECT 
  frv.facility_id,
  frv.requirement_id,
  frv.requirement_data_id,
  frv.value,
  'pending' as status -- Default status, can be updated later
FROM facility_requirement_values_old frv
ON CONFLICT (facility_id, requirement_id, requirement_data_id) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- =====================================================
-- STEP 6: MIGRATE FACILITY PROVIDERS
-- =====================================================

-- Migrate facility providers from arrays
INSERT INTO facility_providers (facility_id, provider_id, role, is_active)
SELECT 
  f.id as facility_id,
  unnest(f.providers) as provider_id,
  'attending' as role, -- Default role, can be updated later
  true as is_active
FROM facilities_backup f
WHERE f.providers IS NOT NULL AND array_length(f.providers, 1) > 0
ON CONFLICT (facility_id, provider_id) DO NOTHING;

-- =====================================================
-- STEP 7: MIGRATE FACILITY REQUIREMENTS
-- =====================================================

-- Migrate facility requirements from arrays
-- This creates requirement values for all requirements that were in the array
INSERT INTO facility_requirement_values (facility_id, requirement_id, requirement_data_id, value, status)
SELECT 
  f.id as facility_id,
  r.id as requirement_id,
  rd.id as requirement_data_id,
  '{}'::jsonb as value, -- Empty value, will be filled later
  'pending' as status
FROM facilities_backup f
CROSS JOIN LATERAL unnest(f.requirements) AS req_id
JOIN requirements r ON r.id = req_id
CROSS JOIN LATERAL unnest(r.data) AS data_id
JOIN requirement_data rd ON rd.id = data_id
ON CONFLICT (facility_id, requirement_id, requirement_data_id) DO NOTHING;

-- =====================================================
-- STEP 8: MIGRATE FACILITY PROPERTIES FROM ARRAYS
-- =====================================================

-- Migrate facility properties from arrays
-- This creates property values for all properties that were in the array
INSERT INTO facility_property_values (facility_id, facility_property_id, value)
SELECT 
  f.id as facility_id,
  fp.id as facility_property_id,
  COALESCE(fp.value::jsonb, '{}'::jsonb) as value
FROM facilities_backup f
CROSS JOIN LATERAL unnest(f.facility_properties) AS prop_id
JOIN facility_properties_backup fp_old ON fp_old.id = prop_id
JOIN facility_properties fp ON fp.key = fp_old.key
ON CONFLICT (facility_id, facility_property_id) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- =====================================================
-- STEP 9: VALIDATION QUERIES
-- =====================================================

-- Check migration results
SELECT 'Facilities migrated:' as check_type, COUNT(*) as count FROM facilities
UNION ALL
SELECT 'Facility properties migrated:', COUNT(*) FROM facility_properties
UNION ALL
SELECT 'Facility property values migrated:', COUNT(*) FROM facility_property_values
UNION ALL
SELECT 'Facility requirement values migrated:', COUNT(*) FROM facility_requirement_values
UNION ALL
SELECT 'Facility providers migrated:', COUNT(*) FROM facility_providers;

-- Check for orphaned records
SELECT 'Orphaned facility property values:' as check_type, COUNT(*) as count 
FROM facility_property_values fpv
LEFT JOIN facilities f ON fpv.facility_id = f.id
LEFT JOIN facility_properties fp ON fpv.facility_property_id = fp.id
WHERE f.id IS NULL OR fp.id IS NULL
UNION ALL
SELECT 'Orphaned facility requirement values:', COUNT(*) 
FROM facility_requirement_values frv
LEFT JOIN facilities f ON frv.facility_id = f.id
LEFT JOIN requirements r ON frv.requirement_id = r.id
LEFT JOIN requirement_data rd ON frv.requirement_data_id = rd.id
WHERE f.id IS NULL OR r.id IS NULL OR rd.id IS NULL
UNION ALL
SELECT 'Orphaned facility providers:', COUNT(*) 
FROM facility_providers fp
LEFT JOIN facilities f ON fp.facility_id = f.id
LEFT JOIN providers p ON fp.provider_id = p.id
WHERE f.id IS NULL OR p.id IS NULL;

-- =====================================================
-- STEP 10: CLEANUP (OPTIONAL - RUN AFTER VALIDATION)
-- =====================================================

-- Uncomment these lines after you've validated the migration
-- DROP TABLE facilities_backup;
-- DROP TABLE facility_properties_backup;
-- DROP TABLE facility_property_values_old;
-- DROP TABLE facility_requirement_values_old;

-- =====================================================
-- STEP 11: UPDATE APPLICATION DATA
-- =====================================================

-- Update any application-specific data that might need adjustment
-- For example, update facility types based on names or other criteria

UPDATE facilities 
SET facility_type = 
  CASE 
    WHEN LOWER(name) LIKE '%hospital%' THEN 'hospital'
    WHEN LOWER(name) LIKE '%clinic%' THEN 'clinic'
    WHEN LOWER(name) LIKE '%lab%' OR LOWER(name) LIKE '%laboratory%' THEN 'laboratory'
    WHEN LOWER(name) LIKE '%center%' THEN 'center'
    ELSE 'other'
  END
WHERE facility_type = 'hospital'; -- Only update default values

-- Update provider roles based on any available data
-- This is a placeholder - adjust based on your actual data

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- The migration is now complete. You should:
-- 1. Test the new structure thoroughly
-- 2. Update your application code
-- 3. Verify all functionality works as expected
-- 4. Remove backup tables when confident 