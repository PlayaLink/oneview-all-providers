-- Change credentialing_entity to credentialing_entities as array of facility IDs
-- First, drop the view that depends on the column
DROP VIEW IF EXISTS requirements_with_data;

-- Drop the existing index
DROP INDEX IF EXISTS idx_requirements_credentialing_entity;

-- Rename the column
ALTER TABLE requirements 
RENAME COLUMN credentialing_entity TO credentialing_entities;

-- Change the column type to UUID array
ALTER TABLE requirements 
ALTER COLUMN credentialing_entities TYPE UUID[] USING 
  CASE 
    WHEN credentialing_entities IS NULL THEN '{}'::UUID[]
    ELSE ARRAY[credentialing_entities]::UUID[]
  END;

-- Set default value to empty array
ALTER TABLE requirements 
ALTER COLUMN credentialing_entities SET DEFAULT '{}'::UUID[];

-- Add GIN index for array operations
CREATE INDEX idx_requirements_credentialing_entities ON requirements USING GIN (credentialing_entities);

-- Add comment for documentation
COMMENT ON COLUMN requirements.credentialing_entities IS 'Array of facility IDs that this requirement applies to';

-- Recreate the view with the new column structure
CREATE VIEW requirements_with_data AS
SELECT 
  r.id,
  r.type,
  r.key,
  r."group",
  r.label,
  r.note,
  COALESCE(r.visible, true) as visible,
  COALESCE(r.required, false) as required,
  r.credentialing_entities,
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
GRANT SELECT, INSERT, UPDATE, DELETE ON requirements_with_data TO authenticated; 