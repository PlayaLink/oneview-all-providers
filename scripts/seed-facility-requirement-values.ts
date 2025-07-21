import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to convert requirement value based on data type
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

  // Get requirement data items
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

  // Sample requirement values for different facilities
  const facilityRequirementValues = [
    // Charlotte Mecklenburg Hospital Authority
    {
      facility_name: 'Charlotte Mecklenburg Hospital Authority',
      values: {
        'malpractice_history': 'No malpractice claims in the last 5 years',
        'employment_history': '10+ years of experience in hospital settings',
        'facility_affiliations_history': 'Previously affiliated with Atrium Health',
        'peer_references': '3 positive peer references submitted',
        'cmes_general': 45,
        'cme_history': 'Completed 45 CME hours in cardiology',
        'life_support_certification_through_aha': true,
        'drug_screen_general': true,
        'drug_screen_type': '10-panel',
        'background_check': true
      }
    },
    // Cardiac Care Institute
    {
      facility_name: 'Cardiac Care Institute',
      values: {
        'malpractice_history': 'One minor claim resolved in 2022',
        'employment_history': '15+ years specializing in cardiac care',
        'facility_affiliations_history': 'Former director at Duke Heart Center',
        'peer_references': '5 cardiac specialist references',
        'cmes_general': 60,
        'cme_history': 'Advanced cardiac life support certification',
        'life_support_certification_through_aha': true,
        'drug_screen_general': true,
        'drug_screen_type': '12-panel',
        'background_check': true
      }
    },
    // Children's Hospital
    {
      facility_name: 'Children\'s Hospital',
      values: {
        'malpractice_history': 'Clean record, pediatric specialist',
        'employment_history': '8 years in pediatric medicine',
        'facility_affiliations_history': 'Previous work at UNC Children\'s',
        'peer_references': '4 pediatrician references',
        'cmes_general': 75,
        'cme_history': 'Pediatric advanced life support certified',
        'life_support_certification_through_aha': true,
        'drug_screen_general': true,
        'drug_screen_type': '10-panel',
        'background_check': true
      }
    },
    // Rehabilitation Center
    {
      facility_name: 'Rehabilitation Center',
      values: {
        'malpractice_history': 'No claims, rehabilitation specialist',
        'employment_history': '12 years in physical therapy',
        'facility_affiliations_history': 'Former PT director at WakeMed',
        'peer_references': '3 physical therapist references',
        'cmes_general': 30,
        'cme_history': 'Rehabilitation medicine certification',
        'life_support_certification_through_aha': false,
        'drug_screen_general': true,
        'drug_screen_type': '5-panel',
        'background_check': true
      }
    },
    // Emergency Trauma Center
    {
      facility_name: 'Emergency Trauma Center',
      values: {
        'malpractice_history': 'Two claims, both resolved favorably',
        'employment_history': '20+ years in emergency medicine',
        'facility_affiliations_history': 'Former chief at UNC Trauma',
        'peer_references': '6 emergency medicine references',
        'cmes_general': 100,
        'cme_history': 'Advanced trauma life support instructor',
        'life_support_certification_through_aha': true,
        'drug_screen_general': true,
        'drug_screen_type': '12-panel',
        'background_check': true
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
    const facilityValues = facilityRequirementValues[i];
    
    if (!facilityValues) continue;
    
    // For each requirement, find its data items and create values
    for (const requirement of requirements) {
      const requirementDataIds = requirement.data || [];
      
      // Find the requirement data items for this requirement
      const requirementDataItemsForRequirement = requirementDataIds
        .map(id => requirementDataItems.find(item => item.id === id))
        .filter(Boolean);
      
      for (const dataItem of requirementDataItemsForRequirement) {
        const dataKey = dataItem.key;
        const value = facilityValues.values[dataKey];
        
        if (value !== undefined) {
          // Convert value based on data type
          const convertedValue = convertRequirementValue(value, dataItem.data_type);
          
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

  console.log(`📝 Preparing to insert ${requirementValuesToInsert.length} requirement values...`);

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