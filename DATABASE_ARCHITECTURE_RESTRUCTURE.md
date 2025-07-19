# Database Architecture Restructure

## Overview

This document outlines the restructured database architecture for the OneView All Providers application, specifically focusing on the facilities, requirements, and properties system. The restructure addresses performance, maintainability, and scalability issues in the original array-based design.

## Problems with Original Architecture

### 1. **Array-Based Relationships**
- **Issue**: Using UUID arrays in the `facilities` table for properties, requirements, and providers
- **Problems**:
  - Poor query performance (no index optimization)
  - Complex joins required for data retrieval
  - Difficult to maintain referential integrity
  - Limited query flexibility

### 2. **Inconsistent Data Storage**
- **Issue**: Mix of array storage and separate tables
- **Problems**:
  - Inconsistent access patterns
  - Complex data migration
  - Difficult to implement proper validation

### 3. **Complex Views**
- **Issue**: Overly complex views with nested JSON aggregation
- **Problems**:
  - Poor performance at scale
  - Difficult to debug and maintain
  - Limited query optimization

## New Architecture Design

### 1. **Normalized Table Structure**

#### Core Tables
```sql
-- Simplified facilities table
facilities (id, label, icon, created_at, updated_at)

-- Property definitions (templates)
facility_properties (id, key, label, group, type, default_value, is_required, validation_rules)

-- Property values for each facility
facility_property_values (id, facility_id, facility_property_id, value)

-- Requirement definitions (templates)
requirements (id, type, key, group, label, note, visible, required)

-- Requirement data fields (templates)
requirement_data_fields (id, requirement_id, key, label, data_type, default_value, is_required, validation_rules, order)

-- Requirement values for each facility
facility_requirement_values (id, facility_id, requirement_id, requirement_data_field_id, value)
```

#### Junction Tables
```sql
-- Many-to-many relationships
facility_providers (id, facility_id, provider_id, role, start_date, end_date, is_active)
facility_requirements (id, facility_id, requirement_id, is_active)
```

### 2. **Key Benefits**

#### A. **Performance Improvements**
- **Proper Indexing**: Each relationship has dedicated indexes
- **Efficient Queries**: Direct foreign key relationships
- **Optimized Views**: Simplified aggregation logic
- **Better Query Planning**: PostgreSQL can optimize joins effectively

#### B. **Data Integrity**
- **Referential Integrity**: Foreign key constraints ensure data consistency
- **Validation**: Proper data types and constraints
- **Audit Trail**: Clear relationship tracking with timestamps

#### C. **Maintainability**
- **Clear Relationships**: Explicit junction tables
- **Modular Design**: Each table has a single responsibility
- **Easy Debugging**: Simple queries for troubleshooting
- **Scalable**: Easy to add new features without breaking existing code

#### D. **Flexibility**
- **Dynamic Properties**: Easy to add/remove properties per facility
- **Requirement Management**: Flexible requirement assignment
- **Provider Relationships**: Rich provider-facility relationships with roles and dates

### 3. **Optimized Views**

#### A. **Basic Facility View**
```sql
facilities_basic
- Shows facility info with counts
- Fast performance for list views
- Includes active provider count
```

#### B. **Detailed Views**
```sql
facilities_with_properties
- Properties grouped by category
- Includes default values
- Optimized for property display

facilities_with_requirements
- Requirements with data fields
- Ordered by field order
- Includes validation rules

facilities_with_all_data
- Comprehensive view with all relationships
- Optimized for detail pages
- JSON aggregation for frontend consumption
```

## Migration Strategy

### Phase 1: Create New Structure
1. Create new tables with proper relationships
2. Add indexes for performance
3. Create optimized views
4. Add triggers and constraints

### Phase 2: Migrate Data
1. Migrate facility-provider relationships
2. Migrate facility-requirement relationships
3. Migrate requirement data relationships
4. Validate data integrity

### Phase 3: Cleanup
1. Remove old array columns
2. Drop old indexes
3. Update application code
4. Test thoroughly

## Usage Examples

### 1. **Adding a Property to a Facility**
```sql
-- Insert property value
INSERT INTO facility_property_values (facility_id, facility_property_id, value)
VALUES ('facility-uuid', 'property-uuid', '"250"');

-- Query facility with properties
SELECT * FROM facilities_with_properties WHERE id = 'facility-uuid';
```

### 2. **Assigning Requirements to a Facility**
```sql
-- Assign requirement
INSERT INTO facility_requirements (facility_id, requirement_id, is_active)
VALUES ('facility-uuid', 'requirement-uuid', true);

-- Set requirement values
INSERT INTO facility_requirement_values (facility_id, requirement_id, requirement_data_field_id, value)
VALUES ('facility-uuid', 'requirement-uuid', 'field-uuid', '"completed"');
```

### 3. **Querying Facilities with Requirements**
```sql
-- Get all facilities with their requirements
SELECT * FROM facilities_with_requirements;

-- Get facilities with specific requirement
SELECT f.* 
FROM facilities f
JOIN facility_requirements fr ON f.id = fr.facility_id
WHERE fr.requirement_id = 'requirement-uuid' AND fr.is_active = true;
```

## Performance Considerations

### 1. **Indexing Strategy**
- **Primary Keys**: All tables have UUID primary keys
- **Foreign Keys**: Indexed for join performance
- **JSONB**: GIN indexes for complex queries
- **Composite Indexes**: For unique constraints and common queries

### 2. **Query Optimization**
- **Views**: Pre-computed aggregations for common queries
- **Partitioning**: Consider partitioning for large datasets
- **Caching**: Application-level caching for frequently accessed data

### 3. **Scalability**
- **Horizontal Scaling**: Junction tables support sharding
- **Vertical Scaling**: Optimized for read-heavy workloads
- **Future Growth**: Easy to add new relationship types

## Best Practices

### 1. **Data Management**
- Always use junction tables for many-to-many relationships
- Implement proper foreign key constraints
- Use appropriate data types (JSONB for flexible data)
- Add validation at the database level

### 2. **Performance**
- Create indexes for all foreign keys
- Use GIN indexes for JSONB columns
- Monitor query performance regularly
- Optimize views for common use cases

### 3. **Maintenance**
- Regular database maintenance (VACUUM, ANALYZE)
- Monitor index usage and performance
- Keep statistics up to date
- Regular backup and recovery testing

## Migration Commands

### Apply the Restructure
```bash
# Apply the main restructure migration
psql -h your-db-host -U your-user -d your-database -f supabase/migrations/restructure_facilities_system.sql

# Apply the cleanup migration (after testing)
psql -h your-db-host -U your-user -d your-database -f supabase/migrations/cleanup_old_facilities_structure.sql
```

### Verify Migration
```sql
-- Check that new tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'facility_%';

-- Check that views are working
SELECT COUNT(*) FROM facilities_basic;
SELECT COUNT(*) FROM facilities_with_properties;
SELECT COUNT(*) FROM facilities_with_requirements;
```

## Conclusion

This restructured architecture provides:
- **Better Performance**: Optimized queries and indexing
- **Improved Maintainability**: Clear relationships and modular design
- **Enhanced Scalability**: Support for growth and new features
- **Data Integrity**: Proper constraints and validation
- **Developer Experience**: Simpler queries and debugging

The migration is designed to be safe and reversible, with proper data validation at each step. The new structure follows database normalization principles while maintaining the flexibility needed for the application's requirements. 