import React from "react";
import SearchCriteria from "@/components/sidepanel-details/SearchCriteria";

interface SearchCriteriaData {
  state: string;
  licenseType: string;
  license: string;
  firstName: string;
  lastName: string;
}

const Index: React.FC = () => {
  const handleSearch = (data: SearchCriteriaData) => {
    console.log("Search criteria changed:", data);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Criteria Component
          </h1>
          <p className="text-gray-600">
            A responsive search form component matching the provided design
            specification.
          </p>
        </div>

        {/* Search Criteria Component */}
        <SearchCriteria onSearch={handleSearch} />

        {/* Component Information */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Component Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Design Features:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Pixel-perfect match to Figma design</li>
                <li>• Blue "Search Criteria" header</li>
                <li>• Gray background container</li>
                <li>• Required field indicators (*)</li>
                <li>• Consistent spacing and typography</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Technical Features:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Fully responsive grid layout</li>
                <li>• Built with existing UI components</li>
                <li>• TypeScript support</li>
                <li>• Real-time form data callbacks</li>
                <li>• TailwindCSS styling</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Example */}
        <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Usage Example
          </h3>
          <p className="text-blue-700 text-sm mb-3">
            Import and use the SearchCriteria component anywhere in your
            application:
          </p>
          <pre className="bg-white p-4 rounded border text-xs overflow-x-auto">
            <code>{`import SearchCriteria from "@/components/SearchCriteria";

const MyPage = () => {
  const handleSearch = (data) => {
    console.log("Search data:", data);
  };

  return (
    <SearchCriteria onSearch={handleSearch} />
  );
};`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Index;
