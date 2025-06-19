import { ColDef } from "ag-grid-community";

// Sample data - can be reused across all grids
export const sampleProviders = [
  {
    id: "1",
    firstName: "Sofia",
    lastName: "García",
    title: "MD",
    primarySpecialty: "Acupuncture",
    npiNumber: "1477552867",
    workEmail: "michelle.rivera@example.com",
    personalEmail: "alma.lawson@example.com",
    mobilePhone: "(225) 555-0118",
    tags: ["Team A", "1099", "Green", "Expired"],
    lastUpdated: "2017-12-04",
  },
  {
    id: "2",
    firstName: "Tom",
    lastName: "Petty",
    title: "MD",
    primarySpecialty: "General Surgery",
    npiNumber: "1841384468",
    workEmail: "tom.petty@healthspace.com",
    personalEmail: "tom.petty@gmail.com",
    mobilePhone: "(555) 123-4567",
    tags: ["Team A", "Team C", "Texas"],
    lastUpdated: "2024-01-15",
  },
  {
    id: "3",
    firstName: "Sarah",
    lastName: "Johnson",
    title: "MD",
    primarySpecialty: "Cardiology",
    npiNumber: "1234567890",
    workEmail: "sarah.johnson@healthspace.com",
    personalEmail: "sarah.j@gmail.com",
    mobilePhone: "(555) 234-5678",
    tags: ["Team B", "California"],
    lastUpdated: "2024-01-14",
  },
  // Add more sample data as needed
];

// Standard column definitions that can be reused
export const standardColumns: ColDef[] = [
  {
    headerName: "Provider Name",
    valueGetter: (params) =>
      `${params.data.lastName}, ${params.data.firstName}`,
    width: 200,
  },
  {
    headerName: "Title",
    field: "title",
    width: 120,
  },
  {
    headerName: "Specialty",
    field: "primarySpecialty",
    width: 200,
  },
  {
    headerName: "NPI #",
    field: "npiNumber",
    width: 140,
  },
  {
    headerName: "Work Email",
    field: "workEmail",
    width: 250,
  },
  {
    headerName: "Personal Email",
    field: "personalEmail",
    width: 250,
  },
  {
    headerName: "Mobile Phone",
    field: "mobilePhone",
    width: 145,
  },
  {
    headerName: "Tags",
    field: "tags",
    width: 200,
    valueFormatter: (params) => {
      return params.value && Array.isArray(params.value)
        ? params.value.join(", ")
        : "";
    },
  },
  {
    headerName: "Last Updated",
    field: "lastUpdated",
    width: 120,
  },
];
