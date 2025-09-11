#!/usr/bin/env tsx

/**
 * Seed Additional Names Data
 * 
 * This script seeds the additional_names table with realistic test data.
 * It generates 3-5 additional names per provider with various types and realistic names.
 */

import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import { TYPE_OPTIONS_EXTENDED, TITLE_OPTIONS_EXTENDED, TAG_OPTIONS_EXTENDED } from '../src/components/grid-item-details/AdditionalNamesSelectInputOptions';

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Custom fetch configuration for development
const customFetch = (url: string, options: any) => {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: {
    fetch: customFetch,
  },
});

interface AdditionalName {
  provider_id: string;
  type: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  title?: string;
  start_date?: string;
  end_date?: string;
  tags: string[];
}

async function clearExistingData(): Promise<void> {
  try {
    console.log('🗑️  Clearing existing additional_names data...');
    
    const { error } = await supabase
      .from('additional_names')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (error) {
      console.error('❌ Error clearing existing data:', error);
      throw error;
    }
    
    console.log('✅ Existing data cleared successfully');
  } catch (error) {
    console.error('❌ Failed to clear existing data:', error);
    throw error;
  }
}

async function fetchProviders(): Promise<any[]> {
  try {
    console.log('📋 Fetching providers...');
    
    const { data: providers, error } = await supabase
      .from('providers')
      .select('id, first_name, last_name')
      .limit(100); // Limit to first 100 providers for seeding
    
    if (error) {
      console.error('❌ Error fetching providers:', error);
      throw error;
    }
    
    console.log(`✅ Found ${providers?.length || 0} providers`);
    return providers || [];
  } catch (error) {
    console.error('❌ Failed to fetch providers:', error);
    throw error;
  }
}

function generateAdditionalName(provider: any): AdditionalName {
  // Set deterministic seed based on provider ID for consistent data
  const seed = provider.id.split('-')[0];
  faker.seed(parseInt(seed, 16));
  
  const type = faker.helpers.arrayElement(TYPE_OPTIONS_EXTENDED);
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const middleName = faker.datatype.boolean(0.3) ? faker.person.middleName() : undefined;
  const title = faker.datatype.boolean(0.4) ? faker.helpers.arrayElement(TITLE_OPTIONS_EXTENDED) : undefined;
  
  // Generate realistic date ranges
  const startDate = faker.datatype.boolean(0.7) ? faker.date.past({ years: 5 }) : undefined;
  const endDate = startDate && faker.datatype.boolean(0.3) ? 
    faker.date.between({ from: startDate, to: new Date() }) : undefined;
  
  // Generate tags
  const numTags = faker.number.int({ min: 0, max: 3 });
  const tags = faker.helpers.arrayElements(TAG_OPTIONS_EXTENDED, numTags);
  
  return {
    provider_id: provider.id,
    type,
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
    title,
    start_date: startDate?.toISOString().split('T')[0],
    end_date: endDate?.toISOString().split('T')[0],
    tags
  };
}

async function seedAdditionalNames(providers: any[]): Promise<void> {
  try {
    console.log('🌱 Generating additional names data...');
    
    const additionalNames: AdditionalName[] = [];
    
    for (const provider of providers) {
      // Generate 3-5 additional names per provider
      const numNames = faker.number.int({ min: 3, max: 5 });
      
      for (let i = 0; i < numNames; i++) {
        additionalNames.push(generateAdditionalName(provider));
      }
    }
    
    console.log(`📊 Generated ${additionalNames.length} additional names records`);
    
    // Insert in batches of 100
    const batchSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < additionalNames.length; i += batchSize) {
      const batch = additionalNames.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('additional_names')
        .insert(batch);
      
      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error);
        throw error;
      }
      
      insertedCount += batch.length;
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}: ${insertedCount}/${additionalNames.length} records`);
    }
    
    console.log(`🎉 Successfully seeded ${insertedCount} additional names records`);
  } catch (error) {
    console.error('❌ Failed to seed additional names:', error);
    throw error;
  }
}

async function verifySeeding(): Promise<void> {
  try {
    console.log('🔍 Verifying seeded data...');
    
    const { data: count, error: countError } = await supabase
      .from('additional_names')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error verifying count:', countError);
      throw countError;
    }
    
    console.log(`📊 Total additional names records: ${count}`);
    
    // Check sample records
    const { data: sample, error: sampleError } = await supabase
      .from('additional_names_with_provider')
      .select('*')
      .limit(5);
    
    if (sampleError) {
      console.error('❌ Error fetching sample records:', sampleError);
      throw sampleError;
    }
    
    console.log('📋 Sample records:');
    sample?.forEach((record, index) => {
      console.log(`  ${index + 1}. ${record.provider_name} - ${record.type}: ${record.first_name} ${record.last_name}`);
    });
    
    console.log('✅ Verification completed successfully');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  }
}

async function main(): Promise<void> {
  try {
    console.log('🚀 Starting Additional Names seeding process...');
    console.log(`📍 Supabase URL: ${SUPABASE_URL}`);
    
    // Clear existing data
    await clearExistingData();
    
    // Fetch providers
    const providers = await fetchProviders();
    
    if (providers.length === 0) {
      console.log('⚠️  No providers found. Please seed providers first.');
      process.exit(1);
    }
    
    // Seed additional names
    await seedAdditionalNames(providers);
    
    // Verify seeding
    await verifySeeding();
    
    console.log('🎉 Additional Names seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Seeding process failed:', error);
    process.exit(1);
  }
}

// Run the seeding process
main();
