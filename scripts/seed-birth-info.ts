import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedBirthInfo() {
  // Fetch all providers
  const { data: providers, error } = await supabase
    .from('providers')
    .select('id');

  if (error) {
    console.error('Error fetching providers:', error);
    process.exit(1);
  }

  for (const provider of providers) {
    // Check if a birth_info record already exists for this provider
    const { data: existing, error: existingError } = await supabase
      .from('birth_info')
      .select('id')
      .eq('provider_id', provider.id)
      .maybeSingle();
    if (existingError) {
      console.error(`Error checking existing birth_info for provider ${provider.id}:`, existingError);
      continue;
    }
    if (existing) {
      console.log(`birth_info already exists for provider ${provider.id}, skipping.`);
      continue;
    }
    const birthInfo = {
      provider_id: provider.id,
      date_of_birth: faker.date.birthdate({ min: 1950, max: 1995, mode: 'year' }),
      country_of_citizenship: faker.location.country(),
      citizenship_work_auth: faker.helpers.arrayElement(['US Citizen', 'Permanent Resident', 'Work Visa', 'Other']),
      us_work_auth: faker.helpers.arrayElement(['Yes', 'No']),
      tags: [faker.word.noun(), faker.word.noun()],
      last_updated: new Date().toISOString(),
      birth_city: faker.location.city(),
      birth_state_province: faker.location.state(),
      birth_county: faker.location.county(),
      birth_country: faker.location.country(),
      gender: faker.helpers.arrayElement(['Male', 'Female', 'Non-binary', 'Other']),
      identifies_transgender: faker.datatype.boolean(),
      hair_color: faker.helpers.arrayElement(['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'Other']),
      eye_color: faker.helpers.arrayElement(['Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Other']),
      height_ft: faker.number.int({ min: 4, max: 7 }),
      height_in: faker.number.int({ min: 0, max: 11 }),
      weight_lbs: faker.number.int({ min: 90, max: 300 }),
      ethnicity: faker.helpers.arrayElement(['Hispanic', 'Non-Hispanic', 'Asian', 'Black', 'White', 'Native American', 'Other']),
    };
    const { error: insertError } = await supabase
      .from('birth_info')
      .insert([birthInfo]);
    if (insertError) {
      console.error(`Error inserting for provider ${provider.id}:`, insertError);
    } else {
      console.log(`Inserted birth_info for provider ${provider.id}`);
    }
  }
  console.log('Seeding complete.');
}

seedBirthInfo(); 