-- Create a view to easily query facilities with their property values
CREATE VIEW facilities_with_property_values AS
SELECT 
  f.id as facility_id,
  f.label as facility_label,
  f.icon as facility_icon,
  f.requirements as facility_requirements,
  f.providers as facility_providers,
  f.created_at as facility_created_at,
  f.updated_at as facility_updated_at,
  fp.id as property_id,
  fp.key as property_key,
  fp.label as property_label,
  fp.group as property_group,
  fp.type as property_type,
  fpv.value as property_value,
  fpv.created_at as value_created_at,
  fpv.updated_at as value_updated_at
FROM facilities f
CROSS JOIN facility_properties fp
LEFT JOIN facility_property_values fpv ON f.id = fpv.facility_id AND fp.id = fpv.facility_property_id;

-- Create a JSON aggregated view for easier consumption
CREATE VIEW facilities_with_property_values_json AS
SELECT 
  f.id,
  f.label,
  f.icon,
  f.requirements,
  f.providers,
  f.created_at,
  f.updated_at,
  -- Aggregate properties as JSON grouped by property group
  COALESCE(
    (SELECT json_object_agg(
      fp.group,
      (SELECT json_agg(
        json_build_object(
          'id', fp.id,
          'key', fp.key,
          'label', fp.label,
          'type', fp.type,
          'value', COALESCE(fpv.value, fp.value)
        )
      ) FROM facility_properties fp2
      LEFT JOIN facility_property_values fpv2 ON f.id = fpv2.facility_id AND fp2.id = fpv2.facility_property_id
      WHERE fp2.group = fp.group)
    ) FROM facility_properties fp
    GROUP BY fp.group),
    '{}'::json
  ) as properties_by_group
FROM facilities f;

-- Grant permissions on the views
GRANT SELECT ON facilities_with_property_values TO authenticated;
GRANT SELECT ON facilities_with_property_values_json TO authenticated; 