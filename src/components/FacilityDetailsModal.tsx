import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FacilityInformation } from './FacilityInformation';
import { FacilityRequirements } from './FacilityRequirements';
import { FacilityProperties } from './FacilityProperties';

interface FacilityProperty {
  id?: string;
  key?: string;
  label?: string;
  type?: string;
  group?: string;
  value?: any;
  is_required?: boolean;
  validation_rules?: any;
}

interface FacilityRequirement {
  id?: string;
  key?: string;
  label?: string;
  group?: string;
  type?: string;
  note?: string | null;
  visible?: boolean;
  required?: boolean;
}

interface FacilityProvider {
  id?: string;
  first_name?: string | null;
  last_name?: string | null;
  npi_number?: string | null;
  title?: string | null;
  primary_specialty?: string | null;
  role?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_active?: boolean;
}

interface FacilityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility: {
    id: string;
    label: string;
    icon?: string;
    created_at: string;
    updated_at: string;
    properties?: FacilityProperty[];
    requirements?: FacilityRequirement[];
    providers?: FacilityProvider[];
  };
  requirementValues?: any[];
}

export const FacilityDetailsModal: React.FC<FacilityDetailsModalProps> = ({
  isOpen,
  onClose,
  facility,
  requirementValues = [],
}) => {
  const [activeTab, setActiveTab] = useState('information');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden" data-testid="facility-details-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {facility.icon && (
              <span className="text-2xl" role="img" aria-label="Facility icon">
                {facility.icon}
              </span>
            )}
            {facility.label}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
            data-testid="facility-details-tabs"
          >
            <TabsList className="grid w-full grid-cols-4 mb-4" data-testid="facility-tabs-list">
              <TabsTrigger 
                value="information" 
                data-testid="facility-information-tab"
                className="flex items-center gap-2"
              >
                <span role="img" aria-label="Information icon">ℹ️</span>
                Information
              </TabsTrigger>
              <TabsTrigger 
                value="properties" 
                data-testid="facility-properties-tab"
                className="flex items-center gap-2"
              >
                <span role="img" aria-label="Properties icon">🏢</span>
                Properties
              </TabsTrigger>
              <TabsTrigger 
                value="requirements" 
                data-testid="facility-requirements-tab"
                className="flex items-center gap-2"
              >
                <span role="img" aria-label="Requirements icon">📋</span>
                Requirements
              </TabsTrigger>
              <TabsTrigger 
                value="providers" 
                data-testid="facility-providers-tab"
                className="flex items-center gap-2"
              >
                <span role="img" aria-label="Providers icon">👨‍⚕️</span>
                Providers
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-auto">
              <TabsContent 
                value="information" 
                className="h-full mt-0"
                data-testid="facility-information-content"
              >
                <FacilityInformation facility={facility} requirementValues={requirementValues} />
              </TabsContent>
              
              <TabsContent 
                value="properties" 
                className="h-full mt-0"
                data-testid="facility-properties-content"
              >
                <FacilityProperties facility={facility} />
              </TabsContent>
              
              <TabsContent 
                value="requirements" 
                className="h-full mt-0"
                data-testid="facility-requirements-content"
              >
                <FacilityRequirements facility={facility} requirementValues={requirementValues} />
              </TabsContent>
              
              <TabsContent 
                value="providers" 
                className="h-full mt-0"
                data-testid="facility-providers-content"
              >
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <div className="text-4xl mb-4" role="img" aria-label="Coming soon icon">
                      🚧
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Providers Tab</h3>
                    <p className="text-sm">This tab will show facility providers and their information.</p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 