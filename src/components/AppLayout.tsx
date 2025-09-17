import React from "react";
import GlobalNav_Legacy from "@/components/GlobalNav_Legacy";
import PageContainer from "@/components/PageContainer";
import MainContentArea from "@/components/MainContentArea";
import ApplicationFooter from "@/components/ApplicationFooter";
import Banner from "@/components/Banner";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { Outlet } from "react-router-dom";
import GlobalNav_Option1 from "@/components/GlobalNav_Option1";

interface AppLayoutProps {
  user: any;
  children?: React.ReactNode;
  showFooter?: boolean;
  isAnnotationMode?: boolean;
  setAnnotationMode?: (value: boolean) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ user, children, showFooter = true, isAnnotationMode, setAnnotationMode }) => {
  const { value: showFooterFlag, isLoading } = useFeatureFlag("footer");
  const { value: useNewNav, isLoading: navFlagLoading } = useFeatureFlag("new_nav_option_1");
  const { value: showBanner, isLoading: bannerFlagLoading } = useFeatureFlag("banner");
  
  let shouldShowFooter: boolean = showFooter;
  if (typeof showFooterFlag === "boolean") {
    shouldShowFooter = showFooterFlag;
  } else if (typeof showFooterFlag === "string") {
    if (showFooterFlag === "true") shouldShowFooter = true;
    else if (showFooterFlag === "false") shouldShowFooter = false;
  }

  let shouldShowBanner: boolean = false;
  if (typeof showBanner === "boolean") {
    shouldShowBanner = showBanner;
  } else if (typeof showBanner === "string") {
    if (showBanner === "true") shouldShowBanner = true;
    else if (showBanner === "false") shouldShowBanner = false;
  }
  return (
    <div className="h-screen flex flex-col bg-white" data-testid="app-layout">
      {/* Banner component - displays above global navigation when enabled */}
      {shouldShowBanner && (
        <div className="w-full" data-testid="app-banner-container">
          <Banner
            icon="circle-exclamation"
            color="blue"
            title="Welcome to OneView All Providers"
            description="This is a system-wide banner that can be controlled via feature flags. You can add <a href='#'>links</a> and important information here."
            data-testid="app-banner"
          />
        </div>
      )}
      
      {useNewNav ? (
        <GlobalNav_Option1 user={user} isAnnotationMode={isAnnotationMode} setAnnotationMode={setAnnotationMode} />
      ) : (
        <GlobalNav_Legacy user={user} />
      )}
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