import { gridColumnConfigs } from "./columnConfigs";

// Sample data generators for different data types
export const dataGenerators = {
  string: (field: string): string => {
    const generators: Record<string, () => string> = {
      homeAddress: () =>
        `${Math.floor(Math.random() * 9999) + 1} ${["Main St", "Oak Ave", "Pine Rd", "Elm St", "Cedar Ln"][Math.floor(Math.random() * 5)]}`,
      workAddress: () =>
        `${Math.floor(Math.random() * 999) + 1} ${["Medical Center", "Hospital Dr", "Clinic Way", "Health Plaza"][Math.floor(Math.random() * 4)]}`,
      city: () =>
        [
          "New York",
          "Los Angeles",
          "Chicago",
          "Houston",
          "Phoenix",
          "Philadelphia",
          "San Antonio",
          "San Diego",
        ][Math.floor(Math.random() * 8)],
      state: () =>
        ["NY", "CA", "TX", "FL", "IL", "PA", "OH", "GA"][
          Math.floor(Math.random() * 8)
        ],
      zipCode: () => String(Math.floor(Math.random() * 90000) + 10000),
      countryOfCitizenship: () =>
        [
          "United States",
          "Canada",
          "United Kingdom",
          "Germany",
          "Australia",
          "France",
          "Ireland",
        ][Math.floor(Math.random() * 7)],
      citizenshipWorkAuth: () =>
        ["US Citizen", "Green Card", "Work Visa"][
          Math.floor(Math.random() * 3)
        ],
      usWorkAuth: () => "Authorized",
      licenseNumber: () => `MD${Math.floor(Math.random() * 999999) + 100000}`,
      licenseState: () =>
        ["CA", "NY", "TX", "FL", "IL"][Math.floor(Math.random() * 5)],
      deaNumber: () =>
        `B${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9999999) + 1000000}`,
      certificationName: () =>
        [
          "Board Certified Internal Medicine",
          "Board Certified Surgery",
          "ACLS Certified",
          "BLS Certified",
        ][Math.floor(Math.random() * 4)],
      schoolName: () =>
        [
          "Harvard Medical School",
          "Johns Hopkins",
          "Stanford Medicine",
          "UCLA Medical",
        ][Math.floor(Math.random() * 4)],
      hospitalName: () =>
        [
          "General Hospital",
          "Medical Center",
          "Regional Medical",
          "Community Hospital",
        ][Math.floor(Math.random() * 4)],
    };
    return generators[field] ? generators[field]() : `Sample ${field}`;
  },

  email: (field: string): string => {
    const domains = [
      "healthspace.com",
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
    ];
    const names = ["john.doe", "jane.smith", "mike.johnson", "sarah.wilson"];
    return `${names[Math.floor(Math.random() * names.length)]}@${domains[Math.floor(Math.random() * domains.length)]}`;
  },

  phone: (): string => {
    return `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
  },

  date: (field: string): string => {
    const start =
      field === "dateOfBirth" ? new Date(1970, 0, 1) : new Date(2020, 0, 1);
    const end = field === "dateOfBirth" ? new Date(1995, 11, 31) : new Date();
    const randomDate = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
    return randomDate.toISOString().split("T")[0];
  },

  number: (): number => {
    return Math.floor(Math.random() * 1000) + 1;
  },

  boolean: (): boolean => {
    return Math.random() > 0.5;
  },

  array: (field: string): string[] => {
    const tagOptions: Record<string, string[]> = {
      tags: ["Team A", "Team B", "Team C", "Active", "Pending", "W2", "1099"],
      specialties: ["Cardiology", "Neurology", "Orthopedics", "Pediatrics"],
      languages: ["English", "Spanish", "French", "German", "Mandarin"],
    };
    const options = tagOptions[field] || tagOptions.tags;
    const count = Math.floor(Math.random() * 3) + 1;
    const selected = [];
    for (let i = 0; i < count; i++) {
      const option = options[Math.floor(Math.random() * options.length)];
      if (!selected.includes(option)) {
        selected.push(option);
      }
    }
    return selected;
  },
};

// Generate data for all fields required by grid configurations
export function generateProviderData(baseProvider: any): any {
  const provider = { ...baseProvider };

  // Get all unique fields from all grid configurations
  const allFields = new Set<string>();
  Object.values(gridColumnConfigs).forEach((configs) => {
    configs.forEach((config) => {
      if (
        config.field &&
        config.field !== "providerName" &&
        !provider.hasOwnProperty(config.field)
      ) {
        allFields.add(config.field);
      }
    });
  });

  // Generate data for missing fields
  allFields.forEach((field) => {
    if (!provider[field]) {
      // Find the field configuration to get the data type
      let dataType = "string";
      let fieldConfig = null;

      Object.values(gridColumnConfigs).forEach((configs) => {
        const config = configs.find((c) => c.field === field);
        if (config) {
          dataType = config.dataType || "string";
          fieldConfig = config;
        }
      });

      // Generate data based on type
      if (dataGenerators[dataType as keyof typeof dataGenerators]) {
        provider[field] =
          dataGenerators[dataType as keyof typeof dataGenerators](field);
      }
    }
  });

  return provider;
}

// Enhanced sample providers with generated data
export const enhancedSampleProviders = [
  {
    id: "1",
    firstName: "Sofia",
    lastName: "García",
    title: "MD",
    primarySpecialty: "Acupuncture",
    npiNumber: "1477552867",
    workEmail: "sofia.garcia@healthspace.com",
    personalEmail: "sofia.garcia@gmail.com",
    mobilePhone: "(225) 555-0118",
    dateOfBirth: "1985-03-15",
    countryOfCitizenship: "United States",
    citizenshipWorkAuth: "US Citizen",
    usWorkAuth: "Authorized",
    tags: ["Team A", "1099", "Green", "Expired"],
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    firstName: "Tom",
    lastName: "Petty",
    title: "MD",
    primarySpecialty: "General Surgery",
    npiNumber: "1588663978",
    workEmail: "tom.petty@healthspace.com",
    personalEmail: "tom.petty@yahoo.com",
    mobilePhone: "(316) 555-0142",
    dateOfBirth: "1978-10-20",
    countryOfCitizenship: "Canada",
    citizenshipWorkAuth: "Work Visa",
    usWorkAuth: "Authorized",
    tags: ["Team B", "W2", "Red", "Active"],
    lastUpdated: "2024-01-14",
  },
  // Add more base providers...
].map(generateProviderData);
