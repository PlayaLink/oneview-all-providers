import React from "react";
import SearchCriteria from "@/components/SearchCriteria";

const SearchCriteriaDemo: React.FC = () => {
  const handleSearch = (data: any) => {
    console.log("Search criteria changed:", data);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Search Criteria Component
        </h1>

        <SearchCriteria onSearch={handleSearch} />

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Component Features:
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Responsive grid layout (1-5 columns based on screen size)</li>
            <li>• Required field indicators with red asterisks</li>
            <li>• Pre-populated values (Kelly, Riggs)</li>
            <li>• Dropdown selects for State and License Type</li>
            <li>• Real-time form data updates via callback</li>
            <li>• Matches the provided design specification</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchCriteriaDemo;
