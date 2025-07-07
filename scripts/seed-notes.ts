import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

const supabaseUrl = 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AUTHOR = 'Jordan England-Nelson';

async function seedNotes() {
  // Seed for providers
  const { data: providers, error: providersError } = await supabase.from('providers').select('id');
  if (providersError) {
    console.error('Error fetching providers:', providersError);
    process.exit(1);
  }
  if (!providers) {
    console.error('No providers found.');
    process.exit(1);
  }
  for (const provider of providers) {
    const notes = Array.from({ length: 3 }).map(() => ({
      text: faker.lorem.paragraph(),
      author: AUTHOR,
      record_id: provider.id,
      record_type: 'Provider_Info',
    }));
    const { error: insertError } = await supabase.from('notes').insert(notes);
    if (insertError) {
      console.error(`Error inserting notes for provider ${provider.id}:`, insertError);
    } else {
      console.log(`Inserted 3 notes for provider ${provider.id}`);
    }
  }

  // Seed for state licenses
  const { data: licenses, error: licensesError } = await supabase.from('state_licenses').select('id');
  if (licensesError) {
    console.error('Error fetching state licenses:', licensesError);
    process.exit(1);
  }
  if (!licenses) {
    console.error('No state licenses found.');
    process.exit(1);
  }
  for (const license of licenses) {
    const notes = Array.from({ length: 3 }).map(() => ({
      text: faker.lorem.paragraph(),
      author: AUTHOR,
      record_id: license.id,
      record_type: 'State_Licenses',
    }));
    const { error: insertError } = await supabase.from('notes').insert(notes);
    if (insertError) {
      console.error(`Error inserting notes for state license ${license.id}:`, insertError);
    } else {
      console.log(`Inserted 3 notes for state license ${license.id}`);
    }
  }
  console.log('Done seeding notes!');
}

seedNotes(); 