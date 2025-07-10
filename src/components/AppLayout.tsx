import React from "react";
import GlobalNavigation from "@/components/GlobalNavigation";
import PageContainer from "@/components/PageContainer";
import MainContentArea from "@/components/MainContentArea";
import ApplicationFooter from "@/components/ApplicationFooter";

interface AppLayoutProps {
  user: any;
  children: React.ReactNode;
  showFooter?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ user, children, showFooter = true }) => {
  return (
    <div className="h-screen flex flex-col bg-white" data-testid="app-layout">
      <GlobalNavigation user={user} />
      <PageContainer>
        <MainContentArea>
          {children}
        </MainContentArea>
      </PageContainer>
      
      <ApplicationFooter showFooter={showFooter} />
    </div>
  );
};

export default AppLayout; 