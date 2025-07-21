import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function connectFacilitiesToRequirements() {
  console.log('🔗 Connecting facilities to requirements...');

  // Get all requirements
  const { data: requirements, error: reqError } = await supabase
    .from('requirements')
    .select('id, key, label, group, required')
    .order('group, label');

  if (reqError) {
    console.error('❌ Error fetching requirements:', reqError);
    return;
  }

  console.log(`📋 Found ${requirements.length} requirements`);

  // Get all facilities
  const { data: facilities, error: facError } = await supabase
    .from('facilities')
    .select('id, label, requirements')
    .order('label');

  if (facError) {
    console.error('❌ Error fetching facilities:', reqError);
    return;
  }

  console.log(`🏥 Found ${facilities.length} facilities`);

  // For each facility, assign all requirements (since these are standard eligibility criteria)
  const updates = facilities.map(facility => ({
    id: facility.id,
    requirements: requirements.map(req => req.id)
  }));

  console.log('🔄 Updating facilities with requirements...');

  // Update each facility
  for (const update of updates) {
    const { error: updateError } = await supabase
      .from('facilities')
      .update({ requirements: update.requirements })
      .eq('id', update.id);

    if (updateError) {
      console.error(`❌ Error updating facility ${update.id}:`, updateError);
    } else {
      console.log(`✅ Updated facility: ${facilities.find(f => f.id === update.id)?.label}`);
    }
  }

  console.log('🎉 Facilities connected to requirements successfully!');

  // Verify the connection
  console.log('🔍 Verifying connection...');
  const { data: verifyData, error: verifyError } = await supabase
    .from('facilities')
    .select(`
      id,
      label,
      requirements,
      requirements_details:requirements(id, key, label, group, required)
    `)
    .limit(3);

  if (verifyError) {
    console.error('❌ Error verifying connection:', verifyError);
  } else {
    console.log('✅ Verification successful:');
    console.log(JSON.stringify(verifyData, null, 2));
  }
}

async function main() {
  try {
    await connectFacilitiesToRequirements();
  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

// Run the script
main().then(() => {
  console.log('🏁 Facilities to requirements connection script finished');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
}); 