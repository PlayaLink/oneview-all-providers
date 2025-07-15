import React, { useRef, useEffect, useState } from "react";
import { faUsers, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import AllProvidersHeader from "@/components/AllProvidersHeader";
import GridDataFetcher from "@/components/GridDataFetcher";

const TeamPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Ref for measuring header height
  const headerRef = useRef<HTMLElement>(null);
  const [gridHeight, setGridHeight] = useState<number | undefined>(undefined);

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

  // Effect to calculate grid height
  useEffect(() => {
    function updateHeight() {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      setGridHeight(window.innerHeight - headerHeight - 32); // 32px for padding/margin
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <>
      <AllProvidersHeader
        ref={headerRef}
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
      <div className='px-4 pt-4'>
        <GridDataFetcher
          gridKey="provider_info"
          titleOverride="Team"
          iconOverride={faUsers}
          onRowClicked={handleRowClick}
          height={gridHeight}
        />
      </div>
    </>
  );
};

export default TeamPage; 