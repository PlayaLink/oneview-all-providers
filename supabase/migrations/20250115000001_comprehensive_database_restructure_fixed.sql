-- =====================================================
-- COMPREHENSIVE DATABASE RESTRUCTURE MIGRATION (FIXED)
-- This migration restructures the facilities system for better performance and maintainability
-- Run this in Supabase Dashboard SQL Editor
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
  requirement_data_id UUID NOT NULL REFERENCES requirement_data(id) ON DELETE CASCADE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(facility_id, requirement_id, requirement_data_id)
);

-- Step 2: Add missing columns to existing tables
-- =====================================================

-- Add missing columns to facility_properties
ALTER TABLE facility_properties 
ADD COLUMN IF NOT EXISTS default_value TEXT,
ADD COLUMN IF NOT EXISTS is_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS validation_rules JSONB;

-- Add missing columns to requirement_data (if they don't exist)
ALTER TABLE requirement_data 
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
CREATE INDEX IF NOT EXISTS idx_facility_requirement_values_data_id ON facility_requirement_values(requirement_data_id);
CREATE INDEX IF NOT EXISTS idx_facility_requirement_values_value ON facility_requirement_values USING GIN (value);

-- Requirement data indexes
CREATE INDEX IF NOT EXISTS idx_requirement_data_requirement_id ON requirement_data(requirement_id);
CREATE INDEX IF NOT EXISTS idx_requirement_data_key ON requirement_data(key);
CREATE INDEX IF NOT EXISTS idx_requirement_data_order ON requirement_data("order");

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_facility_property_values_facility_property ON facility_property_values(facility_id, facility_property_id);
CREATE INDEX IF NOT EXISTS idx_facility_requirement_values_facility_requirement ON facility_requirement_values(facility_id, requirement_id);

-- Step 4: Migrate existing data from arrays to junction tables (SAFE OPERATION)
-- =====================================================

-- Migrate facility-provider relationships from facilities.providers array
-- Only if the column exists and has data
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'facilities' AND column_name = 'providers') THEN
    INSERT INTO facility_providers (facility_id, provider_id, is_active)
    SELECT 
      f.id as facility_id,
      unnest(f.providers) as provider_id,
      true as is_active
    FROM facilities f
    WHERE f.providers IS NOT NULL AND array_length(f.providers, 1) > 0
    ON CONFLICT (facility_id, provider_id) DO NOTHING;
    
    RAISE NOTICE 'Migrated facility-provider relationships';
  ELSE
    RAISE NOTICE 'facilities.providers column does not exist, skipping migration';
  END IF;
END $$;

-- Migrate facility-requirement relationships from facilities.requirements array
-- Only if the column exists and has data
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'facilities' AND column_name = 'requirements') THEN
    INSERT INTO facility_requirements (facility_id, requirement_id, is_active)
    SELECT 
      f.id as facility_id,
      unnest(f.requirements) as requirement_id,
      true as is_active
    FROM facilities f
    WHERE f.requirements IS NOT NULL AND array_length(f.requirements, 1) > 0
    ON CONFLICT (facility_id, requirement_id) DO NOTHING;
    
    RAISE NOTICE 'Migrated facility-requirement relationships';
  ELSE
    RAISE NOTICE 'facilities.requirements column does not exist, skipping migration';
  END IF;
END $$;

-- Migrate facility-property relationships from facilities.facility_properties array
-- Only if the column exists and has data
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'facilities' AND column_name = 'facility_properties') THEN
    INSERT INTO facility_property_values (facility_id, facility_property_id, value)
    SELECT 
      f.id as facility_id,
      unnest(f.facility_properties) as facility_property_id,
      fp.value::jsonb as value
    FROM facilities f
    JOIN facility_properties fp ON fp.id = ANY(f.facility_properties)
    WHERE f.facility_properties IS NOT NULL AND array_length(f.facility_properties, 1) > 0
    ON CONFLICT (facility_id, facility_property_id) DO NOTHING;
    
    RAISE NOTICE 'Migrated facility-property relationships';
  ELSE
    RAISE NOTICE 'facilities.facility_properties column does not exist, skipping migration';
  END IF;
END $$;

-- Step 5: Create optimized views for different use cases
-- =====================================================

-- Drop existing views to recreate them
DROP VIEW IF EXISTS facilities_basic;
DROP VIEW IF EXISTS facilities_with_properties;
DROP VIEW IF EXISTS facilities_with_requirements;
DROP VIEW IF EXISTS facilities_with_all_data;

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
            'id', rd.id,
            'key', rd.key,
            'label', rd.label,
            'data_type', rd.data_type,
            'value', COALESCE(frv.value, rd.default_value::jsonb),
            'is_required', rd.is_required,
            'order', rd."order",
            'validation_rules', rd.validation_rules
          )
        )
        FROM requirement_data rd
        LEFT JOIN facility_requirement_values frv ON 
          frv.facility_id = f.id AND 
          frv.requirement_id = r.id AND 
          frv.requirement_data_id = rd.id
        WHERE rd.requirement_id = r.id
        ORDER BY rd."order"
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
            'id', rd.id,
            'key', rd.key,
            'label', rd.label,
            'data_type', rd.data_type,
            'value', COALESCE(frv.value, rd.default_value::jsonb),
            'is_required', rd.is_required,
            'order', rd."order",
            'validation_rules', rd.validation_rules
          )
        )
        FROM requirement_data rd
        LEFT JOIN facility_requirement_values frv ON 
          frv.facility_id = f.id AND 
          frv.requirement_id = r.id AND 
          frv.requirement_data_id = rd.id
        WHERE rd.requirement_id = r.id
        ORDER BY rd."order"
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

CREATE TRIGGER update_requirement_data_updated_at 
  BEFORE UPDATE ON requirement_data 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Grant permissions
-- =====================================================

GRANT ALL ON TABLE facility_property_values TO authenticated;
GRANT ALL ON TABLE facility_providers TO authenticated;
GRANT ALL ON TABLE facility_requirements TO authenticated;
GRANT ALL ON TABLE facility_requirement_values TO authenticated;
GRANT ALL ON TABLE requirement_data TO authenticated;

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
COMMENT ON TABLE requirement_data IS 'Stores individual data fields that belong to requirements';

COMMENT ON COLUMN facility_property_values.facility_id IS 'Reference to the facility';
COMMENT ON COLUMN facility_property_values.facility_property_id IS 'Reference to the property definition';
COMMENT ON COLUMN facility_property_values.value IS 'The actual value for this facility''s property (JSONB to support different data types)';

COMMENT ON COLUMN facility_providers.role IS 'Role of the provider at this facility';
COMMENT ON COLUMN facility_providers.is_active IS 'Whether this provider-facility relationship is currently active';
COMMENT ON COLUMN facility_requirements.is_active IS 'Whether this requirement is currently active for this facility';
COMMENT ON COLUMN facility_requirement_values.value IS 'The actual value for this facility requirement (JSONB to support different data types)';

-- Step 9: Verification queries
-- =====================================================

-- Show what was created
SELECT 'Migration completed successfully!' as status;

-- Show table counts
SELECT 
  'facility_property_values' as table_name,
  COUNT(*) as record_count
FROM facility_property_values
UNION ALL
SELECT 
  'facility_providers' as table_name,
  COUNT(*) as record_count
FROM facility_providers
UNION ALL
SELECT 
  'facility_requirements' as table_name,
  COUNT(*) as record_count
FROM facility_requirements
UNION ALL
SELECT 
  'facility_requirement_values' as table_name,
  COUNT(*) as record_count
FROM facility_requirement_values;

-- =====================================================
-- MIGRATION COMPLETE
-- ===================================================== 