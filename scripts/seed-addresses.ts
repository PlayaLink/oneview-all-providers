import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAddresses() {
  // Fetch all providers
  const { data: providers, error } = await supabase
    .from('providers')
    .select('id');

  if (error) {
    console.error('Error fetching providers:', error);
    process.exit(1);
  }

  for (const provider of providers) {
    // Check if an address already exists for this provider
    const { data: existing, error: existingError } = await supabase
      .from('addresses')
      .select('id')
      .eq('provider_id', provider.id)
      .maybeSingle();
    if (existingError) {
      console.error(`Error checking existing address for provider ${provider.id}:`, existingError);
      continue;
    }
    if (existing) {
      console.log(`Address already exists for provider ${provider.id}, skipping.`);
      continue;
    }
    const address = {
      provider_id: provider.id,
      type: faker.helpers.arrayElement(['Home', 'Work', 'Mailing', 'Billing']),
      address: faker.location.streetAddress(),
      address_2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zip_postal_code: faker.location.zipCode(),
      phone_number: faker.phone.number(),
      email: faker.internet.email(),
      start_date: faker.date.past({ years: 10 }).toISOString().slice(0, 10),
      end_date: null,
      county: faker.location.county(),
      country: faker.location.country(),
      tags: [faker.word.noun()],
      last_updated: new Date().toISOString(),
    };
    const { error: insertError } = await supabase
      .from('addresses')
      .insert([address]);
    if (insertError) {
      console.error(`Error inserting address for provider ${provider.id}:`, insertError);
    } else {
      console.log(`Inserted address for provider ${provider.id}`);
    }
  }
  console.log('Seeding addresses complete.');
}

seedAddresses(); 