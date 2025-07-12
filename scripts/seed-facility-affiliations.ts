import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

const supabaseUrl = 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const STAFF_CATEGORIES = ['Active', 'Consulting', 'Visiting', 'Emeritus'];
const FACILITY_TYPES = ['Hospital', 'Clinic', 'Surgery Center', 'Rehab', 'Lab'];
const TAG_OPTIONS = ['urgent', 'expiring', 'primary', 'secondary', 'remote', 'on-call'];

function randomBoolOrNull() {
  const r = Math.random();
  if (r < 0.33) return true;
  if (r < 0.66) return false;
  return null;
}

function randomTags() {
  if (Math.random() < 0.5) return [];
  const count = Math.random() < 0.7 ? 1 : 2;
  return Array.from({ length: count }, () => faker.helpers.arrayElement(TAG_OPTIONS));
}

function generateAffiliation(provider_id: string, seed: number) {
  faker.seed(seed);
  const start = faker.date.between({ from: '2010-01-01', to: '2020-12-31' });
  const end = faker.date.between({ from: start, to: '2030-12-31' });
  const apptEnd = faker.date.between({ from: end, to: '2032-12-31' });
  return {
    provider_id,
    facility_name: faker.company.name() + ' ' + faker.helpers.arrayElement(['Hospital', 'Clinic', 'Center']),
    staff_category: faker.helpers.arrayElement(STAFF_CATEGORIES),
    in_good_standing: randomBoolOrNull(),
    facility_type: faker.helpers.arrayElement(FACILITY_TYPES),
    currently_affiliated: randomBoolOrNull(),
    appt_end_date: apptEnd.toISOString().slice(0, 10),
    start_date: start.toISOString().slice(0, 10),
    end_date: end.toISOString().slice(0, 10),
    reason_for_leaving: faker.lorem.sentence(),
    accepting_new_patients: randomBoolOrNull(),
    telemedicine: randomBoolOrNull(),
    takes_calls: randomBoolOrNull(),
    admitting_privileges: randomBoolOrNull(),
    primary_affiliation: randomBoolOrNull(),
    tags: randomTags(),
    last_updated: new Date().toISOString(),
  };
}

async function main() {
  const { data: providers, error } = await supabase.from('providers').select('id');
  if (error) {
    console.error('Error fetching providers:', error);
    process.exit(1);
  }
  if (!providers) {
    console.error('No providers found.');
    process.exit(1);
  }

  for (const [i, provider] of providers.entries()) {
    const affiliations = Array.from({ length: 5 }).map((_, j) => generateAffiliation(provider.id, i * 10 + j));
    const { error: insertError } = await supabase.from('facility_affiliations').insert(affiliations);
    if (insertError) {
      console.error(`Error inserting affiliations for provider ${provider.id}:`, insertError);
    } else {
      console.log(`Inserted 5 facility affiliations for provider ${provider.id}`);
    }
  }
  console.log('Done!');
}

main(); 