import { gridDefinitions } from "./gridDefinitions";
import { faker } from '@faker-js/faker';

// Sample data for generating realistic provider information
const sampleData = {
  providers: [
    { firstName: "Sofia", lastName: "García", title: "MD", specialty: "Acupuncture" },
    { firstName: "Tom", lastName: "Petty", title: "MD", specialty: "General Surgery" },
    { firstName: "Sarah", lastName: "Johnson", title: "MD", specialty: "Cardiology" },
    { firstName: "David", lastName: "Brown", title: "NP", specialty: "Family Medicine" },
    { firstName: "Emily", lastName: "Davis", title: "MD", specialty: "Pediatrics" },
    { firstName: "Robert", lastName: "Wilson", title: "MD", specialty: "Orthopedics" },
    { firstName: "Jessica", lastName: "Miller", title: "PA", specialty: "Dermatology" },
    { firstName: "Christopher", lastName: "Moore", title: "MD", specialty: "Neurology" },
    { firstName: "Ashley", lastName: "Taylor", title: "MD", specialty: "Psychiatry" },
    { firstName: "Matthew", lastName: "Anderson", title: "DO", specialty: "Radiology" },
  ],
  addresses: ["123 Main St", "456 Oak Ave", "789 Pine Rd", "321 Elm St", "654 Maple Dr"],
  cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"],
  states: ["CA", "TX", "NY", "FL", "IL", "PA", "OH", "GA", "NC", "MI"],
  countries: ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Mexico", "India", "Brazil", "China"],
  tags: ["Active", "Expired", "Pending", "Team A", "Team B", "Team C", "1099", "W2", "Green", "Red"],
};

// Simple seeded random number generator
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Helper function to get deterministic random item from array
const getDeterministicItem = <T>(array: T[], seed: number): T => {
  const index = Math.floor(seededRandom(seed) * array.length);
  return array[index];
};

// Helper function to generate deterministic random date
const getDeterministicDate = (start: Date, end: Date, seed: number): string => {
  const randomValue = seededRandom(seed);
  const date = new Date(start.getTime() + randomValue * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

// Helper function to generate deterministic random phone number
const getDeterministicPhone = (seed: number): string => {
  const areaCode = Math.floor(seededRandom(seed) * 900) + 100;
  const prefix = Math.floor(seededRandom(seed + 1) * 900) + 100;
  const lineNumber = Math.floor(seededRandom(seed + 2) * 9000) + 1000;
  return `(${areaCode}) ${prefix}-${lineNumber}`;
};

// Helper function to generate deterministic random NPI number
const getDeterministicNPI = (seed: number): string => {
  return (Math.floor(seededRandom(seed) * 9000000000) + 1000000000).toString();
};

// Helper function to generate deterministic random email
const getDeterministicEmail = (firstName: string, lastName: string, domain: string, seed: number): string => {
  const providers = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
  const selectedDomain = domain || getDeterministicItem(providers, seed);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${selectedDomain}`;
};

// Generate sample data for any grid based on its columns
export const generateSampleData = (gridKey: string, count: number = 10): any[] => {
  const grid = gridDefinitions.find(g => g.tableName === gridKey);
  if (!grid) {
    return [];
  }

  const data = [];
  const usedNames = new Set<string>();
  const usedNPIs = new Set<string>();

  for (let i = 0; i < count; i++) {
    // Generate a unique provider name
    let firstName, lastName, providerName;
    do {
      firstName = faker.person.firstName();
      lastName = faker.person.lastName();
      providerName = `${firstName} ${lastName}`;
    } while (usedNames.has(providerName));
    usedNames.add(providerName);

    // Generate a unique 10-digit NPI number
    let npi;
    do {
      npi = faker.string.numeric({ length: 10, allowLeadingZeros: false });
    } while (usedNPIs.has(npi));
    usedNPIs.add(npi);

    const row: any = {
      id: `${gridKey}-${i + 1}`,
      first_name: firstName,
      last_name: lastName,
    };

    grid.columns.forEach((columnName, colIndex) => {
      switch (columnName) {
        case "provider_name":
          row[columnName] = providerName;
          break;
        case "title":
          row[columnName] = faker.person.prefix();
          break;
        case "primary_specialty":
          row[columnName] = faker.person.jobType();
          break;
        case "npi_number":
          row[columnName] = npi;
          break;
        case "work_email":
          row[columnName] = faker.internet.email({ firstName, lastName, provider: "healthspace.com" });
          break;
        case "personal_email":
          row[columnName] = faker.internet.email({ firstName, lastName });
          break;
        case "mobile_phone_number":
          row[columnName] = faker.phone.number();
          break;
        case "date_of_birth":
          row[columnName] = getDeterministicDate(new Date(1960, 0, 1), new Date(1990, 11, 31), colIndex * 100);
          break;
        case "country_of_citizenship":
          row[columnName] = getDeterministicItem(sampleData.countries, colIndex * 100);
          break;
        case "citizenship/work_auth":
          row[columnName] = getDeterministicItem(["US Citizen", "Green Card", "Work Visa", "Student Visa"], colIndex * 100);
          break;
        case "us_work_auth":
          row[columnName] = getDeterministicItem(["Authorized", "Not Authorized", "Pending"], colIndex * 100);
          break;
        case "type":
          row[columnName] = getDeterministicItem(["Home", "Work", "Mailing", "Billing", "Legal", "Previous"], colIndex * 100);
          break;
        case "address":
          row[columnName] = getDeterministicItem(sampleData.addresses, colIndex * 100);
          break;
        case "address_2":
          row[columnName] = getDeterministicItem(["Apt 101", "Suite 200", "Unit 3B", "", ""], colIndex * 100);
          break;
        case "city":
          row[columnName] = getDeterministicItem(sampleData.cities, colIndex * 100);
          break;
        case "state":
          row[columnName] = getDeterministicItem(sampleData.states, colIndex * 100);
          break;
        case "zip/postal_code":
          row[columnName] = (Math.floor(seededRandom(colIndex * 100) * 90000) + 10000).toString();
          break;
        case "middle_name":
          row[columnName] = getDeterministicItem(["A", "B", "C", "D", "E", ""], colIndex * 100);
          break;
        case "start_date":
          row[columnName] = getDeterministicDate(new Date(2010, 0, 1), new Date(2020, 11, 31), colIndex * 100);
          break;
        case "end_date":
          row[columnName] = getDeterministicDate(new Date(2020, 0, 1), new Date(2030, 11, 31), colIndex * 100);
          break;
        case "tests/immunization_type":
          row[columnName] = getDeterministicItem(["TB Test", "Flu Shot", "COVID Vaccine", "Hepatitis B", "MMR"], colIndex * 100);
          break;
        case "questionnaire_type":
          row[columnName] = getDeterministicItem(["Health History", "Medical Clearance", "Immunization Record", "Physical Exam"], colIndex * 100);
          break;
        case "status":
          row[columnName] = getDeterministicItem(["Active", "Pending", "Expired", "Completed", "In Progress"], colIndex * 100);
          break;
        case "completion_date":
          row[columnName] = getDeterministicDate(new Date(2020, 0, 1), new Date(2024, 11, 31), colIndex * 100);
          break;
        case "expiration_date":
          row[columnName] = getDeterministicDate(new Date(2024, 0, 1), new Date(2026, 11, 31), colIndex * 100);
          break;
        case "expires_within":
          row[columnName] = getDeterministicItem(["30 days", "60 days", "90 days", "6 months", "1 year", "Expired"], colIndex * 100);
          break;
        case "identification_number":
          row[columnName] = (Math.floor(seededRandom(colIndex * 100) * 900000000) + 100000000).toString();
          break;
        case "effective_date":
          row[columnName] = getDeterministicDate(new Date(2020, 0, 1), new Date(2024, 11, 31), colIndex * 100);
          break;
        case "caqh_provider_id":
          row[columnName] = `CAQH${Math.floor(seededRandom(colIndex * 100) * 9000000) + 1000000}`;
          break;
        case "account_status":
          row[columnName] = getDeterministicItem(["Active", "Inactive", "Pending", "Suspended"], colIndex * 100);
          break;
        case "re-attestation_date":
          row[columnName] = getDeterministicDate(new Date(2024, 0, 1), new Date(2025, 11, 31), colIndex * 100);
          break;
        case "re-attestation_tags":
          row[columnName] = getDeterministicItem(["Due Soon", "Overdue", "Completed", "Not Required"], colIndex * 100);
          break;
        case "license_type":
          row[columnName] = getDeterministicItem(["Medical License", "Nurse Practitioner", "Physician Assistant", "Specialty License"], colIndex * 100);
          break;
        case "license_additional_info":
          row[columnName] = getDeterministicItem(["Active Practice", "Hospital Privileges", "Board Certified", "Prescriptive Authority"], colIndex * 100);
          break;
        case "license":
          row[columnName] = `${faker.person.prefix()}-${Math.floor(seededRandom(colIndex * 100) * 90000) + 10000}`;
          break;
        case "payment_indicator":
          row[columnName] = getDeterministicItem(["Paid", "Unpaid", "Pending", "Waived"], colIndex * 100);
          break;
        case "tags":
          row[columnName] = getDeterministicItem(sampleData.tags, colIndex * 100);
          break;
        case "last_updated":
          row[columnName] = getDeterministicDate(new Date(2023, 0, 1), new Date(2024, 11, 31), colIndex * 100);
          break;
        default:
          row[columnName] = `Sample ${columnName.replace(/_/g, ' ')}`;
      }
    });
    data.push(row);
  }
  return data;
};

// Legacy exports for backward compatibility
export const sampleProviders = generateSampleData("provider-info", 50);
export const sampleStateLicenses = generateSampleData("state-licenses", 15);
