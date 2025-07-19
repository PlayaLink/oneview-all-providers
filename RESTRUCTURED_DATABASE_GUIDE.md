# Restructured Database Architecture Guide

## Overview

This guide explains the restructured database architecture for the OneView All Providers application. The restructure transforms the original array-based design into a normalized, performant, and maintainable database structure.

## Key Improvements

### 🚀 **Performance Benefits**
- **Proper Indexing**: Every foreign key has dedicated indexes
- **Efficient Queries**: Direct relationships instead of array operations
- **Optimized Views**: Pre-computed aggregations for common queries
- **Better Query Planning**: PostgreSQL can optimize joins effectively

### 🛡️ **Data Integrity**
- **Referential Integrity**: Foreign key constraints ensure data consistency
- **Validation**: Proper data types and constraints
- **Audit Trail**: Clear relationship tracking with timestamps

### 🔧 **Maintainability**
- **Clear Relationships**: Explicit junction tables
- **Modular Design**: Each table has a single responsibility
- **Easy Debugging**: Simple queries for troubleshooting
- **Scalable**: Easy to add new features without breaking existing code

## Database Schema

### Core Tables

#### 1. **facilities** (Simplified)
```sql
facilities (
  id UUID PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

#### 2. **facility_properties** (Property Templates)
```sql
facility_properties (
  id UUID PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  group TEXT NOT NULL,
  type TEXT NOT NULL,
  default_value TEXT,
  is_required BOOLEAN DEFAULT false,
  validation_rules JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

#### 3. **facility_property_values** (Actual Values)
```sql
facility_property_values (
  id UUID PRIMARY KEY,
  facility_id UUID REFERENCES facilities(id),
  facility_property_id UUID REFERENCES facility_properties(id),
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(facility_id, facility_property_id)
)
```

#### 4. **requirements** (Requirement Templates)
```sql
requirements (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  key TEXT UNIQUE NOT NULL,
  group TEXT NOT NULL,
  label TEXT NOT NULL,
  note TEXT,
  visible BOOLEAN DEFAULT true,
  required BOOLEAN DEFAULT false,
  credentialing_entities UUID[],
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

#### 5. **requirement_data_fields** (Requirement Field Templates)
```sql
requirement_data_fields (
  id UUID PRIMARY KEY,
  requirement_id UUID REFERENCES requirements(id),
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  data_type TEXT NOT NULL,
  default_value TEXT,
  is_required BOOLEAN DEFAULT false,
  validation_rules JSONB,
  order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(requirement_id, key)
)
```

#### 6. **facility_requirement_values** (Actual Requirement Values)
```sql
facility_requirement_values (
  id UUID PRIMARY KEY,
  facility_id UUID REFERENCES facilities(id),
  requirement_id UUID REFERENCES requirements(id),
  requirement_data_field_id UUID REFERENCES requirement_data_fields(id),
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(facility_id, requirement_id, requirement_data_field_id)
)
```

### Junction Tables

#### 7. **facility_providers** (Many-to-Many)
```sql
facility_providers (
  id UUID PRIMARY KEY,
  facility_id UUID REFERENCES facilities(id),
  provider_id UUID REFERENCES providers(id),
  role TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(facility_id, provider_id)
)
```

#### 8. **facility_requirements** (Many-to-Many)
```sql
facility_requirements (
  id UUID PRIMARY KEY,
  facility_id UUID REFERENCES facilities(id),
  requirement_id UUID REFERENCES requirements(id),
  is_active BOOLEAN DEFAULT true,
  assigned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(facility_id, requirement_id)
)
```

## Optimized Views

### 1. **facilities_basic** (Fast List View)
```sql
-- Shows facility info with counts
-- Fast performance for list views
-- Includes active provider count
SELECT * FROM facilities_basic;
```

### 2. **facilities_with_properties** (Property Display)
```sql
-- Properties grouped by category
-- Includes default values
-- Optimized for property display
SELECT * FROM facilities_with_properties;
```

### 3. **facilities_with_requirements** (Requirement Display)
```sql
-- Requirements with data fields
-- Ordered by field order
-- Includes validation rules
SELECT * FROM facilities_with_requirements;
```

### 4. **facilities_with_all_data** (Comprehensive View)
```sql
-- Comprehensive view with all relationships
-- Optimized for detail pages
-- JSON aggregation for frontend consumption
SELECT * FROM facilities_with_all_data;
```

## Usage Examples

### 1. **Adding a Property to a Facility**

```typescript
import { updateFacilityPropertyValueByKey } from '@/lib/supabaseClient';

// Update a facility's bed count
await updateFacilityPropertyValueByKey(
  'facility-uuid', 
  'bed_count', 
  250
);

// Update a facility's services
await updateFacilityPropertyValueByKey(
  'facility-uuid', 
  'services_offered', 
  ['emergency', 'surgery', 'cardiology']
);
```

### 2. **Assigning Requirements to a Facility**

```typescript
import { createFacilityRequirementValue } from '@/lib/supabaseClient';

// Assign a requirement value
await createFacilityRequirementValue({
  facility_id: 'facility-uuid',
  requirement_id: 'requirement-uuid',
  requirement_data_field_id: 'field-uuid',
  value: 'completed'
});
```

### 3. **Querying Facilities with Requirements**

```typescript
import { fetchFacilitiesWithRequirements } from '@/lib/supabaseClient';

// Get all facilities with their requirements
const facilities = await fetchFacilitiesWithRequirements();

// Get facilities with specific requirement
const facilitiesWithLicense = facilities.filter(f => 
  f.requirements.some(r => r.key === 'state_license')
);
```

### 4. **Adding a Provider to a Facility**

```typescript
import { supabase } from '@/lib/supabaseClient';

await supabase
  .from('facility_providers')
  .insert({
    facility_id: 'facility-uuid',
    provider_id: 'provider-uuid',
    role: 'attending',
    start_date: '2024-01-01',
    is_active: true
  });
```

## Migration Process

### Step 1: Apply the Migration
```bash
# Apply the comprehensive restructure migration
psql -h your-db-host -U your-user -d your-database -f supabase/migrations/comprehensive_database_restructure.sql
```

### Step 2: Seed the Database
```bash
# Run the seeding script
npx tsx scripts/seed-restructured-database.ts
```

### Step 3: Test the Structure
```bash
# Run the testing script
npx tsx scripts/test-restructured-database.ts
```

### Step 4: Clean Up Old Structure (Optional)
```bash
# After testing, remove old array columns
psql -h your-db-host -U your-user -d your-database -f supabase/migrations/cleanup_old_facilities_structure.sql
```

## Best Practices

### 1. **Data Management**
- Always use junction tables for many-to-many relationships
- Implement proper foreign key constraints
- Use JSONB for flexible data storage
- Add validation at the database level

### 2. **Performance**
- Create indexes for all foreign keys
- Use GIN indexes for JSONB columns
- Monitor query performance regularly
- Use appropriate views for different use cases

### 3. **Query Optimization**
- Use `facilities_basic` for list views
- Use `facilities_with_properties` for property display
- Use `facilities_with_requirements` for requirement display
- Use `facilities_with_all_data` for detail pages

### 4. **Frontend Integration**
- Use the provided helper functions in `supabaseClient.ts`
- Handle JSONB values properly in the frontend
- Use type conversion functions for different data types
- Implement proper error handling

## Common Queries

### Get Facility with All Data
```sql
SELECT * FROM facilities_with_all_data WHERE id = 'facility-uuid';
```

### Get Facilities by Property Value
```sql
SELECT f.* 
FROM facilities f
JOIN facility_property_values fpv ON f.id = fpv.facility_id
JOIN facility_properties fp ON fpv.facility_property_id = fp.id
WHERE fp.key = 'bed_count' AND fpv.value::int > 100;
```

### Get Active Providers for a Facility
```sql
SELECT p.*, fp.role
FROM facility_providers fp
JOIN providers p ON fp.provider_id = p.id
WHERE fp.facility_id = 'facility-uuid' AND fp.is_active = true;
```

### Get Requirements for a Facility
```sql
SELECT r.*, rdf.*, frv.value
FROM facility_requirements fr
JOIN requirements r ON fr.requirement_id = r.id
JOIN requirement_data_fields rdf ON rdf.requirement_id = r.id
LEFT JOIN facility_requirement_values frv ON 
  frv.facility_id = fr.facility_id AND 
  frv.requirement_id = r.id AND 
  frv.requirement_data_field_id = rdf.id
WHERE fr.facility_id = 'facility-uuid' AND fr.is_active = true
ORDER BY rdf."order";
```

## Troubleshooting

### Common Issues

1. **Missing Data**: Check if junction tables have the correct relationships
2. **Performance Issues**: Verify indexes are created properly
3. **JSONB Errors**: Ensure values are properly formatted for JSONB storage
4. **Foreign Key Violations**: Check referential integrity constraints

### Debugging Queries

```sql
-- Check facility relationships
SELECT 
  f.label,
  COUNT(fpv.id) as property_count,
  COUNT(fr.id) as requirement_count,
  COUNT(fpr.id) as provider_count
FROM facilities f
LEFT JOIN facility_property_values fpv ON f.id = fpv.facility_id
LEFT JOIN facility_requirements fr ON f.id = fr.facility_id
LEFT JOIN facility_providers fpr ON f.id = fpr.facility_id
GROUP BY f.id, f.label;

-- Check orphaned records
SELECT 'property_values' as table_name, COUNT(*) as orphaned_count
FROM facility_property_values fpv
LEFT JOIN facilities f ON fpv.facility_id = f.id
WHERE f.id IS NULL
UNION ALL
SELECT 'requirement_values' as table_name, COUNT(*) as orphaned_count
FROM facility_requirement_values frv
LEFT JOIN facilities f ON frv.facility_id = f.id
WHERE f.id IS NULL;
```

## Conclusion

This restructured architecture provides:
- **Better Performance**: Optimized queries and indexing
- **Improved Maintainability**: Clear relationships and modular design
- **Enhanced Scalability**: Support for growth and new features
- **Data Integrity**: Proper constraints and validation
- **Developer Experience**: Simpler queries and debugging

The migration is designed to be safe and reversible, with proper data validation at each step. The new structure follows database normalization principles while maintaining the flexibility needed for the application's requirements. 