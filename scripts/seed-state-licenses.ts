import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

const supabaseUrl = 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

const LICENSE_TYPES = ["MD", "DO", "NP", "PA", "RN", "LPN", "CRNA", "DPM", "DDS", "DMD"];
const STATUS = ["Active", "Expired", "Pending"];
const TAG_OPTIONS = ['urgent', 'expiring', 'renewal', 'compliance', 'audit', 'pending', 'primary', 'secondary'];

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
  return Array.from({ length: count }, () => faker.helpers.arrayElement(TAG_OPTIONS));
}

function generateStateLicense(provider_id: string, seed: number) {
  const issue = randomDateBetween(new Date(1990, 0, 1), new Date(2015, 11, 31));
  const exp = randomDateBetween(issue, new Date(2027, 11, 31));
  return {
    provider_id,
    license_type: getDeterministicItem(LICENSE_TYPES, seed),
    license: generateLicenseNumber(seed),
    license_additional_info: getDeterministicItem(["No", "Yes"], seed),
    state: getDeterministicItem(US_STATES, seed),
    status: getDeterministicItem(STATUS, seed),
    issue_date: formatDate(issue),
    expiration_date: formatDate(exp),
    expires_within: getDeterministicItem([
      "Expired", "Expiring", "7 Days", "14 Days", "30 Days", "60 Days", "90 Days"
    ], seed),
    tags: randomTags()
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
    // Optionally: delete existing dummy state licenses for this provider
    // await supabase.from('state_licenses').delete().eq('provider_id', provider.id);
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