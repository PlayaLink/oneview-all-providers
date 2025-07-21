-- Drop the existing problematic view
DROP VIEW IF EXISTS facilities_with_property_values_json;

-- Create a simpler, more reliable JSON view
CREATE VIEW facilities_with_property_values_json AS
SELECT 
  f.id,
  f.label,
  f.icon,
  f.requirements,
  f.providers,
  f.created_at,
  f.updated_at,
  -- Create a JSON object with all properties grouped by their group
  (
    SELECT json_object_agg(
      property_group,
      (
        SELECT json_agg(
          json_build_object(
            'id', fp.id,
            'key', fp.key,
            'label', fp.label,
            'type', fp.type,
            'value', COALESCE(fpv.value, fp.value::jsonb)
          )
        )
        FROM facility_properties fp
        LEFT JOIN facility_property_values fpv ON f.id = fpv.facility_id AND fp.id = fpv.facility_property_id
        WHERE fp.group = property_group
      )
    )
    FROM (
      SELECT DISTINCT group as property_group 
      FROM facility_properties
    ) groups
  ) as properties_by_group
FROM facilities f;

-- Grant permissions
GRANT SELECT ON facilities_with_property_values_json TO authenticated; 