-- =====================================================
-- ESSENTIAL DATABASE SCHEMA EXPORT FOR CURSOR RULE
-- This script exports the most important database schema information
-- optimized for creating a concise but comprehensive Cursor rule
-- =====================================================

-- Core Tables with Columns and Relationships
-- =====================================================

-- PROVIDERS TABLE (Core entity)
SELECT 'PROVIDERS TABLE:' as info, '' as column_info
UNION ALL
SELECT '  ' || column_name || ' ' || data_type ||
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
    CASE WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default ELSE '' END as info,
    '' as column_info
FROM information_schema.columns
WHERE table_name = 'providers' AND table_schema = 'public'
ORDER BY info;

-- GRID SYSTEM TABLES
SELECT 'GRID_DEFINITIONS TABLE:' as info;
SELECT 
    '  ' || column_name || ' ' || data_type ||
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END as column_info
FROM information_schema.columns
WHERE table_name = 'grid_definitions' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'GRID_COLUMNS TABLE:' as info;
SELECT 
    '  ' || column_name || ' ' || data_type ||
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END as column_info
FROM information_schema.columns
WHERE table_name = 'grid_columns' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'GRID_ACTIONS TABLE:' as info;
SELECT 
    '  ' || column_name || ' ' || data_type ||
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END as column_info
FROM information_schema.columns
WHERE table_name = 'grid_actions' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'ACTIONS TABLE:' as info;
SELECT 
    '  ' || column_name || ' ' || data_type ||
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END as column_info
FROM information_schema.columns
WHERE table_name = 'actions' AND table_schema = 'public'
ORDER BY ordinal_position;

-- PROVIDER-RELATED DATA TABLES
SELECT 'ADDRESSES TABLE:' as info;
SELECT 
    '  ' || column_name || ' ' || data_type ||
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END as column_info
FROM information_schema.columns
WHERE table_name = 'addresses' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'BIRTH_INFO TABLE:' as info;
SELECT 
    '  ' || column_name || ' ' || data_type ||
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END as column_info
FROM information_schema.columns
WHERE table_name = 'birth_info' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'ADDITIONAL_NAMES TABLE:' as info;
SELECT 
    '  ' || column_name || ' ' || data_type ||
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END as column_info
FROM information_schema.columns
WHERE table_name = 'additional_names' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'DEA_LICENSES TABLE:' as info;
SELECT 
    '  ' || column_name || ' ' || data_type ||
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END as column_info
FROM information_schema.columns
WHERE table_name = 'dea_licenses' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'STATE_CONTROLLED_SUBSTANCE_LICENSES TABLE:' as info;
SELECT 
    '  ' || column_name || ' ' || data_type ||
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END as column_info
FROM information_schema.columns
WHERE table_name = 'state_controlled_substance_licenses' AND table_schema = 'public'
ORDER BY ordinal_position;

-- FACILITIES SYSTEM TABLES
SELECT 'FACILITIES TABLE:' as info;
SELECT 
    '  ' || column_name || ' ' || data_type ||
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END as column_info
FROM information_schema.columns
WHERE table_name = 'facilities' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'FACILITY_PROPERTIES TABLE:' as info;
SELECT 
    '  ' || column_name || ' ' || data_type ||
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END as column_info
FROM information_schema.columns
WHERE table_name = 'facility_properties' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'FACILITY_PROPERTY_VALUES TABLE:' as info;
SELECT 
    '  ' || column_name || ' ' || data_type ||
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END as column_info
FROM information_schema.columns
WHERE table_name = 'facility_property_values' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'REQUIREMENTS TABLE:' as info;
SELECT 
    '  ' || column_name || ' ' || data_type ||
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END as column_info
FROM information_schema.columns
WHERE table_name = 'requirements' AND table_schema = 'public'
ORDER BY ordinal_position;

-- FEATURE SETTINGS TABLE
SELECT 'FEATURE_SETTINGS TABLE:' as info;
SELECT 
    '  ' || column_name || ' ' || data_type ||
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END as column_info
FROM information_schema.columns
WHERE table_name = 'feature_settings' AND table_schema = 'public'
ORDER BY ordinal_position;

-- IMPORTANT VIEWS
SELECT 'IMPORTANT VIEWS:' as info;
SELECT 
    '  ' || viewname || ': ' || 
    CASE 
        WHEN viewname LIKE '%_with_provider' THEN 'Joins ' || REPLACE(viewname, '_with_provider', '') || ' with provider data'
        WHEN viewname LIKE 'facilities_with_%' THEN 'Facilities view with ' || REPLACE(REPLACE(viewname, 'facilities_with_', ''), '_', ' ')
        ELSE 'Custom view for ' || viewname
    END as view_description
FROM pg_views 
WHERE schemaname = 'public'
ORDER BY viewname;

-- FOREIGN KEY RELATIONSHIPS
SELECT 'KEY FOREIGN KEY RELATIONSHIPS:' as info;
SELECT 
    '  ' || tc.table_name || '.' || kcu.column_name || ' -> ' || 
    ccu.table_name || '.' || ccu.column_name as relationship
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ENUM TYPES
SELECT 'CUSTOM ENUM TYPES:' as info;
SELECT 
    '  ' || t.typname || ': [' ||
    string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) || ']' as enum_definition
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
GROUP BY t.typname
ORDER BY t.typname;

-- TABLE PATTERNS AND CONVENTIONS
SELECT 'TABLE PATTERNS:' as info;
SELECT '  All provider-related tables have provider_id UUID foreign key to providers table' as pattern;
SELECT '  All tables have id UUID primary key with gen_random_uuid() default' as pattern;
SELECT '  Most tables have created_at and updated_at timestamp columns' as pattern;
SELECT '  Many tables have tags TEXT[] array for categorization' as pattern;
SELECT '  Grid system uses grid_definitions, grid_columns, and grid_actions for configuration' as pattern;
SELECT '  Views ending in _with_provider join data tables with provider information' as pattern;
SELECT '  Facilities system uses junction tables for many-to-many relationships' as pattern;

-- CRITICAL COLUMN NAMING CONVENTIONS
SELECT 'CRITICAL COLUMN NAMING:' as info;
SELECT '  grid_definitions: key, display_name, table_name, "group", icon, "order"' as naming_convention;
SELECT '  grid_columns: grid_id, name, display_name, type, "order", visible, width, "group"' as naming_convention;
SELECT '  Use double quotes for reserved words: "group", "order"' as naming_convention;
SELECT '  Icons stored in kebab-case format (e.g., "house-chimney-user")' as naming_convention;
SELECT '  Grid keys use underscores (e.g., "state_controlled_substance_licenses")' as naming_convention;

-- AUTHENTICATION AND PERMISSIONS
SELECT 'AUTHENTICATION PATTERNS:' as info;
SELECT '  Most tables have RLS disabled for development (ALTER TABLE ... DISABLE ROW LEVEL SECURITY)' as auth_pattern;
SELECT '  Views granted to public role for easier development' as auth_pattern;
SELECT '  Feature flags stored as JSONB boolean values in feature_settings table' as auth_pattern;

-- =====================================================
-- SUMMARY FOR CURSOR RULE
-- =====================================================
SELECT 'CURSOR RULE SUMMARY:' as summary;
SELECT 'This database follows a provider-centric design where:' as summary;
SELECT '1. providers table is the core entity' as summary;
SELECT '2. All data tables link to providers via provider_id foreign key' as summary;
SELECT '3. Grid system (grid_definitions, grid_columns, grid_actions) controls UI display' as summary;
SELECT '4. Facilities system uses normalized junction tables for relationships' as summary;
SELECT '5. Views ending in _with_provider join data with provider information' as summary;
SELECT '6. Standard columns: id (UUID PK), provider_id (FK), created_at, updated_at, tags[]' as summary;
SELECT '7. RLS typically disabled for development, permissions granted to public' as summary;
SELECT '8. Icons stored in kebab-case, grid keys use underscores' as summary;
