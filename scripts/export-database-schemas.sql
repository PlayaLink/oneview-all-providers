-- =====================================================
-- COMPLETE DATABASE SCHEMA EXPORT
-- This script exports all database schemas, tables, views, functions, and relationships
-- Use this output to create a comprehensive Cursor rule for database schema context
-- =====================================================

-- Export all table schemas with columns, types, and constraints
-- =====================================================
SELECT 
    '-- TABLE: ' || t.table_name as schema_info,
    'CREATE TABLE ' || t.table_name || ' (' ||
    string_agg(
        '    ' || c.column_name || ' ' || 
        UPPER(c.data_type) ||
        CASE 
            WHEN c.character_maximum_length IS NOT NULL THEN '(' || c.character_maximum_length || ')'
            WHEN c.numeric_precision IS NOT NULL AND c.numeric_scale IS NOT NULL THEN '(' || c.numeric_precision || ',' || c.numeric_scale || ')'
            WHEN c.numeric_precision IS NOT NULL THEN '(' || c.numeric_precision || ')'
            ELSE ''
        END ||
        CASE WHEN c.is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
        CASE WHEN c.column_default IS NOT NULL THEN ' DEFAULT ' || c.column_default ELSE '' END,
        E',\n'
        ORDER BY c.ordinal_position
    ) || E'\n);' as table_definition
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' 
    AND t.table_type = 'BASE TABLE'
    AND t.table_name NOT LIKE 'pg_%'
    AND t.table_name != 'spatial_ref_sys'
GROUP BY t.table_name
ORDER BY t.table_name;

-- Export all primary keys
-- =====================================================
SELECT 
    '-- PRIMARY KEY: ' || tc.table_name as constraint_info,
    'ALTER TABLE ' || tc.table_name || ' ADD CONSTRAINT ' || tc.constraint_name || 
    ' PRIMARY KEY (' || string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) || ');' as pk_definition
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public'
GROUP BY tc.table_name, tc.constraint_name
ORDER BY tc.table_name;

-- Export all foreign keys
-- =====================================================
SELECT 
    '-- FOREIGN KEY: ' || tc.table_name || ' -> ' || ccu.table_name as fk_info,
    'ALTER TABLE ' || tc.table_name || ' ADD CONSTRAINT ' || tc.constraint_name ||
    ' FOREIGN KEY (' || kcu.column_name || ') REFERENCES ' || ccu.table_name || '(' || ccu.column_name || ')' ||
    CASE WHEN rc.delete_rule != 'NO ACTION' THEN ' ON DELETE ' || rc.delete_rule ELSE '' END ||
    CASE WHEN rc.update_rule != 'NO ACTION' THEN ' ON UPDATE ' || rc.update_rule ELSE '' END ||
    ';' as fk_definition
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints rc ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- Export all unique constraints
-- =====================================================
SELECT 
    '-- UNIQUE CONSTRAINT: ' || tc.table_name as unique_info,
    'ALTER TABLE ' || tc.table_name || ' ADD CONSTRAINT ' || tc.constraint_name || 
    ' UNIQUE (' || string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) || ');' as unique_definition
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
    AND tc.table_schema = 'public'
GROUP BY tc.table_name, tc.constraint_name
ORDER BY tc.table_name;

-- Export all indexes
-- =====================================================
SELECT 
    '-- INDEX: ' || indexname as index_info,
    indexdef || ';' as index_definition
FROM pg_indexes 
WHERE schemaname = 'public'
    AND indexname NOT LIKE '%_pkey'
ORDER BY tablename, indexname;

-- Export all views
-- =====================================================
SELECT 
    '-- VIEW: ' || viewname as view_info,
    'CREATE OR REPLACE VIEW ' || viewname || ' AS ' || definition as view_definition
FROM pg_views 
WHERE schemaname = 'public'
ORDER BY viewname;

-- Export all custom types and enums
-- =====================================================
SELECT 
    '-- ENUM TYPE: ' || t.typname as enum_info,
    'CREATE TYPE ' || t.typname || ' AS ENUM (' ||
    string_agg('''' || e.enumlabel || '''', ', ' ORDER BY e.enumsortorder) || ');' as enum_definition
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
GROUP BY t.typname
ORDER BY t.typname;

-- Export all functions and triggers
-- =====================================================
SELECT 
    '-- FUNCTION: ' || p.proname as function_info,
    'CREATE OR REPLACE FUNCTION ' || p.proname || '(' ||
    COALESCE(pg_get_function_arguments(p.oid), '') || ') RETURNS ' ||
    pg_get_function_result(p.oid) || ' AS $$ ' ||
    p.prosrc || ' $$ LANGUAGE ' || l.lanname || ';' as function_definition
FROM pg_proc p
JOIN pg_language l ON p.prolang = l.oid
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
    AND p.prokind = 'f'
ORDER BY p.proname;

-- Export all triggers
-- =====================================================
SELECT 
    '-- TRIGGER: ' || t.tgname || ' ON ' || c.relname as trigger_info,
    'CREATE TRIGGER ' || t.tgname || ' ' ||
    CASE t.tgtype & 2 WHEN 0 THEN 'AFTER' ELSE 'BEFORE' END || ' ' ||
    CASE t.tgtype & 4 WHEN 0 THEN '' ELSE 'INSERT ' END ||
    CASE t.tgtype & 8 WHEN 0 THEN '' ELSE 'DELETE ' END ||
    CASE t.tgtype & 16 WHEN 0 THEN '' ELSE 'UPDATE ' END ||
    'ON ' || c.relname || ' FOR EACH ROW EXECUTE FUNCTION ' || p.proname || '();' as trigger_definition
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
    AND NOT t.tgisinternal
ORDER BY c.relname, t.tgname;

-- Export table comments
-- =====================================================
SELECT 
    '-- TABLE COMMENT: ' || c.relname as comment_info,
    'COMMENT ON TABLE ' || c.relname || ' IS ''' || d.description || ''';' as comment_definition
FROM pg_class c
JOIN pg_description d ON c.oid = d.objoid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
    AND c.relkind = 'r'
    AND d.objsubid = 0
ORDER BY c.relname;

-- Export column comments
-- =====================================================
SELECT 
    '-- COLUMN COMMENT: ' || c.relname || '.' || a.attname as comment_info,
    'COMMENT ON COLUMN ' || c.relname || '.' || a.attname || ' IS ''' || d.description || ''';' as comment_definition
FROM pg_class c
JOIN pg_attribute a ON c.oid = a.attrelid
JOIN pg_description d ON c.oid = d.objoid AND a.attnum = d.objsubid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
    AND c.relkind = 'r'
    AND a.attnum > 0
    AND NOT a.attisdropped
ORDER BY c.relname, a.attname;

-- Export RLS policies
-- =====================================================
SELECT 
    '-- RLS POLICY: ' || p.polname || ' ON ' || c.relname as policy_info,
    'CREATE POLICY ' || p.polname || ' ON ' || c.relname ||
    ' FOR ' || p.polcmd ||
    CASE WHEN p.polroles IS NOT NULL THEN ' TO ' || array_to_string(p.polroles::regrole[], ', ') ELSE '' END ||
    CASE WHEN p.polqual IS NOT NULL THEN ' USING (' || pg_get_expr(p.polqual, p.polrelid) || ')' ELSE '' END ||
    CASE WHEN p.polwithcheck IS NOT NULL THEN ' WITH CHECK (' || pg_get_expr(p.polwithcheck, p.polrelid) || ')' ELSE '' END ||
    ';' as policy_definition
FROM pg_policy p
JOIN pg_class c ON p.polrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY c.relname, p.polname;

-- Export table statistics and row counts
-- =====================================================
SELECT 
    '-- TABLE STATS: ' || schemaname || '.' || tablename as stats_info,
    'Table: ' || tablename || 
    ', Estimated Rows: ' || COALESCE(n_tup_ins - n_tup_del, 0) ||
    ', Size: ' || pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as stats_definition
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Export all sequences
-- =====================================================
SELECT 
    '-- SEQUENCE: ' || sequence_name as sequence_info,
    'CREATE SEQUENCE ' || sequence_name ||
    ' START WITH ' || start_value ||
    ' INCREMENT BY ' || increment ||
    ' MINVALUE ' || minimum_value ||
    ' MAXVALUE ' || maximum_value ||
    CASE WHEN cycle_option = 'YES' THEN ' CYCLE' ELSE ' NO CYCLE' END ||
    ';' as sequence_definition
FROM information_schema.sequences
WHERE sequence_schema = 'public'
ORDER BY sequence_name;

-- Export permissions summary
-- =====================================================
SELECT 
    '-- PERMISSIONS: ' || t.table_name as permission_info,
    'Table: ' || t.table_name || 
    ', Owner: ' || t.table_owner ||
    ', RLS Enabled: ' || CASE WHEN c.relrowsecurity THEN 'YES' ELSE 'NO' END as permission_summary
FROM information_schema.tables t
JOIN pg_class c ON c.relname = t.table_name
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    AND n.nspname = 'public'
ORDER BY t.table_name;

-- Export relationship summary
-- =====================================================
SELECT 
    '-- RELATIONSHIPS SUMMARY' as relationship_info,
    'Foreign Key Relationships:' ||
    E'\n' || string_agg(
        '  ' || tc.table_name || '.' || kcu.column_name || ' -> ' || 
        ccu.table_name || '.' || ccu.column_name,
        E'\n'
    ) as relationship_summary
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public';

-- =====================================================
-- SUMMARY REPORT
-- =====================================================
SELECT '-- DATABASE SCHEMA EXPORT SUMMARY' as summary_info;

SELECT 
    'Total Tables: ' || COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

SELECT 
    'Total Views: ' || COUNT(*) as view_count
FROM pg_views 
WHERE schemaname = 'public';

SELECT 
    'Total Functions: ' || COUNT(*) as function_count
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.prokind = 'f';

SELECT 
    'Total Indexes: ' || COUNT(*) as index_count
FROM pg_indexes 
WHERE schemaname = 'public';

SELECT 
    'Total Foreign Keys: ' || COUNT(*) as fk_count
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public';

-- =====================================================
-- END OF SCHEMA EXPORT
-- =====================================================
