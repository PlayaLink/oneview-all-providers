import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to convert requirement value based on data type (same as in supabaseClient.ts)
function convertRequirementValue(value: any, dataType: string): any {
  switch (dataType) {
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
    case 'oneview_record':
    default:
      // For JSONB storage, return the actual value, not a string
      return value || '';
  }
}

async function seedFacilityRequirementValues() {
  console.log('🌱 Seeding facility requirement values...');

  // Get existing facilities
  const { data: facilities, error: facilitiesError } = await supabase
    .from('facilities')
    .select('id, label');

  if (facilitiesError) {
    console.error('❌ Error fetching facilities:', facilitiesError);
    return;
  }

  if (!facilities || facilities.length === 0) {
    console.error('❌ No facilities found. Please run the facilities seeding script first.');
    return;
  }

  // Get existing requirements
  const { data: requirements, error: requirementsError } = await supabase
    .from('requirements')
    .select('id, key, label, type, group, data');

  if (requirementsError) {
    console.error('❌ Error fetching requirements:', requirementsError);
    return;
  }

  if (!requirements || requirements.length === 0) {
    console.error('❌ No requirements found. Please run the requirements seeding script first.');
    return;
  }

  // Get requirement data items separately
  const { data: requirementDataItems, error: dataError } = await supabase
    .from('requirement_data')
    .select('id, key, label, data_type');

  if (dataError) {
    console.error('❌ Error fetching requirement data:', dataError);
    return;
  }

  if (!requirementDataItems || requirementDataItems.length === 0) {
    console.error('❌ No requirement data found. Please run the requirements seeding script first.');
    return;
  }

  // Create a map of requirement data items by key for easy lookup
  const requirementDataMap = requirementDataItems.reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, {} as Record<string, any>);

  if (requirementsError) {
    console.error('❌ Error fetching requirements:', requirementsError);
    return;
  }

  if (!requirements || requirements.length === 0) {
    console.error('❌ No requirements found. Please run the requirements seeding script first.');
    return;
  }

  // Sample requirement values for different facilities
  const requirementValues = [
    // Charlotte Mecklenburg Hospital Authority
    {
      facility_name: 'Charlotte Mecklenburg Hospital Authority',
      requirements: {
        'facility_licensing_requirements': {
          'license_number_format': 'NC-12345',
          'required_certifications': 'BLS, ACLS, PALS',
          'facility_size_min_sqft': '5000',
          'documentation_requirements': 'Complete medical records, incident reports'
        },
        'facility_safety_standards': {
          'safety_equipment_required': 'Fire extinguishers, emergency lighting, AED',
          'min_staff_count': '15',
          'medical_equipment_standards': 'FDA approved, regularly calibrated'
        },
        'board_certification_requirements': {
          'board_exam_passing_score': '75',
          'continuing_education_hours': '50',
          'recertification_period_years': '10'
        }
      }
    },
    // Cardiac Care Institute
    {
      facility_name: 'Cardiac Care Institute',
      requirements: {
        'facility_licensing_requirements': {
          'license_number_format': 'NC-23456',
          'required_certifications': 'BLS, ACLS, Cardiac certification',
          'facility_size_min_sqft': '8000',
          'documentation_requirements': 'Cardiac protocols, patient outcomes'
        },
        'facility_safety_standards': {
          'safety_equipment_required': 'Cardiac monitors, defibrillators, crash carts',
          'min_staff_count': '25',
          'medical_equipment_standards': 'Cardiac-specific equipment, daily checks'
        },
        'board_certification_requirements': {
          'board_exam_passing_score': '80',
          'continuing_education_hours': '60',
          'recertification_period_years': '8'
        }
      }
    },
    // Children's Hospital
    {
      facility_name: 'Children\'s Hospital',
      requirements: {
        'facility_licensing_requirements': {
          'license_number_format': 'NC-34567',
          'required_certifications': 'BLS, PALS, Pediatric certification',
          'facility_size_min_sqft': '12000',
          'documentation_requirements': 'Pediatric protocols, family consent forms'
        },
        'facility_safety_standards': {
          'safety_equipment_required': 'Pediatric equipment, child-proofing, security',
          'min_staff_count': '40',
          'medical_equipment_standards': 'Pediatric-specific, size-appropriate'
        },
        'board_certification_requirements': {
          'board_exam_passing_score': '85',
          'continuing_education_hours': '75',
          'recertification_period_years': '7'
        }
      }
    },
    // Rehabilitation Center
    {
      facility_name: 'Rehabilitation Center',
      requirements: {
        'facility_licensing_requirements': {
          'license_number_format': 'NC-45678',
          'required_certifications': 'BLS, Rehabilitation certification',
          'facility_size_min_sqft': '3000',
          'documentation_requirements': 'Rehab protocols, progress notes'
        },
        'facility_safety_standards': {
          'safety_equipment_required': 'Mobility aids, safety rails, emergency exits',
          'min_staff_count': '8',
          'medical_equipment_standards': 'Rehab equipment, accessibility features'
        },
        'board_certification_requirements': {
          'board_exam_passing_score': '70',
          'continuing_education_hours': '30',
          'recertification_period_years': '12'
        }
      }
    },
    // Emergency Trauma Center
    {
      facility_name: 'Emergency Trauma Center',
      requirements: {
        'facility_licensing_requirements': {
          'license_number_format': 'NC-56789',
          'required_certifications': 'BLS, ACLS, ATLS, Trauma certification',
          'facility_size_min_sqft': '15000',
          'documentation_requirements': 'Trauma protocols, rapid response documentation'
        },
        'facility_safety_standards': {
          'safety_equipment_required': 'Trauma equipment, emergency response systems',
          'min_staff_count': '50',
          'medical_equipment_standards': 'Trauma-specific, 24/7 availability'
        },
        'board_certification_requirements': {
          'board_exam_passing_score': '90',
          'continuing_education_hours': '100',
          'recertification_period_years': '5'
        }
      }
    }
  ];

  // Create requirement values for each facility
  const requirementValuesToInsert: Array<{
    facility_id: string;
    requirement_id: string;
    requirement_data_id: string;
    value: any;
  }> = [];
  
  for (let i = 0; i < facilities.length; i++) {
    const facility = facilities[i];
    const facilityValues = requirementValues[i];
    
    if (!facilityValues) continue;
    
    for (const requirement of requirements) {
      const requirementKey = requirement.key;
      const facilityRequirementValues = facilityValues.requirements[requirementKey];
      
      if (!facilityRequirementValues) continue;
      
      // Get the requirement data items for this requirement using the data array
      const requirementDataIds = requirement.data || [];
      const requirementDataItemsForRequirement = requirementDataIds
        .map(id => requirementDataItems.find(item => item.id === id))
        .filter(Boolean);
      
      for (const dataItem of requirementDataItemsForRequirement) {
        const dataKey = dataItem.key;
        const value = facilityRequirementValues[dataKey];
        
        if (value !== undefined) {
          // Convert value based on data type
          const convertedValue = convertRequirementValue(value, dataItem.data_type);
          
          // Log conversion for debugging (only for boolean properties)
          if (dataItem.data_type === 'boolean') {
            console.log(`Converting ${requirementKey}.${dataKey}: "${value}" (${typeof value}) -> ${convertedValue} (${typeof convertedValue})`);
          }
          
          requirementValuesToInsert.push({
            facility_id: facility.id,
            requirement_id: requirement.id,
            requirement_data_id: dataItem.id,
            value: convertedValue
          });
        }
      }
    }
  }

  if (requirementValuesToInsert.length === 0) {
    console.log('⚠️ No requirement values to insert');
    return;
  }

  const { data: insertedValues, error: valuesError } = await supabase
    .from('facility_requirement_values')
    .insert(requirementValuesToInsert)
    .select();

  if (valuesError) {
    console.error('❌ Error seeding facility requirement values:', valuesError);
    return;
  }

  console.log(`✅ Inserted ${insertedValues.length} facility requirement values`);
  return insertedValues;
}

async function main() {
  try {
    console.log('🚀 Starting facility requirement values seeding...');

    // Seed facility requirement values
    await seedFacilityRequirementValues();

    console.log('🎉 Facility requirement values seeding completed successfully!');

    // Test the data
    console.log('🔍 Testing facility requirement values...');
    const { data: testData, error: testError } = await supabase
      .from('facility_requirement_values')
      .select(`
        *,
        facility:facilities(label),
        requirement:requirements(key, label),
        requirement_data:requirement_data(key, label, data_type)
      `)
      .limit(5);

    if (testError) {
      console.error('❌ Error testing data:', testError);
    } else {
      console.log('✅ Test successful, sample data:');
      console.log(JSON.stringify(testData, null, 2));
    }

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// Run the seeding
main().then(() => {
  console.log('🏁 Facility requirement values seeding script finished');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
}); 