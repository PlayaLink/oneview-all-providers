import React, { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  SelectionChangedEvent,
} from "ag-grid-community";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faSearch,
  faUserPlus,
  faUserDoctor,
  faChevronLeft,
  faChevronRight,
  faChartBar,
  faMessage,
  faFileText,
  faUsers,
  faXmark,
  faCircleDown,
  faUpRightFromSquare,
  faFlag,
  faEllipsisVertical,
  faPlus,
  faFilter,
  faCircleQuestion,
  faBarsStaggered,
} from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SideNav from "@/components/SideNav";
import DataGrid from "@/components/DataGrid";

// Import AG Grid styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface HealthcareProvider {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  primarySpecialty: string;
  npiNumber: string;
  workEmail: string;
  personalEmail: string;
  mobilePhone: string;
  tags: string[];
  lastUpdated: string;
}

const sampleProviders: HealthcareProvider[] = [
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
  {
    id: "4",
    firstName: "Michael",
    lastName: "Rodriguez",
    title: "NP",
    primarySpecialty: "Family Medicine",
    npiNumber: "0987654321",
    workEmail: "michael.rodriguez@healthspace.com",
    personalEmail: "mike.r@gmail.com",
    mobilePhone: "(555) 345-6789",
    tags: ["Team A", "Florida"],
    lastUpdated: "2024-01-13",
  },
  {
    id: "5",
    firstName: "Emily",
    lastName: "Chen",
    title: "MD",
    primarySpecialty: "Pediatrics",
    npiNumber: "1122334455",
    workEmail: "emily.chen@healthspace.com",
    personalEmail: "emily.chen@gmail.com",
    mobilePhone: "(555) 456-7890",
    tags: ["Team C", "New York"],
    lastUpdated: "2024-01-12",
  },
  {
    id: "6",
    firstName: "David",
    lastName: "Williams",
    title: "PA",
    primarySpecialty: "Emergency Medicine",
    npiNumber: "2233445566",
    workEmail: "david.williams@healthspace.com",
    personalEmail: "david.w@gmail.com",
    mobilePhone: "(555) 567-8901",
    tags: ["Team B", "Illinois"],
    lastUpdated: "2024-01-11",
  },
  {
    id: "7",
    firstName: "Jennifer",
    lastName: "Martinez",
    title: "MD",
    primarySpecialty: "Dermatology",
    npiNumber: "3344556677",
    workEmail: "jennifer.martinez@healthspace.com",
    personalEmail: "jen.martinez@gmail.com",
    mobilePhone: "(555) 678-9012",
    tags: ["Team A", "Dermatology", "Arizona"],
    lastUpdated: "2024-01-10",
  },
  {
    id: "8",
    firstName: "Robert",
    lastName: "Taylor",
    title: "DO",
    primarySpecialty: "Internal Medicine",
    npiNumber: "4455667788",
    workEmail: "robert.taylor@healthspace.com",
    personalEmail: "bob.taylor@outlook.com",
    mobilePhone: "(555) 789-0123",
    tags: ["Team C", "Internal Medicine", "Colorado"],
    lastUpdated: "2024-01-09",
  },
  {
    id: "9",
    firstName: "Lisa",
    lastName: "Anderson",
    title: "NP",
    primarySpecialty: "Women's Health",
    npiNumber: "5566778899",
    workEmail: "lisa.anderson@healthspace.com",
    personalEmail: "lisa.a@yahoo.com",
    mobilePhone: "(555) 890-1234",
    tags: ["Team B", "Women's Health", "Oregon"],
    lastUpdated: "2024-01-08",
  },
  {
    id: "10",
    firstName: "James",
    lastName: "Thompson",
    title: "MD",
    primarySpecialty: "Orthopedic Surgery",
    npiNumber: "6677889900",
    workEmail: "james.thompson@healthspace.com",
    personalEmail: "james.t@gmail.com",
    mobilePhone: "(555) 901-2345",
    tags: ["Team A", "Surgery", "Washington"],
    lastUpdated: "2024-01-07",
  },
  {
    id: "11",
    firstName: "Maria",
    lastName: "Lopez",
    title: "MD",
    primarySpecialty: "Psychiatry",
    npiNumber: "7788990011",
    workEmail: "maria.lopez@healthspace.com",
    personalEmail: "maria.lopez@hotmail.com",
    mobilePhone: "(555) 012-3456",
    tags: ["Team C", "Mental Health", "Nevada"],
    lastUpdated: "2024-01-06",
  },
  {
    id: "12",
    firstName: "Christopher",
    lastName: "White",
    title: "PA",
    primarySpecialty: "Urgent Care",
    npiNumber: "8899001122",
    workEmail: "christopher.white@healthspace.com",
    personalEmail: "chris.white@gmail.com",
    mobilePhone: "(555) 123-4567",
    tags: ["Team A", "Urgent Care", "Utah"],
    lastUpdated: "2024-01-05",
  },
  {
    id: "13",
    firstName: "Amanda",
    lastName: "Harris",
    title: "MD",
    primarySpecialty: "Neurology",
    npiNumber: "9900112233",
    workEmail: "amanda.harris@healthspace.com",
    personalEmail: "amanda.h@gmail.com",
    mobilePhone: "(555) 234-5678",
    tags: ["Team B", "Neurology", "Idaho"],
    lastUpdated: "2024-01-04",
  },
  {
    id: "14",
    firstName: "Kevin",
    lastName: "Clark",
    title: "DO",
    primarySpecialty: "Family Medicine",
    npiNumber: "1011121314",
    workEmail: "kevin.clark@healthspace.com",
    personalEmail: "kevin.clark@outlook.com",
    mobilePhone: "(555) 345-6789",
    tags: ["Team C", "Primary Care", "Montana"],
    lastUpdated: "2024-01-03",
  },
  {
    id: "15",
    firstName: "Rachel",
    lastName: "Lewis",
    title: "NP",
    primarySpecialty: "Pediatrics",
    npiNumber: "1112131415",
    workEmail: "rachel.lewis@healthspace.com",
    personalEmail: "rachel.l@yahoo.com",
    mobilePhone: "(555) 456-7890",
    tags: ["Team A", "Pediatrics", "Wyoming"],
    lastUpdated: "2024-01-02",
  },
  {
    id: "16",
    firstName: "Daniel",
    lastName: "Walker",
    title: "MD",
    primarySpecialty: "Radiology",
    npiNumber: "1213141516",
    workEmail: "daniel.walker@healthspace.com",
    personalEmail: "dan.walker@gmail.com",
    mobilePhone: "(555) 567-8901",
    tags: ["Team B", "Radiology", "Alaska"],
    lastUpdated: "2024-01-01",
  },
  {
    id: "17",
    firstName: "Nicole",
    lastName: "Young",
    title: "PA",
    primarySpecialty: "Gastroenterology",
    npiNumber: "1314151617",
    workEmail: "nicole.young@healthspace.com",
    personalEmail: "nicole.y@hotmail.com",
    mobilePhone: "(555) 678-9012",
    tags: ["Team C", "GI", "Hawaii"],
    lastUpdated: "2023-12-31",
  },
  {
    id: "18",
    firstName: "Brian",
    lastName: "King",
    title: "MD",
    primarySpecialty: "Anesthesiology",
    npiNumber: "1415161718",
    workEmail: "brian.king@healthspace.com",
    personalEmail: "brian.king@gmail.com",
    mobilePhone: "(555) 789-0123",
    tags: ["Team A", "Anesthesia", "Vermont"],
    lastUpdated: "2023-12-30",
  },
  {
    id: "19",
    firstName: "Stephanie",
    lastName: "Wright",
    title: "DO",
    primarySpecialty: "Pulmonology",
    npiNumber: "1516171819",
    workEmail: "stephanie.wright@healthspace.com",
    personalEmail: "steph.wright@outlook.com",
    mobilePhone: "(555) 890-1234",
    tags: ["Team B", "Pulmonary", "Maine"],
    lastUpdated: "2023-12-29",
  },
  {
    id: "20",
    firstName: "Gregory",
    lastName: "Scott",
    title: "NP",
    primarySpecialty: "Oncology",
    npiNumber: "1617181920",
    workEmail: "gregory.scott@healthspace.com",
    personalEmail: "greg.scott@yahoo.com",
    mobilePhone: "(555) 901-2345",
    tags: ["Team C", "Oncology", "Rhode Island"],
    lastUpdated: "2023-12-28",
  },
  {
    id: "21",
    firstName: "Jessica",
    lastName: "Green",
    title: "MD",
    primarySpecialty: "Endocrinology",
    npiNumber: "1718192021",
    workEmail: "jessica.green@healthspace.com",
    personalEmail: "jessica.g@gmail.com",
    mobilePhone: "(555) 012-3456",
    tags: ["Team A", "Endocrine", "Connecticut"],
    lastUpdated: "2023-12-27",
  },
  {
    id: "22",
    firstName: "Matthew",
    lastName: "Adams",
    title: "PA",
    primarySpecialty: "Urology",
    npiNumber: "1819202122",
    workEmail: "matthew.adams@healthspace.com",
    personalEmail: "matt.adams@hotmail.com",
    mobilePhone: "(555) 123-4567",
    tags: ["Team B", "Urology", "New Hampshire"],
    lastUpdated: "2023-12-26",
  },
  {
    id: "23",
    firstName: "Michelle",
    lastName: "Baker",
    title: "MD",
    primarySpecialty: "Ophthalmology",
    npiNumber: "1920212223",
    workEmail: "michelle.baker@healthspace.com",
    personalEmail: "michelle.b@gmail.com",
    mobilePhone: "(555) 234-5678",
    tags: ["Team C", "Eye Care", "Delaware"],
    lastUpdated: "2023-12-25",
  },
  {
    id: "24",
    firstName: "Andrew",
    lastName: "Nelson",
    title: "DO",
    primarySpecialty: "Emergency Medicine",
    npiNumber: "2021222324",
    workEmail: "andrew.nelson@healthspace.com",
    personalEmail: "andrew.n@outlook.com",
    mobilePhone: "(555) 345-6789",
    tags: ["Team A", "Emergency", "Maryland"],
    lastUpdated: "2023-12-24",
  },
  {
    id: "25",
    firstName: "Kimberly",
    lastName: "Carter",
    title: "NP",
    primarySpecialty: "Rheumatology",
    npiNumber: "2122232425",
    workEmail: "kimberly.carter@healthspace.com",
    personalEmail: "kim.carter@yahoo.com",
    mobilePhone: "(555) 456-7890",
    tags: ["Team B", "Rheumatology", "Virginia"],
    lastUpdated: "2023-12-23",
  },
  {
    id: "26",
    firstName: "Joshua",
    lastName: "Mitchell",
    title: "MD",
    primarySpecialty: "Plastic Surgery",
    npiNumber: "2223242526",
    workEmail: "joshua.mitchell@healthspace.com",
    personalEmail: "josh.mitchell@gmail.com",
    mobilePhone: "(555) 567-8901",
    tags: ["Team C", "Surgery", "North Carolina"],
    lastUpdated: "2023-12-22",
  },
  {
    id: "27",
    firstName: "Elizabeth",
    lastName: "Perez",
    title: "PA",
    primarySpecialty: "Infectious Disease",
    npiNumber: "2324252627",
    workEmail: "elizabeth.perez@healthspace.com",
    personalEmail: "liz.perez@hotmail.com",
    mobilePhone: "(555) 678-9012",
    tags: ["Team A", "ID", "South Carolina"],
    lastUpdated: "2023-12-21",
  },
  {
    id: "28",
    firstName: "Ryan",
    lastName: "Roberts",
    title: "MD",
    primarySpecialty: "Hematology",
    npiNumber: "2425262728",
    workEmail: "ryan.roberts@healthspace.com",
    personalEmail: "ryan.r@gmail.com",
    mobilePhone: "(555) 789-0123",
    tags: ["Team B", "Hematology", "Georgia"],
    lastUpdated: "2023-12-20",
  },
  {
    id: "29",
    firstName: "Laura",
    lastName: "Turner",
    title: "DO",
    primarySpecialty: "Nephrology",
    npiNumber: "2526272829",
    workEmail: "laura.turner@healthspace.com",
    personalEmail: "laura.t@outlook.com",
    mobilePhone: "(555) 890-1234",
    tags: ["Team C", "Kidney", "Florida"],
    lastUpdated: "2023-12-19",
  },
  {
    id: "30",
    firstName: "Benjamin",
    lastName: "Phillips",
    title: "NP",
    primarySpecialty: "Pain Management",
    npiNumber: "2627282930",
    workEmail: "benjamin.phillips@healthspace.com",
    personalEmail: "ben.phillips@yahoo.com",
    mobilePhone: "(555) 901-2345",
    tags: ["Team A", "Pain Mgmt", "Alabama"],
    lastUpdated: "2023-12-18",
  },
  {
    id: "31",
    firstName: "Ashley",
    lastName: "Campbell",
    title: "MD",
    primarySpecialty: "Allergy & Immunology",
    npiNumber: "2728293031",
    workEmail: "ashley.campbell@healthspace.com",
    personalEmail: "ashley.c@gmail.com",
    mobilePhone: "(555) 012-3456",
    tags: ["Team B", "Allergy", "Mississippi"],
    lastUpdated: "2023-12-17",
  },
  {
    id: "32",
    firstName: "Jason",
    lastName: "Parker",
    title: "PA",
    primarySpecialty: "Sports Medicine",
    npiNumber: "2829303132",
    workEmail: "jason.parker@healthspace.com",
    personalEmail: "jason.p@hotmail.com",
    mobilePhone: "(555) 123-4567",
    tags: ["Team C", "Sports Med", "Tennessee"],
    lastUpdated: "2023-12-16",
  },
  {
    id: "33",
    firstName: "Samantha",
    lastName: "Evans",
    title: "MD",
    primarySpecialty: "Pathology",
    npiNumber: "2930313233",
    workEmail: "samantha.evans@healthspace.com",
    personalEmail: "sam.evans@gmail.com",
    mobilePhone: "(555) 234-5678",
    tags: ["Team A", "Pathology", "Kentucky"],
    lastUpdated: "2023-12-15",
  },
  {
    id: "34",
    firstName: "Nathan",
    lastName: "Edwards",
    title: "DO",
    primarySpecialty: "Geriatrics",
    npiNumber: "3031323334",
    workEmail: "nathan.edwards@healthspace.com",
    personalEmail: "nathan.e@outlook.com",
    mobilePhone: "(555) 345-6789",
    tags: ["Team B", "Geriatrics", "Arkansas"],
    lastUpdated: "2023-12-14",
  },
  {
    id: "35",
    firstName: "Brittany",
    lastName: "Collins",
    title: "NP",
    primarySpecialty: "Occupational Medicine",
    npiNumber: "3132333435",
    workEmail: "brittany.collins@healthspace.com",
    personalEmail: "brittany.c@yahoo.com",
    mobilePhone: "(555) 456-7890",
    tags: ["Team C", "Occ Med", "Louisiana"],
    lastUpdated: "2023-12-13",
  },
  {
    id: "36",
    firstName: "Jacob",
    lastName: "Stewart",
    title: "MD",
    primarySpecialty: "Vascular Surgery",
    npiNumber: "3233343536",
    workEmail: "jacob.stewart@healthspace.com",
    personalEmail: "jacob.s@gmail.com",
    mobilePhone: "(555) 567-8901",
    tags: ["Team A", "Vascular", "Oklahoma"],
    lastUpdated: "2023-12-12",
  },
  {
    id: "37",
    firstName: "Megan",
    lastName: "Sanchez",
    title: "PA",
    primarySpecialty: "Physical Medicine",
    npiNumber: "3334353637",
    workEmail: "megan.sanchez@healthspace.com",
    personalEmail: "megan.s@hotmail.com",
    mobilePhone: "(555) 678-9012",
    tags: ["Team B", "PM&R", "Kansas"],
    lastUpdated: "2023-12-11",
  },
  {
    id: "38",
    firstName: "Timothy",
    lastName: "Morris",
    title: "MD",
    primarySpecialty: "Thoracic Surgery",
    npiNumber: "3435363738",
    workEmail: "timothy.morris@healthspace.com",
    personalEmail: "tim.morris@gmail.com",
    mobilePhone: "(555) 789-0123",
    tags: ["Team C", "Thoracic", "Iowa"],
    lastUpdated: "2023-12-10",
  },
  {
    id: "39",
    firstName: "Heather",
    lastName: "Rogers",
    title: "DO",
    primarySpecialty: "Reproductive Endocrinology",
    npiNumber: "3536373839",
    workEmail: "heather.rogers@healthspace.com",
    personalEmail: "heather.r@outlook.com",
    mobilePhone: "(555) 890-1234",
    tags: ["Team A", "REI", "Nebraska"],
    lastUpdated: "2023-12-09",
  },
  {
    id: "40",
    firstName: "Sean",
    lastName: "Reed",
    title: "NP",
    primarySpecialty: "Sleep Medicine",
    npiNumber: "3637383940",
    workEmail: "sean.reed@healthspace.com",
    personalEmail: "sean.r@yahoo.com",
    mobilePhone: "(555) 901-2345",
    tags: ["Team B", "Sleep", "Minnesota"],
    lastUpdated: "2023-12-08",
  },
  {
    id: "41",
    firstName: "Crystal",
    lastName: "Cook",
    title: "MD",
    primarySpecialty: "Interventional Radiology",
    npiNumber: "3738394041",
    workEmail: "crystal.cook@healthspace.com",
    personalEmail: "crystal.c@gmail.com",
    mobilePhone: "(555) 012-3456",
    tags: ["Team C", "IR", "Wisconsin"],
    lastUpdated: "2023-12-07",
  },
  {
    id: "42",
    firstName: "Marcus",
    lastName: "Bell",
    title: "PA",
    primarySpecialty: "Hand Surgery",
    npiNumber: "3839404142",
    workEmail: "marcus.bell@healthspace.com",
    personalEmail: "marcus.b@hotmail.com",
    mobilePhone: "(555) 123-4567",
    tags: ["Team A", "Hand", "Michigan"],
    lastUpdated: "2023-12-06",
  },
  {
    id: "43",
    firstName: "Angela",
    lastName: "Murphy",
    title: "MD",
    primarySpecialty: "Nuclear Medicine",
    npiNumber: "3940414243",
    workEmail: "angela.murphy@healthspace.com",
    personalEmail: "angela.m@gmail.com",
    mobilePhone: "(555) 234-5678",
    tags: ["Team B", "Nuclear", "Indiana"],
    lastUpdated: "2023-12-05",
  },
  {
    id: "44",
    firstName: "Adam",
    lastName: "Bailey",
    title: "DO",
    primarySpecialty: "Pediatric Surgery",
    npiNumber: "4041424344",
    workEmail: "adam.bailey@healthspace.com",
    personalEmail: "adam.b@outlook.com",
    mobilePhone: "(555) 345-6789",
    tags: ["Team C", "Peds Surgery", "Ohio"],
    lastUpdated: "2023-12-04",
  },
  {
    id: "45",
    firstName: "Melissa",
    lastName: "Rivera",
    title: "NP",
    primarySpecialty: "Critical Care",
    npiNumber: "4142434445",
    workEmail: "melissa.rivera@healthspace.com",
    personalEmail: "melissa.r@yahoo.com",
    mobilePhone: "(555) 456-7890",
    tags: ["Team A", "ICU", "Pennsylvania"],
    lastUpdated: "2023-12-03",
  },
  {
    id: "46",
    firstName: "Tyler",
    lastName: "Cooper",
    title: "MD",
    primarySpecialty: "Interventional Cardiology",
    npiNumber: "4243444546",
    workEmail: "tyler.cooper@healthspace.com",
    personalEmail: "tyler.c@gmail.com",
    mobilePhone: "(555) 567-8901",
    tags: ["Team B", "Cards", "New York"],
    lastUpdated: "2023-12-02",
  },
  {
    id: "47",
    firstName: "Vanessa",
    lastName: "Richardson",
    title: "PA",
    primarySpecialty: "Maternal-Fetal Medicine",
    npiNumber: "4344454647",
    workEmail: "vanessa.richardson@healthspace.com",
    personalEmail: "vanessa.r@hotmail.com",
    mobilePhone: "(555) 678-9012",
    tags: ["Team C", "MFM", "New Jersey"],
    lastUpdated: "2023-12-01",
  },
  {
    id: "48",
    firstName: "Patrick",
    lastName: "Cox",
    title: "MD",
    primarySpecialty: "Preventive Medicine",
    npiNumber: "4445464748",
    workEmail: "patrick.cox@healthspace.com",
    personalEmail: "patrick.c@gmail.com",
    mobilePhone: "(555) 789-0123",
    tags: ["Team A", "Preventive", "Massachusetts"],
    lastUpdated: "2023-11-30",
  },
  {
    id: "49",
    firstName: "Courtney",
    lastName: "Ward",
    title: "DO",
    primarySpecialty: "Addiction Medicine",
    npiNumber: "4546474849",
    workEmail: "courtney.ward@healthspace.com",
    personalEmail: "courtney.w@outlook.com",
    mobilePhone: "(555) 890-1234",
    tags: ["Team B", "Addiction", "California"],
    lastUpdated: "2023-11-29",
  },
  {
    id: "50",
    firstName: "Kenneth",
    lastName: "Torres",
    title: "NP",
    primarySpecialty: "Telemedicine",
    npiNumber: "4647484950",
    workEmail: "kenneth.torres@healthspace.com",
    personalEmail: "kenneth.t@yahoo.com",
    mobilePhone: "(555) 901-2345",
    tags: ["Team C", "Telehealth", "Texas"],
    lastUpdated: "2023-11-28",
  },
];

const TagsCellRenderer = ({ value }: { value: string[] }) => {
  if (!value || value.length === 0) return null;

  return (
    <div className="flex gap-1 flex-wrap">
      {value.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="text-xs bg-blue-50 text-blue-800 border-blue-200"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};

const ActionsCellRenderer = () => {
  return (
    <div className="flex items-center justify-end gap-2 h-full">
      <button className="p-1 hover:bg-gray-100 rounded">
        <FontAwesomeIcon
          icon={faCircleDown}
          className="w-4 h-4 text-[#BABABA]"
        />
      </button>
      <button className="p-1 hover:bg-gray-100 rounded">
        <FontAwesomeIcon
          icon={faUpRightFromSquare}
          className="w-4 h-4 text-[#545454]"
        />
      </button>
      <button className="p-1 hover:bg-gray-100 rounded">
        <FontAwesomeIcon icon={faEdit} className="w-4 h-4 text-[#545454]" />
      </button>
      <button className="p-1 hover:bg-gray-100 rounded">
        <FontAwesomeIcon icon={faFlag} className="w-4 h-4 text-[#545454]" />
      </button>
      <div className="flex items-center">
        <div className="w-6 h-3 bg-[#79AC48] rounded-full relative">
          <div className="w-2.5 h-2.5 bg-white rounded-full absolute right-0.5 top-0.25"></div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const [selectedProvider, setSelectedProvider] =
    useState<HealthcareProvider | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "Provider Name",
        field: "providerName",
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
        headerName: "Mobile Phone",
        field: "mobilePhone",
        width: 145,
      },
    ],
    [],
  );

  const handleSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      setSelectedProvider(selectedRows[0]);
    }
  };

  const closeSidePanel = () => {
    setSelectedProvider(null);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <div className="bg-[#008BC9] text-white">
        {/* Condensed Navigation */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-5">
            {/* Logo and Company */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-white rounded"></div>
              <span className="text-white font-bold text-sm tracking-wide">
                Modio
              </span>
            </div>

            {/* Company Info */}
            <div className="flex items-center gap-2 px-2 py-1 rounded">
              <div className="text-white">
                <div className="font-bold text-xs tracking-wide">
                  CompHealth
                </div>
                <div className="text-xs opacity-90">(Salt Lake City, Utah)</div>
              </div>
              <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
            </div>

            {/* Navigation Items */}
            <div className="flex items-center gap-6">
              <span className="font-bold text-xs tracking-wide">Team</span>
              <span className="font-bold text-xs tracking-wide">Forms</span>
              <span className="font-bold text-xs tracking-wide">Tracking</span>
              <span className="font-bold text-xs tracking-wide">Logins</span>
              <span className="font-bold text-xs tracking-wide">Tasks</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <span className="text-xs">New Features</span>
            <span className="text-xs">Modio U</span>
            <span className="text-xs">Support</span>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white rounded-full"></div>
              <span className="font-bold text-xs">John Smith</span>
              <FontAwesomeIcon icon={faChevronDown} className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* All Providers Section */}
        <div className="bg-white text-[#545454] px-4 py-3 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faUsers}
                className="w-4 h-4 text-[#545454]"
              />
              <span className="font-bold text-xs tracking-wider uppercase">
                All Providers
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                className="bg-[#79AC48] hover:bg-[#6B9A3F] text-white"
              >
                <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4 mr-2" />
                Add Provider
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 border-t border-gray-300 overflow-hidden">
        {/* Left Sidebar */}
        <div
          className={cn(
            "relative border-r border-gray-300 bg-white transition-all duration-300",
            sidebarCollapsed ? "w-0" : "w-48",
          )}
        >
          <SideNav collapsed={sidebarCollapsed} />

          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute w-6 h-6 bg-[#545454] text-white rounded-full flex items-center justify-center hover:bg-[#3f3f3f] transition-colors z-20"
            style={{
              right: sidebarCollapsed ? "-28px" : "-12px",
              top: "-12px",
            }}
          >
            {sidebarCollapsed ? (
              <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
            ) : (
              <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Main Grid Area - Flexible */}
        <div
          className={cn(
            "flex-1 flex flex-col",
            sidebarCollapsed && "ml-4 border-l border-gray-300",
          )}
        >
          {/* Provider Info Grid - Fills Available Space */}
          <div className="flex-1 min-h-0">
            <DataGrid
              title="Provider Info"
              icon={faUserDoctor}
              data={sampleProviders}
              columns={[
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
                {
                  headerName: "Actions",
                  cellRenderer: ActionsCellRenderer,
                  width: 190,
                  sortable: false,
                  filter: false,
                  pinned: "right",
                  cellStyle: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                    paddingLeft: "16px",
                  },
                },
              ]}
              onRowClicked={setSelectedProvider}
              height="100%"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#545454] text-white px-20 py-4 flex items-center justify-between">
        <div className="text-[#91DCFB] text-xs font-semibold">
          Privacy Policy
        </div>
        <div className="text-xs font-semibold">
          <span className="text-white">© 2023 </span>
          <span className="text-[#91DCFB]">Modio Health</span>
          <span className="text-white"> All Rights Reserved</span>
        </div>
        <div className="text-[#91DCFB] text-xs font-semibold">
          Terms and Conditions
        </div>

        {/* Chat Bubble */}
        <div className="bg-[#12ABE4] px-5 py-3 rounded-full flex items-center gap-3 relative -top-2 -right-5">
          <span className="text-white font-bold text-xs">Chat</span>
          <div className="w-4 h-4 bg-white rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
