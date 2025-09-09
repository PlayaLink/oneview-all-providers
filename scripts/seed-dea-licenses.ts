import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import fetch from 'node-fetch';
import https from 'https';
import { 
  STATE_OPTIONS, 
  STATUS_OPTIONS, 
  PAYMENT_INDICATOR_OPTIONS, 
  DONT_RENEW_OPTIONS, 
  DONT_TRANSFER_OPTIONS, 
  YES_NO_OPTIONS, 
  APPROVED_ERX_OPTIONS 
} from '../src/components/grid-item-details/DEALicensesSelectInputOptions';

// Create a custom fetch that ignores SSL certificate issues for development
const customFetch = (url: string, options: any) => {
  return fetch(url, {
    ...options,
    agent: new https.Agent({
      rejectUnauthorized: false
    })
  });
};

// Set seed for consistent data generation
faker.seed(12345);

// Use hardcoded values like other seeding scripts
const supabaseUrl = 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    fetch: customFetch as any
  }
});

interface DEALicense {
  provider_id: string;
  state: string;
  license_number: string;
  first_name: string;
  last_name: string;
  status: string;
  payment_indicator: string;
  issue_date: string;
  expiration_date: string;
  dont_renew: string;
  dont_transfer: string;
  primary_license: string;
  approved_erx: string;
  dea_schedules: string;
  address: string;
  address2: string;
  city: string;
  address_state: string;
  zip_code: string;
  tags: string[];
}

async function clearExistingData() {
  console.log('Clearing existing DEA licenses data...');
  const { error } = await supabase
    .from('dea_licenses')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
  
  if (error) {
    console.error('Error clearing existing data:', error);
    throw error;
  }
  console.log('Existing data cleared successfully');
}

async function getProviders() {
  console.log('Fetching providers...');
  const { data: providers, error } = await supabase
    .from('providers')
    .select('id, first_name, last_name, title, primary_specialty');
  
  if (error) {
    console.error('Error fetching providers:', error);
    throw error;
  }
  
  console.log(`Found ${providers?.length || 0} providers`);
  return providers || [];
}

function generateDEALicense(provider: any): DEALicense {
  const state = faker.helpers.arrayElement(STATE_OPTIONS);
  const status = faker.helpers.arrayElement(STATUS_OPTIONS);
  const paymentIndicator = faker.helpers.arrayElement(PAYMENT_INDICATOR_OPTIONS);
  const dontRenew = faker.helpers.arrayElement(DONT_RENEW_OPTIONS);
  const dontTransfer = faker.helpers.arrayElement(DONT_TRANSFER_OPTIONS);
  const primaryLicense = faker.helpers.arrayElement(YES_NO_OPTIONS);
  const approvedErx = faker.helpers.arrayElement(APPROVED_ERX_OPTIONS);
  
  // Generate realistic dates
  const issueDate = faker.date.past({ years: 5 });
  const expirationDate = faker.date.future({ years: 2 });
  
  // Generate DEA license number (9 digits)
  const licenseNumber = faker.string.numeric(9);
  
  // Generate address components
  const address = faker.location.streetAddress();
  const address2 = faker.datatype.boolean() ? faker.location.secondaryAddress() : '';
  const city = faker.location.city();
  const addressState = faker.helpers.arrayElement(STATE_OPTIONS);
  const zipCode = faker.location.zipCode();
  
  // Generate DEA schedules (common controlled substance schedules)
  const schedules = faker.helpers.arrayElements([
    'Schedule I', 'Schedule II', 'Schedule III', 'Schedule IV', 'Schedule V'
  ], { min: 1, max: 3 });
  
  // Generate tags
  const tags = faker.helpers.arrayElements([
    'DEA', 'Controlled Substances', 'Prescription', 'Pharmacy', 'Medical',
    'License', 'Federal', 'Drug Enforcement', 'Schedule II', 'Schedule III'
  ], { min: 2, max: 5 });

  return {
    provider_id: provider.id,
    state: state,
    license_number: licenseNumber,
    first_name: provider.first_name || faker.person.firstName(),
    last_name: provider.last_name || faker.person.lastName(),
    status: status,
    payment_indicator: paymentIndicator,
    issue_date: issueDate.toISOString().split('T')[0],
    expiration_date: expirationDate.toISOString().split('T')[0],
    dont_renew: dontRenew,
    dont_transfer: dontTransfer,
    primary_license: primaryLicense,
    approved_erx: approvedErx,
    dea_schedules: schedules.join(', '),
    address: address,
    address2: address2,
    city: city,
    address_state: addressState,
    zip_code: zipCode,
    tags: tags
  };
}

async function seedDEALicenses() {
  try {
    console.log('Starting DEA licenses seeding...');
    
    // Clear existing data
    await clearExistingData();
    
    // Get providers
    const providers = await getProviders();
    
    if (providers.length === 0) {
      console.log('No providers found. Please seed providers first.');
      return;
    }
    
    // Generate DEA licenses (3-5 per provider)
    const deaLicenses: DEALicense[] = [];
    
    for (const provider of providers) {
      const numLicenses = faker.number.int({ min: 3, max: 5 });
      
      for (let i = 0; i < numLicenses; i++) {
        const deaLicense = generateDEALicense(provider);
        deaLicenses.push(deaLicense);
      }
    }
    
    console.log(`Generated ${deaLicenses.length} DEA licenses`);
    
    // Insert in batches
    const batchSize = 100;
    for (let i = 0; i < deaLicenses.length; i += batchSize) {
      const batch = deaLicenses.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('dea_licenses')
        .insert(batch);
      
      if (error) {
        console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error);
        throw error;
      }
      
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(deaLicenses.length / batchSize)}`);
    }
    
    console.log('DEA licenses seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding DEA licenses:', error);
    throw error;
  }
}

// Run the seeding function
seedDEALicenses()
  .then(() => {
    console.log('Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
