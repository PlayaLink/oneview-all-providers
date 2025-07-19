import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRestructuredDatabase() {
  console.log('🧪 Testing restructured database...\n');

  // Test 1: Basic facilities
  console.log('📋 Test: Basic Facilities');
  try {
    const { data: facilities, error } = await supabase
      .from('facilities')
      .select('id, label')
      .limit(5);
    
    if (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    } else {
      console.log(`   ✅ Passed (${facilities?.length || 0} facilities found)`);
      if (facilities && facilities.length > 0) {
        console.log(`   📄 Sample: ${facilities[0].label}`);
      }
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
  }

  // Test 2: Facilities with properties
  console.log('\n📋 Test: Facilities with Properties');
  try {
    const { data: facilitiesWithProps, error } = await supabase
      .from('facilities_with_properties')
      .select('id, label, properties')
      .limit(3);
    
    if (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    } else {
      console.log(`   ✅ Passed (${facilitiesWithProps?.length || 0} facilities with properties)`);
              if (facilitiesWithProps && facilitiesWithProps.length > 0) {
          const sample = facilitiesWithProps[0];
          const properties = sample.properties || [];
          console.log(`   📄 Sample: ${sample.label} has ${properties.length} properties`);
          if (properties.length > 0) {
            const firstProperty = properties[0] as any;
            console.log(`   📄 First property: ${firstProperty.label} = ${firstProperty.value}`);
          }
        }
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
  }

  // Test 3: Facility property values
  console.log('\n📋 Test: Facility Property Values');
  try {
    const { data: propertyValues, error } = await supabase
      .from('facility_property_values')
      .select(`
        facility_id,
        facility_property_id,
        value,
        facilities!inner(label),
        facility_properties!inner(key, label)
      `)
      .limit(10);
    
    if (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    } else {
      console.log(`   ✅ Passed (${propertyValues?.length || 0} property values found)`);
      if (propertyValues && propertyValues.length > 0) {
        const sample = propertyValues[0] as any;
        console.log(`   📄 Sample: ${sample.facilities.label} - ${sample.facility_properties.label}: ${sample.value}`);
      }
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
  }

  // Test 4: Requirements
  console.log('\n📋 Test: Requirements');
  try {
    const { data: requirements, error } = await supabase
      .from('requirements')
      .select('id, key, label, type, group')
      .limit(5);
    
    if (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    } else {
      console.log(`   ✅ Passed (${requirements?.length || 0} requirements found)`);
      if (requirements && requirements.length > 0) {
        console.log(`   📄 Sample: ${requirements[0].label} (${requirements[0].type})`);
      }
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
  }

  // Test 5: Facility requirement values
  console.log('\n📋 Test: Facility Requirement Values');
  try {
    const { data: requirementValues, error } = await supabase
      .from('facility_requirement_values')
      .select(`
        facility_id,
        requirement_id,
        requirement_data_id,
        value,
        facilities!inner(label),
        requirements!inner(label)
      `)
      .limit(10);
    
    if (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    } else {
      console.log(`   ✅ Passed (${requirementValues?.length || 0} requirement values found)`);
      if (requirementValues && requirementValues.length > 0) {
        const sample = requirementValues[0] as any;
        console.log(`   📄 Sample: ${sample.facilities.label} - ${sample.requirements.label}: ${sample.value}`);
      }
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
  }

  // Test 6: Database structure summary
  console.log('\n📋 Database Structure Summary:');
  
  const tables = [
    'facilities',
    'facility_properties', 
    'facility_property_values',
    'requirements',
    'requirement_data',
    'facility_requirements',
    'facility_requirement_values',
    'facility_providers'
  ];

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`   ❌ ${table}: Failed - ${error.message}`);
      } else {
        console.log(`   ✅ ${table}: ${count || 0} records`);
      }
    } catch (error) {
      console.log(`   ❌ ${table}: Failed - ${error.message}`);
    }
  }

  console.log('\n✅ Testing completed!');
}

// Run the test
testRestructuredDatabase().catch(console.error); 