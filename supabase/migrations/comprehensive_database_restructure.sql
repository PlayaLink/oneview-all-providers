-- =====================================================
-- COMPREHENSIVE DATABASE RESTRUCTURE MIGRATION
-- This migration completes the restructure for optimal performance and maintainability
-- =====================================================

-- Step 1: Create missing junction tables and normalize relationships
-- =====================================================

-- Create facility_property_values table if it doesn't exist
CREATE TABLE IF NOT EXISTS facility_property_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  facility_property_id UUID NOT NULL REFERENCES facility_properties(id) ON DELETE CASCADE,
  value JSONB, -- Use JSONB to store different data types
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(facility_id, facility_property_id)
);

-- Create facility_providers junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS facility_providers (
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

-- Create facility_requirements junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS facility_requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  requirement_id UUID NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(facility_id, requirement_id)
);

-- Create facility_requirement_values table if it doesn't exist
CREATE TABLE IF NOT EXISTS facility_requirement_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  requirement_id UUID NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
  requirement_data_field_id UUID NOT NULL REFERENCES requirement_data_fields(id) ON DELETE CASCADE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(facility_id, requirement_id, requirement_data_field_id)
);

-- Step 2: Add missing columns to existing tables
-- =====================================================

-- Add missing columns to facility_properties
ALTER TABLE facility_properties 
ADD COLUMN IF NOT EXISTS default_value TEXT,
ADD COLUMN IF NOT EXISTS is_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS validation_rules JSONB;

-- Add missing columns to requirement_data_fields
ALTER TABLE requirement_data_fields 
ADD COLUMN IF NOT EXISTS requirement_id UUID REFERENCES requirements(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS default_value TEXT,
ADD COLUMN IF NOT EXISTS is_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS validation_rules JSONB,
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Step 3: Create comprehensive indexes for performance
-- =====================================================

-- Facility property values indexes
CREATE INDEX IF NOT EXISTS idx_facility_property_values_facility_id ON facility_property_values(facility_id);
CREATE INDEX IF NOT EXISTS idx_facility_property_values_property_id ON facility_property_values(facility_property_id);
CREATE INDEX IF NOT EXISTS idx_facility_property_values_value ON facility_property_values USING GIN (value);

-- Facility providers indexes
CREATE INDEX IF NOT EXISTS idx_facility_providers_facility_id ON facility_providers(facility_id);
CREATE INDEX IF NOT EXISTS idx_facility_providers_provider_id ON facility_providers(provider_id);
CREATE INDEX IF NOT EXISTS idx_facility_providers_is_active ON facility_providers(is_active);
CREATE INDEX IF NOT EXISTS idx_facility_providers_role ON facility_providers(role);

-- Facility requirements indexes
CREATE INDEX IF NOT EXISTS idx_facility_requirements_facility_id ON facility_requirements(facility_id);
CREATE INDEX IF NOT EXISTS idx_facility_requirements_requirement_id ON facility_requirements(requirement_id);
CREATE INDEX IF NOT EXISTS idx_facility_requirements_is_active ON facility_requirements(is_active);

-- Facility requirement values indexes
CREATE INDEX IF NOT EXISTS idx_facility_requirement_values_facility_id ON facility_requirement_values(facility_id);
CREATE INDEX IF NOT EXISTS idx_facility_requirement_values_requirement_id ON facility_requirement_values(requirement_id);
CREATE INDEX IF NOT EXISTS idx_facility_requirement_values_field_id ON facility_requirement_values(requirement_data_field_id);
CREATE INDEX IF NOT EXISTS idx_facility_requirement_values_value ON facility_requirement_values USING GIN (value);

-- Requirement data fields indexes
CREATE INDEX IF NOT EXISTS idx_requirement_data_fields_requirement_id ON requirement_data_fields(requirement_id);
CREATE INDEX IF NOT EXISTS idx_requirement_data_fields_key ON requirement_data_fields(key);
CREATE INDEX IF NOT EXISTS idx_requirement_data_fields_order ON requirement_data_fields("order");

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_facility_property_values_facility_property ON facility_property_values(facility_id, facility_property_id);
CREATE INDEX IF NOT EXISTS idx_facility_requirement_values_facility_requirement ON facility_requirement_values(facility_id, requirement_id);

-- Step 4: Migrate existing data from arrays to junction tables
-- =====================================================

-- Migrate facility-provider relationships from facilities.providers array
INSERT INTO facility_providers (facility_id, provider_id, is_active)
SELECT 
  f.id as facility_id,
  unnest(f.providers) as provider_id,
  true as is_active
FROM facilities f
WHERE f.providers IS NOT NULL AND array_length(f.providers, 1) > 0
ON CONFLICT (facility_id, provider_id) DO NOTHING;

-- Migrate facility-requirement relationships from facilities.requirements array
INSERT INTO facility_requirements (facility_id, requirement_id, is_active)
SELECT 
  f.id as facility_id,
  unnest(f.requirements) as requirement_id,
  true as is_active
FROM facilities f
WHERE f.requirements IS NOT NULL AND array_length(f.requirements, 1) > 0
ON CONFLICT (facility_id, requirement_id) DO NOTHING;

-- Migrate facility-property relationships from facilities.facility_properties array
-- This creates property values with default values from facility_properties
INSERT INTO facility_property_values (facility_id, facility_property_id, value)
SELECT 
  f.id as facility_id,
  unnest(f.facility_properties) as facility_property_id,
  fp.value::jsonb as value
FROM facilities f
JOIN facility_properties fp ON fp.id = ANY(f.facility_properties)
WHERE f.facility_properties IS NOT NULL AND array_length(f.facility_properties, 1) > 0
ON CONFLICT (facility_id, facility_property_id) DO NOTHING;

-- Step 5: Create optimized views for different use cases
-- =====================================================

-- Drop existing views to recreate them
DROP VIEW IF EXISTS facilities_basic;
DROP VIEW IF EXISTS facilities_with_properties;
DROP VIEW IF EXISTS facilities_with_requirements;
DROP VIEW IF EXISTS facilities_with_all_data;
DROP VIEW IF EXISTS facilities_with_property_values;
DROP VIEW IF EXISTS facilities_with_property_values_json;

-- Basic facility view with counts (fast for list views)
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
        'value', COALESCE(fpv.value, fp.default_value::jsonb),
        'is_required', fp.is_required,
        'validation_rules', fp.validation_rules
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
            'value', COALESCE(frv.value, rdf.default_value::jsonb),
            'is_required', rdf.is_required,
            'order', rdf."order",
            'validation_rules', rdf.validation_rules
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
        'value', COALESCE(fpv.value, fp.default_value::jsonb),
        'is_required', fp.is_required,
        'validation_rules', fp.validation_rules
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
            'value', COALESCE(frv.value, rdf.default_value::jsonb),
            'is_required', rdf.is_required,
            'order', rdf."order",
            'validation_rules', rdf.validation_rules
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

-- Step 6: Add triggers for updated_at columns
-- =====================================================

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers for all tables
CREATE TRIGGER update_facility_property_values_updated_at 
  BEFORE UPDATE ON facility_property_values 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

-- Step 7: Grant permissions
-- =====================================================

GRANT ALL ON TABLE facility_property_values TO authenticated;
GRANT ALL ON TABLE facility_providers TO authenticated;
GRANT ALL ON TABLE facility_requirements TO authenticated;
GRANT ALL ON TABLE facility_requirement_values TO authenticated;
GRANT ALL ON TABLE requirement_data_fields TO authenticated;

GRANT SELECT ON facilities_basic TO authenticated;
GRANT SELECT ON facilities_with_properties TO authenticated;
GRANT SELECT ON facilities_with_requirements TO authenticated;
GRANT SELECT ON facilities_with_all_data TO authenticated;

-- Step 8: Add comments for documentation
-- =====================================================

COMMENT ON TABLE facility_property_values IS 'Stores actual values for each facility''s properties';
COMMENT ON TABLE facility_providers IS 'Junction table for many-to-many relationship between facilities and providers';
COMMENT ON TABLE facility_requirements IS 'Junction table for many-to-many relationship between facilities and requirements';
COMMENT ON TABLE facility_requirement_values IS 'Stores actual values for facility requirements';
COMMENT ON TABLE requirement_data_fields IS 'Stores individual data fields that belong to requirements';

COMMENT ON COLUMN facility_property_values.facility_id IS 'Reference to the facility';
COMMENT ON COLUMN facility_property_values.facility_property_id IS 'Reference to the property definition';
COMMENT ON COLUMN facility_property_values.value IS 'The actual value for this facility''s property (JSONB to support different data types)';

COMMENT ON COLUMN facility_providers.role IS 'Role of the provider at this facility';
COMMENT ON COLUMN facility_providers.is_active IS 'Whether this provider-facility relationship is currently active';
COMMENT ON COLUMN facility_requirements.is_active IS 'Whether this requirement is currently active for this facility';
COMMENT ON COLUMN facility_requirement_values.value IS 'The actual value for this facility requirement (JSONB to support different data types)';

-- Step 9: Create helper functions for common operations
-- =====================================================

-- Function to get facility with all related data efficiently
CREATE OR REPLACE FUNCTION get_facility_with_all_data(facility_uuid UUID)
RETURNS TABLE (
  facility_data JSONB,
  properties_data JSONB,
  requirements_data JSONB,
  providers_data JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_jsonb(f.*) as facility_data,
    (SELECT json_object_agg(
      fp."group",
      json_agg(
        jsonb_build_object(
          'id', fp.id,
          'key', fp.key,
          'label', fp.label,
          'type', fp.type,
          'value', COALESCE(fpv.value, fp.default_value::jsonb),
          'is_required', fp.is_required
        )
      )
    ) FILTER (WHERE fp.id IS NOT NULL)
    FROM facility_properties fp
    LEFT JOIN facility_property_values fpv ON facility_uuid = fpv.facility_id AND fp.id = fpv.facility_property_id
    ) as properties_data,
    (SELECT json_agg(
      jsonb_build_object(
        'id', r.id,
        'key', r.key,
        'label', r.label,
        'group', r."group",
        'type', r.type,
        'data_fields', (
          SELECT json_agg(
            jsonb_build_object(
              'id', rdf.id,
              'key', rdf.key,
              'label', rdf.label,
              'data_type', rdf.data_type,
              'value', COALESCE(frv.value, rdf.default_value::jsonb)
            )
          )
          FROM requirement_data_fields rdf
          LEFT JOIN facility_requirement_values frv ON 
            frv.facility_id = facility_uuid AND 
            frv.requirement_id = r.id AND 
            frv.requirement_data_field_id = rdf.id
          WHERE rdf.requirement_id = r.id
        )
      )
    )
    FROM facility_requirements fr
    JOIN requirements r ON fr.requirement_id = r.id
    WHERE fr.facility_id = facility_uuid AND fr.is_active = true
    ) as requirements_data,
    (SELECT json_agg(
      jsonb_build_object(
        'id', p.id,
        'first_name', p.first_name,
        'last_name', p.last_name,
        'role', fpr.role,
        'is_active', fpr.is_active
      )
    )
    FROM facility_providers fpr
    JOIN providers p ON fpr.provider_id = p.id
    WHERE fpr.facility_id = facility_uuid
    ) as providers_data
  FROM facilities f
  WHERE f.id = facility_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to update facility property value
CREATE OR REPLACE FUNCTION update_facility_property_value(
  p_facility_id UUID,
  p_property_key TEXT,
  p_value JSONB
)
RETURNS UUID AS $$
DECLARE
  v_property_id UUID;
  v_value_id UUID;
BEGIN
  -- Get property ID
  SELECT id INTO v_property_id
  FROM facility_properties
  WHERE key = p_property_key;
  
  IF v_property_id IS NULL THEN
    RAISE EXCEPTION 'Property with key % not found', p_property_key;
  END IF;
  
  -- Check if value exists
  SELECT id INTO v_value_id
  FROM facility_property_values
  WHERE facility_id = p_facility_id AND facility_property_id = v_property_id;
  
  IF v_value_id IS NULL THEN
    -- Insert new value
    INSERT INTO facility_property_values (facility_id, facility_property_id, value)
    VALUES (p_facility_id, v_property_id, p_value)
    RETURNING id INTO v_value_id;
  ELSE
    -- Update existing value
    UPDATE facility_property_values
    SET value = p_value, updated_at = NOW()
    WHERE id = v_value_id;
  END IF;
  
  RETURN v_value_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MIGRATION COMPLETE
-- ===================================================== 