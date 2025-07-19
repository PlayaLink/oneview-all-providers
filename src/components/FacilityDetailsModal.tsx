import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FacilityInformation } from './FacilityInformation';

interface FacilityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility: {
    id: string;
    label: string;
    icon?: string;
    requirements: string[];
    providers: string[];
    created_at: string;
    updated_at: string;
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
            <TabsList className="grid w-full grid-cols-3 mb-4" data-testid="facility-tabs-list">
              <TabsTrigger 
                value="information" 
                data-testid="facility-information-tab"
                className="flex items-center gap-2"
              >
                <span role="img" aria-label="Information icon">ℹ️</span>
                Facility Information
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
                value="contacts" 
                data-testid="facility-contacts-tab"
                className="flex items-center gap-2"
              >
                <span role="img" aria-label="Contacts icon">👥</span>
                Contacts
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
                value="requirements" 
                className="h-full mt-0"
                data-testid="facility-requirements-content"
              >
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <div className="text-4xl mb-4" role="img" aria-label="Coming soon icon">
                      🚧
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Requirements Tab</h3>
                    <p className="text-sm">This tab will show facility requirements and their values.</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent 
                value="contacts" 
                className="h-full mt-0"
                data-testid="facility-contacts-content"
              >
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <div className="text-4xl mb-4" role="img" aria-label="Coming soon icon">
                      🚧
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Contacts Tab</h3>
                    <p className="text-sm">This tab will show facility contacts and their information.</p>
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