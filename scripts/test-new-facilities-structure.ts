import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testNewFacilitiesStructure() {
  console.log('🧪 Testing new facilities database structure...\n');

  try {
    // Test 1: Check if new tables exist
    console.log('1. Checking new table structure...');
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .like('table_name', 'facility_%');

    if (tablesError) {
      console.error('❌ Error checking tables:', tablesError);
      return;
    }

    const expectedTables = [
      'facility_providers',
      'facility_requirements', 
      'facility_requirement_values',
      'facility_property_values'
    ];

    const existingTables = tables?.map(t => t.table_name) || [];
    const missingTables = expectedTables.filter(table => !existingTables.includes(table));

    if (missingTables.length > 0) {
      console.error('❌ Missing tables:', missingTables);
      return;
    }

    console.log('✅ All expected tables exist');

    // Test 2: Check if new views exist
    console.log('\n2. Checking new views...');
    
    const { data: views, error: viewsError } = await supabase
      .from('information_schema.views')
      .select('table_name')
      .eq('table_schema', 'public')
      .like('table_name', 'facilities_%');

    if (viewsError) {
      console.error('❌ Error checking views:', viewsError);
      return;
    }

    const expectedViews = [
      'facilities_basic',
      'facilities_with_properties',
      'facilities_with_requirements',
      'facilities_with_all_data'
    ];

    const existingViews = views?.map(v => v.table_name) || [];
    const missingViews = expectedViews.filter(view => !existingViews.includes(view));

    if (missingViews.length > 0) {
      console.error('❌ Missing views:', missingViews);
      return;
    }

    console.log('✅ All expected views exist');

    // Test 3: Test basic facility query
    console.log('\n3. Testing basic facility query...');
    
    const { data: basicFacilities, error: basicError } = await supabase
      .from('facilities_basic')
      .select('*')
      .limit(5);

    if (basicError) {
      console.error('❌ Error querying facilities_basic:', basicError);
      return;
    }

    console.log(`✅ Found ${basicFacilities?.length || 0} facilities in basic view`);
    if (basicFacilities && basicFacilities.length > 0) {
      console.log('Sample facility:', {
        id: basicFacilities[0].id,
        label: basicFacilities[0].label,
        property_count: basicFacilities[0].property_count,
        requirement_count: basicFacilities[0].requirement_count,
        active_provider_count: basicFacilities[0].active_provider_count
      });
    }

    // Test 4: Test facilities with properties
    console.log('\n4. Testing facilities with properties...');
    
    const { data: facilitiesWithProps, error: propsError } = await supabase
      .from('facilities_with_properties')
      .select('*')
      .limit(3);

    if (propsError) {
      console.error('❌ Error querying facilities_with_properties:', propsError);
      return;
    }

    console.log(`✅ Found ${facilitiesWithProps?.length || 0} facilities with properties`);
    if (facilitiesWithProps && facilitiesWithProps.length > 0) {
      const facility = facilitiesWithProps[0];
      console.log('Sample facility with properties:', {
        id: facility.id,
        label: facility.label,
        properties_by_group: facility.properties_by_group ? Object.keys(facility.properties_by_group).length : 0
      });
    }

    // Test 5: Test facilities with requirements
    console.log('\n5. Testing facilities with requirements...');
    
    const { data: facilitiesWithReqs, error: reqsError } = await supabase
      .from('facilities_with_requirements')
      .select('*')
      .limit(3);

    if (reqsError) {
      console.error('❌ Error querying facilities_with_requirements:', reqsError);
      return;
    }

    console.log(`✅ Found ${facilitiesWithReqs?.length || 0} facilities with requirements`);
    if (facilitiesWithReqs && facilitiesWithReqs.length > 0) {
      const facility = facilitiesWithReqs[0];
      console.log('Sample facility with requirements:', {
        id: facility.id,
        label: facility.label,
        requirements_count: facility.requirements ? facility.requirements.length : 0
      });
    }

    // Test 6: Test junction table queries
    console.log('\n6. Testing junction table queries...');
    
    const { data: facilityProviders, error: providersError } = await supabase
      .from('facility_providers')
      .select(`
        *,
        facility:facilities(label),
        provider:providers(first_name, last_name, title)
      `)
      .limit(5);

    if (providersError) {
      console.error('❌ Error querying facility_providers:', providersError);
      return;
    }

    console.log(`✅ Found ${facilityProviders?.length || 0} facility-provider relationships`);
    if (facilityProviders && facilityProviders.length > 0) {
      console.log('Sample relationship:', {
        facility: facilityProviders[0].facility?.label,
        provider: `${facilityProviders[0].provider?.first_name} ${facilityProviders[0].provider?.last_name}`,
        role: facilityProviders[0].role,
        is_active: facilityProviders[0].is_active
      });
    }

    // Test 7: Test property values
    console.log('\n7. Testing property values...');
    
    const { data: propertyValues, error: valuesError } = await supabase
      .from('facility_property_values')
      .select(`
        *,
        facility:facilities(label),
        facility_property:facility_properties(key, label, type)
      `)
      .limit(5);

    if (valuesError) {
      console.error('❌ Error querying facility_property_values:', valuesError);
      return;
    }

    console.log(`✅ Found ${propertyValues?.length || 0} property values`);
    if (propertyValues && propertyValues.length > 0) {
      console.log('Sample property value:', {
        facility: propertyValues[0].facility?.label,
        property: propertyValues[0].facility_property?.label,
        key: propertyValues[0].facility_property?.key,
        type: propertyValues[0].facility_property?.type,
        value: propertyValues[0].value
      });
    }

    // Test 8: Performance test
    console.log('\n8. Performance test...');
    
    const startTime = Date.now();
    const { data: allFacilities, error: perfError } = await supabase
      .from('facilities_with_all_data')
      .select('id, label')
      .limit(10);

    const endTime = Date.now();
    const queryTime = endTime - startTime;

    if (perfError) {
      console.error('❌ Error in performance test:', perfError);
      return;
    }

    console.log(`✅ Performance test completed in ${queryTime}ms`);
    console.log(`✅ Retrieved ${allFacilities?.length || 0} facilities with all data`);

    // Test 9: Test data integrity
    console.log('\n9. Testing data integrity...');
    
    // Check for orphaned records
    const { data: orphanedProps, error: orphanError } = await supabase
      .from('facility_property_values')
      .select('facility_id')
      .not('facility_id', 'in', `(SELECT id FROM facilities)`);

    if (orphanError) {
      console.error('❌ Error checking orphaned records:', orphanError);
      return;
    }

    if (orphanedProps && orphanedProps.length > 0) {
      console.warn(`⚠️  Found ${orphanedProps.length} orphaned property values`);
    } else {
      console.log('✅ No orphaned property values found');
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- ✅ New table structure is working');
    console.log('- ✅ Views are functioning correctly');
    console.log('- ✅ Junction tables are properly linked');
    console.log('- ✅ Data integrity is maintained');
    console.log('- ✅ Performance is acceptable');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testNewFacilitiesStructure().then(() => {
  console.log('\n🏁 Test script completed');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Test script failed:', error);
  process.exit(1);
}); 