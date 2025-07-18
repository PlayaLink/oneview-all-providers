-- Create a simple JSON view that just aggregates all properties
CREATE VIEW facilities_with_properties_simple AS
SELECT 
  f.id,
  f.label,
  f.icon,
  f.requirements,
  f.providers,
  f.created_at,
  f.updated_at,
  -- Simple aggregation of all properties
  (
    SELECT json_agg(
      json_build_object(
        'id', fp.id,
        'key', fp.key,
        'label', fp.label,
        'type', fp.type,
        'group', fp.group,
        'value', COALESCE(fpv.value, fp.value::jsonb)
      )
    )
    FROM facility_properties fp
    LEFT JOIN facility_property_values fpv ON f.id = fpv.facility_id AND fp.id = fpv.facility_property_id
  ) as all_properties
FROM facilities f;

-- Grant permissions
GRANT SELECT ON facilities_with_properties_simple TO authenticated; 