-- =====================================================
-- DATABASE RESTRUCTURE RECOMMENDATION
-- =====================================================
-- This file contains the recommended restructuring for the facilities system
-- to improve data integrity, query performance, and maintainability

-- =====================================================
-- 1. CORE TABLES (Keep these mostly as-is)
-- =====================================================

-- Keep the existing providers table (it's well-structured)
-- Keep the existing requirements and requirement_data tables (they're good)

-- =====================================================
-- 2. RESTRUCTURED FACILITIES SYSTEM
-- =====================================================

-- Drop existing problematic tables and views
DROP VIEW IF EXISTS facilities_with_properties;
DROP VIEW IF EXISTS facilities_with_all_data;
DROP VIEW IF EXISTS facilities_with_property_values;
DROP VIEW IF EXISTS facilities_with_property_values_json;
DROP VIEW IF EXISTS facilities_with_properties_simple;
DROP VIEW IF EXISTS facilities_with_requirements;

-- Drop existing tables (after backing up data)
-- DROP TABLE IF EXISTS facility_property_values;
-- DROP TABLE IF EXISTS facilities;
-- DROP TABLE IF EXISTS facility_properties;

-- =====================================================
-- 2.1 FACILITY PROPERTIES (Definition Table)
-- =====================================================

CREATE TABLE facility_properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  "group" TEXT NOT NULL,
  description TEXT,
  data_type TEXT NOT NULL DEFAULT 'text' CHECK (
    data_type IN ('text', 'number', 'boolean', 'date', 'email', 'url', 'phone', 'single-select', 'multi-select', 'file', 'oneview_record')
  ),
  default_value TEXT,
  is_required BOOLEAN DEFAULT false,
  validation_rules JSONB, -- Store validation rules as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2.2 FACILITIES (Core Table)
-- =====================================================

CREATE TABLE facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  facility_type TEXT NOT NULL, -- hospital, clinic, lab, etc.
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  license_number TEXT,
  tax_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2.3 FACILITY PROPERTY VALUES (Junction Table)
-- =====================================================

CREATE TABLE facility_property_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  facility_property_id UUID NOT NULL REFERENCES facility_properties(id) ON DELETE CASCADE,
  value JSONB NOT NULL, -- Store any data type as JSONB
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(facility_id, facility_property_id)
);

-- =====================================================
-- 2.4 FACILITY REQUIREMENT VALUES (Junction Table)
-- =====================================================

CREATE TABLE facility_requirement_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  requirement_id UUID NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
  requirement_data_id UUID NOT NULL REFERENCES requirement_data(id) ON DELETE CASCADE,
  value JSONB NOT NULL, -- Store any data type as JSONB
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(facility_id, requirement_id, requirement_data_id)
);

-- =====================================================
-- 2.5 FACILITY PROVIDERS (Junction Table)
-- =====================================================

CREATE TABLE facility_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- attending, resident, consultant, etc.
  department TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  privileges JSONB, -- Store privileges as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(facility_id, provider_id)
);

-- =====================================================
-- 3. INDEXES FOR PERFORMANCE
-- =====================================================

-- Facility properties indexes
CREATE INDEX idx_facility_properties_key ON facility_properties(key);
CREATE INDEX idx_facility_properties_group ON facility_properties("group");
CREATE INDEX idx_facility_properties_type ON facility_properties(data_type);

-- Facilities indexes
CREATE INDEX idx_facilities_name ON facilities(name);
CREATE INDEX idx_facilities_type ON facilities(facility_type);
CREATE INDEX idx_facilities_status ON facilities(status);
CREATE INDEX idx_facilities_state ON facilities(state);

-- Facility property values indexes
CREATE INDEX idx_facility_property_values_facility_id ON facility_property_values(facility_id);
CREATE INDEX idx_facility_property_values_property_id ON facility_property_values(facility_property_id);
CREATE INDEX idx_facility_property_values_value ON facility_property_values USING GIN (value);

-- Facility requirement values indexes
CREATE INDEX idx_facility_requirement_values_facility_id ON facility_requirement_values(facility_id);
CREATE INDEX idx_facility_requirement_values_requirement_id ON facility_requirement_values(requirement_id);
CREATE INDEX idx_facility_requirement_values_data_id ON facility_requirement_values(requirement_data_id);
CREATE INDEX idx_facility_requirement_values_status ON facility_requirement_values(status);
CREATE INDEX idx_facility_requirement_values_value ON facility_requirement_values USING GIN (value);

-- Facility providers indexes
CREATE INDEX idx_facility_providers_facility_id ON facility_providers(facility_id);
CREATE INDEX idx_facility_providers_provider_id ON facility_providers(provider_id);
CREATE INDEX idx_facility_providers_role ON facility_providers(role);
CREATE INDEX idx_facility_providers_active ON facility_providers(is_active);

-- =====================================================
-- 4. TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_facility_properties_updated_at 
  BEFORE UPDATE ON facility_properties 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facilities_updated_at 
  BEFORE UPDATE ON facilities 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facility_property_values_updated_at 
  BEFORE UPDATE ON facility_property_values 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facility_requirement_values_updated_at 
  BEFORE UPDATE ON facility_requirement_values 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facility_providers_updated_at 
  BEFORE UPDATE ON facility_providers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. SIMPLIFIED VIEWS
-- =====================================================

-- View for facilities with their basic property values
CREATE VIEW facilities_with_properties AS
SELECT 
  f.id,
  f.name,
  f.display_name,
  f.facility_type,
  f.status,
  f.address,
  f.city,
  f.state,
  f.zip_code,
  f.phone,
  f.email,
  f.website,
  f.license_number,
  f.tax_id,
  f.created_at,
  f.updated_at,
  -- Aggregate properties by group
  (
    SELECT json_object_agg(
      fp.group,
      (
        SELECT json_agg(
          json_build_object(
            'id', fp.id,
            'key', fp.key,
            'label', fp.label,
            'type', fp.data_type,
            'value', fpv.value,
            'is_required', fp.is_required
          )
        )
        FROM facility_properties fp
        LEFT JOIN facility_property_values fpv ON f.id = fpv.facility_id AND fp.id = fpv.facility_property_id
        WHERE fp.group = fp_group.group
      )
    )
    FROM (
      SELECT DISTINCT "group" as group 
      FROM facility_properties
    ) fp_group
  ) as properties_by_group
FROM facilities f;

-- View for facilities with their requirement compliance
CREATE VIEW facilities_with_requirements AS
SELECT 
  f.id,
  f.name,
  f.display_name,
  f.facility_type,
  f.status,
  -- Aggregate requirements by group with compliance status
  (
    SELECT json_object_agg(
      r.group,
      (
        SELECT json_agg(
          json_build_object(
            'requirement_id', r.id,
            'requirement_key', r.key,
            'requirement_label', r.label,
            'requirement_type', r.type,
            'requirement_required', r.required,
            'data_items', (
              SELECT json_agg(
                json_build_object(
                  'data_id', rd.id,
                  'data_key', rd.key,
                  'data_label', rd.label,
                  'data_type', rd.data_type,
                  'value', frv.value,
                  'status', frv.status,
                  'submitted_at', frv.submitted_at,
                  'approved_at', frv.approved_at,
                  'expires_at', frv.expires_at
                )
              )
              FROM requirement_data rd
              LEFT JOIN facility_requirement_values frv ON f.id = frv.facility_id AND r.id = frv.requirement_id AND rd.id = frv.requirement_data_id
              WHERE rd.id = ANY(r.data)
            )
          )
        )
        FROM requirements r
        WHERE r.type = 'facility'
      )
    )
    FROM (
      SELECT DISTINCT "group" as group 
      FROM requirements 
      WHERE type = 'facility'
    ) req_group
  ) as requirements_by_group
FROM facilities f;

-- View for facilities with their providers
CREATE VIEW facilities_with_providers AS
SELECT 
  f.id,
  f.name,
  f.display_name,
  f.facility_type,
  f.status,
  -- Aggregate providers by role
  (
    SELECT json_object_agg(
      fp.role,
      (
        SELECT json_agg(
          json_build_object(
            'provider_id', p.id,
            'first_name', p.first_name,
            'last_name', p.last_name,
            'npi_number', p.npi_number,
            'title', p.title,
            'primary_specialty', p.primary_specialty,
            'department', fp.department,
            'start_date', fp.start_date,
            'end_date', fp.end_date,
            'is_active', fp.is_active,
            'privileges', fp.privileges
          )
        )
        FROM providers p
        INNER JOIN facility_providers fp2 ON p.id = fp2.provider_id
        WHERE fp2.facility_id = f.id AND fp2.role = fp_role.role
      )
    )
    FROM (
      SELECT DISTINCT role 
      FROM facility_providers 
      WHERE facility_id = f.id
    ) fp_role
  ) as providers_by_role
FROM facilities f;

-- =====================================================
-- 6. HELPER FUNCTIONS
-- =====================================================

-- Function to get facility compliance status
CREATE OR REPLACE FUNCTION get_facility_compliance_status(facility_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'facility_id', f.id,
    'facility_name', f.name,
    'overall_status', 
      CASE 
        WHEN COUNT(CASE WHEN frv.status != 'approved' AND r.required = true THEN 1 END) = 0 THEN 'compliant'
        WHEN COUNT(CASE WHEN frv.status = 'expired' AND r.required = true THEN 1 END) > 0 THEN 'expired'
        WHEN COUNT(CASE WHEN frv.status = 'pending' AND r.required = true THEN 1 END) > 0 THEN 'pending'
        ELSE 'non_compliant'
      END,
    'total_requirements', COUNT(DISTINCT r.id),
    'approved_requirements', COUNT(DISTINCT CASE WHEN frv.status = 'approved' THEN r.id END),
    'pending_requirements', COUNT(DISTINCT CASE WHEN frv.status = 'pending' THEN r.id END),
    'expired_requirements', COUNT(DISTINCT CASE WHEN frv.status = 'expired' THEN r.id END),
    'missing_requirements', COUNT(DISTINCT CASE WHEN frv.id IS NULL AND r.required = true THEN r.id END)
  ) INTO result
  FROM facilities f
  LEFT JOIN requirements r ON r.type = 'facility'
  LEFT JOIN facility_requirement_values frv ON f.id = frv.facility_id AND r.id = frv.requirement_id
  WHERE f.id = facility_uuid
  GROUP BY f.id, f.name;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE facilities IS 'Core facilities table storing basic facility information';
COMMENT ON TABLE facility_properties IS 'Definitions of properties that facilities can have';
COMMENT ON TABLE facility_property_values IS 'Actual values for facility properties (one value per facility per property)';
COMMENT ON TABLE facility_requirement_values IS 'Facility-specific values for requirements (compliance data)';
COMMENT ON TABLE facility_providers IS 'Many-to-many relationship between facilities and providers with role information';

COMMENT ON COLUMN facility_properties.validation_rules IS 'JSON object containing validation rules for the property';
COMMENT ON COLUMN facility_property_values.value IS 'JSONB value that can store any data type (string, number, boolean, array, object)';
COMMENT ON COLUMN facility_requirement_values.value IS 'JSONB value for the requirement data item';
COMMENT ON COLUMN facility_requirement_values.status IS 'Status of the requirement compliance (pending, approved, rejected, expired)';
COMMENT ON COLUMN facility_providers.privileges IS 'JSON object containing provider privileges at this facility';

-- =====================================================
-- 8. GRANT PERMISSIONS
-- =====================================================

GRANT ALL ON TABLE facilities TO authenticated;
GRANT ALL ON TABLE facility_properties TO authenticated;
GRANT ALL ON TABLE facility_property_values TO authenticated;
GRANT ALL ON TABLE facility_requirement_values TO authenticated;
GRANT ALL ON TABLE facility_providers TO authenticated;

GRANT SELECT ON facilities_with_properties TO authenticated;
GRANT SELECT ON facilities_with_requirements TO authenticated;
GRANT SELECT ON facilities_with_providers TO authenticated;

GRANT EXECUTE ON FUNCTION get_facility_compliance_status(UUID) TO authenticated; 