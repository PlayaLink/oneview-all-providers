const fs = require('fs');
const { parse } = require('json2csv');

// List all columns in your Supabase table (except id, which is auto-generated)
const fields = [
  'prefix',
  'first_name',
  'middle_name',
  'last_name',
  'suffix',
  'pronouns',
  'title',
  'primary_specialty',
  'classifications',
  'taxonomy_codes',
  'clinical_services',
  'marital_status',
  'telemed_exp',
  'fluent_languages',
  'cms_medicare_specialty_codes',
  'work_email',
  'personal_email',
  'mobile_phone_number',
  'mobile_phone_carrier_name',
  'pager_number',
  'fax_number',
  'emergency_contact_name',
  'emergency_contact_email',
  'emergency_contact_phone',
  'emergency_contact_relationship',
  'social_security_number',
  'npi_number',
  'last_updated',
  'enumeration_date',
  'driver_license_or_id_number',
  'state_issued',
  'issue_date',
  'expiration_date'
];

const data = require('../src/data/providers.json');

// Ensure all fields are present for each row
const normalized = data.map(row => {
  const out = {};
  fields.forEach(f => {
    out[f] = row[f] || '';
  });
  return out;
});

const opts = { fields };

try {
  const csv = parse(normalized, opts);
  fs.writeFileSync('providers.csv', csv);
  console.log('CSV file created: providers.csv');
} catch (err) {
  console.error(err);
} 