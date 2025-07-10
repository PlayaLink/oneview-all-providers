import React from "react";

const PageContainer: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="flex flex-col flex-1 min-h-0 h-full w-full bg-white">
    {children}
  </div>
);

export default PageContainer; 