import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchCriteriaData {
  state: string;
  licenseType: string;
  license: string;
  firstName: string;
  lastName: string;
}

interface SearchCriteriaProps {
  onSearch?: (data: SearchCriteriaData) => void;
  className?: string;
}

const SearchCriteria: React.FC<SearchCriteriaProps> = ({
  onSearch,
  className,
}) => {
  const [formData, setFormData] = useState<SearchCriteriaData>({
    state: "",
    licenseType: "",
    license: "",
    firstName: "Kelly",
    lastName: "Riggs",
  });

  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const licenseTypes = [
    "Medical License",
    "Nursing License",
    "Pharmacy License",
    "Dental License",
    "Physical Therapy License",
    "Mental Health License",
    "Veterinary License",
    "Optometry License",
    "Chiropractic License",
  ];

  const handleInputChange = (
    field: keyof SearchCriteriaData,
    value: string,
  ) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    onSearch?.(newFormData);
  };

  return (
    <div
      className={`p-6 rounded-2xl border border-gray-200 bg-gray-50 ${className || ""}`}
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
          Search Criteria
        </h2>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* State Select */}
        <div className="flex flex-col space-y-2">
          <Label className="text-xs font-semibold text-gray-600 tracking-wide">
            State
            <span className="text-red-600 ml-1">*</span>
          </Label>
          <Select
            value={formData.state}
            onValueChange={(value) => handleInputChange("state", value)}
          >
            <SelectTrigger className="h-8 text-xs border-gray-200 bg-white">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state} value={state} className="text-xs">
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* License Type Select */}
        <div className="flex flex-col space-y-2">
          <Label className="text-xs font-semibold text-gray-600 tracking-wide">
            License Type
            <span className="text-red-600 ml-1">*</span>
          </Label>
          <Select
            value={formData.licenseType}
            onValueChange={(value) => handleInputChange("licenseType", value)}
          >
            <SelectTrigger className="h-8 text-xs border-gray-200 bg-white">
              <SelectValue placeholder="Select License Type" />
            </SelectTrigger>
            <SelectContent>
              {licenseTypes.map((type) => (
                <SelectItem key={type} value={type} className="text-xs">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* License Number Input */}
        <div className="flex flex-col space-y-2">
          <Label className="text-xs font-semibold text-gray-600 tracking-wide">
            License
            <span className="text-red-600 ml-1">*</span>
          </Label>
          <Input
            type="text"
            value={formData.license}
            onChange={(e) => handleInputChange("license", e.target.value)}
            className="h-8 text-xs border-gray-200 bg-white"
            placeholder=""
          />
        </div>

        {/* First Name Input */}
        <div className="flex flex-col space-y-2">
          <Label className="text-xs font-semibold text-gray-600 tracking-wide">
            First Name
          </Label>
          <Input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className="h-8 text-xs border-gray-200 bg-white text-gray-600"
          />
        </div>

        {/* Last Name Input */}
        <div className="flex flex-col space-y-2">
          <Label className="text-xs font-semibold text-gray-600 tracking-wide">
            Last Name
          </Label>
          <Input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className="h-8 text-xs border-gray-200 bg-white text-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchCriteria;
