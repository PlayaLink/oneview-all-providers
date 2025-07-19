import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchFacilityById } from '@/lib/supabaseClient';
import { FacilityDetailsModal } from '@/components/FacilityDetailsModal';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const FacilityDetailsPage: React.FC = () => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(true);

  // Fetch facility data
  const { data: facility, isLoading, error } = useQuery({
    queryKey: ['facility', facilityId],
    queryFn: () => fetchFacilityById(facilityId!),
    enabled: !!facilityId,
  });

  // Handle modal close - navigate back
  const handleClose = () => {
    setModalOpen(false);
    navigate(-1); // Go back to previous page
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      setModalOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading facility details...</div>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-lg text-red-500 mb-4">
          {error ? `Error: ${error.message}` : 'Facility not found'}
        </div>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button for mobile/non-modal context */}
      <div className="p-4 border-b bg-white">
        <Button 
          onClick={() => navigate(-1)} 
          variant="ghost" 
          className="flex items-center gap-2"
          data-testid="facility-details-back-button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Modal */}
      {facility && (
        <FacilityDetailsModal
          isOpen={modalOpen}
          onClose={handleClose}
          facility={{
            id: facility.id,
            label: facility.label,
            icon: facility.icon || undefined,
            requirements: facility.requirements || [],
            providers: facility.providers || [],
            created_at: facility.created_at,
            updated_at: facility.updated_at,
          }}
        />
      )}
    </div>
  );
};

export default FacilityDetailsPage; 