-- =====================================================
-- FACILITIES SYSTEM RESTRUCTURE MIGRATION
-- This migration restructures the facilities system for better performance and maintainability
-- =====================================================

-- Step 1: Create new junction tables for many-to-many relationships
-- =====================================================

-- Facility-Provider relationships
CREATE TABLE facility_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  role TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(facility_id, provider_id)
);

-- Facility-Requirement assignments
CREATE TABLE facility_requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  requirement_id UUID NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(facility_id, requirement_id)
);

-- Step 2: Update facility_properties table structure
-- =====================================================

-- Add new columns to facility_properties
ALTER TABLE facility_properties 
ADD COLUMN default_value TEXT,
ADD COLUMN is_required BOOLEAN DEFAULT false,
ADD COLUMN validation_rules JSONB;

-- Step 3: Update requirements table structure
-- =====================================================

-- Rename requirement_data to requirement_data_fields for clarity
ALTER TABLE requirement_data RENAME TO requirement_data_fields;

-- Add new columns to requirement_data_fields
ALTER TABLE requirement_data_fields 
ADD COLUMN requirement_id UUID REFERENCES requirements(id) ON DELETE CASCADE,
ADD COLUMN default_value TEXT,
ADD COLUMN is_required BOOLEAN DEFAULT false,
ADD COLUMN validation_rules JSONB,
ADD COLUMN "order" INTEGER DEFAULT 0;

-- Add unique constraint
ALTER TABLE requirement_data_fields 
ADD CONSTRAINT unique_requirement_data_field UNIQUE (requirement_id, key);

-- Step 4: Create facility_requirement_values table
-- =====================================================

CREATE TABLE facility_requirement_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  requirement_id UUID NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
  requirement_data_field_id UUID NOT NULL REFERENCES requirement_data_fields(id) ON DELETE CASCADE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(facility_id, requirement_id, requirement_data_field_id)
);

-- Step 5: Migrate existing data
-- =====================================================

-- Migrate facility-provider relationships from facilities.providers array
INSERT INTO facility_providers (facility_id, provider_id, is_active)
SELECT 
  f.id as facility_id,
  unnest(f.providers) as provider_id,
  true as is_active
FROM facilities f
WHERE f.providers IS NOT NULL AND array_length(f.providers, 1) > 0;

-- Migrate facility-requirement relationships from facilities.requirements array
INSERT INTO facility_requirements (facility_id, requirement_id, is_active)
SELECT 
  f.id as facility_id,
  unnest(f.requirements) as requirement_id,
  true as is_active
FROM facilities f
WHERE f.requirements IS NOT NULL AND array_length(f.requirements, 1) > 0;

-- Migrate requirement data relationships
-- First, update requirement_data_fields to link to requirements
UPDATE requirement_data_fields rdf
SET requirement_id = r.id
FROM requirements r
WHERE rdf.id = ANY(r.data);

-- Step 6: Create indexes for performance
-- =====================================================

-- Facility property values indexes
CREATE INDEX idx_facility_property_values_facility_id ON facility_property_values(facility_id);
CREATE INDEX idx_facility_property_values_property_id ON facility_property_values(facility_property_id);
CREATE INDEX idx_facility_property_values_value ON facility_property_values USING GIN (value);

-- Facility requirement values indexes
CREATE INDEX idx_facility_requirement_values_facility_id ON facility_requirement_values(facility_id);
CREATE INDEX idx_facility_requirement_values_requirement_id ON facility_requirement_values(requirement_id);
CREATE INDEX idx_facility_requirement_values_field_id ON facility_requirement_values(requirement_data_field_id);
CREATE INDEX idx_facility_requirement_values_value ON facility_requirement_values USING GIN (value);

-- Junction table indexes
CREATE INDEX idx_facility_providers_facility_id ON facility_providers(facility_id);
CREATE INDEX idx_facility_providers_provider_id ON facility_providers(provider_id);
CREATE INDEX idx_facility_providers_active ON facility_providers(is_active);

CREATE INDEX idx_facility_requirements_facility_id ON facility_requirements(facility_id);
CREATE INDEX idx_facility_requirements_requirement_id ON facility_requirements(requirement_id);
CREATE INDEX idx_facility_requirements_active ON facility_requirements(is_active);

-- Requirement data fields indexes
CREATE INDEX idx_requirement_data_fields_requirement_id ON requirement_data_fields(requirement_id);
CREATE INDEX idx_requirement_data_fields_key ON requirement_data_fields(key);
CREATE INDEX idx_requirement_data_fields_order ON requirement_data_fields("order");

-- Step 7: Create optimized views
-- =====================================================

-- Drop existing views that will be replaced
DROP VIEW IF EXISTS facilities_with_properties;
DROP VIEW IF EXISTS facilities_with_all_data;
DROP VIEW IF EXISTS facilities_with_requirements;
DROP VIEW IF EXISTS facilities_with_property_values;
DROP VIEW IF EXISTS facilities_with_property_values_json;

-- Basic facility view with counts
CREATE VIEW facilities_basic AS
SELECT 
  f.id,
  f.label,
  f.icon,
  f.created_at,
  f.updated_at,
  COUNT(DISTINCT fpv.id) as property_count,
  COUNT(DISTINCT frv.id) as requirement_count,
  COUNT(DISTINCT fpr.provider_id) FILTER (WHERE fpr.is_active = true) as active_provider_count
FROM facilities f
LEFT JOIN facility_property_values fpv ON f.id = fpv.facility_id
LEFT JOIN facility_requirement_values frv ON f.id = frv.facility_id
LEFT JOIN facility_providers fpr ON f.id = fpr.facility_id
GROUP BY f.id, f.label, f.icon, f.created_at, f.updated_at;

-- Facility with properties grouped by property group
CREATE VIEW facilities_with_properties AS
SELECT 
  f.id,
  f.label,
  f.icon,
  f.created_at,
  f.updated_at,
  json_object_agg(
    fp."group",
    json_agg(
      jsonb_build_object(
        'id', fp.id,
        'key', fp.key,
        'label', fp.label,
        'type', fp.type,
        'value', COALESCE(fpv.value, fp.default_value),
        'is_required', fp.is_required
      )
    )
  ) FILTER (WHERE fp.id IS NOT NULL) as properties_by_group
FROM facilities f
LEFT JOIN facility_property_values fpv ON f.id = fpv.facility_id
LEFT JOIN facility_properties fp ON fpv.facility_property_id = fp.id
GROUP BY f.id, f.label, f.icon, f.created_at, f.updated_at;

-- Facility with requirements and their values
CREATE VIEW facilities_with_requirements AS
SELECT 
  f.id,
  f.label,
  f.icon,
  f.created_at,
  f.updated_at,
  json_agg(
    DISTINCT jsonb_build_object(
      'id', r.id,
      'key', r.key,
      'label', r.label,
      'group', r."group",
      'type', r.type,
      'note', r.note,
      'visible', r.visible,
      'required', r.required,
      'data_fields', (
        SELECT json_agg(
          jsonb_build_object(
            'id', rdf.id,
            'key', rdf.key,
            'label', rdf.label,
            'data_type', rdf.data_type,
            'value', COALESCE(frv.value, rdf.default_value),
            'is_required', rdf.is_required,
            'order', rdf."order"
          )
        )
        FROM requirement_data_fields rdf
        LEFT JOIN facility_requirement_values frv ON 
          frv.facility_id = f.id AND 
          frv.requirement_id = r.id AND 
          frv.requirement_data_field_id = rdf.id
        WHERE rdf.requirement_id = r.id
        ORDER BY rdf."order"
      )
    )
  ) FILTER (WHERE r.id IS NOT NULL) as requirements
FROM facilities f
LEFT JOIN facility_requirements fr ON f.id = fr.facility_id AND fr.is_active = true
LEFT JOIN requirements r ON fr.requirement_id = r.id
GROUP BY f.id, f.label, f.icon, f.created_at, f.updated_at;

-- Comprehensive facility view with all data
CREATE VIEW facilities_with_all_data AS
SELECT 
  f.id,
  f.label,
  f.icon,
  f.created_at,
  f.updated_at,
  -- Properties
  (SELECT json_object_agg(
    fp."group",
    json_agg(
      jsonb_build_object(
        'id', fp.id,
        'key', fp.key,
        'label', fp.label,
        'type', fp.type,
        'value', COALESCE(fpv.value, fp.default_value),
        'is_required', fp.is_required
      )
    )
  ) FILTER (WHERE fp.id IS NOT NULL)
  FROM facility_properties fp
  LEFT JOIN facility_property_values fpv ON f.id = fpv.facility_id AND fp.id = fpv.facility_property_id
  ) as properties_by_group,
  -- Requirements
  (SELECT json_agg(
    DISTINCT jsonb_build_object(
      'id', r.id,
      'key', r.key,
      'label', r.label,
      'group', r."group",
      'type', r.type,
      'note', r.note,
      'visible', r.visible,
      'required', r.required,
      'data_fields', (
        SELECT json_agg(
          jsonb_build_object(
            'id', rdf.id,
            'key', rdf.key,
            'label', rdf.label,
            'data_type', rdf.data_type,
            'value', COALESCE(frv.value, rdf.default_value),
            'is_required', rdf.is_required,
            'order', rdf."order"
          )
        )
        FROM requirement_data_fields rdf
        LEFT JOIN facility_requirement_values frv ON 
          frv.facility_id = f.id AND 
          frv.requirement_id = r.id AND 
          frv.requirement_data_field_id = rdf.id
        WHERE rdf.requirement_id = r.id
        ORDER BY rdf."order"
      )
    )
  ) FILTER (WHERE r.id IS NOT NULL)
  FROM facility_requirements fr
  JOIN requirements r ON fr.requirement_id = r.id
  WHERE fr.facility_id = f.id AND fr.is_active = true
  ) as requirements,
  -- Providers
  (SELECT json_agg(
    jsonb_build_object(
      'id', p.id,
      'first_name', p.first_name,
      'last_name', p.last_name,
      'npi_number', p.npi_number,
      'title', p.title,
      'primary_specialty', p.primary_specialty,
      'role', fpr.role,
      'start_date', fpr.start_date,
      'end_date', fpr.end_date,
      'is_active', fpr.is_active
    )
  )
  FROM facility_providers fpr
  JOIN providers p ON fpr.provider_id = p.id
  WHERE fpr.facility_id = f.id
  ) as providers
FROM facilities f;

-- Step 8: Add triggers for updated_at
-- =====================================================

-- Add updated_at triggers for new tables
CREATE TRIGGER update_facility_providers_updated_at 
  BEFORE UPDATE ON facility_providers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facility_requirements_updated_at 
  BEFORE UPDATE ON facility_requirements 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facility_requirement_values_updated_at 
  BEFORE UPDATE ON facility_requirement_values 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requirement_data_fields_updated_at 
  BEFORE UPDATE ON requirement_data_fields 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 9: Grant permissions
-- =====================================================

GRANT ALL ON TABLE facility_providers TO authenticated;
GRANT ALL ON TABLE facility_requirements TO authenticated;
GRANT ALL ON TABLE facility_requirement_values TO authenticated;
GRANT ALL ON TABLE requirement_data_fields TO authenticated;

GRANT SELECT ON facilities_basic TO authenticated;
GRANT SELECT ON facilities_with_properties TO authenticated;
GRANT SELECT ON facilities_with_requirements TO authenticated;
GRANT SELECT ON facilities_with_all_data TO authenticated;

-- Step 10: Add comments for documentation
-- =====================================================

COMMENT ON TABLE facility_providers IS 'Junction table for many-to-many relationship between facilities and providers';
COMMENT ON TABLE facility_requirements IS 'Junction table for many-to-many relationship between facilities and requirements';
COMMENT ON TABLE facility_requirement_values IS 'Stores actual values for facility requirements';
COMMENT ON TABLE requirement_data_fields IS 'Stores individual data fields that belong to requirements';

COMMENT ON COLUMN facility_providers.role IS 'Role of the provider at this facility';
COMMENT ON COLUMN facility_providers.is_active IS 'Whether this provider-facility relationship is currently active';
COMMENT ON COLUMN facility_requirements.is_active IS 'Whether this requirement is currently active for this facility';
COMMENT ON COLUMN facility_requirement_values.value IS 'The actual value for this facility requirement (JSONB to support different data types)';

-- =====================================================
-- MIGRATION COMPLETE
-- ===================================================== 