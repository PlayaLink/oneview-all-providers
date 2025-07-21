-- Create a view that joins facilities with their requirements and requirement data
CREATE OR REPLACE VIEW facilities_with_requirements AS
SELECT 
    f.id as facility_id,
    f.label as facility_label,
    f.icon as facility_icon,
    f.created_at as facility_created_at,
    f.updated_at as facility_updated_at,
    r.id as requirement_id,
    r.key as requirement_key,
    r.label as requirement_label,
    r.group as requirement_group,
    r.note as requirement_note,
    r.visible as requirement_visible,
    r.required as requirement_required,
    r.credentialing_entities as requirement_credentialing_entities,
    r.created_at as requirement_created_at,
    r.updated_at as requirement_updated_at,
    rd.id as requirement_data_id,
    rd.key as requirement_data_key,
    rd.label as requirement_data_label,
    rd.value as requirement_data_value,
    rd.data_type as requirement_data_type,
    rd.created_at as requirement_data_created_at,
    rd.updated_at as requirement_data_updated_at
FROM facilities f
CROSS JOIN LATERAL unnest(f.requirements) AS req_id
JOIN requirements r ON r.id = req_id
CROSS JOIN LATERAL unnest(r.data) AS data_id
JOIN requirement_data rd ON rd.id = data_id
ORDER BY f.label, r.group, r.label, rd.label;

-- Grant permissions
GRANT SELECT ON facilities_with_requirements TO anon;
GRANT SELECT ON facilities_with_requirements TO authenticated; 