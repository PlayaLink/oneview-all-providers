-- Add requirements column to facility_affiliations table
ALTER TABLE facility_affiliations 
ADD COLUMN requirements UUID[] DEFAULT '{}';

-- Add index for requirements array for better performance
CREATE INDEX idx_facility_affiliations_requirements ON facility_affiliations USING GIN (requirements);

-- Add comment for documentation
COMMENT ON COLUMN facility_affiliations.requirements IS 'Array of requirement record IDs associated with this facility affiliation';

-- Create a view to join facility affiliations with their requirements
CREATE VIEW facility_affiliations_with_requirements AS
SELECT 
  fa.*,
  -- Aggregate requirements as JSON
  COALESCE(
    (SELECT json_agg(
      json_build_object(
        'id', r.id,
        'type', r.type,
        'key', r.key,
        'group', r."group",
        'label', r.label,
        'note', r.note,
        'visible', r.visible,
        'credentialing_entities', r.credentialing_entities
      )
    ) FROM requirements r WHERE r.id = ANY(fa.requirements)),
    '[]'::json
  ) as requirement_details
FROM facility_affiliations fa; 