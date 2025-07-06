import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function generateRandomPhoneNumber(): string {
  const area = Math.floor(100 + Math.random() * 900);
  const prefix = Math.floor(100 + Math.random() * 900);
  const line = Math.floor(1000 + Math.random() * 9000);
  return `(${area}) ${prefix}-${line}`;
}

async function bulkUpdateProviders() {
  const { data: providers, error } = await supabase
    .from('providers')
    .select('id');

  if (error) {
    console.error('Error fetching providers:', error.message);
    process.exit(1);
  }

  if (!providers || providers.length === 0) {
    console.log('No providers found.');
    return;
  }

  for (const provider of providers) {
    const phone = generateRandomPhoneNumber();
    const { error: updateError } = await supabase
      .from('providers')
      .update({ mobile_phone_number: phone })
      .eq('id', provider.id);
    if (updateError) {
      console.error(`Failed to update provider ${provider.id}:`, updateError.message);
    } else {
      console.log(`Updated provider ${provider.id} with phone ${phone}`);
    }
  }

  console.log('Bulk update complete.');
}

bulkUpdateProviders(); 