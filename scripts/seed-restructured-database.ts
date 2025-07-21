import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedRestructuredDatabase() {
  console.log('🌱 Seeding restructured database...\n');

  try {
    // Step 1: Seed facility properties (templates)
    console.log('1. Creating facility properties...');
    const facilityProperties = [
      // Capacity properties
      {
        key: 'bed_count',
        label: 'Number of Beds',
        group: 'capacity',
        type: 'number',
        default_value: '100',
        is_required: true,
        validation_rules: { min: 1, max: 10000 }
      },
      {
        key: 'icu_beds',
        label: 'ICU Beds',
        group: 'capacity',
        type: 'number',
        default_value: '10',
        is_required: false,
        validation_rules: { min: 0, max: 1000 }
      },
      {
        key: 'operating_rooms',
        label: 'Operating Rooms',
        group: 'capacity',
        type: 'number',
        default_value: '5',
        is_required: false,
        validation_rules: { min: 0, max: 100 }
      },
      // Contact properties
      {
        key: 'phone_number',
        label: 'Main Phone Number',
        group: 'contact',
        type: 'phone',
        default_value: null,
        is_required: true,
        validation_rules: { format: 'phone' }
      },
      {
        key: 'email',
        label: 'General Email',
        group: 'contact',
        type: 'email',
        default_value: null,
        is_required: false,
        validation_rules: { format: 'email' }
      },
      {
        key: 'website',
        label: 'Website',
        group: 'contact',
        type: 'url',
        default_value: null,
        is_required: false,
        validation_rules: { format: 'url' }
      },
      // Services properties
      {
        key: 'services_offered',
        label: 'Services Offered',
        group: 'services',
        type: 'multi-select',
        default_value: '["emergency", "surgery", "cardiology"]',
        is_required: false,
        validation_rules: { options: ['emergency', 'surgery', 'cardiology', 'pediatrics', 'oncology', 'neurology'] }
      },
      {
        key: 'accreditation',
        label: 'Accreditation',
        group: 'services',
        type: 'single-select',
        default_value: 'joint_commission',
        is_required: true,
        validation_rules: { options: ['joint_commission', 'cms', 'state_health', 'none'] }
      },
      // Financial properties
      {
        key: 'annual_budget',
        label: 'Annual Budget (USD)',
        group: 'financial',
        type: 'number',
        default_value: '50000000',
        is_required: false,
        validation_rules: { min: 0 }
      },
      {
        key: 'profit_status',
        label: 'Profit Status',
        group: 'financial',
        type: 'single-select',
        default_value: 'non_profit',
        is_required: true,
        validation_rules: { options: ['non_profit', 'for_profit', 'government'] }
      }
    ];

    const { data: properties, error: propertiesError } = await supabase
      .from('facility_properties')
      .upsert(facilityProperties, { onConflict: 'key' })
      .select();

    if (propertiesError) throw propertiesError;
    console.log(`✅ Created ${properties.length} facility properties`);

    // Step 2: Seed requirements and requirement data fields
    console.log('\n2. Creating requirements and data fields...');
    
    const requirementDataFields = [
      // License requirement fields
      {
        key: 'license_number',
        label: 'License Number',
        data_type: 'text',
        default_value: null,
        is_required: true,
        validation_rules: { min_length: 5, max_length: 20 }
      },
      {
        key: 'issue_date',
        label: 'Issue Date',
        data_type: 'date',
        default_value: null,
        is_required: true,
        validation_rules: { format: 'date' }
      },
      {
        key: 'expiration_date',
        label: 'Expiration Date',
        data_type: 'date',
        default_value: null,
        is_required: true,
        validation_rules: { format: 'date' }
      },
      {
        key: 'status',
        label: 'Status',
        data_type: 'single-select',
        default_value: 'active',
        is_required: true,
        validation_rules: { options: ['active', 'pending', 'expired', 'suspended'] }
      },
      // Insurance requirement fields
      {
        key: 'insurance_provider',
        label: 'Insurance Provider',
        data_type: 'text',
        default_value: null,
        is_required: true,
        validation_rules: { min_length: 2, max_length: 100 }
      },
      {
        key: 'policy_number',
        label: 'Policy Number',
        data_type: 'text',
        default_value: null,
        is_required: true,
        validation_rules: { min_length: 5, max_length: 50 }
      },
      {
        key: 'coverage_amount',
        label: 'Coverage Amount (USD)',
        data_type: 'number',
        default_value: '1000000',
        is_required: true,
        validation_rules: { min: 100000 }
      },
      // Certification requirement fields
      {
        key: 'certification_type',
        label: 'Certification Type',
        data_type: 'single-select',
        default_value: 'board_certified',
        is_required: true,
        validation_rules: { options: ['board_certified', 'board_eligible', 'not_certified'] }
      },
      {
        key: 'certifying_board',
        label: 'Certifying Board',
        data_type: 'text',
        default_value: null,
        is_required: true,
        validation_rules: { min_length: 2, max_length: 100 }
      },
      {
        key: 'certification_date',
        label: 'Certification Date',
        data_type: 'date',
        default_value: null,
        is_required: true,
        validation_rules: { format: 'date' }
      }
    ];

    const { data: dataFields, error: dataFieldsError } = await supabase
      .from('requirement_data_fields')
      .upsert(requirementDataFields, { onConflict: 'key' })
      .select();

    if (dataFieldsError) throw dataFieldsError;
    console.log(`✅ Created ${dataFields.length} requirement data fields`);

    // Create requirements
    const requirements = [
      {
        type: 'facility',
        key: 'state_license',
        group: 'licensing',
        label: 'State Medical License',
        note: 'Valid medical license for the state where the facility operates',
        visible: true,
        required: true,
        credentialing_entities: []
      },
      {
        type: 'facility',
        key: 'malpractice_insurance',
        group: 'insurance',
        label: 'Malpractice Insurance',
        note: 'Professional liability insurance coverage',
        visible: true,
        required: true,
        credentialing_entities: []
      },
      {
        type: 'board',
        key: 'board_certification',
        group: 'certification',
        label: 'Board Certification',
        note: 'Specialty board certification',
        visible: true,
        required: false,
        credentialing_entities: []
      }
    ];

    const { data: reqs, error: reqsError } = await supabase
      .from('requirements')
      .upsert(requirements, { onConflict: 'key' })
      .select();

    if (reqsError) throw reqsError;
    console.log(`✅ Created ${reqs.length} requirements`);

    // Link requirement data fields to requirements
    const requirementFieldMappings = [
      { requirement_key: 'state_license', field_keys: ['license_number', 'issue_date', 'expiration_date', 'status'] },
      { requirement_key: 'malpractice_insurance', field_keys: ['insurance_provider', 'policy_number', 'coverage_amount'] },
      { requirement_key: 'board_certification', field_keys: ['certification_type', 'certifying_board', 'certification_date'] }
    ];

    for (const mapping of requirementFieldMappings) {
      const requirement = reqs.find(r => r.key === mapping.requirement_key);
      const fields = dataFields.filter(f => mapping.field_keys.includes(f.key));
      
      for (let i = 0; i < fields.length; i++) {
        await supabase
          .from('requirement_data_fields')
          .update({ 
            requirement_id: requirement.id,
            "order": i + 1
          })
          .eq('id', fields[i].id);
      }
    }

    // Step 3: Seed facilities
    console.log('\n3. Creating facilities...');
    const facilities = [
      {
        label: 'General Medical Center',
        icon: 'hospital',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        label: 'Cardiac Care Institute',
        icon: 'heart',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        label: 'Children\'s Hospital',
        icon: 'baby',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        label: 'Emergency Trauma Center',
        icon: 'ambulance',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        label: 'Rehabilitation Center',
        icon: 'wheelchair',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const { data: facs, error: facsError } = await supabase
      .from('facilities')
      .insert(facilities)
      .select();

    if (facsError) throw facsError;
    console.log(`✅ Created ${facs.length} facilities`);

    // Step 4: Create facility property values
    console.log('\n4. Creating facility property values...');
    const facilityPropertyValues = [];
    
    for (const facility of facs) {
      for (const property of properties) {
        let value;
        
        // Generate realistic values based on property type
        switch (property.key) {
          case 'bed_count':
            value = faker.number.int({ min: 50, max: 500 });
            break;
          case 'icu_beds':
            value = faker.number.int({ min: 5, max: 50 });
            break;
          case 'operating_rooms':
            value = faker.number.int({ min: 2, max: 20 });
            break;
          case 'phone_number':
            value = faker.phone.number();
            break;
          case 'email':
            value = faker.internet.email();
            break;
          case 'website':
            value = faker.internet.url();
            break;
          case 'services_offered':
            const services = faker.helpers.arrayElements(
              ['emergency', 'surgery', 'cardiology', 'pediatrics', 'oncology', 'neurology'],
              faker.number.int({ min: 2, max: 4 })
            );
            value = services;
            break;
          case 'accreditation':
            value = faker.helpers.arrayElement(['joint_commission', 'cms', 'state_health']);
            break;
          case 'annual_budget':
            value = faker.number.int({ min: 10000000, max: 200000000 });
            break;
          case 'profit_status':
            value = faker.helpers.arrayElement(['non_profit', 'for_profit', 'government']);
            break;
          default:
            value = property.default_value;
        }

        facilityPropertyValues.push({
          facility_id: facility.id,
          facility_property_id: property.id,
          value: typeof value === 'string' ? value : value
        });
      }
    }

    const { error: propValuesError } = await supabase
      .from('facility_property_values')
      .insert(facilityPropertyValues);

    if (propValuesError) throw propValuesError;
    console.log(`✅ Created ${facilityPropertyValues.length} facility property values`);

    // Step 5: Create facility-requirement assignments
    console.log('\n5. Creating facility-requirement assignments...');
    const facilityRequirements = [];
    
    for (const facility of facs) {
      for (const requirement of reqs) {
        facilityRequirements.push({
          facility_id: facility.id,
          requirement_id: requirement.id,
          is_active: true,
          assigned_at: new Date().toISOString()
        });
      }
    }

    const { error: facReqsError } = await supabase
      .from('facility_requirements')
      .insert(facilityRequirements);

    if (facReqsError) throw facReqsError;
    console.log(`✅ Created ${facilityRequirements.length} facility-requirement assignments`);

    // Step 6: Create facility requirement values
    console.log('\n6. Creating facility requirement values...');
    const facilityRequirementValues = [];
    
    for (const facility of facs) {
      for (const requirement of reqs) {
        const requirementFields = dataFields.filter(f => 
          requirementFieldMappings.find(m => m.requirement_key === requirement.key)?.field_keys.includes(f.key)
        );
        
        for (const field of requirementFields) {
          let value;
          
          // Generate realistic values based on field type
          switch (field.key) {
            case 'license_number':
              value = faker.string.alphanumeric(8).toUpperCase();
              break;
            case 'issue_date':
              value = faker.date.past({ years: 5 }).toISOString().split('T')[0];
              break;
            case 'expiration_date':
              value = faker.date.future({ years: 3 }).toISOString().split('T')[0];
              break;
            case 'status':
              value = faker.helpers.arrayElement(['active', 'pending', 'expired', 'suspended']);
              break;
            case 'insurance_provider':
              value = faker.helpers.arrayElement(['Blue Cross', 'Aetna', 'Cigna', 'UnitedHealth', 'Kaiser']);
              break;
            case 'policy_number':
              value = faker.string.alphanumeric(10).toUpperCase();
              break;
            case 'coverage_amount':
              value = faker.number.int({ min: 100000, max: 5000000 });
              break;
            case 'certification_type':
              value = faker.helpers.arrayElement(['board_certified', 'board_eligible', 'not_certified']);
              break;
            case 'certifying_board':
              value = faker.helpers.arrayElement(['American Board of Internal Medicine', 'American Board of Surgery', 'American Board of Pediatrics']);
              break;
            case 'certification_date':
              value = faker.date.past({ years: 10 }).toISOString().split('T')[0];
              break;
            default:
              value = field.default_value;
          }

          facilityRequirementValues.push({
            facility_id: facility.id,
            requirement_id: requirement.id,
            requirement_data_field_id: field.id,
            value: typeof value === 'string' ? value : value
          });
        }
      }
    }

    const { error: reqValuesError } = await supabase
      .from('facility_requirement_values')
      .insert(facilityRequirementValues);

    if (reqValuesError) throw reqValuesError;
    console.log(`✅ Created ${facilityRequirementValues.length} facility requirement values`);

    // Step 7: Create facility-provider relationships
    console.log('\n7. Creating facility-provider relationships...');
    
    // First, get some existing providers
    const { data: existingProviders, error: providersError } = await supabase
      .from('providers')
      .select('id')
      .limit(10);

    if (providersError) throw providersError;

    if (existingProviders && existingProviders.length > 0) {
      const facilityProviders = [];
      
      for (const facility of facs) {
        // Assign 2-4 providers to each facility
        const numProviders = faker.number.int({ min: 2, max: 4 });
        const selectedProviders = faker.helpers.arrayElements(existingProviders, numProviders);
        
        for (const provider of selectedProviders) {
          facilityProviders.push({
            facility_id: facility.id,
            provider_id: provider.id,
            role: faker.helpers.arrayElement(['attending', 'resident', 'fellow', 'consultant']),
            start_date: faker.date.past({ years: 3 }).toISOString().split('T')[0],
            end_date: faker.helpers.maybe(() => faker.date.future({ years: 2 }).toISOString().split('T')[0], { probability: 0.2 }),
            is_active: faker.datatype.boolean({ probability: 0.9 })
          });
        }
      }

      const { error: facProvsError } = await supabase
        .from('facility_providers')
        .insert(facilityProviders);

      if (facProvsError) throw facProvsError;
      console.log(`✅ Created ${facilityProviders.length} facility-provider relationships`);
    } else {
      console.log('⚠️  No existing providers found, skipping facility-provider relationships');
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${properties.length} facility properties`);
    console.log(`   - ${dataFields.length} requirement data fields`);
    console.log(`   - ${reqs.length} requirements`);
    console.log(`   - ${facs.length} facilities`);
    console.log(`   - ${facilityPropertyValues.length} facility property values`);
    console.log(`   - ${facilityRequirements.length} facility-requirement assignments`);
    console.log(`   - ${facilityRequirementValues.length} facility requirement values`);

    console.log('\n🔍 You can now test the new structure with:');
    console.log('   - SELECT * FROM facilities_basic;');
    console.log('   - SELECT * FROM facilities_with_properties;');
    console.log('   - SELECT * FROM facilities_with_requirements;');
    console.log('   - SELECT * FROM facilities_with_all_data;');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seeding function
seedRestructuredDatabase()
  .then(() => {
    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }); 