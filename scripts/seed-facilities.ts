import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedFacilityProperties() {
  console.log('🌱 Seeding facility_properties table...');

  const facilityProperties = [
    // General Section
    {
      key: 'facility_name',
      label: 'Facility Name',
      group: 'general',
      value: 'Charlotte Mecklenburg Hospital Authority',
      type: 'text'
    },
    {
      key: 'abbreviation',
      label: 'Abbreviation',
      group: 'general',
      value: 'CMHA',
      type: 'text'
    },
    {
      key: 'facility_type',
      label: 'Facility Type',
      group: 'general',
      value: 'acute_care',
      type: 'single-select'
    },
    {
      key: 'facility_id',
      label: 'Facility ID',
      group: 'general',
      value: '123456',
      type: 'text'
    },
    {
      key: 'cmc_id',
      label: 'CMC ID',
      group: 'general',
      value: '345677',
      type: 'text'
    },
    {
      key: 'npi_number',
      label: 'NPI #',
      group: 'identification',
      value: '1234567890',
      type: 'text'
    },
    {
      key: 'clia_number',
      label: 'CLIA #',
      group: 'identification',
      value: '12D1234567',
      type: 'text'
    },
    {
      key: 'tax_id',
      label: 'Tax ID #',
      group: 'identification',
      value: '12-3456789',
      type: 'text'
    },
    {
      key: 'group_medicare',
      label: 'Group Medicare #',
      group: 'identification',
      value: '1234567890A',
      type: 'text'
    },
    // Address Section
    {
      key: 'address_line1',
      label: 'Address',
      group: 'address',
      value: '920 John Paul Jones Cir',
      type: 'text'
    },
    {
      key: 'city',
      label: 'City',
      group: 'address',
      value: 'Portsmouth',
      type: 'text'
    },
    {
      key: 'state',
      label: 'State',
      group: 'address',
      value: 'Oregon',
      type: 'text'
    },
    {
      key: 'country',
      label: 'Country',
      group: 'address',
      value: 'United States of America',
      type: 'text'
    },
    {
      key: 'zip_code',
      label: 'Zip/Postal Code',
      group: 'address',
      value: '23708',
      type: 'text'
    },
    {
      key: 'phone',
      label: 'Phone #',
      group: 'address',
      value: '(757) 953-1640',
      type: 'phone'
    },
    {
      key: 'fax',
      label: 'Fax #',
      group: 'address',
      value: '(757) 988-5103',
      type: 'phone'
    },
    {
      key: 'website',
      label: 'Website',
      group: 'address',
      value: 'www.charlottemecklen.org',
      type: 'url'
    },
    {
      key: 'near_public_transportation',
      label: 'Near Public Transportation',
      group: 'address',
      value: 'Yes',
      type: 'boolean'
    },
    {
      key: 'handicap_access',
      label: 'Handicap Access',
      group: 'address',
      value: 'Yes',
      type: 'boolean'
    },
    // Credentialing Section
    {
      key: 'credentialing_contact_name',
      label: 'Contact Name',
      group: 'credentialing',
      value: 'Brooke Nuñez',
      type: 'text'
    },
    {
      key: 'credentialing_contact_title',
      label: 'Contact Title',
      group: 'credentialing',
      value: 'Registration Program Specialist',
      type: 'text'
    },
    {
      key: 'credentialing_contact_phone',
      label: 'Contact Phone #',
      group: 'credentialing',
      value: '(757) 953-1640',
      type: 'phone'
    },
    {
      key: 'credentialing_contact_email',
      label: 'Contact Email',
      group: 'credentialing',
      value: 'brooke.nunez@blueridgehospital.com',
      type: 'email'
    },
    // Billing Section
    {
      key: 'billing_name',
      label: 'Billing Name',
      group: 'billing',
      value: 'Charlotte Mecklenburg Hospital Authority',
      type: 'text'
    },
    {
      key: 'billing_phone',
      label: 'Billing Phone #',
      group: 'billing',
      value: '(757) 953-1640',
      type: 'phone'
    },
    // Payment Details Section
    {
      key: 'payee',
      label: 'Payee',
      group: 'payment',
      value: 'Medical Board of California',
      type: 'text'
    },
    {
      key: 'supplier_number',
      label: 'Supplier Number',
      group: 'payment',
      value: '4279-12312-12',
      type: 'text'
    },
    // Approval Process Section
    {
      key: 'time_to_complete',
      label: 'Time Required to Complete',
      group: 'approval_process',
      value: '90-120 Days from when Application is Submitted',
      type: 'text'
    },
    {
      key: 'approval_method',
      label: 'Approval Method',
      group: 'approval_process',
      value: 'Signature',
      type: 'single-select'
    },
    {
      key: 'license_pending_meetings',
      label: 'File can go to meetings with License Pending',
      group: 'approval_process',
      value: 'No',
      type: 'boolean'
    },
    {
      key: 'dea_pending_meetings',
      label: 'File can go to meetings with DEA Pending',
      group: 'approval_process',
      value: 'Yes',
      type: 'boolean'
    },
    {
      key: 'payor_enrollment_required',
      label: 'Does Payor Enrollment need to be completed prior to approval?',
      group: 'approval_process',
      value: 'Yes',
      type: 'boolean'
    },
    {
      key: 'primary_source_verification',
      label: 'Primary Source Verification Required',
      group: 'approval_process',
      value: 'Yes',
      type: 'boolean'
    },
    {
      key: 'application_type',
      label: 'Application Type',
      group: 'approval_process',
      value: 'Mapped',
      type: 'single-select'
    },
    {
      key: 'orientation_required',
      label: 'Orientation Required Prior to Privileges Granted',
      group: 'approval_process',
      value: 'Yes',
      type: 'boolean'
    },
    {
      key: 'pay_application_fee',
      label: 'Do we pay Application Fee?',
      group: 'approval_process',
      value: 'No',
      type: 'boolean'
    },
    // Fees Section
    {
      key: 'hospital_privilege_fee',
      label: 'Hospital Privilege Fee',
      group: 'fees',
      value: '20.00',
      type: 'number'
    }
  ];

  const { data: insertedProperties, error: propertiesError } = await supabase
    .from('facility_properties')
    .insert(facilityProperties)
    .select();

  if (propertiesError) {
    console.error('❌ Error seeding facility_properties:', propertiesError);
    return;
  }

  console.log(`✅ Inserted ${insertedProperties.length} facility properties`);
  return insertedProperties;
}

async function seedFacilities(facilityProperties: any[]) {
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
      label: 'General Medical Center',
      icon: 'hospital',
      facility_properties: [
        facilityProperties[0].id, // facility_type
        facilityProperties[1].id, // bed_count
        facilityProperties[2].id, // accreditation_status
        facilityProperties[3].id, // emergency_services
        facilityProperties[4].id, // specialties
        facilityProperties[5].id, // address
        facilityProperties[6].id, // phone
        facilityProperties[7].id, // email
        facilityProperties[8].id, // website
        facilityProperties[9].id  // operating_hours
      ],
      requirements: requirementIds.slice(0, 3),
      providers: providerIds.slice(0, 5)
    },
    {
      label: 'Cardiac Care Institute',
      icon: 'heart',
      facility_properties: [
        facilityProperties[0].id, // facility_type
        facilityProperties[1].id, // bed_count
        facilityProperties[2].id, // accreditation_status
        facilityProperties[4].id, // specialties
        facilityProperties[5].id, // address
        facilityProperties[6].id, // phone
        facilityProperties[7].id, // email
        facilityProperties[8].id, // website
        facilityProperties[9].id, // operating_hours
        facilityProperties[13].id // trauma_level
      ],
      requirements: requirementIds.slice(1, 4),
      providers: providerIds.slice(2, 7)
    },
    {
      label: 'Children\'s Hospital',
      icon: 'baby',
      facility_properties: [
        facilityProperties[0].id, // facility_type
        facilityProperties[1].id, // bed_count
        facilityProperties[2].id, // accreditation_status
        facilityProperties[3].id, // emergency_services
        facilityProperties[4].id, // specialties
        facilityProperties[5].id, // address
        facilityProperties[6].id, // phone
        facilityProperties[7].id, // email
        facilityProperties[8].id, // website
        facilityProperties[9].id, // operating_hours
        facilityProperties[14].id // icu_beds
      ],
      requirements: requirementIds.slice(0, 2),
      providers: providerIds.slice(5, 10)
    },
    {
      label: 'Rehabilitation Center',
      icon: 'wheelchair',
      facility_properties: [
        facilityProperties[0].id, // facility_type
        facilityProperties[1].id, // bed_count
        facilityProperties[2].id, // accreditation_status
        facilityProperties[4].id, // specialties
        facilityProperties[5].id, // address
        facilityProperties[6].id, // phone
        facilityProperties[7].id, // email
        facilityProperties[8].id, // website
        facilityProperties[9].id  // operating_hours
      ],
      requirements: requirementIds.slice(2, 4),
      providers: providerIds.slice(0, 3)
    },
    {
      label: 'Emergency Trauma Center',
      icon: 'ambulance',
      facility_properties: [
        facilityProperties[0].id, // facility_type
        facilityProperties[1].id, // bed_count
        facilityProperties[2].id, // accreditation_status
        facilityProperties[3].id, // emergency_services
        facilityProperties[4].id, // specialties
        facilityProperties[5].id, // address
        facilityProperties[6].id, // phone
        facilityProperties[7].id, // email
        facilityProperties[8].id, // website
        facilityProperties[9].id, // operating_hours
        facilityProperties[13].id, // trauma_level
        facilityProperties[14].id  // icu_beds
      ],
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

async function main() {
  try {
    console.log('🚀 Starting facilities seeding...');

    // First seed facility_properties
    const facilityProperties = await seedFacilityProperties();
    if (!facilityProperties) {
      console.error('❌ Failed to seed facility_properties, aborting...');
      return;
    }

    // Then seed facilities with references to facility_properties
    await seedFacilities(facilityProperties);

    console.log('🎉 Facilities seeding completed successfully!');

    // Test the views
    console.log('🔍 Testing facilities_with_properties view...');
    const { data: viewData, error: viewError } = await supabase
      .from('facilities_with_properties')
      .select('*')
      .limit(2);

    if (viewError) {
      console.error('❌ Error testing view:', viewError);
    } else {
      console.log('✅ View test successful, sample data:');
      console.log(JSON.stringify(viewData, null, 2));
    }

    console.log('🔍 Testing facilities_with_all_data view...');
    const { data: allDataView, error: allDataError } = await supabase
      .from('facilities_with_all_data')
      .select('*')
      .limit(1);

    if (allDataError) {
      console.error('❌ Error testing all data view:', allDataError);
    } else {
      console.log('✅ All data view test successful');
    }

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// Run the seeding
main().then(() => {
  console.log('🏁 Facilities seeding script finished');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
}); 