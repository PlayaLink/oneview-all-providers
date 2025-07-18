-- Add required column to requirements table
ALTER TABLE requirements 
ADD COLUMN required BOOLEAN NOT NULL DEFAULT false;

-- Add index for required for better performance
CREATE INDEX idx_requirements_required ON requirements(required);

-- Add comment for documentation
COMMENT ON COLUMN requirements.required IS 'Whether this requirement is mandatory for compliance';

-- Update the view to include the new column
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
  r.required,
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

-- Grant permissions on the updated view
GRANT ALL ON VIEW requirements_with_data TO authenticated; 