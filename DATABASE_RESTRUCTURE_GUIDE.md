# Database Restructure Guide

## Overview

Your current database architecture has several issues that make it difficult to maintain, query efficiently, and ensure data integrity. This guide provides a comprehensive restructuring recommendation that addresses these problems.

## Current Problems

### 1. **Array-Based Relationships**
```sql
-- Current problematic approach
CREATE TABLE facilities (
  facility_properties UUID[] DEFAULT '{}', -- ❌ Array of UUIDs
  requirements UUID[] DEFAULT '{}',        -- ❌ Array of UUIDs  
  providers UUID[] DEFAULT '{}'            -- ❌ Array of UUIDs
);
```

**Problems:**
- Complex queries requiring `unnest()` and `CROSS JOIN LATERAL`
- No referential integrity (can reference non-existent UUIDs)
- Difficult to add metadata to relationships (like roles, dates, status)
- Poor performance with large arrays
- Hard to maintain and debug

### 2. **Inconsistent Data Storage**
- Properties stored in both `facility_properties` table AND as arrays in `facilities`
- Requirements referenced in multiple places without clear ownership
- Missing junction table for `facility_requirement_values` (exists in code but no migration)

### 3. **Overly Complex Views**
- Multiple views trying to solve the same problem
- Complex JSON aggregation that's hard to maintain
- Views with poor performance due to nested subqueries

## Recommended Solution

### 1. **Proper Junction Tables**

Instead of arrays, use proper junction tables:

```sql
-- ✅ Clean junction table approach
CREATE TABLE facility_providers (
  facility_id UUID REFERENCES facilities(id),
  provider_id UUID REFERENCES providers(id),
  role TEXT NOT NULL,           -- Can store role information
  department TEXT,              -- Can store department
  start_date DATE,              -- Can store start date
  is_active BOOLEAN DEFAULT true,
  PRIMARY KEY (facility_id, provider_id)
);
```

### 2. **Normalized Structure**

```sql
-- Core facility information
CREATE TABLE facilities (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  facility_type TEXT NOT NULL,
  status TEXT NOT NULL,
  -- ... other basic fields
);

-- Property definitions (templates)
CREATE TABLE facility_properties (
  id UUID PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  data_type TEXT NOT NULL,
  -- ... other definition fields
);

-- Actual property values (one per facility per property)
CREATE TABLE facility_property_values (
  facility_id UUID REFERENCES facilities(id),
  facility_property_id UUID REFERENCES facility_properties(id),
  value JSONB NOT NULL, -- Can store any data type
  PRIMARY KEY (facility_id, facility_property_id)
);
```

### 3. **Clear Data Flow**

```
Facilities → Facility Properties → Property Values
     ↓
Requirements → Requirement Data → Requirement Values
     ↓
Providers → Facility Providers (with roles)
```

## Key Benefits

### 1. **Data Integrity**
- Foreign key constraints ensure referential integrity
- No orphaned references
- Consistent data structure

### 2. **Query Performance**
- Simple JOINs instead of complex array operations
- Proper indexes on foreign keys
- Faster aggregations and filtering

### 3. **Flexibility**
- Easy to add metadata to relationships
- Simple to extend with new fields
- Clear ownership of data

### 4. **Maintainability**
- Clear table relationships
- Easy to understand and debug
- Simple to add new features

## Migration Strategy

### Phase 1: Create New Tables
1. Create the new normalized tables
2. Set up proper indexes and constraints
3. Create simplified views

### Phase 2: Migrate Data
1. Extract data from current arrays
2. Transform into junction table format
3. Validate data integrity

### Phase 3: Update Application
1. Update TypeScript types
2. Modify API functions
3. Update frontend components

### Phase 4: Cleanup
1. Drop old tables and views
2. Remove unused code
3. Update documentation

## Example Queries

### Before (Complex Array Queries)
```sql
-- ❌ Complex array-based query
SELECT f.label, r.label, rd.label
FROM facilities f
CROSS JOIN LATERAL unnest(f.requirements) AS req_id
JOIN requirements r ON r.id = req_id
CROSS JOIN LATERAL unnest(r.data) AS data_id
JOIN requirement_data rd ON rd.id = data_id;
```

### After (Simple JOINs)
```sql
-- ✅ Simple junction table query
SELECT f.name, r.label, rd.label, frv.value, frv.status
FROM facilities f
JOIN facility_requirement_values frv ON f.id = frv.facility_id
JOIN requirements r ON frv.requirement_id = r.id
JOIN requirement_data rd ON frv.requirement_data_id = rd.id
WHERE f.status = 'active';
```

## Implementation Steps

### 1. **Backup Current Data**
```sql
-- Create backup tables
CREATE TABLE facilities_backup AS SELECT * FROM facilities;
CREATE TABLE facility_properties_backup AS SELECT * FROM facility_properties;
```

### 2. **Run Migration Script**
Execute the `database_restructure_recommendation.sql` file

### 3. **Migrate Data**
```sql
-- Example: Migrate facility providers
INSERT INTO facility_providers (facility_id, provider_id, role)
SELECT 
  f.id as facility_id,
  unnest(f.providers) as provider_id,
  'attending' as role  -- Default role
FROM facilities f
WHERE f.providers IS NOT NULL AND array_length(f.providers, 1) > 0;
```

### 4. **Update Application Code**
- Update TypeScript interfaces
- Modify API functions in `supabaseClient.ts`
- Update frontend components

## TypeScript Interface Updates

### Before
```typescript
interface Facility {
  facility_properties: string[]; // Array of UUIDs
  requirements: string[];        // Array of UUIDs
  providers: string[];           // Array of UUIDs
}
```

### After
```typescript
interface Facility {
  id: string;
  name: string;
  facility_type: string;
  status: string;
  // ... other basic fields
}

interface FacilityProvider {
  facility_id: string;
  provider_id: string;
  role: string;
  department?: string;
  is_active: boolean;
}

interface FacilityPropertyValue {
  facility_id: string;
  facility_property_id: string;
  value: any; // JSONB
}
```

## Testing Strategy

### 1. **Data Integrity Tests**
- Verify all foreign key relationships
- Check for orphaned records
- Validate data types

### 2. **Performance Tests**
- Compare query performance before/after
- Test with large datasets
- Monitor index usage

### 3. **Application Tests**
- Test all CRUD operations
- Verify UI displays correctly
- Check data consistency

## Rollback Plan

If issues arise during migration:

1. **Keep backup tables** until migration is fully validated
2. **Create rollback scripts** to restore original structure
3. **Test rollback process** before starting migration
4. **Monitor closely** during initial deployment

## Conclusion

This restructuring will significantly improve your database architecture by:

- **Eliminating complex array operations**
- **Ensuring data integrity**
- **Improving query performance**
- **Making the system more maintainable**
- **Providing flexibility for future features**

The migration requires careful planning and testing, but the long-term benefits far outweigh the initial effort. 