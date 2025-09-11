import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

// Import dropdown options for consistent data generation
import {
  LICENSE_TYPE_OPTIONS,
  STATE_OPTIONS,
  STATUS_OPTIONS,
  DONT_RENEW_OPTIONS,
  IS_PRIMARY_OPTIONS,
  TITLE_OPTIONS,
  PRIMARY_SPECIALTY_OPTIONS,
  TAGS_OPTIONS
} from '../src/components/grid-item-details/StateControlledSubstanceLicensesSelectInputOptions';

// Custom fetch configuration for SSL certificate handling in development
const customFetch = (url: string, options: any = {}) => {
  return fetch(url, {
    ...options,
    // Disable SSL verification in development
    ...(process.env.NODE_ENV === 'development' && {
      // @ts-ignore
      rejectUnauthorized: false
    })
  });
};

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    fetch: customFetch
  }
});

interface StateControlledSubstanceLicense {
  provider_id: string;
  license_type: string;
  license_number: string;
  state: string;
  status: string;
  issue_date: string;
  expiration_date: string;
  expires_within: string;
  dont_renew: string;
  is_primary: string;
  first_name: string;
  last_name: string;
  tags: string[];
}

async function clearExistingData(): Promise<void> {
  try {
    console.log('Clearing existing state controlled substance licenses data...');
    
    const { error } = await supabase
      .from('state_controlled_substance_licenses')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (error) {
      throw new Error(`Failed to clear existing data: ${error.message}`);
    }
    
    console.log('✅ Existing data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing existing data:', error);
    throw error;
  }
}

async function getProviders(): Promise<{ id: string; provider_name: string }[]> {
  try {
    console.log('Fetching providers...');
    
    const { data: providers, error } = await supabase
      .from('providers')
      .select('id, provider_name')
      .limit(1000); // Limit to prevent memory issues
    
    if (error) {
      throw new Error(`Failed to fetch providers: ${error.message}`);
    }
    
    if (!providers || providers.length === 0) {
      throw new Error('No providers found. Please seed providers first.');
    }
    
    console.log(`✅ Found ${providers.length} providers`);
    return providers;
  } catch (error) {
    console.error('❌ Error fetching providers:', error);
    throw error;
  }
}

function generateStateControlledSubstanceLicense(provider: { id: string; provider_name: string }): StateControlledSubstanceLicense {
  // Set deterministic seed based on provider ID for consistent data
  const seed = provider.id.split('-').join('');
  faker.seed(parseInt(seed.substring(0, 8), 16));
  
  const issueDate = faker.date.past({ years: 10 });
  const expirationDate = faker.date.future({ years: 5, refDate: issueDate });
  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate 3-5 records per provider
  const recordCount = faker.number.int({ min: 3, max: 5 });
  
  return {
    provider_id: provider.id,
    license_type: faker.helpers.arrayElement(LICENSE_TYPE_OPTIONS.map(opt => opt.value)),
    license_number: faker.string.alphanumeric({ length: 9, casing: 'upper' }),
    state: faker.helpers.arrayElement(STATE_OPTIONS.map(opt => opt.value)),
    status: faker.helpers.arrayElement(STATUS_OPTIONS.map(opt => opt.value)),
    issue_date: issueDate.toISOString().split('T')[0],
    expiration_date: expirationDate.toISOString().split('T')[0],
    expires_within: daysUntilExpiration > 0 ? `${daysUntilExpiration} days` : 'Expired',
    dont_renew: faker.helpers.arrayElement(DONT_RENEW_OPTIONS.map(opt => opt.value)),
    is_primary: faker.helpers.arrayElement(IS_PRIMARY_OPTIONS.map(opt => opt.value)),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    tags: faker.helpers.arrayElements(TAGS_OPTIONS.map(opt => opt.value), { min: 0, max: 3 })
  };
}

async function seedStateControlledSubstanceLicenses(): Promise<void> {
  try {
    console.log('🌱 Starting state controlled substance licenses seeding...');
    
    // Clear existing data
    await clearExistingData();
    
    // Get providers
    const providers = await getProviders();
    
    // Generate records for each provider
    const records: StateControlledSubstanceLicense[] = [];
    
    for (const provider of providers) {
      const recordCount = faker.number.int({ min: 3, max: 5 });
      
      for (let i = 0; i < recordCount; i++) {
        records.push(generateStateControlledSubstanceLicense(provider));
      }
    }
    
    console.log(`📊 Generated ${records.length} state controlled substance license records`);
    
    // Insert records in batches
    const batchSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('state_controlled_substance_licenses')
        .insert(batch);
      
      if (error) {
        throw new Error(`Failed to insert batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
      }
      
      insertedCount += batch.length;
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)} (${insertedCount}/${records.length} records)`);
    }
    
    console.log(`🎉 Successfully seeded ${insertedCount} state controlled substance license records`);
    
    // Verify the data
    const { count, error: countError } = await supabase
      .from('state_controlled_substance_licenses')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.warn('⚠️ Could not verify record count:', countError.message);
    } else {
      console.log(`✅ Verification: ${count} records in database`);
    }
    
  } catch (error) {
    console.error('❌ Error seeding state controlled substance licenses:', error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    await seedStateControlledSubstanceLicenses();
    console.log('🎉 State controlled substance licenses seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 State controlled substance licenses seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding
main();
