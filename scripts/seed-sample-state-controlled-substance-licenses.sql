-- Quick seeding script for State Controlled Substance Licenses
-- This adds sample data so you can see the grid in the UI

-- First, let's check if we have any providers to work with
SELECT COUNT(*) as provider_count FROM providers;

-- If we have providers, add some sample State Controlled Substance Licenses
DO $$
DECLARE
    provider_record RECORD;
    sample_count INTEGER := 0;
BEGIN
    -- Get a few providers to create sample licenses for
    FOR provider_record IN 
        SELECT id, first_name, last_name FROM providers LIMIT 5
    LOOP
        -- Insert 2-3 sample licenses per provider
        FOR i IN 1..3 LOOP
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
                provider_record.id,
                CASE (i % 4)
                    WHEN 0 THEN 'MD'
                    WHEN 1 THEN 'DO'
                    WHEN 2 THEN 'PA'
                    ELSE 'NP'
                END,
                'SCS' || LPAD((sample_count * 10 + i)::TEXT, 6, '0'),
                CASE (i % 3)
                    WHEN 0 THEN 'IL'
                    WHEN 1 THEN 'CA'
                    ELSE 'NY'
                END,
                CASE (i % 3)
                    WHEN 0 THEN 'Active'
                    WHEN 1 THEN 'Active - Fully Licensed'
                    ELSE 'Active - Not Practicing'
                END,
                CURRENT_DATE - INTERVAL '2 years' + (i * INTERVAL '6 months'),
                CURRENT_DATE + INTERVAL '1 year' + (i * INTERVAL '3 months'),
                CASE (i % 2)
                    WHEN 0 THEN '365 days'
                    ELSE '180 days'
                END,
                CASE (i % 2)
                    WHEN 0 THEN 'Renew (No)'
                    ELSE 'Don''t Renew (Yes)'
                END,
                CASE (i % 2)
                    WHEN 0 THEN 'Yes'
                    ELSE 'No'
                END,
                provider_record.first_name,
                provider_record.last_name,
                ARRAY[
                    CASE (i % 3)
                        WHEN 0 THEN 'Expiring Soon'
                        WHEN 1 THEN 'High Priority'
                        ELSE 'Follow Up Required'
                    END
                ]
            );
            
            sample_count := sample_count + 1;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Inserted % sample State Controlled Substance Licenses', sample_count;
END $$;

-- Verify the data was inserted
SELECT 
    COUNT(*) as total_records,
    COUNT(DISTINCT provider_id) as unique_providers,
    COUNT(DISTINCT state) as unique_states,
    COUNT(DISTINCT status) as unique_statuses
FROM state_controlled_substance_licenses;

-- Show sample records
SELECT 
    s.license_number,
    s.state,
    s.status,
    s.license_type,
    p.provider_name,
    s.expiration_date
FROM state_controlled_substance_licenses s
JOIN providers_with_full_name p ON s.provider_id = p.id
ORDER BY s.created_at DESC
LIMIT 10;
