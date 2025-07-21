import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedFacilities() {
  console.log('🌱 Seeding facilities table...');

  // Get existing facility properties from the database
  const { data: facilityProperties, error: propertiesError } = await supabase
    .from('facility_properties')
    .select('id');

  if (propertiesError) {
    console.error('❌ Error fetching facility_properties:', propertiesError);
    return;
  }

  if (!facilityProperties || facilityProperties.length === 0) {
    console.error('❌ No facility properties found. Please run the facility properties seeding script first.');
    return;
  }

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

  // Get all facility property IDs
  const allPropertyIds = facilityProperties.map(prop => prop.id);

  const facilities = [
    {
      label: 'Charlotte Mecklenburg Hospital Authority',
      icon: 'hospital',
      facility_properties: allPropertyIds,
      requirements: requirementIds.slice(0, 3),
      providers: providerIds.slice(0, 5)
    },
    {
      label: 'Cardiac Care Institute',
      icon: 'heart',
      facility_properties: allPropertyIds,
      requirements: requirementIds.slice(1, 4),
      providers: providerIds.slice(2, 7)
    },
    {
      label: 'Children\'s Hospital',
      icon: 'baby',
      facility_properties: allPropertyIds,
      requirements: requirementIds.slice(0, 2),
      providers: providerIds.slice(5, 10)
    },
    {
      label: 'Rehabilitation Center',
      icon: 'wheelchair',
      facility_properties: allPropertyIds,
      requirements: requirementIds.slice(2, 4),
      providers: providerIds.slice(0, 3)
    },
    {
      label: 'Emergency Trauma Center',
      icon: 'ambulance',
      facility_properties: allPropertyIds,
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

    // Seed facilities with references to existing facility_properties
    await seedFacilities();

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