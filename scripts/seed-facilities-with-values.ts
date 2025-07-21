import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to convert property value based on type (same as in supabaseClient.ts)
function convertPropertyValue(value: any, propertyType: string): any {
  switch (propertyType) {
    case 'number':
      return typeof value === 'number' ? value : parseFloat(value?.toString() || '0');
    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        return value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
      }
      return false;
    case 'multi-select':
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
      }
      return [];
    case 'single-select':
    case 'text':
    case 'email':
    case 'url':
    case 'phone':
    default:
      // For JSONB storage, return the actual value, not a string
      return value || '';
  }
}

async function seedFacilities() {
  console.log('🌱 Seeding facilities table...');

  // Get some existing requirements and providers for references
  const { data: requirements } = await supabase
    .from('requirements')
    .select('id')
    .limit(5);

  const { data: providers } = await supabase
    .from('providers')
    .select('id')
    .limit(10);

  const requirementIds = requirements?.map(r => r.id) || [];
  const providerIds = providers?.map(p => p.id) || [];

  const facilities = [
    {
      label: 'Charlotte Mecklenburg Hospital Authority',
      icon: 'hospital',
      requirements: requirementIds.slice(0, 3),
      providers: providerIds.slice(0, 5)
    },
    {
      label: 'Cardiac Care Institute',
      icon: 'heart',
      requirements: requirementIds.slice(1, 4),
      providers: providerIds.slice(2, 7)
    },
    {
      label: 'Children\'s Hospital',
      icon: 'baby',
      requirements: requirementIds.slice(0, 2),
      providers: providerIds.slice(5, 10)
    },
    {
      label: 'Rehabilitation Center',
      icon: 'wheelchair',
      requirements: requirementIds.slice(2, 4),
      providers: providerIds.slice(0, 3)
    },
    {
      label: 'Emergency Trauma Center',
      icon: 'ambulance',
      requirements: requirementIds.slice(1, 3),
      providers: providerIds.slice(3, 8)
    }
  ];

  const { data: insertedFacilities, error: facilitiesError } = await supabase
    .from('facilities')
    .insert(facilities)
    .select();

  if (facilitiesError) {
    console.error('❌ Error seeding facilities:', facilitiesError);
    return;
  }

  console.log(`✅ Inserted ${insertedFacilities.length} facilities`);
  return insertedFacilities;
}

async function seedFacilityPropertyValues(facilities: any[]) {
  console.log('🌱 Seeding facility property values...');

  // Get all facility properties
  const { data: facilityProperties, error: propertiesError } = await supabase
    .from('facility_properties')
    .select('*');

  if (propertiesError) {
    console.error('❌ Error fetching facility properties:', propertiesError);
    return;
  }

  if (!facilityProperties || facilityProperties.length === 0) {
    console.error('❌ No facility properties found. Please run the facility properties seeding script first.');
    return;
  }

  // Create different values for each facility
  const facilityValues = [
    // Charlotte Mecklenburg Hospital Authority
    {
      facility_name: 'Charlotte Mecklenburg Hospital Authority',
      abbreviation: 'CMHA',
      facility_type: 'acute_care',
      facility_id: '123456',
      cmc_id: '345677',
      npi_number: '1234567890',
      clia_number: '12D1234567',
      tax_id: '12-3456789',
      group_medicare: '1234567890A',
      address_line1: '920 John Paul Jones Cir',
      city: 'Charlotte',
      state: 'North Carolina',
      country: 'United States of America',
      zip_code: '28202',
      phone: '(704) 355-2000',
      fax: '(704) 355-2001',
      website: 'www.cmha.org',
      near_public_transportation: 'Yes',
      handicap_access: 'Yes',
      credentialing_contact_name: 'Brooke Nuñez',
      credentialing_contact_title: 'Registration Program Specialist',
      credentialing_contact_phone: '(704) 355-2002',
      credentialing_contact_email: 'brooke.nunez@cmha.org',
      billing_name: 'Charlotte Mecklenburg Hospital Authority',
      billing_phone: '(704) 355-2003',
      payee: 'Medical Board of North Carolina',
      supplier_number: '4279-12312-12',
      time_to_complete: '90-120 Days from when Application is Submitted',
      approval_method: 'Signature',
      license_pending_meetings: 'No',
      dea_pending_meetings: 'Yes',
      payor_enrollment_required: 'Yes',
      primary_source_verification: 'Yes',
      application_type: 'Mapped',
      orientation_required: 'Yes',
      pay_application_fee: 'No',
      hospital_privilege_fee: '25.00'
    },
    // Cardiac Care Institute
    {
      facility_name: 'Cardiac Care Institute',
      abbreviation: 'CCI',
      facility_type: 'specialty_care',
      facility_id: '234567',
      cmc_id: '456788',
      npi_number: '2345678901',
      clia_number: '12D2345678',
      tax_id: '23-4567890',
      group_medicare: '2345678901B',
      address_line1: '123 Heart Center Dr',
      city: 'Raleigh',
      state: 'North Carolina',
      country: 'United States of America',
      zip_code: '27601',
      phone: '(919) 555-1000',
      fax: '(919) 555-1001',
      website: 'www.cardiacinstitute.org',
      near_public_transportation: 'Yes',
      handicap_access: 'Yes',
      credentialing_contact_name: 'Dr. Sarah Johnson',
      credentialing_contact_title: 'Medical Director',
      credentialing_contact_phone: '(919) 555-1002',
      credentialing_contact_email: 'sarah.johnson@cardiacinstitute.org',
      billing_name: 'Cardiac Care Institute',
      billing_phone: '(919) 555-1003',
      payee: 'Medical Board of North Carolina',
      supplier_number: '4279-23423-23',
      time_to_complete: '60-90 Days from when Application is Submitted',
      approval_method: 'Electronic',
      license_pending_meetings: 'Yes',
      dea_pending_meetings: 'Yes',
      payor_enrollment_required: 'No',
      primary_source_verification: 'Yes',
      application_type: 'Digital',
      orientation_required: 'No',
      pay_application_fee: 'Yes',
      hospital_privilege_fee: '50.00'
    },
    // Children's Hospital
    {
      facility_name: 'Children\'s Hospital',
      abbreviation: 'CH',
      facility_type: 'pediatric_care',
      facility_id: '345678',
      cmc_id: '567899',
      npi_number: '3456789012',
      clia_number: '12D3456789',
      tax_id: '34-5678901',
      group_medicare: '3456789012C',
      address_line1: '456 Pediatric Way',
      city: 'Durham',
      state: 'North Carolina',
      country: 'United States of America',
      zip_code: '27701',
      phone: '(919) 666-2000',
      fax: '(919) 666-2001',
      website: 'www.childrenshospital.org',
      near_public_transportation: 'Yes',
      handicap_access: 'Yes',
      credentialing_contact_name: 'Dr. Michael Chen',
      credentialing_contact_title: 'Pediatric Director',
      credentialing_contact_phone: '(919) 666-2002',
      credentialing_contact_email: 'michael.chen@childrenshospital.org',
      billing_name: 'Children\'s Hospital',
      billing_phone: '(919) 666-2003',
      payee: 'Medical Board of North Carolina',
      supplier_number: '4279-34534-34',
      time_to_complete: '75-105 Days from when Application is Submitted',
      approval_method: 'Hybrid',
      license_pending_meetings: 'No',
      dea_pending_meetings: 'No',
      payor_enrollment_required: 'Yes',
      primary_source_verification: 'Yes',
      application_type: 'Mapped',
      orientation_required: 'Yes',
      pay_application_fee: 'No',
      hospital_privilege_fee: '30.00'
    },
    // Rehabilitation Center
    {
      facility_name: 'Rehabilitation Center',
      abbreviation: 'RC',
      facility_type: 'rehabilitation',
      facility_id: '456789',
      cmc_id: '678900',
      npi_number: '4567890123',
      clia_number: '12D4567890',
      tax_id: '45-6789012',
      group_medicare: '4567890123D',
      address_line1: '789 Recovery Rd',
      city: 'Greensboro',
      state: 'North Carolina',
      country: 'United States of America',
      zip_code: '27401',
      phone: '(336) 777-3000',
      fax: '(336) 777-3001',
      website: 'www.rehabcenter.org',
      near_public_transportation: 'No',
      handicap_access: 'Yes',
      credentialing_contact_name: 'Lisa Rodriguez',
      credentialing_contact_title: 'Rehabilitation Coordinator',
      credentialing_contact_phone: '(336) 777-3002',
      credentialing_contact_email: 'lisa.rodriguez@rehabcenter.org',
      billing_name: 'Rehabilitation Center',
      billing_phone: '(336) 777-3003',
      payee: 'Medical Board of North Carolina',
      supplier_number: '4279-45645-45',
      time_to_complete: '45-60 Days from when Application is Submitted',
      approval_method: 'Signature',
      license_pending_meetings: 'Yes',
      dea_pending_meetings: 'No',
      payor_enrollment_required: 'No',
      primary_source_verification: 'Yes',
      application_type: 'Digital',
      orientation_required: 'Yes',
      pay_application_fee: 'Yes',
      hospital_privilege_fee: '15.00'
    },
    // Emergency Trauma Center
    {
      facility_name: 'Emergency Trauma Center',
      abbreviation: 'ETC',
      facility_type: 'emergency_care',
      facility_id: '567890',
      cmc_id: '789011',
      npi_number: '5678901234',
      clia_number: '12D5678901',
      tax_id: '56-7890123',
      group_medicare: '5678901234E',
      address_line1: '321 Trauma Ave',
      city: 'Winston-Salem',
      state: 'North Carolina',
      country: 'United States of America',
      zip_code: '27101',
      phone: '(336) 888-4000',
      fax: '(336) 888-4001',
      website: 'www.traumacenter.org',
      near_public_transportation: 'Yes',
      handicap_access: 'Yes',
      credentialing_contact_name: 'Dr. Emily Wilson',
      credentialing_contact_title: 'Emergency Director',
      credentialing_contact_phone: '(336) 888-4002',
      credentialing_contact_email: 'emily.wilson@traumacenter.org',
      billing_name: 'Emergency Trauma Center',
      billing_phone: '(336) 888-4003',
      payee: 'Medical Board of North Carolina',
      supplier_number: '4279-56756-56',
      time_to_complete: '30-45 Days from when Application is Submitted',
      approval_method: 'Electronic',
      license_pending_meetings: 'Yes',
      dea_pending_meetings: 'Yes',
      payor_enrollment_required: 'Yes',
      primary_source_verification: 'Yes',
      application_type: 'Digital',
      orientation_required: 'No',
      pay_application_fee: 'Yes',
      hospital_privilege_fee: '75.00'
    }
  ];

  // Create property values for each facility
  const propertyValues: Array<{
    facility_id: string;
    facility_property_id: string;
    value: any;
  }> = [];
  
  for (let i = 0; i < facilities.length; i++) {
    const facility = facilities[i];
    const values = facilityValues[i];
    
    for (const property of facilityProperties) {
      const value = values[property.key as keyof typeof values];
      if (value !== undefined) {
        // Convert value based on property type using the helper function
        const convertedValue = convertPropertyValue(value, property.type);
        
        // Log conversion for debugging (only for boolean properties)
        if (property.type === 'boolean') {
          console.log(`Converting ${property.key}: "${value}" (${typeof value}) -> ${convertedValue} (${typeof convertedValue})`);
        }
        
        propertyValues.push({
          facility_id: facility.id,
          facility_property_id: property.id,
          value: convertedValue as any
        });
      }
    }
  }

  const { data: insertedValues, error: valuesError } = await supabase
    .from('facility_property_values')
    .insert(propertyValues)
    .select();

  if (valuesError) {
    console.error('❌ Error seeding facility property values:', valuesError);
    return;
  }

  console.log(`✅ Inserted ${insertedValues.length} facility property values`);
  return insertedValues;
}

async function main() {
  try {
    console.log('🚀 Starting facilities with property values seeding...');

    // First seed facilities
    const facilities = await seedFacilities();
    if (!facilities) {
      console.error('❌ Failed to seed facilities, aborting...');
      return;
    }

    // Then seed facility property values
    await seedFacilityPropertyValues(facilities);

    console.log('🎉 Facilities with property values seeding completed successfully!');

    // Test the views
    console.log('🔍 Testing facilities_with_property_values view...');
    const { data: viewData, error: viewError } = await supabase
      .from('facilities_with_property_values')
      .select('*')
      .limit(5);

    if (viewError) {
      console.error('❌ Error testing view:', viewError);
    } else {
      console.log('✅ View test successful, sample data:');
      console.log(JSON.stringify(viewData, null, 2));
    }

    console.log('🔍 Testing facilities_with_property_values_json view...');
    const { data: jsonViewData, error: jsonViewError } = await supabase
      .from('facilities_with_property_values_json')
      .select('*')
      .limit(1);

    if (jsonViewError) {
      console.error('❌ Error testing JSON view:', jsonViewError);
    } else {
      console.log('✅ JSON view test successful');
    }

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// Run the seeding
main().then(() => {
  console.log('🏁 Facilities with property values seeding script finished');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
}); 