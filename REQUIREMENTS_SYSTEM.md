# Requirements System Architecture

This document describes the requirements system that allows you to define and manage various types of requirements with associated data.

## Database Schema

### Tables

#### 1. `requirement_data` Table
Stores individual data items that can be referenced by requirements.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `label` | TEXT | Human-readable label for the data item |
| `value` | TEXT | The actual data value |
| `data_type` | ENUM | Type of data (text, number, boolean, date, email, url, phone, select, multi_select, file, json) |
| `key` | TEXT | Unique identifier for the data item |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

#### 2. `requirements` Table
Stores requirement definitions with references to requirement_data items.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `type` | ENUM | Type of requirement (facility, board) |
| `key` | TEXT | Unique identifier for the requirement |
| `group` | TEXT | Logical grouping for requirements |
| `label` | TEXT | Human-readable label for the requirement |
| `note` | TEXT | Additional notes or description |
| `visible` | BOOLEAN | Whether the requirement is visible in the UI |
| `required` | BOOLEAN | Whether this requirement is mandatory for compliance |
| `credentialing_entity` | UUID | Reference to the credentialing entity (e.g., facility affiliation ID) |
| `data` | UUID[] | Array of requirement_data IDs |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### Views

#### `requirements_with_data` View
A convenient view that joins requirements with their associated data items, returning the data as a JSON array.

## Usage Examples

### Creating a Validation Requirement

```typescript
import { createRequirementData, createRequirement } from '@/lib/supabaseClient';

// First, create the data items
const emailValidationData = await createRequirementData({
  label: 'Email Validation Regex',
  value: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
  data_type: 'text',
  key: 'email_regex'
});

const ageValidationData = await createRequirementData({
  label: 'Minimum Age',
  value: '18',
  data_type: 'number',
  key: 'min_age'
});

// Then create the requirement that references these data items
const validationRequirement = await createRequirement({
  type: 'facility',
  key: 'facility_licensing_validation',
  group: 'licensing',
  label: 'Facility Licensing Validation Rules',
  note: 'Validation rules for facility licensing',
  visible: true,
  credentialing_entity: 'facility-affiliation-uuid-here',
  data: [emailValidationData[0].id, ageValidationData[0].id]
});
```

### Fetching Requirements with Data

```typescript
import { fetchRequirementsWithData } from '@/lib/supabaseClient';

// Get all requirements with their associated data
const requirements = await fetchRequirementsWithData();

// Each requirement will have a `requirement_data_items` array
requirements.forEach(req => {
  console.log(`Requirement: ${req.label}`);
  req.requirement_data_items.forEach(dataItem => {
    console.log(`  - ${dataItem.label}: ${dataItem.value} (${dataItem.data_type})`);
  });
});
```

### Searching Requirements

```typescript
import { searchRequirements } from '@/lib/supabaseClient';

// Search for requirements containing "validation"
const validationReqs = await searchRequirements('validation');

// Search with filters
const licensingReqs = await searchRequirements('licensing', {
  group: 'licensing',
  type: 'facility',
  visible: true,
  credentialing_entity: 'facility-affiliation-uuid'
});
```

## Data Types

### Requirement Types
- `validation`: Data validation rules
- `business_rule`: Business logic requirements
- `compliance`: Regulatory compliance requirements
- `functional`: Functional requirements
- `non_functional`: Non-functional requirements (performance, security, etc.)
- `technical`: Technical specifications
- `user_story`: User story requirements
- `acceptance_criteria`: Acceptance criteria for features

### Data Types
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
psql -h your-db-host -U your-user -d your-database -f supabase/migrations/create_requirements_tables.sql
```

### 2. Seed Sample Data
```bash
# Run the seeding script
npx tsx scripts/seed-requirements.ts
```

## Frontend Integration

The system includes TypeScript types and database client functions for easy integration:

```typescript
import { 
  Requirement, 
  RequirementData, 
  RequirementType,
  REQUIREMENT_TYPE_LABELS 
} from '@/types/requirements';

// Use the types in your components
const requirement: Requirement = {
  id: 'uuid',
  type: 'facility',
  key: 'facility_validation',
  group: 'licensing',
  label: 'Facility Validation',
  note: 'Validates facility requirements',
  visible: true,
  required: true,
  credentialing_entity: 'facility-affiliation-uuid',
  data: ['data-uuid-1', 'data-uuid-2'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

// Use the labels for display
console.log(REQUIREMENT_TYPE_LABELS[requirement.type]); // "Validation"
```

## Best Practices

1. **Naming Conventions**: Use descriptive keys and labels
2. **Grouping**: Use meaningful group names to organize requirements
3. **Data Types**: Choose appropriate data types for validation and display
4. **Reusability**: Create reusable data items that can be referenced by multiple requirements
5. **Documentation**: Use the `note` field to provide additional context

## API Functions

### Requirement Data Functions
- `fetchRequirementData()` - Get all requirement data items
- `fetchRequirementDataById(id)` - Get specific data item
- `fetchRequirementDataByKey(key)` - Get data item by key
- `createRequirementData(data)` - Create new data item
- `updateRequirementData(id, data)` - Update existing data item
- `deleteRequirementData(id)` - Delete data item

### Requirement Functions
- `fetchRequirements()` - Get all requirements
- `fetchRequirementsWithData()` - Get requirements with joined data
- `fetchRequirementById(id)` - Get specific requirement
- `fetchRequirementByKey(key)` - Get requirement by key
- `fetchRequirementsByGroup(groupName)` - Get requirements by group
- `fetchRequirementsByType(type)` - Get requirements by type
- `fetchRequirementsByCredentialingEntity(entityId)` - Get requirements by credentialing entity
- `fetchVisibleRequirements()` - Get only visible requirements
- `fetchRequirementsByTypeAndEntity(type, entityId)` - Get requirements by type and entity
- `createRequirement(data)` - Create new requirement
- `updateRequirement(id, data)` - Update existing requirement
- `deleteRequirement(id)` - Delete requirement
- `searchRequirements(term, filters)` - Search requirements with visibility and entity filters
- `fetchRequirementDataByIds(ids)` - Get multiple data items by IDs 