import React from "react";
import GlobalNavigation from "@/components/GlobalNavigation";
import PageContainer from "@/components/PageContainer";
import MainContentArea from "@/components/MainContentArea";
import ApplicationFooter from "@/components/ApplicationFooter";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { Outlet } from "react-router-dom";

interface AppLayoutProps {
  user: any;
  children?: React.ReactNode;
  showFooter?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ user, children, showFooter = true }) => {
  const { value: showFooterFlag, isLoading } = useFeatureFlag("footer");
  let shouldShowFooter: boolean = showFooter;
  if (typeof showFooterFlag === "boolean") {
    shouldShowFooter = showFooterFlag;
  } else if (typeof showFooterFlag === "string") {
    if (showFooterFlag === "true") shouldShowFooter = true;
    else if (showFooterFlag === "false") shouldShowFooter = false;
  }
  return (
    <div className="h-screen flex flex-col bg-white" data-testid="app-layout">
      <GlobalNavigation user={user} />
      <PageContainer>
        <MainContentArea>
          {/* Render nested routes here */}
          <Outlet />
        </MainContentArea>
      </PageContainer>
      <ApplicationFooter showFooter={shouldShowFooter} />
    </div>
  );
};

export default AppLayout; 