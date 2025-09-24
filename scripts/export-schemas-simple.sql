-- =====================================================
-- SIMPLE DATABASE SCHEMA EXPORT FOR CURSOR RULE
-- This script exports all essential database schema information in one result set
-- =====================================================

WITH schema_info AS (
  -- Table structures
  SELECT 
    'TABLE' as type,
    table_name as name,
    'Columns: ' || string_agg(
      column_name || ' ' || data_type ||
      CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END,
      ', ' ORDER BY ordinal_position
    ) as details
  FROM information_schema.columns
  WHERE table_schema = 'public'
  GROUP BY table_name
  
  UNION ALL
  
  -- Views
  SELECT 
    'VIEW' as type,
    viewname as name,
    'Definition: ' || LEFT(definition, 200) || '...' as details
  FROM pg_views 
  WHERE schemaname = 'public'
  
  UNION ALL
  
  -- Foreign key relationships
  SELECT 
    'FOREIGN_KEY' as type,
    tc.table_name || '.' || kcu.column_name as name,
    'References: ' || ccu.table_name || '.' || ccu.column_name as details
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
  WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
  
  UNION ALL
  
  -- Enum types
  SELECT 
    'ENUM' as type,
    t.typname as name,
    'Values: [' || string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) || ']' as details
  FROM pg_type t
  JOIN pg_enum e ON t.oid = e.enumtypid
  WHERE t.typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  GROUP BY t.typname
  
  UNION ALL
  
  -- Key patterns and conventions
  SELECT 'PATTERN' as type, 'Provider Tables' as name, 'All have provider_id UUID foreign key to providers table' as details
  UNION ALL
  SELECT 'PATTERN' as type, 'Primary Keys' as name, 'All tables use UUID primary key with gen_random_uuid() default' as details
  UNION ALL
  SELECT 'PATTERN' as type, 'Timestamps' as name, 'Most tables have created_at and updated_at timestamp columns' as details
  UNION ALL
  SELECT 'PATTERN' as type, 'Tags' as name, 'Many tables have tags TEXT[] array for categorization' as details
  UNION ALL
  SELECT 'PATTERN' as type, 'Grid System' as name, 'Uses grid_definitions, grid_columns, and grid_actions for UI configuration' as details
  UNION ALL
  SELECT 'PATTERN' as type, 'Provider Views' as name, 'Views ending in _with_provider join data tables with provider information' as details
  UNION ALL
  SELECT 'PATTERN' as type, 'Icon Storage' as name, 'Icons stored in kebab-case format (e.g., house-chimney-user)' as details
  UNION ALL
  SELECT 'PATTERN' as type, 'Grid Keys' as name, 'Grid keys use underscores (e.g., state_controlled_substance_licenses)' as details
  UNION ALL
  SELECT 'PATTERN' as type, 'Reserved Words' as name, 'Use double quotes for reserved words: "group", "order"' as details
  UNION ALL
  SELECT 'PATTERN' as type, 'RLS' as name, 'Most tables have RLS disabled for development' as details
  UNION ALL
  SELECT 'PATTERN' as type, 'Permissions' as name, 'Views granted to public role for easier development' as details
)

SELECT 
  type,
  name,
  details
FROM schema_info
ORDER BY 
  CASE type 
    WHEN 'TABLE' THEN 1
    WHEN 'VIEW' THEN 2
    WHEN 'FOREIGN_KEY' THEN 3
    WHEN 'ENUM' THEN 4
    WHEN 'PATTERN' THEN 5
  END,
  name;
