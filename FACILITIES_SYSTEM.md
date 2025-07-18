# Facilities System Architecture

This document describes the facilities system that allows you to manage healthcare facilities with their properties, requirements, and associated providers.

## Database Schema

### Tables

#### 1. `facility_properties` Table
Stores individual property definitions for facilities.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `key` | TEXT | Unique identifier for the property |
| `label` | TEXT | Human-readable label for the property |
| `group` | TEXT | Logical grouping for properties |
| `value` | TEXT | The actual property value |
| `type` | TEXT | Data type (text, number, boolean, date, email, url, phone, single-select, multi-select, file, oneview_record) |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

#### 2. `facilities` Table
Stores facility information with references to properties, requirements, and providers.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `label` | TEXT | Human-readable facility name |
| `icon` | TEXT | Icon identifier for the facility |
| `facility_properties` | UUID[] | Array of facility_properties IDs |
| `requirements` | UUID[] | Array of requirements IDs |
| `providers` | UUID[] | Array of providers IDs |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### Views

#### `facilities_with_properties` View
A view that joins facilities with their associated property details.

#### `facilities_with_all_data` View
A comprehensive view that joins facilities with properties, requirements, and provider details.

## Usage Examples

### Creating a Facility Property

```typescript
import { createFacilityProperty } from '@/lib/supabaseClient';

const bedCountProperty = await createFacilityProperty({
  key: 'bed_count',
  label: 'Number of Beds',
  group: 'capacity',
  value: '250',
  type: 'number'
});

const facilityTypeProperty = await createFacilityProperty({
  key: 'facility_type',
  label: 'Facility Type',
  group: 'basic_info',
  value: 'hospital',
  type: 'single-select'
});
```

### Creating a Facility

```typescript
import { createFacility } from '@/lib/supabaseClient';

const medicalCenter = await createFacility({
  label: 'General Medical Center',
  icon: 'hospital',
  facility_properties: [bedCountProperty[0].id, facilityTypeProperty[0].id],
  requirements: [requirementId1, requirementId2],
  providers: [providerId1, providerId2, providerId3]
});
```

### Fetching Facilities with All Data

```typescript
import { fetchFacilitiesWithAllData } from '@/lib/supabaseClient';

// Get all facilities with their properties, requirements, and providers
const facilities = await fetchFacilitiesWithAllData();

// Each facility will have detailed information
facilities.forEach(facility => {
  console.log(`Facility: ${facility.label}`);
  
  facility.facility_property_details.forEach(prop => {
    console.log(`  - ${prop.label}: ${prop.value} (${prop.type})`);
  });
  
  facility.requirement_details.forEach(req => {
    console.log(`  - Requirement: ${req.label} (${req.type})`);
  });
  
  facility.provider_details.forEach(provider => {
    console.log(`  - Provider: ${provider.first_name} ${provider.last_name}`);
  });
});
```

### Searching Facilities

```typescript
import { searchFacilities } from '@/lib/supabaseClient';

// Search for facilities containing "medical"
const medicalFacilities = await searchFacilities('medical');

// Search with filters
const hospitals = await searchFacilities('hospital', {
  icon: 'hospital'
});
```

## Property Types

The facility properties support the same data types as the requirements system:

- `text`: Plain text data
- `number`: Numeric data
- `boolean`: True/false values
- `date`: Date values
- `email`: Email addresses
- `url`: URLs
- `phone`: Phone numbers
- `single-select`: Single selection from options
- `multi-select`: Multiple selections from options
- `file`: File references
- `oneview_record`: OneView record references

## Migration and Setup

### 1. Run the Migration
```bash
# Apply the migration to create the tables
psql -h your-db-host -U your-user -d your-database -f supabase/migrations/create_facilities_and_facility_properties_tables.sql
```

### 2. Seed Sample Data
```bash
# Run the seeding script
npx tsx scripts/seed-facilities.ts
```

## Frontend Integration

The system includes TypeScript types and database client functions for easy integration:

```typescript
import { 
  Facility, 
  FacilityProperty, 
  FacilityWithAllData,
  FACILITY_PROPERTY_TYPE_LABELS 
} from '@/types/facilities';

// Use the types in your components
const facility: Facility = {
  id: 'uuid',
  label: 'General Medical Center',
  icon: 'hospital',
  facility_properties: ['prop-uuid-1', 'prop-uuid-2'],
  requirements: ['req-uuid-1', 'req-uuid-2'],
  providers: ['provider-uuid-1', 'provider-uuid-2'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

// Use the labels for display
console.log(FACILITY_PROPERTY_TYPE_LABELS['number']); // "Number"
```

## Best Practices

1. **Property Organization**: Use meaningful group names to organize facility properties
2. **Icon Consistency**: Use consistent icon identifiers across your application
3. **Data Types**: Choose appropriate data types for validation and display
4. **Reusability**: Create reusable properties that can be shared across multiple facilities
5. **Documentation**: Use descriptive labels and keys for properties

## API Functions

### Facility Properties Functions
- `fetchFacilityProperties()` - Get all facility properties
- `fetchFacilityPropertyById(id)` - Get specific property
- `fetchFacilityPropertyByKey(key)` - Get property by key
- `fetchFacilityPropertiesByGroup(groupName)` - Get properties by group
- `createFacilityProperty(data)` - Create new property
- `updateFacilityProperty(id, data)` - Update existing property
- `deleteFacilityProperty(id)` - Delete property

### Facility Functions
- `fetchFacilities()` - Get all facilities
- `fetchFacilitiesWithProperties()` - Get facilities with property details
- `fetchFacilitiesWithAllData()` - Get facilities with all related data
- `fetchFacilityById(id)` - Get specific facility
- `fetchFacilitiesByLabel(label)` - Get facilities by label
- `createFacility(data)` - Create new facility
- `updateFacility(id, data)` - Update existing facility
- `deleteFacility(id)` - Delete facility
- `searchFacilities(term, filters)` - Search facilities
- `searchFacilityProperties(term, filters)` - Search facility properties
- `fetchFacilityPropertiesByIds(ids)` - Get multiple properties by IDs

## Relationship with Other Systems

### Requirements Integration
Facilities can reference multiple requirements, allowing you to:
- Track compliance requirements for each facility
- Manage facility-specific validation rules
- Link facility requirements to credentialing entities

### Provider Integration
Facilities can be associated with multiple providers, enabling:
- Track which providers work at each facility
- Manage facility-specific provider requirements
- Link facility affiliations to facility records

### Facility Properties Integration
Facilities can have multiple properties, providing:
- Flexible facility data management
- Reusable property definitions
- Structured facility information storage 