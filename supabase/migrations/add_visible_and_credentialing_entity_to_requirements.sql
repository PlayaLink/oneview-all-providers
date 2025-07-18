-- Add visible and credentialing_entity columns to requirements table
ALTER TABLE requirements 
ADD COLUMN visible BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN credentialing_entity UUID;

-- Add index for credentialing_entity for better performance
CREATE INDEX idx_requirements_credentialing_entity ON requirements(credentialing_entity);

-- Add index for visible for filtering
CREATE INDEX idx_requirements_visible ON requirements(visible);

-- Add comment for documentation
COMMENT ON COLUMN requirements.visible IS 'Whether the requirement is visible in the UI';
COMMENT ON COLUMN requirements.credentialing_entity IS 'UUID reference to the credentialing entity (e.g., facility affiliation ID for facility requirements)';

-- Update the view to include the new columns
DROP VIEW IF EXISTS requirements_with_data;

CREATE VIEW requirements_with_data AS
SELECT 
  r.id,
  r.type,
  r.key,
  r."group",
  r.label,
  r.note,
  r.visible,
  r.credentialing_entity,
  r.data,
  r.created_at,
  r.updated_at,
  -- Aggregate requirement data as JSON
  COALESCE(
    (SELECT json_agg(
      json_build_object(
        'id', rd.id,
        'label', rd.label,
        'value', rd.value,
        'data_type', rd.data_type,
        'key', rd.key
      )
    ) FROM requirement_data rd WHERE rd.id = ANY(r.data)),
    '[]'::json
  ) as requirement_data_items
FROM requirements r; 