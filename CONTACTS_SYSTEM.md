# Contacts System Architecture

This document describes the contacts system that allows you to manage contact information for facilities with various types and departments.

## Database Schema

### Tables

#### `contacts` Table
Stores contact information for facilities with various types and departments.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `facility_id` | UUID | Foreign key to facilities table |
| `type` | TEXT | Type of contact (general, credentialing, billing, emergency, administrative, clinical, technical) |
| `first_name` | TEXT | Contact's first name |
| `last_name` | TEXT | Contact's last name |
| `job_title` | TEXT | Contact's job title |
| `department` | TEXT | Contact's department |
| `restrictions` | TEXT | Any restrictions or special requirements |
| `preferred_contact_method` | TEXT | Preferred method of contact (email, phone, fax) |
| `email` | TEXT | Contact's email address |
| `phone` | TEXT | Contact's phone number |
| `fax` | TEXT | Contact's fax number |
| `notes` | TEXT | Additional notes about the contact |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### Contact Types
- `general`: General inquiries and information
- `credentialing`: Credentialing and provider enrollment
- `billing`: Billing and payment inquiries
- `emergency`: Emergency contact information
- `administrative`: Administrative and scheduling
- `clinical`: Clinical leadership and medical staff
- `technical`: Technical support and IT issues

### Preferred Contact Methods
- `email`: Email communication preferred
- `phone`: Phone communication preferred
- `fax`: Fax communication preferred

## Usage Examples

### Creating a Contact

```typescript
import { createContact } from '@/lib/supabaseClient';

const newContact = await createContact({
  facility_id: 'facility-uuid',
  type: 'credentialing',
  first_name: 'Brooke',
  last_name: 'Nuñez',
  job_title: 'Registration Program Specialist',
  department: 'Human Resources',
  restrictions: 'Manager Approval Required',
  preferred_contact_method: 'phone',
  email: 'brooke.nunez@blueridgehospital.com',
  phone: '(714) 674-8302',
  fax: '(714) 674-3673',
  notes: 'Primary credentialing contact'
});
```

### Fetching Contacts

```typescript
import { 
  fetchContacts, 
  fetchContactsByFacility, 
  fetchContactsByType,
  fetchContactsWithFacility 
} from '@/lib/supabaseClient';

// Get all contacts
const allContacts = await fetchContacts();

// Get contacts for a specific facility
const facilityContacts = await fetchContactsByFacility('facility-uuid');

// Get contacts by type
const credentialingContacts = await fetchContactsByType('credentialing');

// Get contacts with facility information
const contactsWithFacility = await fetchContactsWithFacility();
```

### Updating a Contact

```typescript
import { updateContact } from '@/lib/supabaseClient';

const updatedContact = await updateContact('contact-uuid', {
  job_title: 'Senior Registration Specialist',
  preferred_contact_method: 'email',
  notes: 'Updated contact information'
});
```

## Frontend Integration

The system includes TypeScript types and database client functions for easy integration:

```typescript
import { 
  Contact, 
  ContactType, 
  PreferredContactMethod,
  CONTACT_TYPE_LABELS,
  PREFERRED_CONTACT_METHOD_LABELS,
  getContactFullName,
  getContactDisplayInfo
} from '@/types/contacts';

// Use the types in your components
const contact: Contact = {
  id: 'uuid',
  facility_id: 'facility-uuid',
  type: 'credentialing',
  first_name: 'Brooke',
  last_name: 'Nuñez',
  job_title: 'Registration Program Specialist',
  department: 'Human Resources',
  restrictions: 'Manager Approval Required',
  preferred_contact_method: 'phone',
  email: 'brooke.nunez@blueridgehospital.com',
  phone: '(714) 674-8302',
  fax: '(714) 674-3673',
  notes: 'Primary credentialing contact',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

// Use the labels for display
console.log(CONTACT_TYPE_LABELS[contact.type]); // "Credentialing"
console.log(PREFERRED_CONTACT_METHOD_LABELS[contact.preferred_contact_method]); // "Phone"

// Use utility functions
console.log(getContactFullName(contact)); // "Brooke Nuñez"
console.log(getContactDisplayInfo(contact)); // "Brooke Nuñez - Registration Program Specialist (Human Resources)"
```

## Migration and Setup

### 1. Run the Migration
```sql
-- Create contacts table
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'general',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  job_title TEXT,
  department TEXT,
  restrictions TEXT,
  preferred_contact_method TEXT DEFAULT 'email',
  email TEXT,
  phone TEXT,
  fax TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_contacts_facility_id ON contacts(facility_id);
CREATE INDEX idx_contacts_type ON contacts(type);
CREATE INDEX idx_contacts_department ON contacts(department);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_last_name ON contacts(last_name);

-- Add triggers
CREATE TRIGGER update_contacts_updated_at 
  BEFORE UPDATE ON contacts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON TABLE contacts TO authenticated;
```

### 2. Seed Sample Data
```bash
# Run the seeding script
npx tsx scripts/seed-contacts.ts
```

## Best Practices

1. **Contact Types**: Use appropriate contact types to categorize contacts effectively
2. **Department Organization**: Use consistent department names across facilities
3. **Contact Methods**: Respect the preferred contact method for each contact
4. **Restrictions**: Document any special requirements or restrictions clearly
5. **Notes**: Use the notes field to provide additional context or special instructions

## API Functions

### Contact Management Functions
- `fetchContacts()` - Get all contacts
- `fetchContactsWithFacility()` - Get contacts with facility information
- `fetchContactsByFacility(facilityId)` - Get contacts for a specific facility
- `fetchContactsByType(type)` - Get contacts by type
- `fetchContactById(id)` - Get specific contact
- `createContact(data)` - Create new contact
- `updateContact(id, data)` - Update existing contact
- `deleteContact(id)` - Delete contact
- `searchContacts(searchTerm, filters)` - Search contacts with filters

### Search and Filter Options
- Search by name, job title, or department
- Filter by contact type
- Filter by department
- Filter by facility

## Integration with Other Systems

### Facility Integration
Contacts are linked to facilities through the `facility_id` foreign key, allowing you to:
- Display all contacts for a specific facility
- Filter contacts by facility
- Maintain contact information per facility

### Provider Integration
While contacts are primarily facility-focused, they can be used in conjunction with:
- Provider credentialing processes
- Facility affiliation management
- Emergency contact systems

## Security and Permissions

- Contacts are protected by Supabase Row Level Security (RLS)
- Only authenticated users can access contact information
- Contact data is linked to specific facilities for proper access control 