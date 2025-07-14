import React from "react";
import { faUsers, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import AllProvidersHeader from "@/components/AllProvidersHeader";
import GridDataFetcher from "@/components/GridDataFetcher";

const TeamPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Handler for provider search selection (optional, can be customized)
  const handleProviderSelect = (providerId: string) => {
    if (providerId) {
      navigate(`/${providerId}`);
    } else {
      navigate('/all-records');
    }
  };

  // Handler for DataGrid row clicks - navigate to provider detail page
  const handleRowClick = (rowData: any) => {
    // Use id as provider_id for routing
    if (rowData.id) {
      navigate(`/${rowData.id}`);
    }
  };

  return (
    <>
      {/* All Providers Header */}
      <AllProvidersHeader
        title="Team"
        npi={undefined}
        onProviderSelect={handleProviderSelect}
        providerSearchList={[]}
        icon={faUsers}
        buttonText="Add Provider"
        buttonIcon={faUserPlus}
        onButtonClick={() => {
          // Add Provider functionality
        }}
        buttonClassName="bg-[#79AC48] hover:bg-[#6B9A3F] text-white"
      />
      <GridDataFetcher
        gridKey="provider_info"
        titleOverride="Team"
        iconOverride={faUsers}
        onRowClicked={handleRowClick}
      />
    </>
  );
};

export default TeamPage; 