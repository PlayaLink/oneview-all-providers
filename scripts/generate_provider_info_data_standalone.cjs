const fs = require('fs');
const path = require('path');

// Minimal Provider_Info grid definition (copy from gridDefinitions.json)
const providerInfoGrid = {
  tableName: 'Provider_Info',
  displayName: 'Provider Info',
  group: 'Provider',
  columns: [
    'id', 'first_name', 'last_name', 'middle_name', 'title', 'primary_specialty', 'npi_number',
    'work_email', 'personal_email', 'mobile_phone', 'work_phone', 'address', 'city', 'state', 'zip',
    'last_updated', 'status'
  ]
};

// Helper functions for fake data
function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let str = '';
  for (let i = 0; i < length; i++) str += randomFrom(chars);
  return str;
}
function randomEmail(first, last) {
  return `${first}.${last}@example.com`.toLowerCase();
}
function randomPhone() {
  return `(${Math.floor(Math.random()*900+100)}) ${Math.floor(Math.random()*900+100)}-${Math.floor(Math.random()*9000+1000)}`;
}
function randomNPI() {
  return String(Math.floor(Math.random() * 1e9 + 1e9));
}
function randomDate() {
  const d = new Date(Date.now() - Math.floor(Math.random() * 1e10));
  return d.toISOString().split('T')[0];
}

// Realistic first and last names
const firstNames = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
  "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
  "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra",
  "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle"
];
const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
  "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
  "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores"
];

// Main data generator
function generateSampleData(count) {
  const specialties = ['Cardiology', 'Dermatology', 'Family Medicine', 'Internal Medicine', 'Pediatrics', 'Psychiatry', 'Surgery'];
  const titles = ['MD', 'DO', 'NP', 'PA', 'RN', 'PhD'];
  const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];
  const statuses = ['Active', 'Inactive', 'Pending'];
  const data = [];
  for (let i = 0; i < count; i++) {
    const first = randomFrom(firstNames);
    const last = randomFrom(lastNames);
    const middle = randomString(1).toUpperCase();
    data.push({
      id: i + 1,
      first_name: first,
      last_name: last,
      middle_name: middle,
      title: randomFrom(titles),
      primary_specialty: randomFrom(specialties),
      npi_number: randomNPI(),
      work_email: randomEmail(first, last),
      personal_email: randomEmail(last, first),
      mobile_phone: randomPhone(),
      work_phone: randomPhone(),
      address: `${Math.floor(Math.random()*9999+1)} ${randomString(7)} St`,
      city: randomString(6).charAt(0).toUpperCase() + randomString(5),
      state: randomFrom(states),
      zip: String(Math.floor(Math.random()*90000+10000)),
      last_updated: randomDate(),
      status: randomFrom(statuses)
    });
  }
  return data;
}

const OUTPUT_PATH = path.join(__dirname, '../src/data/providers.json');
const records = generateSampleData(50);
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(records, null, 2), 'utf-8');
console.log(`Generated 50 Provider Info records to ${OUTPUT_PATH}`); 