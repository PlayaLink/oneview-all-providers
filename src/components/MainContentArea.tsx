import React from "react";

interface MainContentAreaProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const MainContentArea: React.FC<MainContentAreaProps> = ({ children, ...props }) => (
  <main
    className="flex flex-1 border-t border-gray-300"
    role="main"
    aria-label="Main Content Area"
    data-testid="main-content-area"
    {...props}
  >
    {children}
  </main>
);

export default MainContentArea; 