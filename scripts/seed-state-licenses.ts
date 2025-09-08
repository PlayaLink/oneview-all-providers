import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import fetch from 'node-fetch';
import https from 'https';
import { STATE_OPTIONS, SEEDING_LICENSE_TYPE_OPTIONS, EXTENDED_STATUS_OPTIONS, TAG_OPTIONS } from '../src/components/grid-item-details/StateLicenseSelectInputOptions';

// Create a custom fetch that ignores SSL certificate issues for development
const customFetch = (url: string, options: any) => {
  return fetch(url, {
    ...options,
    agent: new https.Agent({
      rejectUnauthorized: false
    })
  });
};

// Create a standalone Supabase client for the script
const supabaseUrl = 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    fetch: customFetch as any
  }
});

const US_STATES = STATE_OPTIONS;
const LICENSE_TYPES = SEEDING_LICENSE_TYPE_OPTIONS;
const STATUS = EXTENDED_STATUS_OPTIONS;
const TAG_OPTIONS_ARRAY = TAG_OPTIONS;

function getDeterministicItem<T>(array: T[], seed: number): T {
  return array[seed % array.length];
}

function generateLicenseNumber(seed: number): string {
  const formats = [
    () => `C1-${faker.string.numeric(7)}`,
    () => `DR.${faker.string.numeric(7)}`,
    () => `${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.numeric(8)}`,
    () => faker.string.numeric(5),
    () => faker.string.numeric(6),
    () => `${faker.string.numeric(2)}.${faker.string.numeric(6)}`,
    () => `MD${faker.string.numeric(7)}`,
    () => `${faker.string.numeric(7)}-${faker.string.numeric(4)}`
  ];
  return getDeterministicItem(formats, seed)();
}

function randomDateBetween(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US');
}

function expiresWithin(expDate: Date): string {
  const now = new Date();
  const diff = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff < 0 ? "Expired" : `${diff} days`;
}

function randomTags() {
  // 50% chance of no tags, otherwise 1-2 random tags
  if (Math.random() < 0.5) return [];
  const count = Math.random() < 0.7 ? 1 : 2;
  return Array.from({ length: count }, () => faker.helpers.arrayElement(TAG_OPTIONS_ARRAY));
}

function generateStateLicense(provider_id: string, seed: number) {
  const issue = randomDateBetween(new Date(1990, 0, 1), new Date(2015, 11, 31));
  
  // Generate expiration date between 30 days in the past and 150 days in the future
  const today = new Date();
  const pastDate = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000)); // 30 days ago
  const futureDate = new Date(today.getTime() + (150 * 24 * 60 * 60 * 1000)); // 150 days from now
  const exp = randomDateBetween(pastDate, futureDate);
  
  return {
    provider_id,
    license_type: getDeterministicItem(LICENSE_TYPES, seed),
    license: generateLicenseNumber(seed),
    license_additional_info: getDeterministicItem(["No", "Yes"], seed),
    state: getDeterministicItem(US_STATES, seed),
    status: getDeterministicItem(STATUS, seed),
    issue_date: formatDate(issue),
    expiration_date: formatDate(exp),
    expires_within: expiresWithin(exp),
    tags: randomTags()
  };
}

async function main() {
  console.log('Starting state licenses seeding...');
  
  // Add retry logic for fetching providers
  let providers;
  let error;
  let retries = 3;
  
  while (retries > 0) {
    try {
      console.log(`Attempting to fetch providers (attempt ${4 - retries}/3)...`);
      const result = await supabase.from('providers').select('id');
      providers = result.data;
      error = result.error;
      
      if (!error && providers) {
        console.log(`Successfully fetched ${providers.length} providers`);
        break;
      }
    } catch (err) {
      console.log(`Attempt failed: ${err}`);
      error = err;
    }
    
    retries--;
    if (retries > 0) {
      console.log(`Retrying in 2 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  if (error) {
    console.error('Error fetching providers after all retries:', error);
    process.exit(1);
  }
  if (!providers) {
    console.error('No providers found.');
    process.exit(1);
  }

  // Clear existing state licenses data
  console.log('Clearing existing state licenses...');
  const { error: deleteError } = await supabase.from('state_licenses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('Error clearing existing state licenses:', deleteError);
    process.exit(1);
  }
  console.log('Existing state licenses cleared successfully.');

  for (const [i, provider] of providers.entries()) {
    const licenses = Array.from({ length: 5 }).map((_, j) => generateStateLicense(provider.id, i * 10 + j));
    const { error: insertError } = await supabase.from('state_licenses').insert(licenses);
    if (insertError) {
      console.error(`Error inserting licenses for provider ${provider.id}:`, insertError);
    } else {
      console.log(`Inserted 5 state licenses for provider ${provider.id}`);
    }
  }
  console.log('Done!');
}

main(); 