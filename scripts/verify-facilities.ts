import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
  console.log('🔍 Checking facility data...');
  
  // Check facility count
  const { count: facilityCount } = await supabase
    .from('facilities')
    .select('*', { count: 'exact', head: true });
  
  console.log(`📊 Facilities: ${facilityCount}`);
  
  // Check facility property values count
  const { count: valueCount } = await supabase
    .from('facility_property_values')
    .select('*', { count: 'exact', head: true });
  
  console.log(`📊 Facility Property Values: ${valueCount}`);
  
  // Check boolean values specifically
  console.log('\n🔍 Checking boolean values...');
  const { data: booleanValues } = await supabase
    .from('facility_property_values')
    .select(`
      value,
      facility_property:facility_properties(key, label, type)
    `)
    .eq('facility_property.type', 'boolean')
    .limit(10);
  
  console.log('Boolean property values:');
  booleanValues?.forEach(item => {
    console.log(`  ${item.facility_property?.key}: ${item.value} (${typeof item.value})`);
  });
  
  // Check text values
  console.log('\n🔍 Checking text values...');
  const { data: textValues } = await supabase
    .from('facility_property_values')
    .select(`
      value,
      facility_property:facility_properties(key, label, type)
    `)
    .eq('facility_property.type', 'text')
    .limit(5);
  
  console.log('Text property values:');
  textValues?.forEach(item => {
    console.log(`  ${item.facility_property?.key}: ${item.value} (${typeof item.value})`);
  });
  
  // Check number values
  console.log('\n🔍 Checking number values...');
  const { data: numberValues } = await supabase
    .from('facility_property_values')
    .select(`
      value,
      facility_property:facility_properties(key, label, type)
    `)
    .eq('facility_property.type', 'number')
    .limit(5);
  
  console.log('Number property values:');
  numberValues?.forEach(item => {
    console.log(`  ${item.facility_property?.key}: ${item.value} (${typeof item.value})`);
  });
  
  // Test the view
  console.log('\n🔍 Testing facilities_with_property_values view...');
  const { data: viewData } = await supabase
    .from('facilities_with_property_values')
    .select('*')
    .limit(3);
  
  console.log('View sample data:');
  viewData?.forEach(item => {
    console.log(`  ${item.facility_label} - ${item.property_key}: ${item.property_value} (${typeof item.property_value})`);
  });
  
  // Check a specific facility's data
  console.log('\n🔍 Checking specific facility data...');
  const { data: facilityData } = await supabase
    .from('facilities_with_property_values')
    .select('*')
    .eq('facility_label', 'Charlotte Mecklenburg Hospital Authority')
    .limit(10);
  
  console.log('Charlotte Mecklenburg Hospital Authority data:');
  facilityData?.forEach(item => {
    console.log(`  ${item.property_key}: ${item.property_value} (${typeof item.property_value})`);
  });
}

checkData().then(() => {
  console.log('\n✅ Data verification completed');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
}); 