-- Insert sample Additional Names data
-- This script inserts test data for the additional_names table

-- First, let's check if we have any providers
SELECT 'Checking providers...' as status;
SELECT COUNT(*) as provider_count FROM providers;

-- Get a few provider IDs to use for additional names
SELECT 'Provider IDs for additional names:' as status;
SELECT id, first_name, last_name FROM providers LIMIT 5;

-- Insert sample additional names data
INSERT INTO additional_names (
    provider_id,
    type,
    first_name,
    middle_name,
    last_name,
    title,
    start_date,
    end_date,
    tags
)
SELECT 
    p.id as provider_id,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 1 THEN 'Alternate Supervisor Name'
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 2 THEN 'Authorized Signer'
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 3 THEN 'Practice Administrator'
        ELSE 'Other Name'
    END as type,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 1 THEN 'John'
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 2 THEN 'Sarah'
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 3 THEN 'Michael'
        ELSE 'David'
    END as first_name,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 1 THEN 'A'
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 2 THEN 'B'
        ELSE NULL
    END as middle_name,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 1 THEN 'Smith'
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 2 THEN 'Johnson'
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 3 THEN 'Williams'
        ELSE 'Brown'
    END as last_name,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 1 THEN 'MD'
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 2 THEN 'DO'
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 3 THEN 'PA'
        ELSE 'NP'
    END as title,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 1 THEN '2020-01-01'
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 2 THEN '2021-06-15'
        ELSE NULL
    END as start_date,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 1 THEN '2025-12-31'
        ELSE NULL
    END as end_date,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 1 THEN ARRAY['active', 'verified']
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 2 THEN ARRAY['primary']
        WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) = 3 THEN ARRAY['legal']
        ELSE ARRAY['preferred']
    END as tags
FROM providers p
CROSS JOIN generate_series(1, 3) as s
WHERE p.id IN (
    SELECT id FROM providers LIMIT 10  -- Limit to first 10 providers
)
ON CONFLICT DO NOTHING;

-- Verify the data was inserted
SELECT 'Verification - Additional Names count:' as status;
SELECT COUNT(*) as additional_names_count FROM additional_names;

-- Show sample of inserted data
SELECT 'Sample additional names data:' as status;
SELECT 
    an.id,
    p.first_name || ' ' || p.last_name as provider_name,
    an.type,
    an.first_name,
    an.middle_name,
    an.last_name,
    an.title,
    an.start_date,
    an.end_date,
    an.tags
FROM additional_names an
JOIN providers p ON an.provider_id = p.id
LIMIT 10;

-- Show data through the view
SELECT 'Data through additional_names_with_provider view:' as status;
SELECT 
    provider_name,
    type,
    first_name,
    middle_name,
    last_name,
    name_title,
    start_date,
    end_date,
    tags
FROM additional_names_with_provider
LIMIT 10;
