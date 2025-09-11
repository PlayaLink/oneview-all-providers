-- Create additional_names_with_provider view
-- This view joins additional_names with provider information

CREATE OR REPLACE VIEW additional_names_with_provider AS
SELECT 
    an.id,
    an.provider_id,
    p.provider_name,
    p.title,
    p.primary_specialty,
    an.type,
    an.first_name,
    an.middle_name,
    an.last_name,
    an.title as name_title,
    an.start_date,
    an.end_date,
    an.tags,
    an.last_updated,
    an.created_at,
    an.updated_at
FROM additional_names an
LEFT JOIN providers_with_full_name p ON an.provider_id = p.id;

-- Grant permissions
GRANT SELECT ON additional_names_with_provider TO public;

-- Add comment
COMMENT ON VIEW additional_names_with_provider IS 'Additional names joined with provider information for grid display';
