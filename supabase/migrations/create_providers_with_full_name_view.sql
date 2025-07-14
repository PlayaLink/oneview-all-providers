-- Create the providers_with_full_name view that's referenced in other scripts
-- This view includes all provider columns plus computed fields for display

CREATE OR REPLACE VIEW providers_with_full_name AS
SELECT 
    id,
    first_name,
    last_name,
    npi_number,
    work_email,
    personal_email,
    mobile_phone_number,
    title,
    tags,
    primary_specialty,
    other_specialties,
    taxonomy_codes,
    clinical_services,
    fluent_languages,
    cms_medicare_specialty_codes,
    classifications,
    created_at,
    updated_at,
    -- Computed provider_name field
    CASE 
        WHEN last_name IS NOT NULL AND first_name IS NOT NULL THEN 
            last_name || ', ' || first_name
        WHEN last_name IS NOT NULL THEN 
            last_name
        WHEN first_name IS NOT NULL THEN 
            first_name
        ELSE 
            'Unknown Provider'
    END as provider_name
FROM providers;

-- Add comment to document the view
COMMENT ON VIEW providers_with_full_name IS 'Provider information with computed provider_name field for display purposes'; 