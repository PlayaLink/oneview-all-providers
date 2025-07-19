# Complete Database Schema

This document contains the complete list of all tables in your database with their full schemas.

## **1. Core Provider Tables**

### **providers**
```sql
CREATE TABLE providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  prefix TEXT,
  first_name TEXT,
  middle_name TEXT,
  last_name TEXT,
  suffix TEXT,
  pronouns TEXT,
  title TEXT,
  primary_specialty TEXT,
  classifications TEXT[],
  taxonomy_codes TEXT[],
  clinical_services TEXT[],
  marital_status TEXT,
  telemed_exp TEXT,
  fluent_languages TEXT[],
  cms_medicare_specialty_codes TEXT[],
  work_email TEXT,
  personal_email TEXT,
  mobile_phone_number TEXT,
  mobile_phone_carrier_name TEXT,
  pager_number TEXT,
  fax_number TEXT,
  emergency_contact_name TEXT,
  emergency_contact_email TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  social_security_number TEXT,
  npi_number TEXT,
  last_updated DATE,
  enumeration_date DATE,
  driver_license_or_id_number TEXT,
  state_issued TEXT,
  issue_date DATE,
  expiration_date DATE,
  tags TEXT[],
  other_specialties TEXT[]
);
```

### **birth_info**
```sql
CREATE TABLE birth_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  date_of_birth DATE,
  country_of_citizenship TEXT,
  citizenship_work_auth TEXT,
  us_work_auth TEXT,
  tags TEXT[],
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  birth_city TEXT,
  birth_state_province TEXT,
  birth_county TEXT,
  birth_country TEXT,
  gender TEXT,
  identifies_transgender BOOLEAN,
  hair_color TEXT,
  eye_color TEXT,
  height_ft INTEGER,
  height_in INTEGER,
  weight_lbs INTEGER,
  ethnicity TEXT
);
```

### **addresses**
```sql
CREATE TABLE addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  type TEXT,
  address TEXT,
  address_2 TEXT,
  city TEXT,
  state TEXT,
  zip_postal_code TEXT,
  phone_number TEXT,
  email TEXT,
  start_date DATE,
  end_date DATE,
  county TEXT,
  country TEXT,
  tags TEXT[],
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **state_licenses**
```sql
CREATE TABLE state_licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  license_type TEXT,
  license TEXT,
  license_additional_info TEXT,
  state TEXT,
  status TEXT,
  issue_date DATE,
  expiration_date DATE,
  expires_within TEXT,
  dont_renew BOOLEAN,
  is_primary BOOLEAN,
  is_multistate BOOLEAN,
  taxonomy_code TEXT,
  enrolled_in_pdmp BOOLEAN,
  fee_exemption TEXT,
  tags TEXT[],
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## **2. Facility System Tables**

### **facilities**
```sql
CREATE TABLE facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT,
  facility_properties UUID[] DEFAULT '{}', -- Array of facility_properties IDs
  requirements UUID[] DEFAULT '{}', -- Array of requirements IDs
  providers UUID[] DEFAULT '{}', -- Array of providers IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **facility_properties**
```sql
CREATE TABLE facility_properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  "group" TEXT NOT NULL,
  value TEXT,
  type TEXT NOT NULL DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **facility_property_values**
```sql
CREATE TABLE facility_property_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  facility_property_id UUID NOT NULL REFERENCES facility_properties(id) ON DELETE CASCADE,
  value JSONB, -- Use JSONB to store different data types
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(facility_id, facility_property_id)
);
```

### **facility_affiliations**
```sql
CREATE TABLE facility_affiliations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  staff_category TEXT,
  in_good_standing BOOLEAN,
  currently_affiliated BOOLEAN,
  appt_end_date DATE,
  start_date DATE,
  end_date DATE,
  reason_for_leaving TEXT,
  accepting_new_patients BOOLEAN,
  telemedicine BOOLEAN,
  takes_calls BOOLEAN,
  admitting_privileges BOOLEAN,
  primary_affiliation BOOLEAN,
  tags TEXT[],
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **contacts**
```sql
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
```

## **3. Requirements System Tables**

### **requirements**
```sql
CREATE TABLE requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type requirement_type NOT NULL, -- ENUM: 'facility', 'board'
  key TEXT NOT NULL UNIQUE,
  "group" TEXT NOT NULL,
  label TEXT NOT NULL,
  note TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  required BOOLEAN NOT NULL DEFAULT false,
  credentialing_entities UUID[] DEFAULT '{}', -- Array of facility IDs
  data UUID[] DEFAULT '{}', -- Array of requirement_data IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **requirement_data**
```sql
CREATE TABLE requirement_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT,
  data_type requirement_data_type NOT NULL DEFAULT 'text', -- ENUM
  key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **facility_requirement_values**
```sql
CREATE TABLE facility_requirement_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  requirement_id UUID REFERENCES requirements(id) ON DELETE CASCADE,
  requirement_data_id UUID REFERENCES requirement_data(id) ON DELETE CASCADE,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(facility_id, requirement_id, requirement_data_id)
);
```

## **4. Grid System Tables**

### **grid_sections**
```sql
CREATE TABLE grid_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0
);
```

### **grid_definitions**
```sql
CREATE TABLE grid_definitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  "group" TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  default_visible BOOLEAN NOT NULL DEFAULT true,
  table_name TEXT NOT NULL DEFAULT '',
  section_id UUID REFERENCES grid_sections(id),
  "order" INTEGER NOT NULL DEFAULT 0
);
```

### **grid_columns**
```sql
CREATE TABLE grid_columns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  grid_id UUID NOT NULL REFERENCES grid_definitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  type TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  width INTEGER,
  options JSONB,
  required BOOLEAN DEFAULT false,
  "group" TEXT,
  description TEXT,
  UNIQUE(grid_id, name)
);
```

### **grid_field_groups**
```sql
CREATE TABLE grid_field_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  grid_id UUID NOT NULL REFERENCES grid_definitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0
);
```

## **5. Feature Settings Table**

### **feature_settings**
```sql
CREATE TABLE feature_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## **6. Document Management Table**

### **documents**
```sql
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  record_id UUID NOT NULL,
  name TEXT NOT NULL,
  size INTEGER,
  document_type TEXT,
  permission TEXT,
  date DATE,
  exp_date DATE,
  verif_date DATE,
  exp_na BOOLEAN DEFAULT false,
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

## **7. Notes Table**

### **notes**
```sql
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  author TEXT NOT NULL,
  record_id UUID NOT NULL,
  record_type TEXT NOT NULL
);
```

## **Summary**

**Total Tables: 18**

**Core Provider Tables: 4**
- providers
- birth_info
- addresses
- state_licenses

**Facility System Tables: 5**
- facilities
- facility_properties
- facility_property_values
- facility_affiliations
- contacts

**Requirements System Tables: 3**
- requirements
- requirement_data
- facility_requirement_values

**Grid System Tables: 4**
- grid_sections
- grid_definitions
- grid_columns
- grid_field_groups

**Other Tables: 2**
- feature_settings
- documents
- notes

## **Migration Files Created**

1. `create_documents_table.sql` ✅
2. `create_notes_table.sql` ✅
3. `create_state_licenses_table.sql` ✅
4. `create_facility_requirement_values_table.sql` ✅
5. `create_facility_affiliations_table.sql` ✅
6. `create_contacts_table.sql` ✅

All missing migration files have been created and your database schema is now complete! 